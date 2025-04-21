import { Layout } from "@/components/layout/layout";
import { Calendar as CalendarComponent, DayPicker, DayProps } from "@/components/ui/calendar"; // Import DayProps if needed for custom Day
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, Phone, Video, Users, MoreHorizontal, Edit, Trash, Eye } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format, isSameDay } from 'date-fns'; // Import date-fns functions

// Define the Event type
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

// Mock data (replace with actual data fetching)
const initialEvents: Event[] = [
  { id: 1, title: "Smith vs. Johnson Mediation", date: new Date(2024, 3, 15, 10, 0), endTime: new Date(2024, 3, 15, 12, 0), location: "Conference Room A", sessionType: "Meeting", caseFileNumber: "CASE-001" },
  { id: 2, title: "Property Dispute Resolution", date: new Date(2024, 3, 16, 14, 30), endTime: new Date(2024, 3, 16, 16, 30), location: "Virtual Meeting", sessionType: "Video Call", caseFileNumber: "CASE-002" },
  { id: 3, title: "Employment Contract Negotiation", date: new Date(2024, 3, 18, 9, 0), endTime: new Date(2024, 3, 18, 11, 30), location: "Conference Room B", sessionType: "Meeting", caseFileNumber: "CASE-003" },
   { id: 4, title: "Follow Up Smith", date: new Date(2024, 3, 15, 14, 0), endTime: new Date(2024, 3, 15, 15, 0), location: "Office", sessionType: "Phone Call", caseFileNumber: "CASE-001" }, // Added another event for testing
];

// Function to create a date object from a date object and time string
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

  // Effect to handle adding new sessions
  useEffect(() => {
    if (location.state && location.state.newSession) {
      const { newSession } = location.state;
      const newEvent: Event = {
        id: Date.now(),
        title: newSession.title,
        date: createDateTimeFromStrings(newSession.date, newSession.startTime),
        endTime: createDateTimeFromStrings(newSession.date, newSession.endTime),
        location: newSession.location,
        notes: newSession.notes,
        sessionType: newSession.sessionType || "Meeting",
        caseFileNumber: newSession.caseFileNumber || "",
      };
      setEvents(prev => [...prev, newEvent]);
      setDate(newEvent.date);
      toast.success("Session added", {
        description: `${newEvent.title} (${newEvent.sessionType}) has been added.`,
      });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Get events for the selected date
  const selectedDateEvents = events.filter(
    (event) => date && isSameDay(event.date, date) // Use isSameDay from date-fns
  );

  // Format time using date-fns
  const formatTime = (date: Date) => {
    return format(date, 'p'); // 'p' is locale-aware short time format (e.g., 2:30 PM)
  };

  // Get session type icon
  const getSessionTypeIcon = (sessionType: string) => {
    switch (sessionType) {
      case "Phone Call": return <Phone className="h-4 w-4 text-blue-500 flex-shrink-0" />;
      case "Video Call": return <Video className="h-4 w-4 text-purple-500 flex-shrink-0" />;
      case "Meeting": return <Users className="h-4 w-4 text-green-500 flex-shrink-0" />;
      default: return <CalendarIcon className="h-4 w-4 flex-shrink-0" />;
    }
  };

  // Handle deleting an event
  const handleDeleteEvent = (id: number) => {
     setEvents(prev => prev.filter(event => event.id !== id));
     toast.success("Session deleted successfully");
  };

  // --- Modifier logic for react-day-picker ---
  const daysWithEvents = events.map(event => event.date);

  const modifiers = {
    hasEvent: daysWithEvents, // Pass array of dates that have events
  };

  const modifiersClassNames = {
    hasEvent: 'day-has-event', // Custom class name for days with events
  };

  // --- Custom CSS for the dot indicator (add this to your global CSS or component's CSS) ---
  /*
  .day-has-event > div::after { // Target the inner div created by react-day-picker
    content: '';
    position: absolute;
    bottom: 4px; // Adjust position as needed
    left: 50%;
    transform: translateX(-50%);
    width: 6px; // Dot size
    height: 6px; // Dot size
    border-radius: 50%;
    background-color: hsl(var(--primary)); // Use your primary color variable
  }
  */

  return (
    <Layout>
      {/* Use h-full on the main container if Layout provides a flex context */}
      <div className="flex flex-col h-full space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h1 className={`${isMobile ? "text-xl" : "text-3xl"} font-bold tracking-tight`}>Calendar</h1>
            <p className="text-muted-foreground text-sm">
              Schedule and manage your mediation sessions.
            </p>
          </div>
           {!isMobile && (
             <Button onClick={() => navigate("/calendar/new")}>
               <Plus className="mr-2 h-4 w-4" /> Add Session
             </Button>
           )}
        </div>

        {/* Main Content Area: Use Grid for layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 min-h-0">

          {/* Calendar Card: Spans 2 columns on desktop */}
          <Card className="flex flex-col md:col-span-2">
            <CardHeader className={`${isMobile ? "px-3 py-2" : "pb-2"}`}>
              <CardTitle className={isMobile ? "text-base" : ""}>Calendar</CardTitle>
              <CardDescription className={isMobile ? "text-xs" : ""}>View and manage your schedule</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-1 md:p-2"> {/* Allow content to scroll */}
              <style>{`
                .day-has-event { position: relative; }
                .day-has-event::after {
                  content: '';
                  position: absolute;
                  bottom: ${isMobile ? '2px' : '4px'};
                  left: 50%;
                  transform: translateX(-50%);
                  width: ${isMobile ? '4px' : '5px'};
                  height: ${isMobile ? '4px' : '5px'};
                  border-radius: 50%;
                  background-color: hsl(var(--primary));
                }
              `}</style>
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                modifiers={modifiers} // Apply modifiers
                modifiersClassNames={modifiersClassNames} // Apply class names for modifiers
                className="w-full" // Calendar takes full width of its container
                classNames={{ // Use default classes where possible, adjust only necessary ones
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: `space-y-4 w-full ${isMobile ? 'text-sm' : ''}`,
                  caption_label: 'text-sm font-medium',
                  nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex w-full",
                  head_cell: "text-muted-foreground rounded-md w-full justify-center font-normal text-[0.8rem]",
                  row: "flex w-full mt-1 md:mt-2",
                  cell: `w-full text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20`,
                  day: `h-10 md:h-16 w-full p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring relative`, // Added relative positioning for pseudo-element
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "day-outside text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                  // day_hidden: "invisible", // Keep default or uncomment if needed
                }}
                // Removed custom Day component override
              />
            </CardContent>
          </Card>

          {/* Day Details Card: Spans 1 column on desktop */}
          <Card className="flex flex-col md:col-span-1">
            <CardHeader className={isMobile ? "px-3 py-2" : ""}>
              <CardTitle className={isMobile ? "text-base" : ""}>
                {date ? format(date, 'PPPP') : 'Select a date'} {/* Use date-fns format */}
              </CardTitle>
              <CardDescription className={isMobile ? "text-xs" : ""}>
                {selectedDateEvents.length
                  ? `${selectedDateEvents.length} session${selectedDateEvents.length !== 1 ? 's' : ''} scheduled`
                  : 'No sessions scheduled'}
              </CardDescription>
            </CardHeader>
            <CardContent className={`flex-1 overflow-auto ${isMobile ? "p-3" : "p-4"}`}>
              <div className="space-y-3">
                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`rounded-lg border ${isMobile ? 'p-2' : 'p-3'} hover:bg-muted/50 transition-colors`}
                    >
                      <div className="flex items-start justify-between gap-2">
                         <div className="flex items-center gap-2 flex-1 min-w-0">
                           {getSessionTypeIcon(event.sessionType)}
                           <div className={`font-medium truncate ${isMobile ? "text-sm" : ""}`}>{event.title}</div>
                         </div>
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                               <MoreHorizontal className="h-4 w-4" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                             <DropdownMenuItem onClick={() => toast.info("Edit session clicked")}>
                               <Edit className="h-4 w-4 mr-2" /> Edit
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => toast.info("View session clicked")}>
                               <Eye className="h-4 w-4 mr-2" /> View
                             </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteEvent(event.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                <Trash className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
                      </div>
                      <div className={`${isMobile ? "text-xs" : "text-sm"} text-muted-foreground mt-1.5 pl-6`}>
                        <div>{formatTime(event.date)} - {formatTime(event.endTime)}</div>
                        <div>{event.location}</div>
                        {event.caseFileNumber && (
                          <div>Case #{event.caseFileNumber}</div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p className={isMobile ? "text-sm" : ""}>No events scheduled for this date.</p>
                    <Button
                      variant="link"
                      className={`mt-2 ${isMobile ? "text-sm" : ""}`}
                      onClick={() => navigate("/calendar/new", { state: { selectedDate: date?.toISOString().split('T')[0] } })}
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
      {/* FAB Removed */}
    </Layout>
  );
};

export default CalendarPage;