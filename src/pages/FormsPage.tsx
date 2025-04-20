import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, FileText, Plus, Download, Check, Edit, DownloadCloud } from "lucide-react";
import { getItem } from "@/services/localDbService";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgreementToMediateForm } from "@/components/forms/AgreementToMediateForm";
import { StatementOfMeansForm } from "@/components/forms/StatementOfMeansForm";
import { ClientEnquiryForm } from "@/components/forms/ClientEnquiryForm";
import { BillingForm } from "@/components/forms/BillingForm";
import { Progress } from "@/components/ui/progress";

interface Matter {
  id: string;
  title: string;
  status: string;
  caseFileNumber?: string;
}

// Mock data for forms
const availableForms = [
  {
    id: "agreement-to-mediate",
    title: "Agreement to Mediate",
    description: "Standard agreement to mediate template",
    status: "required",
    category: "mandatory",
    progress: 0,
    componentName: "AgreementToMediateForm"
  },
  {
    id: "statement-of-means",
    title: "Statement of Means",
    description: "Financial disclosure form for divorce cases",
    status: "optional",
    category: "financial",
    progress: 0,
    componentName: "StatementOfMeansForm"
  },
  {
    id: "client-enquiry",
    title: "Client Enquiry Form",
    description: "Initial client information form",
    status: "completed",
    category: "intake",
    progress: 100,
    componentName: "ClientEnquiryForm"
  },
  {
    id: "billing-details",
    title: "Billing Details",
    description: "Client billing information form",
    status: "in-progress",
    category: "financial",
    progress: 60,
    componentName: "BillingForm"
  }
];

const FormsPage = () => {
  const { id: caseId } = useParams<{ id: string }>();
  const [matter, setMatter] = useState<Matter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [currentForm, setCurrentForm] = useState<any>(null);

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

  const handleFormOpen = (form: any) => {
    setCurrentForm(form);
  };

  const renderFormComponent = (formId: string) => {
    switch (formId) {
      case "agreement-to-mediate":
        return <AgreementToMediateForm caseId={caseId || ""} />;
      case "statement-of-means":
        return <StatementOfMeansForm caseId={caseId || ""} />;
      case "client-enquiry":
        return <ClientEnquiryForm caseId={caseId || ""} />;
      case "billing-details":
        return <BillingForm caseId={caseId || ""} />;
      default:
        return <div className="p-4 text-center">Form not available</div>;
    }
  };

  const handleFormSave = () => {
    toast.success("Form saved successfully.");
    setCurrentForm(null);
  };

  const handleFormCancel = () => {
    setCurrentForm(null);
  };

  const handleFormDownload = (formId: string) => {
    toast.success(`${formId} PDF downloaded successfully.`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "required":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Required</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
      case "optional":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Optional</Badge>;
      default:
        return null;
    }
  };

  const filteredForms = activeTab === "all" 
    ? availableForms 
    : availableForms.filter(form => form.category === activeTab);

  if (isLoading) {
    return <Layout><div className="p-6">Loading forms...</div></Layout>;
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
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" asChild>
              {/* Link back to the main case files list page */}
              <Link to="/case-files">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Forms</h1>
              <div className="text-sm text-muted-foreground">
                {matter.title} • {matter.caseFileNumber || matter.id}
              </div>
            </div>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Form
          </Button>
        </div>

        {/* If a form is currently open, show it */}
        {currentForm ? (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{currentForm.title}</CardTitle>
                  <CardDescription>{currentForm.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleFormCancel}>Cancel</Button>
                  <Button onClick={handleFormSave}>Save</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {renderFormComponent(currentForm.id)}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Form category tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="mandatory">Mandatory</TabsTrigger>
                <TabsTrigger value="intake">Intake</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredForms.map(form => (
                    <Card key={form.id} className="transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg flex items-center">
                              <FileText className="h-5 w-5 mr-2 text-blue-500" />
                              {form.title}
                            </CardTitle>
                            <CardDescription>{form.description}</CardDescription>
                          </div>
                          {getStatusBadge(form.status)}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pb-2">
                        {form.progress > 0 && (
                          <div className="space-y-1 mb-4">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>{form.progress}%</span>
                            </div>
                            <Progress value={form.progress} className="h-2" />
                          </div>
                        )}
                      </CardContent>
                      
                      <CardFooter className="flex justify-between">
                        {form.status === "completed" ? (
                          <Button variant="outline" className="w-full" onClick={() => handleFormDownload(form.id)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </Button>
                        ) : (
                          <Button 
                            className="w-full"
                            variant={form.status === "in-progress" ? "default" : "outline"}
                            onClick={() => handleFormOpen(form)}
                          >
                            {form.status === "in-progress" ? (
                              <>
                                <Edit className="mr-2 h-4 w-4" />
                                Continue Editing
                              </>
                            ) : form.status === "completed" ? (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                View Form
                              </>
                            ) : (
                              <>
                                <Plus className="mr-2 h-4 w-4" />
                                Fill Out Form
                              </>
                            )}
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                
                {filteredForms.length === 0 && (
                  <div className="text-center p-6 bg-muted rounded-md">
                    <p className="text-muted-foreground">No forms in this category</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <Separator />
            
            {/* Template Forms Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Template Forms</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Agreement to Mediate</CardTitle>
                    <CardDescription>Standard template</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <DownloadCloud className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Financial Disclosure</CardTitle>
                    <CardDescription>Standard template</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <DownloadCloud className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Mediation Outcome</CardTitle>
                    <CardDescription>Standard template</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <DownloadCloud className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default FormsPage;