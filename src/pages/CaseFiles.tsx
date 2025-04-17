import React, { useState, useEffect } from "react"; // Added React import
import { Layout } from "@/components/layout/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Search, Filter, Trash, Download, Share2 } from "lucide-react";
import { CreateMatterDialog } from "@/components/dialogs/create-matter-dialog";
import { EditMatterDialog } from "@/components/dialogs/edit-matter-dialog";
// Removed TasksProvider import if not directly used here for tasks context
import { MatterDetails } from "@/components/matters/MatterDetails";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Link } from "react-router-dom"; // Import Link
import { getAllItems, putItem, deleteItem, getNotesForCase } from "@/services/localDbService"; // Import DB functions

// Define Matter interface (consistent with CaseDetail and MatterDetails)
interface Matter {
  id: string; // Changed to string
  title: string;
  type: string;
  status: string;
  lastUpdated: string;
  clientName: string;
  description: string;
  caseFileNumber: string;
  caseFileName: string;
  intakeForm?: any; // Keep intakeForm optional
  // Add other fields if needed by this page specifically
  participants?: string[];
  documents?: any[];
  tasks?: any[];
  meetingNotes?: any[];
  nextSession?: any | null;
}

// Mock data (only used if local storage is empty) - IDs are now strings
const initialMattersData: { [key: string]: Matter } = {
  "case-1": {
    id: "case-1",
    title: "Smith vs. Johnson",
    type: "Divorce Mediation",
    status: "Active",
    lastUpdated: "2023-06-15",
    clientName: "John Smith",
    description: "Divorce mediation case involving property division and custody arrangements.",
    caseFileNumber: "CF-2023-001",
    caseFileName: "Smith-Johnson Divorce Case File",
    participants: ["John Smith", "Sarah Johnson"],
    documents: [], tasks: [], meetingNotes: [], nextSession: null,
  },
  "case-2": {
    id: "case-2",
    title: "Property Dispute Resolution",
    type: "Property Dispute",
    status: "Active",
    lastUpdated: "2023-06-16",
    clientName: "Sarah Johnson",
    description: "Boundary dispute between neighboring properties.",
    caseFileNumber: "CF-2023-002",
    caseFileName: "Johnson Property Dispute File",
    participants: ["Sarah Johnson", "Michael Brown"],
    documents: [], tasks: [], meetingNotes: [], nextSession: null,
  },
   "case-3": {
    id: "case-3",
    title: "Brown Employment Dispute",
    type: "Employment",
    status: "Active",
    lastUpdated: "2023-06-10",
    clientName: "Robert Brown",
    description: "Workplace discrimination claim against employer.",
    caseFileNumber: "CF-2023-003",
    caseFileName: "Brown Employment Case File",
    participants: ["Robert Brown", "Tech Solutions HR"],
    documents: [], tasks: [], meetingNotes: [], nextSession: null,
  },
   "case-4": {
    id: "case-4",
    title: "Wilson Family Mediation",
    type: "Family Dispute",
    status: "Pending",
    lastUpdated: "2023-06-05",
    clientName: "Emma Wilson",
    description: "Family inheritance dispute between siblings.",
    caseFileNumber: "CF-2023-004",
    caseFileName: "Wilson Family Mediation File",
    participants: ["Emma Wilson", "David Wilson"],
    documents: [], tasks: [], meetingNotes: [], nextSession: null,
  },
   "case-5": {
    id: "case-5",
    title: "Corporate Contract Negotiations",
    type: "Contract",
    status: "Closed",
    lastUpdated: "2023-05-20",
    clientName: "Tech Solutions Inc.",
    description: "Negotiation of service agreement between two businesses.",
    caseFileNumber: "CF-2023-005",
    caseFileName: "Tech Solutions Contract File",
    participants: ["Tech Solutions Rep", "Client Co Rep"],
    documents: [], tasks: [], meetingNotes: [], nextSession: null,
  }
};

// Removed localStorage key

const CaseFilesPage = () => {
  const [matters, setMatters] = useState<{ [key: string]: Matter }>({});
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Load matters from IndexedDB on initial render
  useEffect(() => {
    const loadMattersFromDb = async () => {
      setIsLoading(true);
      try {
        const dbMattersArray = await getAllItems('matters');
        if (dbMattersArray.length > 0) {
          // Convert array from DB to the object format used by the component state
          const mattersObject = dbMattersArray.reduce((acc, matter) => {
            acc[matter.id] = matter;
            return acc;
          }, {} as { [key: string]: Matter });
          console.log('Loaded matters from IndexedDB:', mattersObject);
          setMatters(mattersObject);
        } else {
          console.log('No matters found in IndexedDB, populating with initial data.');
          // Populate DB with initial data if it's empty
          const initialDataPromises = Object.values(initialMattersData).map(matter =>
            putItem('matters', matter)
          );
          await Promise.all(initialDataPromises);
          console.log('Populated IndexedDB with initial matters.');
          setMatters(initialMattersData); // Set state with initial data
        }
      } catch (error) {
        console.error('Error loading matters from IndexedDB:', error);
        toast.error("Failed to load case files.");
        // Optionally fallback to initial data in state even on error?
        // setMatters(initialMattersData);
      } finally {
        setIsLoading(false);
      }
    };
    loadMattersFromDb();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Removed useEffect that saved to localStorage

  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMatters, setSelectedMatters] = useState<string[]>([]); // IDs are now strings
  const [selectedMatterDetailId, setSelectedMatterDetailId] = useState<string | null>(null); // ID for showing details is string
  const [notes, setNotes] = useState<any[]>([]); // Notes linked to selected matter

  useEffect(() => {
    if (!selectedMatterDetailId) {
      setNotes([]);
      return;
    }
    getNotesForCase(selectedMatterDetailId)
      .then(setNotes)
      .catch((error) => {
        console.error("Failed to load notes:", error);
        setNotes([]);
      });
  }, [selectedMatterDetailId]);

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
     if (!dateString) return "N/A";
     try {
         const date = new Date(dateString);
         if (isNaN(date.getTime())) return "Invalid Date";
         return date.toLocaleDateString('en-GB', { // Use en-GB for DD/MM/YYYY
             day: '2-digit',
             month: '2-digit',
             year: 'numeric',
         });
     } catch (e) {
         console.error("Error formatting date:", dateString, e);
         return "Invalid Date";
     }
  };

  // Get matters as an array for filtering/mapping
  const mattersArray = Object.values(matters);

  // Filter matters based on search term and active tab
  const filteredMatters = mattersArray.filter(matter => {
    if (!matter) return false; // Skip if matter is somehow null/undefined
    const matchesSearch =
      searchTerm === "" ||
      matter.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      matter.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      matter.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      matter.caseFileNumber?.toLowerCase().includes(searchTerm.toLowerCase()); // Added case file number search

    if (activeTab === "active") return matchesSearch && matter.status === "Active";
    if (activeTab === "pending") return matchesSearch && matter.status === "Pending";
    if (activeTab === "closed") return matchesSearch && matter.status === "Closed";

    return false; // Should not happen if tab is one of the above
  });

  // Toggle matter selection (ID is string)
  const toggleSelectMatter = (id: string) => {
    setSelectedMatters(prev =>
      prev.includes(id)
        ? prev.filter(matterId => matterId !== id)
        : [...prev, id]
    );
  };

  // Toggle matter details view (ID is string)
  const toggleMatterDetails = (id: string) => {
    setSelectedMatterDetailId(prev => prev === id ? null : id);
  };

  // Handle saving edited matter (using IndexedDB)
  const handleSaveMatter = async (updatedMatterData: Matter) => {
    try {
      const matterToSave: Matter = {
        ...updatedMatterData,
        lastUpdated: new Date().toISOString(), // Ensure timestamp is updated
      };
      await putItem('matters', matterToSave);
      // Update state locally as well
      setMatters(prev => ({
        ...prev,
        [matterToSave.id]: matterToSave,
      }));
      console.log('Matter saved successfully to IndexedDB:', matterToSave);
      toast.success("Case file updated");
    } catch (error) {
      console.error('Error saving matter to IndexedDB:', error);
      toast.error('Failed to save case file');
    }
  };

  // Handle deleting a single matter (using IndexedDB)
  const handleDeleteMatter = async (id: string) => {
    try {
      await deleteItem('matters', id);
      // Update state locally
      setMatters(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
      setSelectedMatters(prev => prev.filter(matterId => matterId !== id));
      if (selectedMatterDetailId === id) {
        setSelectedMatterDetailId(null);
      }
      toast.success("Case file deleted successfully");
    } catch (error) {
      console.error(`Error deleting matter ${id} from IndexedDB:`, error);
      toast.error("Failed to delete case file");
    }
  };

  // Handle bulk delete (using IndexedDB)
  const handleBulkDelete = async () => {
    const count = selectedMatters.length;
    if (count === 0) return;

    const deletePromises = selectedMatters.map(id => deleteItem('matters', id));

    try {
      await Promise.all(deletePromises);
      // Update state locally
      setMatters(prev => {
        const newState = { ...prev };
        selectedMatters.forEach(id => {
          delete newState[id];
        });
        return newState;
      });
      if (selectedMatterDetailId && selectedMatters.includes(selectedMatterDetailId)) {
        setSelectedMatterDetailId(null);
      }
      toast.success(`${count} case file${count > 1 ? 's' : ''} deleted`);
      setSelectedMatters([]); // Clear selection
    } catch (error) {
      console.error('Error during bulk delete from IndexedDB:', error);
      toast.error("Failed to delete selected case files");
    }
  };

  // Handle sharing matter (ID is string)
  const handleShareMatter = (id: string) => {
    const matter = matters[id]; // Access matter by ID from the object
    if (matter) {
      // Implement actual sharing logic here (e.g., copy link, open email)
      navigator.clipboard.writeText(`${window.location.origin}/case-files/${id}`)
        .then(() => toast.success(`Link for "${matter.title}" copied to clipboard.`))
        .catch(() => toast.error("Failed to copy link."));
    }
  };

  // Handle downloading matter (ID is string)
  const handleDownloadMatter = (id: string) => {
    const matter = matters[id]; // Access matter by ID
    if (matter) {
      const matterData = JSON.stringify(matter, null, 2);
      const blob = new Blob([matterData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${matter.title?.replace(/[\s\/]/g, '_') || 'case'}_file_${id}.json`; // Sanitize filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Downloaded case file: ${matter.title}`);
    }
  };

  // Handle creating a new matter (using IndexedDB)
  const handleCreateMatter = async (newMatterData: Omit<Matter, 'id' | 'lastUpdated'>) => {
    try {
      const newId = crypto.randomUUID();
      const matterToAdd: Matter = {
        ...newMatterData,
        id: newId,
        lastUpdated: new Date().toISOString(),
        // Ensure default values for potentially missing fields if needed
        participants: newMatterData.participants || [],
        documents: newMatterData.documents || [],
        tasks: newMatterData.tasks || [],
        meetingNotes: newMatterData.meetingNotes || [],
        nextSession: newMatterData.nextSession || null,
        intakeForm: newMatterData.intakeForm || undefined, // Or provide a default structure
      };
      await putItem('matters', matterToAdd);
      // Update state locally
      setMatters(prev => ({
        ...prev,
        [newId]: matterToAdd,
      }));
      toast.success("Case file created successfully");
    } catch (error) {
      console.error("Error creating matter in IndexedDB:", error);
      toast.error("Failed to create case file");
    }
  };


  return (
    <Layout>
      {/* Removed TasksProvider wrapper if context isn't used directly here */}
      <div className="flex flex-col space-y-6 p-4 md:p-6"> {/* Added padding */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Case Files</h1>
            <p className="text-muted-foreground mt-1">
              Manage all your legal matters and cases
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {selectedMatters.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete ({selectedMatters.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the selected {selectedMatters.length} case file(s).
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {/* Pass the updated create handler */}
            <CreateMatterDialog onSave={handleCreateMatter} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title, client, type, case number..."
              className="w-full bg-background py-2 pl-8 pr-4 text-sm border rounded-md h-10" // Added height
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex gap-2 w-full md:w-auto h-10"> {/* Added height */}
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="active">
              Active ({Object.values(matters).filter(m => m.status === "Active").length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({Object.values(matters).filter(m => m.status === "Pending").length})
            </TabsTrigger>
            <TabsTrigger value="closed">
              Closed ({Object.values(matters).filter(m => m.status === "Closed").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredMatters.length > 0 ? (
                    filteredMatters.map((matter) => (
                      <div key={matter.id}> {/* Key is now string ID */}
                        <div
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start flex-grow mb-2 sm:mb-0">
                            <Checkbox
                              checked={selectedMatters.includes(matter.id)}
                              onCheckedChange={() => toggleSelectMatter(matter.id)}
                              className="mr-3 mt-1 flex-shrink-0" // Adjusted margin
                              aria-label={`Select matter ${matter.title}`}
                            />
                            <Briefcase className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                              matter.status === "Active" ? "text-blue-500" :
                              matter.status === "Pending" ? "text-amber-500" : "text-gray-500"
                            }`} />
                            <div
                              className="ml-3 flex-grow"
                              // Toggle inline details on click
                            >
                               <span onClick={() => toggleMatterDetails(matter.id)} className="text-sm font-medium hover:underline cursor-pointer">
                                {matter.title || "Untitled Matter"}
                               </span>
                              <div className="flex items-center text-xs text-muted-foreground space-x-2 mt-1 flex-wrap">
                                <span>{matter.type || "N/A"}</span>
                                <span>•</span>
                                <span>{matter.clientName || "N/A"}</span>
                                <span>•</span>
                                {matter.caseFileNumber ? (
                                  <Link
                                    to={`/case-files/${matter.id}`}
                                    className="text-blue-600 hover:underline"
                                    title={`View Case File ${matter.caseFileNumber}`}
                                  >
                                    {matter.caseFileNumber}
                                  </Link>
                                ) : (
                                  <span>N/A</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground ml-8 sm:ml-4 flex-shrink-0">
                            <span className="mr-4 hidden md:inline">Last updated: {formatDate(matter.lastUpdated)}</span>
                            <div className="flex items-center space-x-0"> {/* Reduced space */}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleShareMatter(matter.id)}
                                title="Share Case File"
                                className="h-8 w-8" // Smaller buttons
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDownloadMatter(matter.id)}
                                title="Download Case File"
                                className="h-8 w-8"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              {/* Edit Dialog - Ensure it handles string ID and object structure */}
                              <EditMatterDialog
                                matter={matter} // Pass the matter object
                                onSave={handleSaveMatter} // Pass the correct save handler
                              />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the case file "{matter.title}".
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteMatter(matter.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                               {/* Button to toggle inline details */}
                               <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleMatterDetails(matter.id)}
                                title={selectedMatterDetailId === matter.id ? "Hide Details" : "Show Details"}
                                className="h-8 w-8"
                              >
                                {selectedMatterDetailId === matter.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Conditionally render MatterDetails inline */}
                        {selectedMatterDetailId === matter.id && (
                          <div className="border-t bg-muted/20">
                            <MatterDetails
                              matter={matter}
                              onSave={handleSaveMatter}
                            />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-muted-foreground">
                      <p>No case files found matching your criteria.</p>
                       {/* Offer to create a new one */}
                       <CreateMatterDialog onSave={handleCreateMatter} triggerText="Create New Case File" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {/* </TasksProvider> */}
    </Layout>
  );
};

// Need to import ChevronDown and ChevronUp
import { ChevronDown, ChevronUp } from "lucide-react";

export default CaseFilesPage;
