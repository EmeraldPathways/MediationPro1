
import { useState } from "react";
import Picker from "react-mobile-picker";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Phone, Video, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(3, { message: "Session title is required" }),
  date: z.date({
    required_error: "Session date is required",
  }),
  startTime: z.string().min(1, { message: "Start time is required" }),
  endTime: z.string().min(1, { message: "End time is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  notes: z.string().optional(),
  sessionType: z.string().min(1, { message: "Session type is required" }),
  caseFileNumber: z.string().min(1, { message: "Case file number is required" }),
});

const NewSessionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get("date");
  const selectedDate = dateParam ? new Date(dateParam) : undefined;

  const currentDate = new Date();
  const years = Array.from({ length: 50 }, (_, i) => `${currentDate.getFullYear() - 25 + i}`);
  const months = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
  const days = Array.from({ length: 31 }, (_, i) => `${i + 1}`);

  const [pickerValue, setPickerValue] = useState({
    year: `${currentDate.getFullYear()}`,
    month: `${currentDate.getMonth() + 1}`,
    day: `${currentDate.getDate()}`
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: selectedDate,
      startTime: "09:00",
      endTime: "10:00",
      location: "",
      notes: "",
      sessionType: "Meeting",
      caseFileNumber: "",
    },
  });

  // Watch the sessionType to display appropriate icon
  const sessionType = form.watch("sessionType");

  // Get session type icon
  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case "Phone Call":
        return <Phone className="h-4 w-4 text-blue-500" />;
      case "Video Call":
        return <Video className="h-4 w-4 text-purple-500" />;
      case "Meeting":
        return <Users className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Form data submitted:", data);

    try {
      // 1. Retrieve existing sessions from localStorage
      const existingSessionsRaw = localStorage.getItem("sessions");
      const existingSessions = existingSessionsRaw ? JSON.parse(existingSessionsRaw) : [];

      // 2. Add the new session (add a unique ID for potential future use)
      const newSessionWithId = { ...data, id: crypto.randomUUID(), date: data.date.toISOString() }; // Store date as ISO string
      existingSessions.push(newSessionWithId);

      // 3. Save updated sessions back to localStorage
      localStorage.setItem("sessions", JSON.stringify(existingSessions));

      toast({
        title: "Session scheduled",
        description: `${data.title} (${data.sessionType}) scheduled for ${format(data.date, "PPP")}`,
      });

      // Navigate back to the calendar page (passing data via state is now less critical but can remain for immediate UI update)
      navigate("/calendar", { state: { newSession: newSessionWithId } });
    } catch (error) {
      console.error("Failed to save session to localStorage:", error);
      toast({
        title: "Error",
        description: "Failed to save session locally. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/calendar")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Schedule Session</h1>
            <p className="text-muted-foreground">Create a new mediation session</p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter session title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sessionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select session type">
                                {field.value && (
                                  <div className="flex items-center gap-2">
                                    {getSessionTypeIcon(field.value)}
                                    <span>{field.value}</span>
                                  </div>
                                )}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Phone Call" className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-blue-500" />
                                <span>Phone Call</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Video Call" className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                <Video className="h-4 w-4 text-purple-500" />
                                <span>Video Call</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Meeting" className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-green-500" />
                                <span>Meeting</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="caseFileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Case File Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter case file number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the associated case file number for this session
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Select a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 max-h-80 overflow-y-auto scroll-smooth" align="start">
                            <div className="flex justify-center gap-4 p-4 h-40 overflow-hidden border rounded-md bg-white">
                              <Picker
                                value={pickerValue}
                                onChange={(val) => {
                                  setPickerValue(val);
                                  const year = parseInt(val.year, 10);
                                  const month = parseInt(val.month, 10) - 1;
                                  const day = parseInt(val.day, 10);
                                  const newDate = new Date(year, month, day);
                                  field.onChange(newDate);
                                }}
                                optionGroups={{
                                  year: years,
                                  month: months,
                                  day: days,
                                }}
                                height={160}
                                itemHeight={40}
                                className="flex gap-4 w-full"
                                wheelClassName="flex-1 flex flex-col items-center overflow-hidden border-x border-gray-200"
                                itemClassName="text-center py-2 text-base text-gray-700"
                                indicatorClassName="border-t-2 border-b-2 border-primary"
                                indicatorTop={60}
                                indicatorHeight={40}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid gap-6 grid-cols-2">
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <textarea 
                          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Add any additional notes"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include any important details about this session.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => navigate("/calendar")}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Schedule Session
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NewSessionPage;
