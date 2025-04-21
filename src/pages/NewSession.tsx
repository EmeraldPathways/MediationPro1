import { useState } from "react";
import Picker from "react-mobile-picker"; // Note: react-mobile-picker might not be actively maintained. Consider alternatives if issues arise.
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"; // Standard calendar component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Phone, Video, Users, Calendar as CalendarIcon } from "lucide-react"; // Added CalendarIcon
import { toast } from "@/hooks/use-toast"; // Assuming use-toast is your preferred hook
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

// --- Updated Schema: Removed location, notes, caseFileNumber ---
const formSchema = z.object({
  title: z.string().min(3, { message: "Session title is required" }),
  date: z.date({
    required_error: "Session date is required",
  }),
  startTime: z.string().min(1, { message: "Start time is required" }),
  endTime: z.string().min(1, { message: "End time is required" }),
  sessionType: z.string().min(1, { message: "Session type is required" }),
});

const NewSessionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get("date");
  // Parse the date carefully, providing a default if invalid
  let initialDate: Date | undefined;
  if (dateParam) {
    try {
      const parsedDate = new Date(dateParam);
      if (!isNaN(parsedDate.getTime())) {
        initialDate = parsedDate;
      }
    } catch (e) {
      console.error("Invalid date parameter:", dateParam);
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // --- Updated Default Values ---
    defaultValues: {
      title: "",
      date: initialDate, // Use parsed date or undefined
      startTime: "09:00",
      endTime: "10:00",
      sessionType: "Meeting",
    },
  });

  // Watch the sessionType to display appropriate icon
  const sessionType = form.watch("sessionType");

  // Get session type icon
  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case "Phone Call": return <Phone className="h-4 w-4 text-blue-500 mr-2" />;
      case "Video Call": return <Video className="h-4 w-4 text-purple-500 mr-2" />;
      case "Meeting": return <Users className="h-4 w-4 text-green-500 mr-2" />;
      default: return null;
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Form data submitted:", data);

    try {
      // --- Saving logic (e.g., localStorage or API call) ---
      // Example using localStorage:
      const existingSessionsRaw = localStorage.getItem("sessions");
      const existingSessions = existingSessionsRaw ? JSON.parse(existingSessionsRaw) : [];
      const newSessionWithId = {
        ...data,
        id: crypto.randomUUID(),
        date: data.date.toISOString() // Store date consistently
      };
      existingSessions.push(newSessionWithId);
      localStorage.setItem("sessions", JSON.stringify(existingSessions));
      // --- End Saving Logic ---

      toast({
        title: "Session scheduled",
        description: `${data.title} (${data.sessionType}) scheduled for ${format(data.date, "PPP")}`,
      });

      // Navigate back to calendar, passing state for immediate update
      navigate("/calendar", { state: { newSession: newSessionWithId } });
    } catch (error) {
      console.error("Failed to save session:", error);
      toast({
        title: "Error",
        description: "Failed to save session. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-6 max-w-2xl mx-auto p-4 md:p-0"> {/* Added max-width and padding */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/calendar")}
            aria-label="Back to Calendar"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            {/* Adjusted Title/Description */}
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Schedule New Session</h1>
            <p className="text-muted-foreground text-sm">Fill in the details for the new mediation session.</p>
          </div>
        </div>

        {/* Removed Card wrapper for a simpler form look */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Row 1: Title and Type */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
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
                            {/* Display icon and text inside trigger */}
                            {field.value ? (
                              <span className="flex items-center">
                                {getSessionTypeIcon(field.value)}
                                {field.value}
                              </span>
                            ) : (
                              "Select session type"
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Meeting">
                          <span className="flex items-center">
                            {getSessionTypeIcon("Meeting")} Meeting
                          </span>
                        </SelectItem>
                        <SelectItem value="Phone Call">
                          <span className="flex items-center">
                            {getSessionTypeIcon("Phone Call")} Phone Call
                          </span>
                        </SelectItem>
                        <SelectItem value="Video Call">
                          <span className="flex items-center">
                            {getSessionTypeIcon("Video Call")} Video Call
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 2: Date */}
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
                            "w-full justify-start text-left font-normal", // Changed width to full
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" /> {/* Added Calendar Icon */}
                          {field.value ? (
                            format(field.value, "PPP") // e.g., Jun 21, 2024
                          ) : (
                            <span>Select a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      {/* Using standard Calendar component */}
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))} // Disable past dates
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Row 3: Start Time and End Time */}
            <div className="grid gap-6 grid-cols-2">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      {/* Consider using a dedicated Time Picker component if available */}
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

            {/* Removed Case File Number Field */}
            {/* Removed Location Field */}
            {/* Removed Notes Field */}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4"> {/* Added padding-top */}
              <Button type="submit" className="w-full sm:w-auto"> {/* Full width on mobile */}
                Schedule Session
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/calendar")} className="w-full sm:w-auto"> {/* Full width on mobile */}
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default NewSessionPage;