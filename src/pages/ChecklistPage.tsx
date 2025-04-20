import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, CheckSquare, Plus } from "lucide-react"; // Changed icon
import { getItem } from "@/services/localDbService";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
// Import other necessary components like Checkbox, Input etc. if needed for checklist items

interface Matter {
  id: string;
  title: string;
  status: string;
  caseFileNumber?: string;
}

// Mock data for checklist items (replace with actual data fetching/structure)
const checklistItems = [
  { id: "item1", text: "Initial client consultation scheduled", completed: true, category: "intake" },
  { id: "item2", text: "Agreement to Mediate signed by Party A", completed: false, category: "agreement" },
  { id: "item3", text: "Agreement to Mediate signed by Party B", completed: false, category: "agreement" },
  { id: "item4", text: "Financial disclosure received from Party A", completed: true, category: "disclosure" },
  { id: "item5", text: "Financial disclosure received from Party B", completed: false, category: "disclosure" },
  { id: "item6", text: "Mediation session 1 scheduled", completed: false, category: "session" },
];

const ChecklistPage = () => {
  const { id: caseId } = useParams<{ id: string }>();
  const [matter, setMatter] = useState<Matter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Add state for checklist items if needed, e.g., const [items, setItems] = useState(checklistItems);

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
          // Fetch checklist items specific to this caseId here
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

  // Add functions to handle checklist item changes (toggle completion, add new item, etc.)
  const handleToggleComplete = (itemId: string) => {
    console.log("Toggle complete for:", itemId);
    // Update state and potentially save to localDbService
    toast.info(`Checklist item ${itemId} status updated.`);
  };

  const handleAddItem = () => {
      console.log("Add new checklist item");
      // Logic to add a new item
      toast.success("New checklist item added (placeholder).");
  };


  if (isLoading) {
    return <Layout><div className="p-6">Loading checklist...</div></Layout>;
  }

  if (error || !matter) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full p-6">
          <h1 className="text-2xl font-bold mb-2">{error || "Case Not Found"}</h1>
          <p className="text-muted-foreground mb-4">The case you're looking for doesn't exist or couldn't be loaded.</p>
          <Button asChild>
            {/* Adjust the link back destination if needed */}
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
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Checklist</h1>
              <div className="text-sm text-muted-foreground">
                {matter.title} • {matter.caseFileNumber || matter.id}
              </div>
            </div>
          </div>
          <Button onClick={handleAddItem}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        <Separator />

        {/* Checklist Content Area */}
        <Card>
          <CardHeader>
            <CardTitle>Case Checklist</CardTitle>
            <CardDescription>Track the progress of key tasks for this case.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {checklistItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50">
                   <div className="flex items-center space-x-3">
                     {/* Replace with actual Checkbox component */}
                     <input
                       type="checkbox"
                       id={`item-${item.id}`}
                       checked={item.completed}
                       onChange={() => handleToggleComplete(item.id)}
                       className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                     />
                     <label
                       htmlFor={`item-${item.id}`}
                       className={`flex-1 ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                     >
                       {item.text}
                     </label>
                   </div>
                   <Badge variant="outline">{item.category}</Badge>
                 </div>
              ))}
              {checklistItems.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No checklist items yet.</p>
              )}
            </div>
          </CardContent>
           <CardFooter>
             {/* Optional: Add summary or actions */}
             <p className="text-xs text-muted-foreground">
               {checklistItems.filter(i => i.completed).length} of {checklistItems.length} items completed.
             </p>
           </CardFooter>
        </Card>

      </div>
    </Layout>
  );
};

export default ChecklistPage;
