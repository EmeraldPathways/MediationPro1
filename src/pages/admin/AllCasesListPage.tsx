import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { FolderOpen, Search, Filter, MoreHorizontal, UserPlus } from "lucide-react";

// Mock data for cases
const cases = [
  { 
    id: "MED-2023-001", 
    clientName: "Johnson Family", 
    mediator: "Emma Wilson", 
    status: "active", 
    createdDate: "2023-03-15", 
    lastActivity: "2023-04-25",
    type: "Divorce Mediation"
  },
  { 
    id: "MED-2023-002", 
    clientName: "Smith & Brown LLC", 
    mediator: "Michael Roberts", 
    status: "completed", 
    createdDate: "2023-02-08", 
    lastActivity: "2023-04-10",
    type: "Business Dispute"
  },
  { 
    id: "MED-2023-003", 
    clientName: "Williams vs. Garcia", 
    mediator: "David Anderson", 
    status: "active", 
    createdDate: "2023-04-01", 
    lastActivity: "2023-04-23",
    type: "Workplace Mediation"
  },
  { 
    id: "MED-2023-004", 
    clientName: "Thompson Estate", 
    mediator: "Emma Wilson", 
    status: "on-hold", 
    createdDate: "2023-03-22", 
    lastActivity: "2023-04-15",
    type: "Estate Dispute"
  },
  { 
    id: "MED-2023-005", 
    clientName: "Miller & Rodriguez", 
    mediator: "Sarah Johnson", 
    status: "active", 
    createdDate: "2023-04-12", 
    lastActivity: "2023-04-24",
    type: "Co-Parenting"
  },
];

// Status badge variations
const getStatusBadge = (status: string) => {
  switch(status.toLowerCase()) {
    case "active":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
    case "completed":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>;
    case "on-hold":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">On Hold</Badge>;
    case "cancelled":
      return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function AllCasesListPage() {
  const isMobile = useIsMobile();
  const [isReassignOpen, setIsReassignOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);

  const handleReassign = (caseItem: any) => {
    setSelectedCase(caseItem);
    setIsReassignOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">All Cases</h1>
          <p className="text-sm text-muted-foreground mt-1">View and manage all case files in the system</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Case Files</CardTitle>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search cases..." 
                  className="pl-8 w-full sm:w-[250px]" 
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <Select>
                  <SelectTrigger className="w-full sm:w-[130px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="All Mediators" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Mediators</SelectItem>
                    <SelectItem value="emma-wilson">Emma Wilson</SelectItem>
                    <SelectItem value="michael-roberts">Michael Roberts</SelectItem>
                    <SelectItem value="david-anderson">David Anderson</SelectItem>
                    <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Mediator</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.map((caseItem) => (
                  <TableRow key={caseItem.id}>
                    <TableCell className="font-medium">{caseItem.id}</TableCell>
                    <TableCell>{caseItem.clientName}</TableCell>
                    <TableCell>{caseItem.type}</TableCell>
                    <TableCell>{caseItem.mediator}</TableCell>
                    <TableCell>{getStatusBadge(caseItem.status)}</TableCell>
                    <TableCell>{caseItem.createdDate}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <FolderOpen className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReassign(caseItem)}>
                            <UserPlus className="mr-2 h-4 w-4" /> Reassign Mediator
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Export Case Data</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <div>Showing 5 of 43 cases</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reassign Dialog */}
      <Dialog open={isReassignOpen} onOpenChange={setIsReassignOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reassign Case</DialogTitle>
            <DialogDescription>
              Reassign {selectedCase?.id}: {selectedCase?.clientName} to another mediator
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-mediator">Current Mediator</Label>
              <Input id="current-mediator" value={selectedCase?.mediator} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-mediator">New Mediator</Label>
              <Select>
                <SelectTrigger id="new-mediator">
                  <SelectValue placeholder="Select mediator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emma-wilson">Emma Wilson</SelectItem>
                  <SelectItem value="michael-roberts">Michael Roberts</SelectItem>
                  <SelectItem value="david-anderson">David Anderson</SelectItem>
                  <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reassign-reason">Reason for Reassignment</Label>
              <Input id="reassign-reason" placeholder="Briefly explain the reason for reassignment" />
            </div>
            <div className="space-y-2">
              <Label>Notification Options</Label>
              <div className="flex items-center space-x-2 text-sm">
                <input type="checkbox" id="notify-mediator" className="rounded" defaultChecked />
                <Label htmlFor="notify-mediator">Notify current mediator</Label>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <input type="checkbox" id="notify-client" className="rounded" />
                <Label htmlFor="notify-client">Notify client</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReassignOpen(false)}>Cancel</Button>
            <Button type="submit">Reassign Case</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}