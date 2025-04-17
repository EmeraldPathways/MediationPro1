import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, FileOutput, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { CreateMatterDialog } from "@/components/dialogs/create-matter-dialog";

export function QuickActions() {
  const [isCreateMatterDialogOpen, setIsCreateMatterDialogOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button asChild variant="outline" className="h-20 flex flex-col gap-1">
              <Link to="/calendar/new">
                <Calendar className="h-5 w-5" />
                <span>Schedule Session</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex flex-col gap-1">
              <Link to="/notes/new">
                <FileText className="h-5 w-5" />
                <span>Create Note</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex flex-col gap-1">
              <Link to="/templates"> 
                <FileOutput className="h-5 w-5" />
                <span>New Template</span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-1"
              onClick={() => setIsCreateMatterDialogOpen(true)} 
            >
              <Plus className="h-5 w-5" />
              <span>Add New Case</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <CreateMatterDialog 
        isOpen={isCreateMatterDialogOpen} 
        onClose={() => setIsCreateMatterDialogOpen(false)} 
      />
    </>
  );
}
