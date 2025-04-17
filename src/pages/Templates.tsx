
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileOutput, Search, Plus, Clock, Filter, Download } from "lucide-react";
import { useState } from "react";

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
  const [currentCategory, setCurrentCategory] = useState("all");

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
    
    const matchesCategory = currentCategory === "all" || template.category === currentCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Categories for filter tabs
  const categories = [
    { value: "all", label: "All Templates" },
    { value: "agreement", label: "Agreements" },
    { value: "intake", label: "Intake Forms" },
    { value: "confidentiality", label: "Confidentiality" },
    { value: "process", label: "Process" },
    { value: "worksheet", label: "Worksheets" },
  ];

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
            <p className="text-muted-foreground">
              Document templates for your mediation process.
            </p>
          </div>
          <Button className="flex gap-2">
            <Plus className="h-4 w-4" />
            New Template
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Document Templates</CardTitle>
                <CardDescription>Use and manage document templates</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search templates..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto pb-2">
              <div className="flex items-center space-x-2 mb-6">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={currentCategory === category.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentCategory(category.value)}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden hover:border-mediator-300 transition-colors">
                    <CardHeader className="p-4 bg-secondary/50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <FileOutput className="h-5 w-5 text-mediator-500" />
                          <CardTitle className="text-base">{template.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground line-clamp-2 h-10">
                        {template.description}
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          <span>Used {formatDate(template.lastUsed)}</span>
                        </div>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-muted-foreground">
                  <FileOutput className="mx-auto h-10 w-10 mb-2" />
                  <h3 className="font-medium">No templates found</h3>
                  <p className="text-sm mt-1">
                    {searchTerm ? "Try adjusting your search term." : "Start by creating your first template."}
                  </p>
                  {!searchTerm && (
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Template
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TemplatesPage;
