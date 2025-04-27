import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Smartphone, 
  CheckCircle, 
  RefreshCw, 
  Users, 
  MessageSquare, 
  FileText, 
  Calendar, 
  AlertCircle 
} from "lucide-react";

export default function HubspotPage() {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">HubSpot Integration</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage HubSpot CRM integration and data synchronization</p>
        </div>
        
        <div className="flex items-center mt-4 sm:mt-0">
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1.5 px-2.5 py-1">
            <CheckCircle className="h-3.5 w-3.5" />
            Connected
          </Badge>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Integration Status</AlertTitle>
        <AlertDescription>
          Your HubSpot account is currently connected and syncing data. Last sync was 35 minutes ago.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            Manage your HubSpot API connection settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex gap-2">
              <Input
                id="api-key"
                value="•••••••••••••••••••••••••••••"
                disabled
                className="font-mono"
              />
              <Button variant="outline">Show</Button>
              <Button variant="outline">Reset</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Your API key is securely stored and never displayed in full
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="account-id">HubSpot Account ID</Label>
              <span className="text-sm text-muted-foreground">Verified</span>
            </div>
            <Input id="account-id" value="84729103" disabled />
          </div>
          
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-sync">Automatic Synchronization</Label>
                <p className="text-sm text-muted-foreground">
                  Sync data with HubSpot every 30 minutes
                </p>
              </div>
              <Switch id="auto-sync" defaultChecked />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Sync Now
          </Button>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>

      <Tabs defaultValue="data-mapping" className="space-y-4">
        <TabsList>
          <TabsTrigger value="data-mapping">Data Mapping</TabsTrigger>
          <TabsTrigger value="sync-history">Sync History</TabsTrigger>
          <TabsTrigger value="settings">Advanced Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="data-mapping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Field Mapping</CardTitle>
              <CardDescription>Configure how data is synchronized between systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between border p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Contacts</p>
                        <p className="text-sm text-muted-foreground">MediatorlPro Contact → HubSpot Contact</p>
                      </div>
                    </div>
                    <Badge variant="outline">12 fields</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between border p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Case Files</p>
                        <p className="text-sm text-muted-foreground">Mediator Pro Cases → HubSpot Deals</p>
                      </div>
                    </div>
                    <Badge variant="outline">8 fields</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between border p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Sessions</p>
                        <p className="text-sm text-muted-foreground">Mediator Pro Sessions → HubSpot Meetings</p>
                      </div>
                    </div>
                    <Badge variant="outline">5 fields</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between border p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Communications</p>
                        <p className="text-sm text-muted-foreground">Mediator Pro Notes → HubSpot Notes</p>
                      </div>
                    </div>
                    <Badge variant="outline">3 fields</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sync-history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Synchronization History</CardTitle>
              <CardDescription>Records of recent data synchronizations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Sync history will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Integration Settings</CardTitle>
              <CardDescription>Configure advanced integration options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Advanced settings will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}