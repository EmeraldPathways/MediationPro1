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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Mail, Plus, RefreshCcw, X, Search, Filter } from "lucide-react";

// Mock data for invitations
const invitations = [
  { 
    id: 1, 
    email: "james.smith@example.com", 
    status: "pending", 
    role: "Mediator",
    invitedBy: "Emma Wilson", 
    date: "2023-04-21" 
  },
  { 
    id: 2, 
    email: "patricia.johnson@example.com", 
    status: "expired", 
    role: "Office Manager",
    invitedBy: "Emma Wilson", 
    date: "2023-03-15" 
  },
  { 
    id: 3, 
    email: "robert.williams@example.com", 
    status: "pending", 
    role: "Support Staff",
    invitedBy: "Michael Roberts", 
    date: "2023-04-23" 
  },
  { 
    id: 4, 
    email: "jennifer.brown@example.com", 
    status: "accepted", 
    role: "Mediator",
    invitedBy: "Emma Wilson", 
    date: "2023-04-18" 
  },
  { 
    id: 5, 
    email: "michael.jones@example.com", 
    status: "pending", 
    role: "Client",
    invitedBy: "David Anderson", 
    date: "2023-04-25" 
  }
];

export default function InvitationsPage() {
  const isMobile = useIsMobile();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "expired":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Expired</Badge>;
      case "accepted":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Accepted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">User Invitations</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage pending and past user invitations</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0">
              <Plus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Invite New User</DialogTitle>
              <DialogDescription>
                Send an invitation email to add a new user to the system
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" placeholder="user@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrator">Administrator</SelectItem>
                    <SelectItem value="mediator">Mediator</SelectItem>
                    <SelectItem value="office-manager">Office Manager</SelectItem>
                    <SelectItem value="support-staff">Support Staff</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Personal Message (Optional)</Label>
                <Input id="message" placeholder="Add a personal note to the invitation email" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button type="submit">Send Invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <CardTitle>Invitation History</CardTitle>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by email..." 
                  className="pl-8 w-[200px] md:w-[250px]" 
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invited By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">{invitation.email}</TableCell>
                    <TableCell>{invitation.role}</TableCell>
                    <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                    <TableCell>{invitation.invitedBy}</TableCell>
                    <TableCell>{invitation.date}</TableCell>
                    <TableCell className="text-right space-x-2">
                      {invitation.status === "pending" && (
                        <Button variant="outline" size="sm">
                          <RefreshCcw className="h-4 w-4 mr-1" /> Resend
                        </Button>
                      )}
                      {invitation.status === "pending" && (
                        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                          <X className="h-4 w-4 mr-1" /> Revoke
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}