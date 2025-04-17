import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Inbox, Send, Archive, Trash, Edit } from "lucide-react";

export default function Email() {
  return (
    <Layout>
      <div className="flex flex-col h-full space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Email</h1>
            <p className="text-muted-foreground">
              Manage and organize your emails
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Compose
          </Button>
        </div>
        
        <Card className="h-[calc(100vh-200px)] flex flex-col">
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <Tabs defaultValue="inbox" className="w-full">
                <TabsList className="grid grid-cols-4 w-[400px]">
                  <TabsTrigger value="inbox" className="flex items-center gap-2">
                    <Inbox className="h-4 w-4" />
                    Inbox
                  </TabsTrigger>
                  <TabsTrigger value="sent" className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Sent
                  </TabsTrigger>
                  <TabsTrigger value="archive" className="flex items-center gap-2">
                    <Archive className="h-4 w-4" />
                    Archive
                  </TabsTrigger>
                  <TabsTrigger value="trash" className="flex items-center gap-2">
                    <Trash className="h-4 w-4" />
                    Trash
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex justify-between items-center mt-4 mb-2">
                  <CardTitle>Inbox</CardTitle>
                  <Input placeholder="Search emails..." className="max-w-xs" />
                </div>
                
                <TabsContent value="inbox" className="m-0">
                  <CardContent className="flex-1 overflow-auto p-0">
                    <div className="divide-y">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div 
                          key={i} 
                          className="p-4 hover:bg-gray-50 cursor-pointer flex items-start gap-4"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-700 text-sm font-medium">C{i}</span>
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <p className="font-medium">Client {i}</p>
                              <p className="text-sm text-gray-500">10:{i}0 AM</p>
                            </div>
                            <p className="font-medium">Case Update - Meeting Notes</p>
                            <p className="text-sm text-gray-600 truncate">
                              Please find attached the notes from our recent mediation session regarding...
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="sent" className="m-0">
                  <CardContent className="flex-1 overflow-auto p-0">
                    <div className="divide-y">
                      {[1, 2, 3].map((i) => (
                        <div 
                          key={i} 
                          className="p-4 hover:bg-gray-50 cursor-pointer flex items-start gap-4"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-700 text-sm font-medium">C{i}</span>
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <p className="font-medium">To: Client {i}</p>
                              <p className="text-sm text-gray-500">Yesterday</p>
                            </div>
                            <p className="font-medium">Mediation Follow-up</p>
                            <p className="text-sm text-gray-600 truncate">
                              Thank you for your participation in the mediation session. As discussed...
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="archive" className="m-0">
                  <CardContent className="flex-1 overflow-auto p-0">
                    <div className="divide-y">
                      {[1, 2].map((i) => (
                        <div 
                          key={i} 
                          className="p-4 hover:bg-gray-50 cursor-pointer flex items-start gap-4"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-700 text-sm font-medium">A{i}</span>
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <p className="font-medium">Archived Thread {i}</p>
                              <p className="text-sm text-gray-500">Mar 15</p>
                            </div>
                            <p className="font-medium">Previous Case Resolution</p>
                            <p className="text-sm text-gray-600 truncate">
                              This is to confirm that we have reached a settlement in the matter of...
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="trash" className="m-0">
                  <CardContent className="flex-1 overflow-auto p-0">
                    <div className="divide-y">
                      <div className="p-8 text-center text-gray-500">
                        No items in trash
                      </div>
                    </div>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </div>
          </CardHeader>
        </Card>
      </div>
    </Layout>
  );
}