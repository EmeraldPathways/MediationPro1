import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";
import { ShieldCheck, Plus, Pencil, Search } from "lucide-react";

// Mock data for roles
const roles = [
  { id: 1, name: "Administrator", count: 3, description: "Full system access" },
  { id: 2, name: "Mediator", count: 12, description: "Can manage assigned cases and create documents" },
  { id: 3, name: "Office Manager", count: 5, description: "Can manage cases and billing" },
  { id: 4, name: "Support Staff", count: 8, description: "Limited access to assist with cases" },
  { id: 5, name: "Client", count: 56, description: "Access to own case materials only" },
];

// Mock data for permissions
const permissionGroups = [
  { 
    name: "User Management", 
    permissions: [
      { id: "create_users", name: "Create Users" },
      { id: "edit_users", name: "Edit Users" },
      { id: "delete_users", name: "Delete Users" },
      { id: "view_all_users", name: "View All Users" },
    ] 
  },
  { 
    name: "Case Management", 
    permissions: [
      { id: "create_cases", name: "Create Cases" },
      { id: "edit_cases", name: "Edit Cases" },
      { id: "delete_cases", name: "Delete Cases" },
      { id: "view_all_cases", name: "View All Cases" },
      { id: "reassign_cases", name: "Reassign Cases" },
    ] 
  },
  { 
    name: "Documents", 
    permissions: [
      { id: "create_documents", name: "Create Documents" },
      { id: "edit_templates", name: "Edit Templates" },
      { id: "delete_documents", name: "Delete Documents" },
      { id: "view_all_documents", name: "View All Documents" },
    ] 
  },
  { 
    name: "Billing", 
    permissions: [
      { id: "manage_invoices", name: "Manage Invoices" },
      { id: "process_payments", name: "Process Payments" },
      { id: "view_financial_reports", name: "View Financial Reports" },
    ] 
  },
];

export default function RolesPermissionsPage() {
  const isMobile = useIsMobile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  const handleEditRole = (role: any) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Roles & Permissions</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage user roles and their permissions</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0">
              <Plus className="mr-2 h-4 w-4" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Define a new role and set its permissions
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-4">
                  <Label htmlFor="name">Role Name</Label>
                  <Input id="name" placeholder="e.g., Senior Mediator" className="mt-1" />
                </div>
                <div className="col-span-4">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Describe the role's purpose" className="mt-1" />
                </div>
              </div>
              
              <div className="mt-6">
                <Label>Role Permissions</Label>
                <div className="border rounded-md mt-2">
                  {permissionGroups.map((group) => (
                    <div key={group.name} className="p-4 border-b last:border-b-0">
                      <h3 className="font-medium mb-2">{group.name}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {group.permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox id={permission.id} />
                            <Label htmlFor={permission.id} className="text-sm">
                              {permission.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
              <Button type="submit">Create Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <CardTitle>System Roles</CardTitle>
            <div className="mt-2 sm:mt-0 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search roles..." 
                className="pl-8 w-[250px]" 
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{role.count} users</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleEditRole(role)}>
                        <Pencil className="h-4 w-4 mr-1" /> Edit Permissions
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Edit {selectedRole?.name} Role</DialogTitle>
            <DialogDescription>
              Modify permissions for this role
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-4">
                <Label htmlFor="edit-name">Role Name</Label>
                <Input id="edit-name" value={selectedRole?.name} className="mt-1" />
              </div>
              <div className="col-span-4">
                <Label htmlFor="edit-description">Description</Label>
                <Input id="edit-description" value={selectedRole?.description} className="mt-1" />
              </div>
            </div>
            
            <div className="mt-6">
              <Label>Role Permissions</Label>
              <div className="border rounded-md mt-2">
                {permissionGroups.map((group) => (
                  <div key={group.name} className="p-4 border-b last:border-b-0">
                    <h3 className="font-medium mb-2">{group.name}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {group.permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox id={`edit-${permission.id}`} defaultChecked={Math.random() > 0.5} />
                          <Label htmlFor={`edit-${permission.id}`} className="text-sm">
                            {permission.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}