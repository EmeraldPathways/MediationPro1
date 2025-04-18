import { Layout } from "@/components/layout/layout";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, Phone, Video, Users } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
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
              <div 
                key={event.id} 
                className={`${isMobile ? 'text-[0.6rem]' : 'text-xs'} bg-blue-100 text-blue-800 rounded px-1 py-0.5 truncate mb-0.5`}
              >
                {isMobile ? '' : `${formatTime(event.date)} `}{event.title}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="flex flex-col h-full space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h1 className={`${isMobile ? "text-xl" : "text-3xl"} font-bold tracking-tight`}>Calendar</h1>
            <p className="text-muted-foreground text-sm">
              Schedule and manage your mediation sessions.
            </p>
          </div>
          <Button 
            size={isMobile ? "sm" : "default"}
            className="flex gap-2 self-start"
            onClick={() => navigate("/calendar/new")}
          >
            <Plus className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            {isMobile ? "Add Session" : "Schedule Session"}
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-12 h-[calc(100vh-200px)]">
          <Card className="md:col-span-8 h-full overflow-hidden flex flex-col">
            <CardHeader className={`${isMobile ? "px-2 py-2" : "pb-2"}`}>
              <CardTitle className={isMobile ? "text-base" : ""}>Calendar</CardTitle>
              <CardDescription className={isMobile ? "text-xs" : ""}>View and manage your schedule</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-0">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    setDate(selectedDate);
                    navigate(`/calendar/new?date=${selectedDate.toISOString().split('T')[0]}`);
                  }
                }}
                className="w-full h-full pointer-events-auto"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: `space-y-4 w-full ${isMobile ? 'text-sm' : ''}`,
                  table: "w-full border-collapse",
                  head_row: "flex w-full",
                  row: "flex w-full mt-2",
                  cell: `w-full p-${isMobile ? '0.5' : '1'} relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 border border-muted`,
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
                    <button {...props} className={`h-full w-full ${isMobile ? 'p-0.5' : 'p-1'} overflow-hidden`}>
                      {renderDay(dayDate)}
                    </button>
                  ),
                }}
              />
            </CardContent>
          </Card>
          
          <Card className="md:col-span-4 h-full flex flex-col">
            <CardHeader className={isMobile ? "px-3 py-2" : ""}>
              <CardTitle className={isMobile ? "text-base" : ""}>
                {date ? date.toLocaleDateString('en-US', { 
                  weekday: isMobile ? 'short' : 'long', 
                  month: isMobile ? 'short' : 'long', 
                  day: 'numeric' 
                }) : 'Select a date'}
              </CardTitle>
              <CardDescription className={isMobile ? "text-xs" : ""}>
                {selectedDateEvents.length 
                  ? `${selectedDateEvents.length} sessions scheduled`
                  : 'No sessions scheduled'}
              </CardDescription>
            </CardHeader>
            <CardContent className={`flex-1 overflow-auto ${isMobile ? "p-3" : ""}`}>
              <div className="space-y-3">
                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`rounded-lg border ${isMobile ? 'p-2' : 'p-3'} hover:bg-muted/50 cursor-pointer transition-colors`}
                    >
                      <div className="flex items-center gap-2">
                        {getSessionTypeIcon(event.sessionType)}
                        <div className={`font-medium ${isMobile ? "text-sm" : ""}`}>{event.title}</div>
                      </div>
                      <div className={`${isMobile ? "text-xs" : "text-sm"} text-muted-foreground mt-1`}>
                        {formatTime(event.date)} - {formatTime(event.endTime)}
                      </div>
                      <div className={`${isMobile ? "text-xs" : "text-sm"} text-muted-foreground mt-1`}>
                        {event.location}
                      </div>
                      
                      {/* Show case file number and session type only on desktop or if mobile, condense them */}
                      {isMobile ? (
                        <div className="text-xs mt-1 flex items-center justify-between">
                          {event.caseFileNumber && (
                            <span>Case #{event.caseFileNumber}</span>
                          )}
                          <span className="flex items-center gap-1 text-muted-foreground">
                            {getSessionTypeIcon(event.sessionType)}
                            {event.sessionType}
                          </span>
                        </div>
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p className={isMobile ? "text-sm" : ""}>No events scheduled for this date.</p>
                    <Button 
                      variant="link" 
                      className={`mt-2 ${isMobile ? "text-sm" : ""}`}
                      onClick={() => navigate("/calendar/new")}
                    >
                      {isMobile ? "Add session" : "+ Add new session"}
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
