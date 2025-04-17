import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent } from "@/components/ui/card";
import {
  User, Search, Plus, MoreHorizontal,
  Mail, Phone, Building, Users,
  Filter, Briefcase
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateContactDialog } from "@/components/dialogs/create-contact-dialog";
import { EditContactDialog, ContactFormValues } from "@/components/dialogs/edit-contact-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Contact, Matter } from "@/types/models"; // Import Contact and Matter types
import { addItem, getAllItems, putItem, deleteItem } from "@/services/localDbService"; // Import DB functions

// Mock contacts with case file links for fallback seeding
const initialContacts: Contact[] = [
  {
    id: 'contact-1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '123-456-7890',
    company: 'Smith & Co',
    type: 'Client',
    caseFileNumbers: ['CF-2023-001'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'contact-2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '234-567-8901',
    company: 'Johnson Law',
    type: 'Solicitor',
    caseFileNumbers: ['CF-2023-002'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'contact-3',
    name: 'Robert Brown',
    email: 'robert.brown@example.com',
    phone: '345-678-9012',
    company: 'Brown Consulting',
    type: 'General',
    caseFileNumbers: ['CF-2023-003'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Define Matter type locally if not fully defined in models.ts for this context
// interface Matter {
//   id: number; // Or string if UUIDs are used
//   caseFileNumber: string;
// }

const ContactsPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [matters, setMatters] = useState<Matter[]>([]); // Assuming Matter type is available
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Load contacts and matters from IndexedDB on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [loadedContacts, loadedMatters] = await Promise.all([
          getAllItems('contacts'),
          getAllItems('matters')
        ]);

        // If no contacts, seed with initialContacts
        if (loadedContacts.length === 0) {
          console.log("No contacts found, seeding initial contacts...");
          await Promise.all(initialContacts.map(c => addItem('contacts', c)));
          const seededContacts = await getAllItems('contacts');
          setContacts(seededContacts);
        } else {
          setContacts(loadedContacts);
        }

        setMatters(loadedMatters);
        console.log("Contacts loaded from DB:", loadedContacts);
        console.log("Matters loaded from DB:", loadedMatters);
      } catch (error) {
        console.error('Error loading data from IndexedDB:', error);
        toast.error("Failed to load contacts or matters from local storage.");
        // Optionally fallback to mock data
        setContacts(initialContacts);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Filter contacts based on search term and active tab
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      searchTerm === "" ||
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.phone && contact.phone.toLowerCase().includes(searchTerm.toLowerCase())) || // Check if phone exists
      (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase())); // Check if company exists

    if (activeTab === "all") return matchesSearch;
    // Ensure contact.type exists and handle potential case differences
    return matchesSearch && contact.type?.toLowerCase() === activeTab.toLowerCase();
  });

  // Get counts for each type of contact
  const newEnquiryCount = contacts.filter(contact => contact.type === "New Enquiry").length;
  const clientCount = contacts.filter(contact => contact.type === "Client").length;
  const solicitorCount = contacts.filter(contact => contact.type === "Solicitor").length;
  const generalCount = contacts.filter(contact => contact.type === "General").length;

  // Handle contact deletion
  const handleDeleteContact = async (id: string | number) => { // Use string | number for ID type flexibility
    try {
      await deleteItem('contacts', String(id)); // Ensure ID is passed as string
      setContacts(prev => prev.filter(contact => contact.id !== id));
      toast.success("Contact deleted successfully");
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact.");
    }
  };

  // Handle updating a contact
  const handleUpdateContact = async (updatedContactData: ContactFormValues) => {
    // Ensure the updatedContactData has an 'id' matching the Contact type
    if (!updatedContactData.id) {
        toast.error("Cannot update contact without an ID.");
        return;
    }
    // Ensure the ID is a string and required fields are present
    const existingContact = contacts.find(c => c.id === String(updatedContactData.id));
    const updatedContact: Contact = {
        // Spread existing data first to preserve fields not in the form
        ...(existingContact || {}),
        // Spread form data, ensuring required fields have fallbacks or are guaranteed by the form
        ...updatedContactData,
        id: String(updatedContactData.id), // Ensure ID is string
        name: updatedContactData.name || existingContact?.name || 'Unknown Name', // Ensure name is present
        email: updatedContactData.email || existingContact?.email || 'unknown@example.com', // Ensure email is present
        type: updatedContactData.type || existingContact?.type || 'Unknown Type', // Ensure type is present
        caseFileNumbers: updatedContactData.caseFileNumbers ?? [], // Default to empty array
        createdAt: existingContact?.createdAt ?? new Date(), // Preserve or set createdAt
        updatedAt: new Date(), // Set updatedAt
    };

    try {
      await putItem('contacts', updatedContact);
      setContacts(prev =>
        prev.map(contact => contact.id === updatedContact.id ? updatedContact : contact)
      );
      toast.success("Contact updated successfully");
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.error("Failed to update contact.");
    }
  };

  // Handle creating a new contact
  const handleCreateContact = async (newContactData: Omit<Contact, 'id'> & { id?: string | number }) => {
     // The dialog currently generates a random ID. We should ideally let IndexedDB handle it or use UUIDs.
     // For now, we'll use the provided ID or generate one if missing (though this isn't robust).
     const contactToSave: Contact = {
        ...newContactData,
        id: newContactData.id || uuidv4(), // Generate a UUID if no ID provided
     } as Contact; // Assert type

    try {
      const addedKey = await addItem('contacts', contactToSave);
      // Use the key returned by IndexedDB if it's different (e.g., auto-increment)
      // Ensure the ID from DB is treated as string
      const finalContact: Contact = { ...contactToSave, id: String(addedKey) };
      setContacts(prev => [...prev, finalContact]);
      toast.success("Contact created successfully");
    } catch (error) {
      console.error("Error creating contact:", error);
      toast.error("Failed to create contact.");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
            <p className="text-muted-foreground">
              Manage all your clients and professional contacts
            </p>
          </div>
          {/* Pass the correct handler to CreateContactDialog */}
          <CreateContactDialog onCreateContact={handleCreateContact} />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full bg-background py-2 pl-8 pr-4 text-sm border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex gap-2 w-full md:w-auto">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">
              All Contacts ({contacts.length})
            </TabsTrigger>
            <TabsTrigger value="new enquiry">
              New Enquiries ({newEnquiryCount})
            </TabsTrigger>
            <TabsTrigger value="client">
              Clients ({clientCount})
            </TabsTrigger>
            <TabsTrigger value="solicitor">
              Solicitors ({solicitorCount})
            </TabsTrigger>
            <TabsTrigger value="general">
              General ({generalCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
             {isLoading ? (
                 <div className="p-6 text-center text-muted-foreground">Loading contacts...</div>
             ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {filteredContacts.length > 0 ? (
                        filteredContacts.map((contact) => (
                          <div
                            key={contact.id} // Use contact.id as key
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <User className="h-5 w-5" />
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium">{contact.name}</p>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                  <div className="flex items-center">
                                    <Mail className="h-3 w-3 mr-1" />
                                    <span>{contact.email}</span>
                                  </div>
                                  <span className="mx-2">•</span>
                                  <div className="flex items-center">
                                    <Phone className="h-3 w-3 mr-1" />
                                    <span>{contact.phone || 'N/A'}</span> {/* Handle missing phone */}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 sm:mt-0 flex items-center text-xs text-muted-foreground ml-14 sm:ml-0">
                              <div className="flex items-center mr-4">
                                <Building className="h-3 w-3 mr-1" />
                                <span>{contact.company || 'N/A'}</span> {/* Handle missing company */}
                              </div>
                              <div className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                <span>{contact.type || 'N/A'}</span> {/* Handle missing type */}
                              </div>
                              {contact.caseFileNumbers && contact.caseFileNumbers.length > 0 && (
                                <div className="flex items-center ml-2 space-x-1">
                                  <Briefcase className="h-3 w-3 mr-1 flex-shrink-0" />
                                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                                    {contact.caseFileNumbers.map((cfNumber, index) => {
                                      // Find matter based on caseFileNumber string
                                      const matter = matters.find(m => m.caseFileNumber === cfNumber);
                                      return matter ? (
                                        <Link
                                          // Use matter.id if it's the unique identifier, otherwise use cfNumber
                                          key={matter.id || cfNumber}
                                          to={`/case-files/${matter.id}`} // Ensure matter.id is correct link target
                                          className="text-blue-600 hover:underline text-xs"
                                          title={`View Case File ${cfNumber}`}
                                        >
                                          {cfNumber}
                                        </Link>
                                      ) : (
                                        <span key={`${cfNumber}-${index}`} className="text-xs text-muted-foreground" title="Case file not found">
                                          {cfNumber}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                              <div className="ml-2">
                                {/* Pass contact data and available case file numbers */}
                                <EditContactDialog
                                   contact={contact as ContactFormValues} // Cast should be safer now ID is string
                                   availableCaseFileNumbers={matters.map(m => m.caseFileNumber)} // Pass available numbers
                                   onUpdateContact={handleUpdateContact}
                                   onDelete={() => handleDeleteContact(contact.id)} // Pass ID to delete handler
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-muted-foreground">
                          <p>No contacts found.</p>
                          <div className="mt-2">
                             {/* Pass the correct handler to CreateContactDialog */}
                            <CreateContactDialog onCreateContact={handleCreateContact} />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
             )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ContactsPage;
