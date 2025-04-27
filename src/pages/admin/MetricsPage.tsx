import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { BarChart3, LineChart, PieChart, Download, RefreshCcw, Calendar } from "lucide-react";

export default function MetricsPage() {
  const isMobile = useIsMobile();
  const [timeframe, setTimeframe] = useState("30d");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Metrics & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor system performance and usage statistics</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button size="icon" variant="outline">
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Load</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28%</div>
            <p className="text-xs text-muted-foreground mt-1">Average over {timeframe === "7d" ? "7 days" : timeframe === "30d" ? "30 days" : timeframe === "90d" ? "90 days" : "1 year"}</p>
            <div className="mt-4 h-[60px] bg-muted/20 rounded-md"></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">API Requests</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4M</div>
            <p className="text-xs text-muted-foreground mt-1">Total for {timeframe === "7d" ? "7 days" : timeframe === "30d" ? "30 days" : timeframe === "90d" ? "90 days" : "1 year"}</p>
            <div className="mt-4 h-[60px] bg-muted/20 rounded-md"></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.12%</div>
            <p className="text-xs text-muted-foreground mt-1">Average for {timeframe === "7d" ? "7 days" : timeframe === "30d" ? "30 days" : timeframe === "90d" ? "90 days" : "1 year"}</p>
            <div className="mt-4 h-[60px] bg-muted/20 rounded-md"></div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Metrics</CardTitle>
              <CardDescription>User activity and engagement statistics</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] relative">
              <div className="absolute top-0 right-0 p-4">
                <Button variant="outline" size="sm" className="h-8">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <div className="h-full bg-muted/20 rounded-md flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Usage chart placeholder</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>System performance and response times</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="h-full bg-muted/20 rounded-md flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Performance chart placeholder</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Logs</CardTitle>
              <CardDescription>System errors and exceptions</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="h-full bg-muted/20 rounded-md flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Error logs placeholder</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}