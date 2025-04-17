
import { Layout } from "@/components/layout/layout";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, Phone, Video, Users } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// Define the Event type for better type checking
interface Event {
  id: number;
  title: string;
  date: Date;
  endTime: Date;
  location: string;
  notes?: string;
  sessionType: string;
  caseFileNumber?: string;
}

// Mock data for calendar events
const initialEvents: Event[] = [
  {
    id: 1,
    title: "Smith vs. Johnson Mediation",
    date: new Date(2023, 5, 15, 10, 0),
    endTime: new Date(2023, 5, 15, 12, 0),
    location: "Conference Room A",
    sessionType: "Meeting",
    caseFileNumber: "CASE-001",
  },
  {
    id: 2,
    title: "Property Dispute Resolution",
    date: new Date(2023, 5, 16, 14, 30),
    endTime: new Date(2023, 5, 16, 16, 30),
    location: "Virtual Meeting",
    sessionType: "Video Call",
    caseFileNumber: "CASE-002",
  },
  {
    id: 3,
    title: "Employment Contract Negotiation",
    date: new Date(2023, 5, 18, 9, 0),
    endTime: new Date(2023, 5, 18, 11, 30),
    location: "Conference Room B",
    sessionType: "Meeting",
    caseFileNumber: "CASE-003",
  },
];

// Function to create a date object from a date string and time string
export const createDateTimeFromStrings = (dateObj: Date, timeString: string): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const newDate = new Date(dateObj);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for new session data from location state
  useEffect(() => {
    if (location.state && location.state.newSession) {
      const { newSession } = location.state;
      
      // Create a new event from the session data
      const newEvent: Event = {
        id: events.length + 1,
        title: newSession.title,
        date: createDateTimeFromStrings(newSession.date, newSession.startTime),
        endTime: createDateTimeFromStrings(newSession.date, newSession.endTime),
        location: newSession.location,
        notes: newSession.notes,
        sessionType: newSession.sessionType || "Meeting",
        caseFileNumber: newSession.caseFileNumber || "",
      };
      
      // Add the new event to the events array
      setEvents(prev => [...prev, newEvent]);
      
      // Set the date to show the new event
      setDate(newEvent.date);
      
      // Show a toast notification
      toast({
        title: "Session added",
        description: `${newEvent.title} (${newEvent.sessionType}) has been added to your calendar`,
      });
      
      // Clear the location state to prevent duplicate additions
      window.history.replaceState({}, document.title);
    }
  }, [location.state, events.length]);
  
  // Get events for the selected date
  const selectedDateEvents = events.filter(
    (event) => date && event.date.toDateString() === date.toDateString()
  );

  // Format time from date
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to get day events
  const getDayEvents = (day: Date | undefined) => {
    if (!day) return [];
    return events.filter(event => 
      event.date.getDate() === day.getDate() && 
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
  };

  // Get session type icon
  const getSessionTypeIcon = (sessionType: string) => {
    switch (sessionType) {
      case "Phone Call":
        return <Phone className="h-4 w-4 text-blue-500" />;
      case "Video Call":
        return <Video className="h-4 w-4 text-purple-500" />;
      case "Meeting":
        return <Users className="h-4 w-4 text-green-500" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };

  // Custom day component to show events
  const renderDay = (dayDate: Date) => {
    const dayEvents = getDayEvents(dayDate);
    return (
      <div className="w-full h-full">
        <div>{dayDate.getDate()}</div>
        {dayEvents.length > 0 && (
          <div className="mt-1">
            {dayEvents.map(event => (
              <div key={event.id} className="text-xs bg-blue-100 text-blue-800 rounded px-1 py-0.5 truncate mb-0.5">
                {formatTime(event.date)} {event.title}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="flex flex-col h-full space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
            <p className="text-muted-foreground">
              Schedule and manage your mediation sessions.
            </p>
          </div>
          <Button 
            className="flex gap-2"
            onClick={() => navigate("/calendar/new")}
          >
            <Plus className="h-4 w-4" />
            Schedule Session
          </Button>
        </div>

        <div className="flex justify-end mt-2">
        </div>
        
        <div className="grid gap-6 md:grid-cols-12 h-[calc(100vh-200px)]">
          <Card className="md:col-span-8 h-full overflow-hidden flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle>Calendar</CardTitle>
              <CardDescription>View and manage your schedule</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-0">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    setDate(selectedDate);
                    const isoDate = selectedDate.toISOString().split('T')[0];
                    navigate(`/calendar/new?date=${isoDate}`);
                  }
                }}
                className="w-full h-full pointer-events-auto"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4 w-full",
                  table: "w-full border-collapse",
                  head_row: "flex w-full",
                  row: "flex w-full mt-2",
                  cell: "w-full p-1 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 border border-muted", // Removed h-24
                  day: "h-full w-full p-0 font-normal aria-selected:opacity-100 hover:bg-muted/50 rounded-md",
                  day_today: "bg-accent text-accent-foreground",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
                components={{
                  Day: ({ date: dayDate, ...props }) => (
                    <button {...props} className="h-full w-full p-1 overflow-hidden">
                      {renderDay(dayDate)}
                    </button>
                  ),
                }}
              />
            </CardContent>
          </Card>
          
          <Card className="md:col-span-4 h-full flex flex-col">
            <CardHeader>
              <CardTitle>
                {date ? date.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'Select a date'}
              </CardTitle>
              <CardDescription>
                {selectedDateEvents.length 
                  ? `${selectedDateEvents.length} sessions scheduled`
                  : 'No sessions scheduled'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <div className="space-y-4">
                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-lg border p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {getSessionTypeIcon(event.sessionType)}
                        <div className="font-medium">{event.title}</div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {formatTime(event.date)} - {formatTime(event.endTime)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {event.location}
                      </div>
                      {event.caseFileNumber && (
                        <div className="text-sm mt-1 flex gap-2">
                          <span className="font-medium">Case #:</span>
                          <span>{event.caseFileNumber}</span>
                        </div>
                      )}
                      {event.sessionType && (
                        <div className="text-sm mt-1 flex gap-2">
                          <span className="font-medium">Type:</span>
                          <span className="flex items-center gap-1">
                            {getSessionTypeIcon(event.sessionType)}
                            {event.sessionType}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No events scheduled for this date.</p>
                    <Button 
                      variant="link" 
                      className="mt-2"
                      onClick={() => navigate("/calendar/new")}
                    >
                      + Add new session
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;
