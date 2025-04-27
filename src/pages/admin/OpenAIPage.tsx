import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Brain, 
  MessageSquare, 
  CheckCircle, 
  RotateCw, 
  FileText, 
  Settings,
  AlertCircle,
  SparkleIcon,
  Bot,
  Database,
  Code,
  Store
} from "lucide-react";

export default function OpenAIPage() {
  const isMobile = useIsMobile();
  const [apiStatus, setApiStatus] = useState("connected"); // connected, disconnected, error
  const [modelType, setModelType] = useState("gpt-4o");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">OpenAI Integration</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure AI assistants and API settings for dashboard AI features</p>
        </div>
        
        <div className="flex items-center mt-4 sm:mt-0">
          {apiStatus === "connected" && (
            <Badge className="bg-green-100 text-green-800 flex items-center gap-1.5 px-2.5 py-1">
              <CheckCircle className="h-3.5 w-3.5" />
              Connected
            </Badge>
          )}
          {apiStatus === "error" && (
            <Badge className="bg-red-100 text-red-800 flex items-center gap-1.5 px-2.5 py-1">
              <AlertCircle className="h-3.5 w-3.5" />
              Error
            </Badge>
          )}
          {apiStatus === "disconnected" && (
            <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1.5 px-2.5 py-1">
              <AlertCircle className="h-3.5 w-3.5" />
              Disconnected
            </Badge>
          )}
        </div>
      </div>

      {apiStatus === "connected" && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>API Connection Active</AlertTitle>
          <AlertDescription>
            Your OpenAI API connection is active and all AI features are functioning properly.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            Configure your OpenAI API settings for all AI features
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
              Your API key is securely stored and never exposed in client-side code
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model-selection">Default Model</Label>
            <Select value={modelType} onValueChange={setModelType}>
              <SelectTrigger id="model-selection">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              This model will be used across all platform features unless otherwise specified
            </p>
          </div>
          
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable-ai">Enable AI Features</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle all AI functionality across the platform
                </p>
              </div>
              <Switch id="enable-ai" defaultChecked />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button variant="outline" className="gap-2">
            <RotateCw className="h-4 w-4" />
            Test Connection
          </Button>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>

      <Tabs defaultValue="assistants" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assistants">AI Assistants</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard AI</TabsTrigger>
          <TabsTrigger value="usage">Usage & Analytics</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assistants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>OpenAI Assistants Configuration</CardTitle>
              <CardDescription>Configure custom assistants for specific tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between border p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">Mediation Assistant</p>
                        <p className="text-sm text-muted-foreground">Assists in organizing and analyzing mediation notes</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50">Active</Badge>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">Document Analyzer</p>
                        <p className="text-sm text-muted-foreground">Extracts key information from legal documents</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50">Active</Badge>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <Bot className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">Client Communication Helper</p>
                        <p className="text-sm text-muted-foreground">Assists in drafting client communications</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-yellow-50">Inactive</Badge>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  <Button className="mt-2">
                    Create New Assistant
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assistant Configuration</CardTitle>
              <CardDescription>Configure system prompts and capabilities for assistants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="system-prompt">Default System Prompt</Label>
                  <Textarea
                    id="system-prompt"
                    placeholder="Enter the default system prompt for assistants"
                    className="min-h-[100px]"
                    defaultValue="You are a helpful assistant for a mediation practice. Provide concise, accurate information related to mediation, legal processes, and client management. Maintain a professional tone and ensure all information is factual and relevant to the mediation context."
                  />
                  <p className="text-sm text-muted-foreground">
                    This system prompt will be used as a base for all assistants unless overridden
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-tools">Enable Tool Use</Label>
                    <Switch id="enable-tools" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Allow assistants to use function calling and tools like retrieval and code interpretation
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-retrieval">Knowledge Retrieval</Label>
                    <Switch id="enable-retrieval" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Allow assistants to search and retrieve information from uploaded documents
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard AI Features</CardTitle>
              <CardDescription>Configure AI functionality on the main dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SparkleIcon className="h-4 w-4 text-primary" />
                      <Label htmlFor="ai-summaries">AI Case Summaries</Label>
                    </div>
                    <Switch id="ai-summaries" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    Generate automatic summaries of case progress and key updates
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      <Label htmlFor="ai-assistant">AI Chat Assistant</Label>
                    </div>
                    <Switch id="ai-assistant" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    Enable chatbot assistant for quick queries and information retrieval
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-primary" />
                      <Label htmlFor="ai-data-analysis">Data Analysis & Insights</Label>
                    </div>
                    <Switch id="ai-data-analysis" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    Generate intelligent insights from your practice data
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-primary" />
                      <Label htmlFor="ai-document-generation">Document Generation</Label>
                    </div>
                    <Switch id="ai-document-generation" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    Use AI to generate documents and correspondence from templates
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button className="w-full">Apply Dashboard Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Usage Analytics</CardTitle>
              <CardDescription>Monitor your OpenAI API usage and costs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Current Billing Cycle</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">API Calls</div>
                        <div className="text-2xl font-bold">1,284</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">Tokens Used</div>
                        <div className="text-2xl font-bold">867,392</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">Estimated Cost</div>
                        <div className="text-2xl font-bold">$34.75</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Usage Limits</h3>
                  <div className="space-y-2">
                    <Label htmlFor="monthly-limit">Monthly Usage Limit ($)</Label>
                    <Input id="monthly-limit" defaultValue="200" />
                    <p className="text-sm text-muted-foreground">
                      Set a monthly spending limit for OpenAI API usage
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="usage-alerts">Usage Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts when usage reaches 80% of limit
                      </p>
                    </div>
                    <Switch id="usage-alerts" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced OpenAI integration options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="org-id">Organization ID</Label>
                  <Input id="org-id" placeholder="Enter OpenAI Organization ID" />
                  <p className="text-sm text-muted-foreground">
                    Optional: Only required if using an organization account
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endpoint-url">Custom API Endpoint</Label>
                  <Input id="endpoint-url" placeholder="https://api.openai.com" defaultValue="https://api.openai.com" />
                  <p className="text-sm text-muted-foreground">
                    Optional: Use a custom API endpoint or proxy
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="fine-tuning">Model Fine-Tuning</Label>
                      <p className="text-sm text-muted-foreground">
                        Use custom fine-tuned models for domain-specific tasks
                      </p>
                    </div>
                    <Switch id="fine-tuning" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="logging">API Call Logging</Label>
                      <p className="text-sm text-muted-foreground">
                        Log all API calls for debugging and optimization
                      </p>
                    </div>
                    <Switch id="logging" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <div className="flex w-full justify-between">
                <Button variant="destructive">Reset All Settings</Button>
                <Button>Save Advanced Settings</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}