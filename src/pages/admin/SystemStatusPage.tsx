import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { format, subDays } from "date-fns";
import { 
  Activity,
  AlertCircle,
  ArrowDownUp,
  CheckCircle2,
  Clock,
  Database,
  Download,
  HardDrive,
  History,
  Link2,
  RefreshCw,
  Server,
  Shield,
  Sparkles,
  Triangle,
  Users,
  XCircle,
} from "lucide-react";

// Mock system status data
const systemStatusData = {
  lastUpdated: new Date(),
  overall: {
    status: "operational", // operational, degraded, major_outage
    uptime: 99.98,
    responseTime: 187,
    serverLoad: 42,
  },
  services: [
    { 
      name: "API Services", 
      status: "operational",
      uptime: 99.99,
      responseTime: 145,
      lastIncident: subDays(new Date(), 23),
    },
    { 
      name: "Database", 
      status: "operational",
      uptime: 100,
      responseTime: 32,
      lastIncident: subDays(new Date(), 47),
    },
    { 
      name: "Authentication", 
      status: "operational",
      uptime: 99.97,
      responseTime: 210,
      lastIncident: subDays(new Date(), 5),
    },
    { 
      name: "Storage", 
      status: "operational",
      uptime: 100,
      responseTime: 85,
      lastIncident: subDays(new Date(), 67),
    },
    { 
      name: "Email Delivery", 
      status: "degraded",
      uptime: 97.8,
      responseTime: 432,
      lastIncident: subDays(new Date(), 1),
    },
    { 
      name: "Search Engine", 
      status: "operational",
      uptime: 99.89,
      responseTime: 267,
      lastIncident: subDays(new Date(), 8),
    },
    { 
      name: "PDF Generation", 
      status: "operational",
      uptime: 99.95,
      responseTime: 312,
      lastIncident: subDays(new Date(), 14),
    },
    { 
      name: "Payment Processing", 
      status: "operational",
      uptime: 99.99,
      responseTime: 230,
      lastIncident: subDays(new Date(), 42),
    }
  ],
  resources: {
    cpu: 32,
    memory: 67,
    storage: 54,
    bandwidth: 23
  },
  incidents: [
    {
      id: "inc-1",
      title: "Email delivery delays",
      status: "investigating",
      severity: "minor",
      services: ["Email Delivery"],
      started: subDays(new Date(), 1),
      updates: [
        {
          timestamp: subDays(new Date(), 1),
          message: "We are investigating reports of delayed email deliveries.",
          status: "investigating"
        },
        {
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
          message: "We identified the issue with our email service provider and are working on a resolution.",
          status: "identified"
        }
      ]
    },
    {
      id: "inc-2",
      title: "API Timeout Errors",
      status: "resolved",
      severity: "major",
      services: ["API Services"],
      started: subDays(new Date(), 23),
      resolved: subDays(new Date(), 23),
      updates: [
        {
          timestamp: subDays(new Date(), 23),
          message: "Users are experiencing timeout errors when accessing certain API endpoints.",
          status: "investigating"
        },
        {
          timestamp: new Date(subDays(new Date(), 23).getTime() + 2 * 60 * 60 * 1000),
          message: "We have identified an issue with our database query optimization.",
          status: "identified"
        },
        {
          timestamp: new Date(subDays(new Date(), 23).getTime() + 4 * 60 * 60 * 1000),
          message: "The issue has been resolved and services have returned to normal operation.",
          status: "resolved"
        }
      ]
    },
    {
      id: "inc-3",
      title: "Authentication Service Latency",
      status: "resolved",
      severity: "minor",
      services: ["Authentication"],
      started: subDays(new Date(), 5),
      resolved: subDays(new Date(), 5),
      updates: [
        {
          timestamp: subDays(new Date(), 5),
          message: "Some users are experiencing delays when logging in.",
          status: "investigating"
        },
        {
          timestamp: new Date(subDays(new Date(), 5).getTime() + 1 * 60 * 60 * 1000),
          message: "We have identified an issue with our authentication service database connection pool.",
          status: "identified"
        },
        {
          timestamp: new Date(subDays(new Date(), 5).getTime() + 3 * 60 * 60 * 1000),
          message: "The issue has been resolved by increasing the connection pool size. Services have returned to normal operation.",
          status: "resolved"
        }
      ]
    }
  ],
  maintenance: [
    {
      id: "maint-1",
      title: "Database Optimization",
      status: "scheduled",
      scheduledStart: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      scheduledEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
      services: ["Database"],
      description: "Scheduled database maintenance for performance optimization. Brief periods of increased response times may be experienced."
    },
    {
      id: "maint-2",
      title: "Storage System Upgrade",
      status: "scheduled",
      scheduledStart: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      scheduledEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000),
      services: ["Storage"],
      description: "Upgrading our storage infrastructure to improve capacity and performance. Some document operations may be temporarily unavailable."
    }
  ],
  metrics: {
    dailyActiveUsers: [
      { date: subDays(new Date(), 6), count: 1245 },
      { date: subDays(new Date(), 5), count: 1302 },
      { date: subDays(new Date(), 4), count: 1380 },
      { date: subDays(new Date(), 3), count: 1248 },
      { date: subDays(new Date(), 2), count: 1410 },
      { date: subDays(new Date(), 1), count: 1325 },
      { date: new Date(), count: 1178 },
    ],
    requestsPerDay: [
      { date: subDays(new Date(), 6), count: 187650 },
      { date: subDays(new Date(), 5), count: 195420 },
      { date: subDays(new Date(), 4), count: 210588 },
      { date: subDays(new Date(), 3), count: 182746 },
      { date: subDays(new Date(), 2), count: 204356 },
      { date: subDays(new Date(), 1), count: 197432 },
      { date: new Date(), count: 154320 },
    ]
  }
};

export default function SystemStatusPage() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [statusData, setStatusData] = useState(systemStatusData);
  const [refreshing, setRefreshing] = useState(false);
  
  // Function to refresh status data
  const refreshStatus = () => {
    setRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      setStatusData({
        ...statusData,
        lastUpdated: new Date()
      });
      toast({
        title: "Status refreshed",
        description: "System status information has been updated.",
      });
    }, 1500);
  };
  
  // Function to get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case "operational":
        return <Badge className="bg-green-100 text-green-800">Operational</Badge>;
      case "degraded":
        return <Badge className="bg-amber-100 text-amber-800">Degraded</Badge>;
      case "major_outage":
        return <Badge className="bg-red-100 text-red-800">Major Outage</Badge>;
      case "investigating":
        return <Badge className="bg-blue-100 text-blue-800">Investigating</Badge>;
      case "identified":
        return <Badge className="bg-purple-100 text-purple-800">Identified</Badge>;
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "in_progress":
        return <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Function to get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case "operational":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "degraded":
        return <Triangle className="h-5 w-5 text-amber-500" />;
      case "major_outage":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Function to get overall system status
  const getOverallSystemStatus = () => {
    const { overall, services } = statusData;
    
    if (services.some(service => service.status === "major_outage")) {
      return {
        label: "Major System Outage",
        icon: <XCircle className="h-6 w-6 text-red-500" />,
        class: "text-red-500"
      };
    } else if (services.some(service => service.status === "degraded")) {
      return {
        label: "Degraded Performance",
        icon: <Triangle className="h-6 w-6 text-amber-500" />,
        class: "text-amber-500"
      };
    } else {
      return {
        label: "All Systems Operational",
        icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
        class: "text-green-500"
      };
    }
  };
  
  const overallStatus = getOverallSystemStatus();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">System Status</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor the health and performance of system services
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button 
            variant="outline"
            size={isMobile ? "sm" : "default"}
            onClick={refreshStatus}
            disabled={refreshing}
          >
            {refreshing ? (
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
          
          <Button size={isMobile ? "sm" : "default"} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>
      
      {/* System Status Overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>System Health</CardTitle>
            <div className="text-sm text-muted-foreground">
              Last updated: {format(statusData.lastUpdated, "MMM d, yyyy HH:mm:ss")}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="flex flex-col items-center">
              {overallStatus.icon}
              <h3 className={`text-xl font-bold mt-2 ${overallStatus.class}`}>
                {overallStatus.label}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {statusData.services.filter(s => s.status === "operational").length} of {statusData.services.length} services operational
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mt-6">
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Uptime</div>
                  <div className="text-2xl font-bold">{statusData.overall.uptime}%</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Response Time</div>
                  <div className="text-2xl font-bold">{statusData.overall.responseTime}ms</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Server Load</div>
                  <div className="text-2xl font-bold">{statusData.overall.serverLoad}%</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Active Services</div>
                  <div className="text-2xl font-bold">{statusData.services.filter(s => s.status === "operational").length}/{statusData.services.length}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs for different status views */}
      <Tabs defaultValue="services" className="w-full">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        
        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Status</CardTitle>
              <CardDescription>Current operational status of all system services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Service</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Uptime</TableHead>
                      <TableHead>Response Time</TableHead>
                      <TableHead>Last Incident</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statusData.services.map((service) => (
                      <TableRow key={service.name}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {service.name === "API Services" && <Activity className="h-4 w-4 mr-2 text-blue-500" />}
                            {service.name === "Database" && <Database className="h-4 w-4 mr-2 text-purple-500" />}
                            {service.name === "Authentication" && <Shield className="h-4 w-4 mr-2 text-green-500" />}
                            {service.name === "Storage" && <HardDrive className="h-4 w-4 mr-2 text-amber-500" />}
                            {service.name === "Email Delivery" && <Link2 className="h-4 w-4 mr-2 text-blue-500" />}
                            {service.name === "Search Engine" && <Sparkles className="h-4 w-4 mr-2 text-purple-500" />}
                            {service.name === "PDF Generation" && <Server className="h-4 w-4 mr-2 text-indigo-500" />}
                            {service.name === "Payment Processing" && <ArrowDownUp className="h-4 w-4 mr-2 text-green-500" />}
                            {service.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getStatusBadge(service.status)}
                          </div>
                        </TableCell>
                        <TableCell>{service.uptime}%</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{service.responseTime}ms</span>
                            {service.responseTime > 300 && <Triangle className="h-3 w-3 text-amber-500" />}
                          </div>
                        </TableCell>
                        <TableCell>
                          {service.lastIncident ? (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{format(service.lastIncident, "MMM d, yyyy")}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">None recorded</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Resources</CardTitle>
              <CardDescription>Current usage of system resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">CPU Usage ({statusData.resources.cpu}%)</label>
                      <span className={`text-xs ${statusData.resources.cpu > 80 ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {statusData.resources.cpu > 80 ? 'High' : 'Normal'}
                      </span>
                    </div>
                    <Progress value={statusData.resources.cpu} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Memory Usage ({statusData.resources.memory}%)</label>
                      <span className={`text-xs ${statusData.resources.memory > 80 ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {statusData.resources.memory > 80 ? 'High' : 'Normal'}
                      </span>
                    </div>
                    <Progress value={statusData.resources.memory} className="h-2" />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Storage Usage ({statusData.resources.storage}%)</label>
                      <span className={`text-xs ${statusData.resources.storage > 80 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                        {statusData.resources.storage > 80 ? 'Warning' : 'Normal'}
                      </span>
                    </div>
                    <Progress value={statusData.resources.storage} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Bandwidth Usage ({statusData.resources.bandwidth}%)</label>
                      <span className="text-xs text-muted-foreground">Normal</span>
                    </div>
                    <Progress value={statusData.resources.bandwidth} className="h-2" />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                <h4 className="text-sm font-medium">System Metrics</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] flex items-end space-x-1">
                        {statusData.metrics.dailyActiveUsers.map((day, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div 
                              className="bg-blue-200 w-full rounded-t-md"
                              style={{ 
                                height: `${(day.count / Math.max(...statusData.metrics.dailyActiveUsers.map(d => d.count))) * 150}px` 
                              }}
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                              {format(day.date, "EEE")}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-center">
                        <div className="text-2xl font-bold">
                          {statusData.metrics.dailyActiveUsers[6].count}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Today's active users
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">API Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] flex items-end space-x-1">
                        {statusData.metrics.requestsPerDay.map((day, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div 
                              className="bg-green-200 w-full rounded-t-md"
                              style={{ 
                                height: `${(day.count / Math.max(...statusData.metrics.requestsPerDay.map(d => d.count))) * 150}px` 
                              }}
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                              {format(day.date, "EEE")}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-center">
                        <div className="text-2xl font-bold">
                          {new Intl.NumberFormat().format(statusData.metrics.requestsPerDay[6].count)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Today's API requests
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Incidents Tab */}
        <TabsContent value="incidents" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Incidents</CardTitle>
              <CardDescription>
                Current issues affecting system performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statusData.incidents.filter(inc => inc.status !== "resolved").length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <h4 className="text-lg font-medium mb-1">No active incidents</h4>
                  <p className="text-muted-foreground">All services are operating normally</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {statusData.incidents
                    .filter(inc => inc.status !== "resolved")
                    .map((incident) => (
                      <Card key={incident.id} className="border-l-4 border-l-amber-500">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">{incident.title}</CardTitle>
                              <CardDescription>
                                Started {format(incident.started, "MMM d, yyyy HH:mm")}
                              </CardDescription>
                            </div>
                            {getStatusBadge(incident.status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm pb-2">
                            <span className="text-muted-foreground">Affected services: </span>
                            {incident.services.join(", ")}
                          </div>
                          
                          <div className="border-t pt-2 mt-2 space-y-2">
                            <h5 className="text-sm font-medium flex items-center">
                              <History className="h-4 w-4 mr-1" />
                              Updates
                            </h5>
                            
                            {incident.updates.map((update, i) => (
                              <div key={i} className="text-sm pl-4 border-l-2 border-l-gray-200 py-1">
                                <div className="text-xs text-muted-foreground">
                                  {format(update.timestamp, "MMM d, yyyy HH:mm")} - {update.status}
                                </div>
                                <div className="pt-1">
                                  {update.message}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Incident History</CardTitle>
              <CardDescription>
                Past incidents that have been resolved
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Services</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead>Resolved</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statusData.incidents
                      .filter(inc => inc.status === "resolved")
                      .map((incident) => {
                        // Calculate duration in hours and minutes
                        const duration = incident.resolved - incident.started;
                        const hours = Math.floor(duration / (1000 * 60 * 60));
                        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
                        
                        return (
                          <TableRow key={incident.id}>
                            <TableCell className="font-medium">
                              {incident.title}
                              <div className="text-xs text-muted-foreground mt-1">
                                {incident.severity === "major" ? "Major" : "Minor"} incident
                              </div>
                            </TableCell>
                            <TableCell>{incident.services.join(", ")}</TableCell>
                            <TableCell>{format(incident.started, "MMM d, yyyy HH:mm")}</TableCell>
                            <TableCell>{format(incident.resolved, "MMM d, yyyy HH:mm")}</TableCell>
                            <TableCell>
                              {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Maintenance</CardTitle>
              <CardDescription>
                Upcoming scheduled maintenance windows
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statusData.maintenance.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No scheduled maintenance</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {statusData.maintenance.map((maint) => (
                    <Card key={maint.id} className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{maint.title}</CardTitle>
                            <CardDescription>
                              {format(maint.scheduledStart, "MMM d, yyyy HH:mm")} - {format(maint.scheduledEnd, "HH:mm")}
                            </CardDescription>
                          </div>
                          {getStatusBadge(maint.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm space-y-2">
                          <div>
                            <span className="text-muted-foreground">Affected services: </span>
                            {maint.services.join(", ")}
                          </div>
                          
                          <div>
                            <span className="text-muted-foreground">Description: </span>
                            {maint.description}
                          </div>
                          
                          <div>
                            <span className="text-muted-foreground">Expected duration: </span>
                            {(maint.scheduledEnd - maint.scheduledStart) / (1000 * 60 * 60)} hours
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-3">
                <p>
                  Our maintenance policy ensures minimal disruption to your service:
                </p>
                
                <ul className="list-disc pl-5 space-y-1">
                  <li>All scheduled maintenance windows are announced at least 48 hours in advance</li>
                  <li>Maintenance is scheduled during off-peak hours whenever possible</li>
                  <li>Critical security patches may be applied with shorter notice when necessary</li>
                  <li>Email notifications are sent to all administrators before maintenance begins</li>
                  <li>Status updates are posted on this page throughout the maintenance window</li>
                </ul>
                
                <p>
                  If you have questions or concerns about upcoming maintenance, please contact our support team.
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full sm:w-auto">
                Contact Support
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <p>
            <span className="font-medium">Environment:</span> Production
          </p>
          <p>
            <span className="font-medium">API Version:</span> v2.7.3
          </p>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-1" />
          <span>{statusData.metrics.dailyActiveUsers[6].count} users currently online</span>
        </div>
      </div>
    </div>
  );
}