import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Search, Plus, AlertTriangle, Activity, Save, Filter } from "lucide-react";

// Mock feature flags data for demonstration
const featureFlags = [
  {
    id: "new-dashboard-ui",
    name: "New Dashboard UI",
    description: "Enable the redesigned dashboard interface",
    status: true,
    environment: "all",
    type: "ui",
    lastUpdated: "2 days ago",
    updatedBy: "Sarah Johnson"
  },
  {
    id: "client-portal-access",
    name: "Client Portal Access",
    description: "Allow clients to access their dedicated portal",
    status: true,
    environment: "production",
    type: "feature",
    lastUpdated: "1 week ago",
    updatedBy: "David Anderson"
  },
  {
    id: "advanced-billing",
    name: "Advanced Billing Features",
    description: "Enable advanced billing and subscription management",
    status: false,
    environment: "development",
    type: "feature", 
    lastUpdated: "3 days ago",
    updatedBy: "Emma Wilson"
  },
  {
    id: "document-ai",
    name: "Document AI Analysis",
    description: "AI-powered document analysis and summarization",
    status: false,
    environment: "staging",
    type: "feature",
    lastUpdated: "5 days ago",
    updatedBy: "Michael Roberts"
  },
  {
    id: "timeline-visualization",
    name: "Case Timeline Visualization",
    description: "Interactive timeline visualization for case events",
    status: true,
    environment: "all",
    type: "ui",
    lastUpdated: "1 day ago",
    updatedBy: "Lisa Thompson"
  }
];

export default function FeatureFlagsPage() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [flags, setFlags] = useState(featureFlags);
  const [searchQuery, setSearchQuery] = useState("");
  const [environmentFilter, setEnvironmentFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [newFlag, setNewFlag] = useState({
    name: "",
    description: "",
    environment: "all",
    type: "feature"
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Handle toggle for feature flags
  const handleToggleStatus = (id: string) => {
    setFlags(flags.map(flag => 
      flag.id === id ? { ...flag, status: !flag.status } : flag
    ));
    
    // Show toast notification
    const flag = flags.find(f => f.id === id);
    if (flag) {
      toast({
        title: `${flag.name} ${!flag.status ? "enabled" : "disabled"}`,
        description: `The feature flag has been ${!flag.status ? "turned on" : "turned off"}.`,
      });
    }
  };
  
  // Filter flags based on search and filters
  const filteredFlags = flags.filter(flag => {
    const matchesSearch = flag.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         flag.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEnvironment = environmentFilter === "all" || flag.environment === environmentFilter || 
                              (environmentFilter === "all" && flag.environment === "all");
    const matchesType = typeFilter === "all" || flag.type === typeFilter;
    
    return matchesSearch && matchesEnvironment && matchesType;
  });
  
  // Handle saving all flag changes
  const handleSaveChanges = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Changes saved",
        description: "Your feature flag changes have been saved successfully.",
      });
    }, 1000);
  };
  
  // Handle creating a new feature flag
  const handleCreateFlag = () => {
    // Generate a simple ID from the name
    const id = newFlag.name.toLowerCase().replace(/\s+/g, '-');
    
    // Create new flag
    const createdFlag = {
      id,
      ...newFlag,
      status: false,
      lastUpdated: "Just now",
      updatedBy: "Current User"
    };
    
    // Add to flags list
    setFlags([createdFlag, ...flags]);
    
    // Reset form and close dialog
    setNewFlag({
      name: "",
      description: "",
      environment: "all",
      type: "feature"
    });
    setDialogOpen(false);
    
    // Show success message
    toast({
      title: "Feature flag created",
      description: `${newFlag.name} has been created successfully.`,
    });
  };

  // Get appropriate badge for environment
  const getEnvironmentBadge = (environment: string) => {
    switch(environment) {
      case "production":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Production</Badge>;
      case "staging":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Staging</Badge>;
      case "development":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Development</Badge>;
      case "all":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">All Environments</Badge>;
      default:
        return <Badge variant="outline">{environment}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Feature Flags</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and configure feature flags across environments
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
          <Button 
            onClick={handleSaveChanges} 
            disabled={isSaving}
            variant="outline"
            size={isMobile ? "sm" : "default"}
          >
            {isSaving ? (
              <>
                <span className="animate-spin mr-2">◌</span>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size={isMobile ? "sm" : "default"}>
                <Plus className="mr-2 h-4 w-4" />
                New Feature Flag
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Feature Flag</DialogTitle>
                <DialogDescription>
                  Define a new feature flag to control feature availability
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="flag-name">Flag Name</Label>
                  <Input 
                    id="flag-name" 
                    value={newFlag.name}
                    onChange={(e) => setNewFlag({...newFlag, name: e.target.value})}
                    placeholder="e.g., New Analytics Dashboard"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flag-description">Description</Label>
                  <Input 
                    id="flag-description" 
                    value={newFlag.description}
                    onChange={(e) => setNewFlag({...newFlag, description: e.target.value})}
                    placeholder="Briefly describe what this flag controls"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flag-environment">Environment</Label>
                  <Select 
                    value={newFlag.environment}
                    onValueChange={(value) => setNewFlag({...newFlag, environment: value})}
                  >
                    <SelectTrigger id="flag-environment">
                      <SelectValue placeholder="Select environment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Environments</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flag-type">Flag Type</Label>
                  <Select 
                    value={newFlag.type}
                    onValueChange={(value) => setNewFlag({...newFlag, type: value})}
                  >
                    <SelectTrigger id="flag-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feature">Feature Toggle</SelectItem>
                      <SelectItem value="ui">UI Component</SelectItem>
                      <SelectItem value="permission">Permission</SelectItem>
                      <SelectItem value="experiment">A/B Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateFlag}
                  disabled={!newFlag.name}
                >
                  Create Flag
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <CardTitle>Feature Flags</CardTitle>
            <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search flags..."
                  className="pl-8 w-full sm:w-[200px] md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Select value={environmentFilter} onValueChange={setEnvironmentFilter}>
                  <SelectTrigger className="w-full sm:w-[130px]">
                    <SelectValue placeholder="Environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Environments</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[100px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="ui">UI</SelectItem>
                    <SelectItem value="permission">Permission</SelectItem>
                    <SelectItem value="experiment">Experiment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFlags.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No feature flags match your search criteria</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Name & Description</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Updated By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFlags.map((flag) => (
                    <TableRow key={flag.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{flag.name}</div>
                          <div className="text-sm text-muted-foreground">{flag.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getEnvironmentBadge(flag.environment)}
                      </TableCell>
                      <TableCell>
                        <span className="capitalize">{flag.type}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={flag.status}
                            onCheckedChange={() => handleToggleStatus(flag.id)}
                          />
                          <span className={flag.status ? "text-green-600" : "text-muted-foreground"}>
                            {flag.status ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{flag.lastUpdated}</TableCell>
                      <TableCell>{flag.updatedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          <Alert className="mt-4 bg-amber-50 border-amber-200 text-amber-800">
            <AlertTriangle className="h-4 w-4 mt-0.5" />
            <AlertDescription>
              Changes to feature flags in production may immediately affect user experience.
              Make sure to test thoroughly before enabling features in production.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}