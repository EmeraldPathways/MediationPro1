import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileOutput, Search, Plus, Clock, Filter, Download, FileText, Files, BookText, FolderClosed, Clipboard, ClipboardList } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data for document templates
const allTemplates = [
  {
    id: 1,
    title: "Mediation Agreement",
    category: "agreement",
    lastUsed: "2023-06-10T15:30:00",
    description: "Standard agreement outlining mediation process, confidentiality terms, and mediator role.",
  },
  {
    id: 2,
    title: "Settlement Agreement",
    category: "agreement",
    lastUsed: "2023-05-22T10:15:00",
    description: "Comprehensive template for documenting final settlement terms between parties.",
  },
  {
    id: 3,
    title: "Intake Form",
    category: "intake",
    lastUsed: "2023-06-05T09:30:00",
    description: "Client information collection form including conflict check and case details.",
  },
  {
    id: 4,
    title: "Confidentiality Agreement",
    category: "confidentiality",
    lastUsed: "2023-05-30T14:45:00",
    description: "Standard NDA for all parties participating in the mediation process.",
  },
  {
    id: 5,
    title: "Meeting Agenda",
    category: "process",
    lastUsed: "2023-06-08T13:00:00",
    description: "Structured agenda template for mediation sessions with timing guidelines.",
  },
  {
    id: 6,
    title: "Property Division Worksheet",
    category: "worksheet",
    lastUsed: "2023-05-18T11:30:00",
    description: "Form for cataloging and valuing assets to be divided between parties.",
  },
];

const TemplatesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const isMobile = useIsMobile(); // Keep hook if used for other conditional rendering

  // Format date in a readable way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 30) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Filter templates based on search term and category
  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = searchTerm === "" ||
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = activeTab === "all" || template.category === activeTab;

    return matchesSearch && matchesCategory;
  });

  // Get tab title based on active tab
  const getTabTitle = () => {
    switch(activeTab) {
      case "agreement": return "Agreement Templates";
      case "intake": return "Intake Form Templates";
      case "confidentiality": return "Confidentiality Documents";
      case "process": return "Process Templates";
      case "worksheet": return "Worksheet Templates";
      default: return "All Templates";
    }
  };

  return (
    <Layout>
      <div className="flex flex-col w-full max-w-full overflow-hidden">
        {/* Back arrow */}
        <div className="flex items-center mb-2">
          <Button variant="outline" size="icon" asChild>
            <a href="/case-files"> {/* Ensure this link is correct */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </a>
          </Button>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h1 className={`${isMobile ? "text-xl" : "text-3xl"} font-bold tracking-tight`}>Templates</h1>
            <p className="text-muted-foreground text-sm">
              Document templates for your mediation process
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size={isMobile ? "sm" : "default"}
              className="flex items-center gap-2"
            >
              <Plus className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
              New Template
            </Button>
          </div>
        </div>

        {/* Removed Summary Cards Section */}

        {/* Tabs and Content Section */}
        <Card className="flex flex-col overflow-hidden"> {/* Added overflow-hidden */}
          <CardHeader className={`${isMobile ? "px-2 py-2" : "pb-0"} overflow-hidden`}> {/* Added overflow-hidden */}
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full overflow-hidden"> {/* Added overflow-hidden */}
              {/* Modified TabsList for 3x2 grid on mobile, 6x1 on md+ */}
              <TabsList className={`grid grid-cols-3 md:grid-cols-6 gap-1 w-full md:w-auto text-xs md:text-sm h-auto overflow-hidden`}>
                 <TabsTrigger value="all" className="flex items-center justify-center gap-1 px-2 py-1.5 md:px-3 md:py-2">
                    <Files className="h-4 w-4" />
                    All
                  </TabsTrigger>
                  <TabsTrigger value="agreement" className="flex items-center justify-center gap-1 px-2 py-1.5 md:px-3 md:py-2">
                    <FileText className="h-4 w-4" />
                    Agreements
                  </TabsTrigger>
                  <TabsTrigger value="intake" className="flex items-center justify-center gap-1 px-2 py-1.5 md:px-3 md:py-2">
                    <ClipboardList className="h-4 w-4" />
                    Intake
                  </TabsTrigger>
                  <TabsTrigger value="confidentiality" className="flex items-center justify-center gap-1 px-2 py-1.5 md:px-3 md:py-2">
                    <BookText className="h-4 w-4" />
                    Confidential
                  </TabsTrigger>
                  <TabsTrigger value="process" className="flex items-center justify-center gap-1 px-2 py-1.5 md:px-3 md:py-2">
                    <Clipboard className="h-4 w-4" />
                    Process
                  </TabsTrigger>
                  <TabsTrigger value="worksheet" className="flex items-center justify-center gap-1 px-2 py-1.5 md:px-3 md:py-2">
                    <FolderClosed className="h-4 w-4" />
                    Worksheets
                  </TabsTrigger>
              </TabsList>

              {/* Title and Search Bar */}
              <div className={`flex flex-col ${isMobile ? "gap-2" : "gap-0"} sm:flex-row sm:justify-between sm:items-center ${isMobile ? "mt-2 mb-1" : "mt-4 mb-2"}`}>
                <CardTitle className={isMobile ? "text-base" : ""}>{getTabTitle()}</CardTitle>
                <div className="relative">
                  <Search className={`absolute left-2.5 ${isMobile ? "top-1.5 h-3 w-3" : "top-2.5 h-4 w-4"} text-muted-foreground`} />
                  <Input
                    placeholder="Search templates..."
                    className={`${isMobile ? "text-sm h-8 pl-7" : "pl-8 max-w-xs"}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Tabs Content (Looping through values) */}
              {["all", "agreement", "intake", "confidentiality", "process", "worksheet"].map(tabValue => (
                <TabsContent key={tabValue} value={tabValue} className="m-0 pt-0">
                   <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 p-0 sm:p-4">
                      {filteredTemplates.length > 0 ? (
                        filteredTemplates.map((template) => (
                          <Card key={template.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                            <CardHeader className={`${isMobile ? "p-3" : "p-4"} bg-muted/50`}>
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`${isMobile ? "h-8 w-8" : "h-10 w-10"} rounded-full bg-primary/10 flex items-center justify-center text-primary`}>
                                    {/* Icon logic */}
                                    {template.category === "agreement" ? <FileText className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} /> :
                                     template.category === "intake" ? <ClipboardList className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} /> :
                                     template.category === "confidentiality" ? <BookText className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} /> :
                                     template.category === "process" ? <Clipboard className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} /> :
                                     <FolderClosed className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} />}
                                  </div>
                                  <CardTitle className={`${isMobile ? "text-sm" : "text-base"}`}>{template.title}</CardTitle>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className={`${isMobile ? "p-3" : "p-4"}`}>
                              {/* Description div with fixed height removed */}
                              <div className={`${isMobile ? "text-xs" : "text-sm"} text-muted-foreground line-clamp-2`}>
                                {template.description}
                              </div>
                              {/* Bottom section of the card */}
                              <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="mr-1 h-3 w-3" />
                                  <span>Used {formatDate(template.lastUsed)}</span>
                                </div>
                                <div className="flex gap-1">
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  {/* Add other actions like Edit/View if needed */}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        // No results display
                        <div className="col-span-full text-center py-10 text-muted-foreground">
                          <FileOutput className="mx-auto h-10 w-10 mb-2" />
                          <h3 className="font-medium">No templates found</h3>
                          <p className="text-sm mt-1">
                            {searchTerm ? "Try adjusting your search term." : `No templates found in the "${getTabTitle()}" category.`}
                          </p>
                        </div>
                      )}
                    </CardContent>
                </TabsContent>
              ))}
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </Layout>
  );
};

export default TemplatesPage;