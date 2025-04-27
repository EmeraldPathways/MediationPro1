import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { 
  Search, 
  Calendar as CalendarIcon,
  Download, 
  RefreshCw, 
  ChevronDown,
  UserCircle,
  FileEdit,
  Trash,
  UserPlus,
  Lock,
  Settings,
  CreditCard,
  Database,
  Eye,
  Info,
} from "lucide-react";

// Mock audit log data for demonstration
const auditLogs = [
  {
    id: "log-1",
    timestamp: new Date(2025, 3, 27, 10, 15, 43),
    action: "user.login",
    user: {
      id: "user-123",
      email: "john.smith@example.com",
      name: "John Smith"
    },
    details: {
      ip: "192.168.1.1",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/96.0.4664.110",
      location: "New York, US"
    },
    resource: {
      type: "auth",
      id: null
    },
    changes: null
  },
  {
    id: "log-2",
    timestamp: new Date(2025, 3, 27, 9, 32, 17),
    action: "case.create",
    user: {
      id: "user-456",
      email: "sarah.johnson@example.com",
      name: "Sarah Johnson"
    },
    details: {
      ip: "192.168.1.2",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15"
    },
    resource: {
      type: "case",
      id: "case-789"
    },
    changes: null
  },
  {
    id: "log-3",
    timestamp: new Date(2025, 3, 26, 16, 45, 22),
    action: "user.update",
    user: {
      id: "user-123",
      email: "john.smith@example.com",
      name: "John Smith"
    },
    details: {
      ip: "192.168.1.1",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/96.0.4664.110"
    },
    resource: {
      type: "user",
      id: "user-789"
    },
    changes: {
      role: {
        from: "mediator",
        to: "admin"
      },
      permissions: {
        from: ["read_cases", "update_cases"],
        to: ["read_cases", "update_cases", "delete_cases", "manage_users"]
      }
    }
  },
  {
    id: "log-4",
    timestamp: new Date(2025, 3, 26, 14, 20, 10),
    action: "document.delete",
    user: {
      id: "user-456",
      email: "sarah.johnson@example.com",
      name: "Sarah Johnson"
    },
    details: {
      ip: "192.168.1.2",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15"
    },
    resource: {
      type: "document",
      id: "doc-123",
      name: "Mediation Agreement.pdf"
    },
    changes: null
  },
  {
    id: "log-5",
    timestamp: new Date(2025, 3, 25, 11, 5, 38),
    action: "user.invite",
    user: {
      id: "user-123",
      email: "john.smith@example.com",
      name: "John Smith"
    },
    details: {
      ip: "192.168.1.1",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/96.0.4664.110"
    },
    resource: {
      type: "user",
      id: null,
      email: "new.user@example.com"
    },
    changes: {
      role: "mediator",
      status: "invited"
    }
  },
  {
    id: "log-6",
    timestamp: new Date(2025, 3, 25, 9, 12, 55),
    action: "settings.update",
    user: {
      id: "user-123",
      email: "john.smith@example.com",
      name: "John Smith"
    },
    details: {
      ip: "192.168.1.1",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/96.0.4664.110"
    },
    resource: {
      type: "settings",
      id: "general"
    },
    changes: {
      company_name: {
        from: "Mediation Services",
        to: "MediatorPro Services"
      },
      support_email: {
        from: "support@example.com",
        to: "help@example.com"
      }
    }
  },
  {
    id: "log-7",
    timestamp: new Date(2025, 3, 24, 16, 30, 15),
    action: "subscription.update",
    user: {
      id: "user-123",
      email: "john.smith@example.com",
      name: "John Smith"
    },
    details: {
      ip: "192.168.1.1",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/96.0.4664.110"
    },
    resource: {
      type: "subscription",
      id: "sub-456"
    },
    changes: {
      plan: {
        from: "professional",
        to: "enterprise"
      },
      seats: {
        from: 5,
        to: 10
      }
    }
  },
  {
    id: "log-8",
    timestamp: new Date(2025, 3, 24, 10, 47, 29),
    action: "case.update",
    user: {
      id: "user-456",
      email: "sarah.johnson@example.com",
      name: "Sarah Johnson"
    },
    details: {
      ip: "192.168.1.2",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15"
    },
    resource: {
      type: "case",
      id: "case-123"
    },
    changes: {
      status: {
        from: "active",
        to: "closed"
      },
      resolution: {
        from: null,
        to: "settled"
      }
    }
  },
  {
    id: "log-9",
    timestamp: new Date(2025, 3, 23, 15, 5, 43),
    action: "payment.process",
    user: {
      id: "user-789",
      email: "david.miller@example.com",
      name: "David Miller"
    },
    details: {
      ip: "192.168.1.3",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/96.0.1054.62"
    },
    resource: {
      type: "payment",
      id: "pay-123"
    },
    changes: {
      status: {
        from: "pending",
        to: "completed"
      },
      amount: "$250.00"
    }
  },
  {
    id: "log-10",
    timestamp: new Date(2025, 3, 23, 9, 32, 17),
    action: "system.backup",
    user: {
      id: "system",
      email: null,
      name: "System"
    },
    details: {
      automated: true
    },
    resource: {
      type: "database",
      id: null
    },
    changes: {
      backup_size: "1.2GB",
      backup_location: "s3://mediatorpro-backups/2025-03-23/"
    }
  }
];

export default function AuditLogPage() {
  const isMobile = useIsMobile();
  const [logs, setLogs] = useState(auditLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Get unique users for filter
  const uniqueUsers = [...new Set(logs.map(log => log.user.id))].map(userId => {
    const user = logs.find(log => log.user.id === userId)?.user;
    return user ? { id: user.id, name: user.name || user.email } : null;
  }).filter(Boolean);

  // Get unique action types for filter
  const uniqueActions = [...new Set(logs.map(log => {
    // Extract category from action string (e.g., "user" from "user.login")
    const category = log.action.split('.')[0];
    return category;
  }))];
  
  // Filter logs based on search, action type, user and date range
  const filteredLogs = logs.filter(log => {
    // Search in action, user email/name, resource type/id
    const searchIn = [
      log.action,
      log.user.email,
      log.user.name,
      log.resource.type,
      log.resource.id,
    ].filter(Boolean).join(' ').toLowerCase();
    
    const matchesSearch = searchQuery === "" || searchIn.includes(searchQuery.toLowerCase());
    
    // Match action category (e.g., "user" from "user.login")
    const actionCategory = log.action.split('.')[0];
    const matchesAction = actionFilter === "all" || actionCategory === actionFilter;
    
    // Match user
    const matchesUser = userFilter === "all" || log.user.id === userFilter;
    
    // Match date range
    const matchesDateRange = (!dateRange.from || new Date(log.timestamp) >= dateRange.from) && 
                            (!dateRange.to || new Date(log.timestamp) <= dateRange.to);
    
    return matchesSearch && matchesAction && matchesUser && matchesDateRange;
  });
  
  // Simulate refreshing logs
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      // In a real app, you would fetch fresh logs here
    }, 1000);
  };
  
  // Handle viewing log details
  const handleViewLog = (log) => {
    setSelectedLog(log);
    setIsDialogOpen(true);
  };
  
  // Handle downloading logs as CSV
  const handleDownload = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    csvContent += "Timestamp,Action,User,Resource Type,Resource ID,Details\n";
    
    // Add data rows
    filteredLogs.forEach(log => {
      const row = [
        format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss"),
        log.action,
        log.user.email || log.user.name,
        log.resource.type,
        log.resource.id || "-",
        JSON.stringify(log.changes || log.details || {}).replace(/,/g, ";") // Replace commas in JSON to not break CSV format
      ];
      csvContent += row.join(",") + "\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit-logs-${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Get appropriate icon for action type
  const getActionIcon = (action) => {
    const actionType = action.split('.')[0];
    const actionVerb = action.split('.')[1];
    
    switch(actionType) {
      case "user":
        if (actionVerb === "login" || actionVerb === "logout") return <UserCircle />;
        if (actionVerb === "invite") return <UserPlus />;
        return <UserCircle />;
        
      case "case":
        return <FileEdit />;
        
      case "document":
        if (actionVerb === "delete") return <Trash />;
        return <FileEdit />;
        
      case "settings":
        return <Settings />;
        
      case "subscription":
      case "payment":
        return <CreditCard />;
        
      case "system":
        return <Database />;
        
      default:
        return <Info />;
    }
  };
  
  // Get appropriate badge for action
  const getActionBadge = (action) => {
    const actionType = action.split('.')[0];
    const actionVerb = action.split('.')[1];
    
    // Security-related actions
    if ((actionType === "user" && (actionVerb === "login" || actionVerb === "logout" || actionVerb === "password_reset")) ||
        actionType === "permission") {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{action}</Badge>;
    }
    
    // Creation actions
    if (actionVerb === "create" || actionVerb === "invite" || actionVerb === "add") {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{action}</Badge>;
    }
    
    // Deletion actions
    if (actionVerb === "delete" || actionVerb === "remove") {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{action}</Badge>;
    }
    
    // Update actions
    if (actionVerb === "update" || actionVerb === "edit" || actionVerb === "modify") {
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{action}</Badge>;
    }
    
    // System actions
    if (actionType === "system") {
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">{action}</Badge>;
    }
    
    // Default
    return <Badge variant="outline">{action}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Audit Log</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and review all system activities and user actions
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
          <Button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size={isMobile ? "sm" : "default"}
          >
            {isRefreshing ? (
              <>
                <span className="animate-spin mr-2">◌</span>
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
          
          <Button 
            onClick={handleDownload}
            size={isMobile ? "sm" : "default"}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <CardTitle>Activity Log</CardTitle>
            <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-8 w-full sm:w-[200px] md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-full sm:w-[120px]">
                    <SelectValue placeholder="Action Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    {uniqueActions.map(action => (
                      <SelectItem key={action} value={action}>{action}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Select User" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {uniqueUsers.map(user => (
                      <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Date Range</span>
                      )}
                      <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No audit logs match your search criteria</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Timestamp</TableHead>
                    <TableHead className="w-[200px]">Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Changes</TableHead>
                    <TableHead className="w-[80px]">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <span className="h-4 w-4">
                              {getActionIcon(log.action)}
                            </span>
                          </span>
                          {getActionBadge(log.action)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{log.user.name}</div>
                        {log.user.email && (
                          <div className="text-xs text-muted-foreground">{log.user.email}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium capitalize">{log.resource.type}</div>
                        {log.resource.id && (
                          <div className="text-xs font-mono">{log.resource.id}</div>
                        )}
                        {log.resource.name && (
                          <div className="text-xs text-muted-foreground line-clamp-1">{log.resource.name}</div>
                        )}
                        {log.resource.email && (
                          <div className="text-xs text-muted-foreground">{log.resource.email}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {log.changes ? (
                          <div className="text-sm">
                            {Object.keys(log.changes).map((key) => (
                              <div key={key} className="line-clamp-1">
                                <span className="font-medium">{key}:</span>{" "}
                                {typeof log.changes[key] === "object" && log.changes[key].from !== undefined ? (
                                  <span>
                                    {JSON.stringify(log.changes[key].from)} →{" "}
                                    {JSON.stringify(log.changes[key].to)}
                                  </span>
                                ) : (
                                  <span>{JSON.stringify(log.changes[key])}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No changes</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewLog(log)}
                        >
                          <span className="sr-only">View details</span>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
            <div>
              Showing {filteredLogs.length} of {logs.length} logs
            </div>
            <div>
              Last refreshed: {format(new Date(), "MMM d, yyyy HH:mm:ss")}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Audit log details dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Complete information about the selected activity
            </DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Timestamp</Label>
                  <div className="font-medium mt-1">
                    {format(new Date(selectedLog.timestamp), "MMMM d, yyyy HH:mm:ss")}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Action</Label>
                  <div className="font-medium mt-1">
                    {getActionBadge(selectedLog.action)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">User</Label>
                  <div className="mt-1">
                    <div className="font-medium">{selectedLog.user.name || "System"}</div>
                    {selectedLog.user.email && (
                      <div className="text-sm text-muted-foreground">{selectedLog.user.email}</div>
                    )}
                    {selectedLog.user.id && (
                      <div className="text-xs font-mono">{selectedLog.user.id}</div>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Resource</Label>
                  <div className="mt-1">
                    <div className="font-medium capitalize">{selectedLog.resource.type}</div>
                    {selectedLog.resource.id && (
                      <div className="text-sm font-mono">{selectedLog.resource.id}</div>
                    )}
                    {selectedLog.resource.name && (
                      <div className="text-sm">{selectedLog.resource.name}</div>
                    )}
                    {selectedLog.resource.email && (
                      <div className="text-sm">{selectedLog.resource.email}</div>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Request Details</Label>
                  <div className="mt-1 bg-muted p-4 rounded-md text-sm space-y-2">
                    {Object.entries(selectedLog.details).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium">{key}:</span>{" "}
                        <span className="break-all">
                          {typeof value === "object" ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedLog.changes && Object.keys(selectedLog.changes).length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Changes</Label>
                  <div className="mt-1 bg-muted p-4 rounded-md text-sm space-y-3">
                    {Object.entries(selectedLog.changes).map(([key, value]) => (
                      <div key={key}>
                        <div className="font-medium mb-1">{key}:</div>
                        {typeof value === "object" && value.from !== undefined ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center">
                              <div className="w-16 text-muted-foreground">From:</div>
                              <div className="break-all">{JSON.stringify(value.from) || "(empty)"}</div>
                            </div>
                            <div className="flex items-center">
                              <div className="w-16 text-muted-foreground">To:</div>
                              <div className="break-all">{JSON.stringify(value.to) || "(empty)"}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="break-all">
                            {typeof value === "object" ? JSON.stringify(value) : String(value)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogClose asChild>
            <Button type="button" className="mt-2">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}