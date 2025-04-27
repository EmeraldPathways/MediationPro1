import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Database, Upload, Download, Calendar as CalendarIcon, AlertCircle, FileText, CheckCircle } from "lucide-react";
import { format } from "date-fns";

export default function DataImportExportPage() {
  const isMobile = useIsMobile();
  const [importFormat, setImportFormat] = useState("csv");
  const [exportType, setExportType] = useState("cases");
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  const [showImportSuccess, setShowImportSuccess] = useState(false);

  const handleFileUpload = () => {
    // In a real implementation, this would handle file upload
    // For this placeholder, we'll just show a success message
    setShowImportSuccess(true);
    setTimeout(() => setShowImportSuccess(false), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Data Import & Export</h1>
          <p className="text-sm text-muted-foreground mt-1">Import data into the system or export data for backup and analysis</p>
        </div>
      </div>

      <Tabs defaultValue="import" className="space-y-6">
        <TabsList>
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="import" className="space-y-6">
          {showImportSuccess && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Import Successful</AlertTitle>
              <AlertDescription>
                Your data has been successfully imported into the system.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Import Data
              </CardTitle>
              <CardDescription>
                Upload files to import data into the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="import-type">Data Type</Label>
                <Select defaultValue="cases">
                  <SelectTrigger id="import-type">
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cases">Case Files</SelectItem>
                    <SelectItem value="contacts">Contacts</SelectItem>
                    <SelectItem value="sessions">Sessions</SelectItem>
                    <SelectItem value="documents">Documents</SelectItem>
                    <SelectItem value="billing">Billing Records</SelectItem>
                    <SelectItem value="users">Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="import-format">Import Format</Label>
                <Select value={importFormat} onValueChange={setImportFormat}>
                  <SelectTrigger id="import-format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload File</Label>
                <div className="mt-1 flex items-center">
                  <Input
                    id="file-upload"
                    type="file"
                    accept={
                      importFormat === "csv" ? ".csv" : 
                      importFormat === "json" ? ".json" : 
                      ".xlsx,.xls"
                    }
                    className="flex-1"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {importFormat === "csv" && "Upload a CSV file with the required columns for your selected data type."}
                  {importFormat === "json" && "Upload a JSON file with the required structure for your selected data type."}
                  {importFormat === "excel" && "Upload an Excel file with the required sheets and columns for your selected data type."}
                </p>
              </div>

              <div className="mt-2">
                <details className="text-sm">
                  <summary className="font-medium cursor-pointer">Import Options</summary>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center">
                      <input
                        id="update-existing"
                        name="import-options"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-primary focus:ring-primary-600"
                        defaultChecked
                      />
                      <Label htmlFor="update-existing" className="ml-2">
                        Update existing records
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="skip-existing"
                        name="import-options"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-primary focus:ring-primary-600"
                      />
                      <Label htmlFor="skip-existing" className="ml-2">
                        Skip existing records
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="duplicate-existing"
                        name="import-options"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-primary focus:ring-primary-600"
                      />
                      <Label htmlFor="duplicate-existing" className="ml-2">
                        Create duplicates
                      </Label>
                    </div>
                  </div>
                </details>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t px-6 py-4">
              <Button variant="outline" className="mr-2" onClick={() => {}}>
                Download Template
              </Button>
              <Button type="button" onClick={handleFileUpload}>
                Import Data
              </Button>
            </CardFooter>
          </Card>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Importing data will merge with or replace existing records based on your selected options. 
              Consider creating a backup before importing large datasets.
            </AlertDescription>
          </Alert>
        </TabsContent>
        
        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Data
              </CardTitle>
              <CardDescription>
                Export data from the system for backup or analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="export-type">Data Type</Label>
                <Select value={exportType} onValueChange={setExportType}>
                  <SelectTrigger id="export-type">
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cases">Case Files</SelectItem>
                    <SelectItem value="contacts">Contacts</SelectItem>
                    <SelectItem value="sessions">Sessions</SelectItem>
                    <SelectItem value="documents">Documents</SelectItem>
                    <SelectItem value="billing">Billing Records</SelectItem>
                    <SelectItem value="users">Users</SelectItem>
                    <SelectItem value="all">All Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="export-format">Export Format</Label>
                <Select defaultValue="csv">
                  <SelectTrigger id="export-format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date Range (Optional)</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="w-full space-y-2">
                      <Label htmlFor="from-date" className="text-xs">From Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.from ? (
                              format(dateRange.from, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dateRange.from}
                            onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="w-full space-y-2">
                      <Label htmlFor="to-date" className="text-xs">To Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.to ? (
                              format(dateRange.to, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dateRange.to}
                            onSelect={(date) => setDateRange((prev) => ({ ...prev, to: date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {exportType === "cases" && (
                  <div className="space-y-2">
                    <Label htmlFor="case-status">Case Status</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="case-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active Only</SelectItem>
                        <SelectItem value="completed">Completed Only</SelectItem>
                        <SelectItem value="on-hold">On Hold Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {exportType === "users" && (
                  <div className="space-y-2">
                    <Label htmlFor="user-role">User Role</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="user-role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Administrators</SelectItem>
                        <SelectItem value="mediator">Mediators</SelectItem>
                        <SelectItem value="staff">Support Staff</SelectItem>
                        <SelectItem value="client">Clients</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              <div className="mt-2">
                <details className="text-sm">
                  <summary className="font-medium cursor-pointer">Advanced Options</summary>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        id="include-deleted"
                        type="checkbox"
                        className="rounded"
                      />
                      <Label htmlFor="include-deleted">
                        Include deleted records
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        id="include-system-fields"
                        type="checkbox"
                        className="rounded"
                        defaultChecked
                      />
                      <Label htmlFor="include-system-fields">
                        Include system fields
                      </Label>
                    </div>
                    {exportType === "all" && (
                      <div className="flex items-center space-x-2">
                        <input
                          id="include-files"
                          type="checkbox"
                          className="rounded"
                        />
                        <Label htmlFor="include-files">
                          Include file attachments (as ZIP)
                        </Label>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t px-6 py-4">
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scheduled Exports</CardTitle>
              <CardDescription>
                Configure automatic data exports on a schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No scheduled exports configured. Use the "Create Schedule" button to set up automatic exports.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end border-t px-6 py-4">
              <Button variant="outline">
                Create Schedule
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}