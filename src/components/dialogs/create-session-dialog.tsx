import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Picker from "react-mobile-picker";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Video, Users, Calendar as CalendarIcon } from "lucide-react";
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
  sessionType: z.string().min(1, { message: "Session type is required" }),
});

interface CreateSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date;
}

export function CreateSessionDialog({ isOpen, onClose, initialDate }: CreateSessionDialogProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const currentDate = new Date();
  const years = Array.from({ length: 50 }, (_, i) => `${currentDate.getFullYear() - 25 + i}`);
  const months = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
  const days = Array.from({ length: 31 }, (_, i) => `${i + 1}`);

  const [pickerValue, setPickerValue] = useState({
    year: `${initialDate?.getFullYear() || currentDate.getFullYear()}`,
    month: `${(initialDate?.getMonth() || currentDate.getMonth()) + 1}`,
    day: `${initialDate?.getDate() || currentDate.getDate()}`
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: initialDate || undefined,
      startTime: "09:00",
      endTime: "10:00",
      sessionType: "Meeting",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: "",
        date: initialDate || undefined,
        startTime: "09:00",
        endTime: "10:00",
        sessionType: "Meeting",
      });
      const dateToUse = initialDate || currentDate;
      setPickerValue({
        year: `${dateToUse.getFullYear()}`,
        month: `${dateToUse.getMonth() + 1}`,
        day: `${dateToUse.getDate()}`
      });
    }
  }, [isOpen, initialDate, form, currentDate]);

  const sessionType = form.watch("sessionType");

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case "Phone Call": return <Phone className="h-4 w-4 text-blue-500" />;
      case "Video Call": return <Video className="h-4 w-4 text-purple-500" />;
      case "Meeting": return <Users className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Form data submitted from dialog:", data);
    try {
      const existingSessionsRaw = localStorage.getItem("sessions");
      const existingSessions = existingSessionsRaw ? JSON.parse(existingSessionsRaw) : [];
      const newSessionWithId = { ...data, id: crypto.randomUUID(), date: data.date.toISOString() }; 
      existingSessions.push(newSessionWithId);
      localStorage.setItem("sessions", JSON.stringify(existingSessions));

      toast({
        title: "Session scheduled",
        description: `${data.title} (${data.sessionType}) scheduled for ${format(data.date, "PPP")}`,
      });
      
      onClose();

    } catch (error) {
      console.error("Failed to save session to localStorage:", error);
      toast({
        title: "Error",
        description: "Failed to save session locally. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-auto w-[calc(100%-2rem)]">
        <DialogHeader>
          <DialogTitle>Schedule New Session</DialogTitle>
          <DialogDescription>
            Fill in the details for the new mediation session.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1 py-2">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter session title" 
                        {...field}
                      />
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
                        <SelectItem value="Phone Call">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-blue-500" />
                            <span>Phone Call</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Video Call">
                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4 text-purple-500" />
                            <span>Video Call</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Meeting">
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
            
            <div className="grid gap-4 md:grid-cols-2">
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
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setDate(new Date().getDate() - 1))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid gap-4 grid-cols-2">
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
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Schedule Session</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
