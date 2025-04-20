import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Users, Phone, Mail, MapPin, Edit, Plus } from "lucide-react";
import { getItem, putItem } from "@/services/localDbService";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatterDetails } from "@/components/matters/MatterDetails"; // Assuming this has client details form

interface Matter {
  id: string;
  title: string;
  status: string;
  clientName: string;
  description?: string;
  caseFileNumber?: string;
  intakeForm?: any; // This would be more specifically typed in a real app
  parties?: string[];
  email?: string;
  phone?: string;
  address?: string;
  // Any other client-specific fields
}

const ClientDetailsPage = () => {
  const { id: caseId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [matter, setMatter] = useState<Matter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    const loadMatter = async () => {
      if (!caseId) {
        setError("No case ID provided.");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const matterData = await getItem('matters', caseId);
        if (matterData) {
          setMatter(matterData);
          setError(null);
        } else {
          setError("Case not found.");
          setMatter(null);
        }
      } catch (e) {
        console.error("Error loading matter data:", e);
        setError("Failed to load case data.");
        setMatter(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMatter();
  }, [caseId]);

  const handleSaveMatter = async (updatedMatterData: Partial<Matter>) => {
    if (!caseId || !matter) return;

    try {
      const matterToSave = {
        ...matter,
        ...updatedMatterData,
        lastUpdated: new Date().toISOString()
      };

      await putItem('matters', matterToSave);
      setMatter(matterToSave);
      toast.success("Client details updated successfully");
    } catch (error) {
      console.error("Error saving matter:", error);
      toast.error("Failed to update client details");
    }
  };

  if (isLoading) {
    return <Layout><div className="p-6">Loading client details...</div></Layout>;
  }

  if (error || !matter) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full p-6">
          <h1 className="text-2xl font-bold mb-2">{error || "Case Not Found"}</h1>
          <p className="text-muted-foreground mb-4">The case you're looking for doesn't exist or couldn't be loaded.</p>
          <Button asChild>
            <Link to="/case-files">Back to Case Files</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" asChild>
              <Link to="/case-files">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Client Details</h1>
              <div className="text-sm text-muted-foreground">
                {matter.title} • {matter.caseFileNumber || matter.id}
              </div>
            </div>
          </div>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Details
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="personal">Personal Details</TabsTrigger>
            <TabsTrigger value="contact">Contact Information</TabsTrigger>
            <TabsTrigger value="related">Related Parties</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Personal Details
                </CardTitle>
                <CardDescription>Client personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Client Name</h3>
                    <p className="text-sm">{matter.clientName || "Not provided"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Case Type</h3>
                    <p className="text-sm">{matter.type || "Not specified"}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                  <p className="text-sm">{matter.description || "No description provided"}</p>
                </div>
                
                {/* Display any other personal details from the matter object */}
                {matter.intakeForm && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium mb-2">Intake Form Details</h3>
                      {/* Render intake form details - this would depend on your data structure */}
                      {Object.entries(matter.intakeForm).map(([key, value]) => (
                        <div key={key} className="mb-2">
                          <h4 className="text-xs font-medium text-muted-foreground">{key}</h4>
                          <p className="text-sm">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Information
                </CardTitle>
                <CardDescription>Client contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium mb-1">Email Address</h3>
                      <p className="text-sm">{matter.email || "No email provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium mb-1">Phone Number</h3>
                      <p className="text-sm">{matter.phone || "No phone provided"}</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium mb-1">Address</h3>
                    <p className="text-sm whitespace-pre-line">{matter.address || "No address provided"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="related" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Related Parties
                </CardTitle>
                <CardDescription>People related to this case</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {matter.parties && matter.parties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {matter.parties.map((party, index) => (
                      <div key={index} className="p-3 bg-muted rounded-md">
                        <p className="font-medium">{party}</p>
                        {/* If you have more details about each party, you could display them here */}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 text-muted-foreground">
                    <p>No related parties have been added to this case.</p>
                    <Button variant="outline" className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Related Party
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Edit Matter/Client Details Form */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Update Client Information</CardTitle>
            <CardDescription>
              Edit or update the client's information using the form below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MatterDetails 
              matter={matter} 
              onSave={handleSaveMatter} 
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ClientDetailsPage;