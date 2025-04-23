import { Layout } from "@/components/layout/layout";
import { Calendar as CalendarComponent } from "@/components/ui/calendar"; // Simplified import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, Phone, Video, Users, MoreHorizontal } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { format, isSameDay, isToday, isWeekend } from 'date-fns'; // Added imports for date utilities
import { Input } from "@/components/ui/input";
import { CreateSessionDialog } from "@/components/dialogs/create-session-dialog"; // Import CreateSessionDialog
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Import Tooltip components

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

// Calendar Weekly Summary component
const CalendarWeeklySummary = ({ events, date, formatTime, getSessionTypeIcon, navigate }) => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get the start and end dates for the current week
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay()); // Sunday
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
  
  // Get events for the current week
  const weeklyEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= startOfWeek && eventDate <= endOfWeek;
  });
  
  // Filter events by search query
  const filteredEvents = searchQuery 
    ? weeklyEvents.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.caseFileNumber && event.caseFileNumber.toLowerCase().includes(searchQuery.toLowerCase())))
    : weeklyEvents;
  
  // Sort events by date
  filteredEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <Card className="flex flex-col overflow-hidden h-full">
      <CardHeader className={`${isMobile ? "px-2 py-2" : "pb-0"}`}>
        <div className="flex justify-between items-center w-full">
          <CardTitle className={isMobile ? "text-base" : ""}>
            Weekly Summary
          </CardTitle>
          <Input 
            placeholder="Search events..." 
            className={`${isMobile ? "text-sm h-8 max-w-[150px]" : "max-w-xs"}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <CardDescription className={isMobile ? "text-xs" : ""}>
          {format(startOfWeek, 'MMM d')} - {format(endOfWeek, 'MMM d, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto overflow-x-hidden p-0">
        <div className="divide-y">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.id} 
                className={`flex flex-col ${isMobile ? "p-2" : "p-3"} hover:bg-muted/50 transition-colors`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getSessionTypeIcon(event.sessionType)}
                    <div className={`font-medium ${isMobile ? "text-sm" : ""}`}>
                      {event.title}
                    </div>
                  </div>
                </div>
                <div className={`mt-1 text-muted-foreground ${isMobile ? "text-xs" : "text-sm"} ml-6`}>
                  <div className="flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {format(event.date, 'EEE, MMM d')} • {formatTime(event.date)} - {formatTime(event.endTime)}
                  </div>
                  <div>{event.location}</div>
                </div>
              </div>
            ))
          ) : (
            <div className={`${isMobile ? "p-4 text-sm" : "p-6"} text-center text-muted-foreground`}>
              <p>No events found this week.</p>
            </div>
          )}
          {weeklyEvents.length > 0 && (
            <div className="p-3 text-center">
              <Button variant="link" onClick={() => navigate("/calendar/new")}>
                Add new session
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isCreateSessionDialogOpen, setIsCreateSessionDialogOpen] = useState(false); // Dialog open state

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

  const getEventIndicatorColor = (sessionType: string) => {
    switch (sessionType) {
      case "Phone Call": return "bg-blue-500";
      case "Video Call": return "bg-purple-500";
      case "Meeting": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Layout>
      {/* Use h-full on the main container if Layout provides a flex context */}
      <div className="flex flex-col h-full space-y-4">
        {/* Header with button positioned to the right like on Contacts page */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h1 className={`${isMobile ? "text-xl" : "text-3xl"} font-bold tracking-tight`}>Calendar</h1>
            <p className="text-muted-foreground text-sm">
              Schedule and manage your mediation sessions.
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateSessionDialogOpen(true)} 
            size={isMobile ? "sm" : "default"}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Session
          </Button>
        </div>

        {/* Create Session Dialog */}
        <CreateSessionDialog 
          isOpen={isCreateSessionDialogOpen} 
          onClose={() => setIsCreateSessionDialogOpen(false)}
          initialDate={date}
        />

        {/* New layout structure */}
        <div className="flex flex-col space-y-4">
          {/* Row 1: Calendar and Weekly Summary side by side */}
          <div className={`${isMobile ? 'flex flex-col space-y-4' : 'grid grid-cols-2 gap-4'}`}>
            {/* Calendar Card */}
            <Card className="flex flex-col">
              <CardHeader className={`${isMobile ? "px-3 py-2" : "pb-2"}`}>
                <CardTitle className={isMobile ? "text-base" : ""}>Calendar</CardTitle>
                <CardDescription className={isMobile ? "text-xs" : ""}>View and manage your schedule</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-1 md:p-2">
                <style>{`
                  .day-has-event { 
                    position: relative; 
                    background-color: hsl(var(--muted)/60%);
                  }
                  .day-has-event:hover {
                    background-color: hsl(var(--muted));
                  }
                  .day-event-dots {
                    position: absolute;
                    bottom: ${isMobile ? '2px' : '4px'};
                    left: 0;
                    right: 0;
                    display: flex;
                    justify-content: center;
                    gap: 2px;
                  }
                  .day-event-dot {
                    width: ${isMobile ? '3px' : '4px'};
                    height: ${isMobile ? '3px' : '4px'};
                    border-radius: 50%;
                  }
                  .day-event-count {
                    position: absolute;
                    top: 1px;
                    right: 1px;
                    font-size: 0.65rem;
                    background-color: hsl(var(--muted-foreground)/30%);
                    border-radius: 10px;
                    padding: 0px 3px;
                    line-height: 1;
                  }
                  .weekend-day {
                    color: hsl(var(--muted-foreground));
                    background-color: hsl(var(--muted)/30%);
                  }
                  .weekend-day:hover {
                    background-color: hsl(var(--muted)/50%);
                  }
                  .calendar-day {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                  }
                  .add-session-button {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: ${isMobile ? '16px' : '20px'};
                    height: ${isMobile ? '16px' : '20px'};
                    background-color: hsl(var(--primary));
                    border-radius: 50%;
                    color: hsl(var(--primary-foreground));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.2s;
                    cursor: pointer;
                    z-index: 10;
                  }
                  .calendar-day:hover .add-session-button {
                    opacity: 0.9;
                  }
                  .add-session-button:hover {
                    opacity: 1 !important;
                    transform: scale(1.1);
                  }
                  .today-day {
                    font-weight: bold;
                    background-color: hsl(var(--accent));
                    color: hsl(var(--accent-foreground));
                  }
                `}</style>
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  modifiers={modifiers}
                  modifiersClassNames={modifiersClassNames}
                  className="w-full"
                  classNames={{ 
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: `space-y-4 w-full ${isMobile ? 'text-sm' : ''}`,
                    caption_label: 'text-sm font-medium',
                    nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex w-full",
                    head_cell: "text-muted-foreground rounded-md w-full justify-center font-normal text-[0.8rem]",
                    row: "flex w-full mt-1 md:mt-2",
                    cell: `w-full text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20`,
                    day: `h-10 md:h-16 w-full p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring relative`,
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "today-day",
                    day_outside: "day-outside text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                  }}
                  renderDay={(day) => {
                    const dayEvents = events.filter(event => isSameDay(event.date, day));
                    const isWeekendDay = isWeekend(day);
                    const isTodayDay = isToday(day);
                    
                    // Group events by session type to show better indicators
                    const sessionTypes = [...new Set(dayEvents.map(event => event.sessionType))];
                    
                    return (
                      <div className={`calendar-day ${isWeekendDay ? 'weekend-day' : ''} ${isTodayDay ? 'today-day' : ''}`}>
                        <div>{format(day, 'd')}</div>
                        
                        {/* Add session button on hover */}
                        <div 
                          className="add-session-button"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent day selection
                            setDate(day); // Set the selected date
                            setIsCreateSessionDialogOpen(true);
                          }}
                        >
                          <Plus className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                        </div>
                        
                        {/* Event count badge for days with many events */}
                        {dayEvents.length > 2 && (
                          <div className="day-event-count">{dayEvents.length}</div>
                        )}
                        
                        {/* Event dots */}
                        {dayEvents.length > 0 && dayEvents.length <= 3 && (
                          <div className="day-event-dots">
                            {sessionTypes.map((type, index) => (
                              <TooltipProvider key={index}>
                                <Tooltip delayDuration={300}>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={`day-event-dot ${getEventIndicatorColor(type)}`}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="py-1">
                                      {dayEvents
                                        .filter(event => event.sessionType === type)
                                        .map((event, i) => (
                                          <div key={i} className="text-xs py-1">
                                            <div className="font-medium">{event.title}</div>
                                            <div className="text-muted-foreground">
                                              {formatTime(event.date)} - {formatTime(event.endTime)}
                                            </div>
                                          </div>
                                        ))}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ))}
                          </div>
                        )}
                        
                        {/* For days with more than 3 events, use a different tooltip approach */}
                        {dayEvents.length > 3 && (
                          <TooltipProvider>
                            <Tooltip delayDuration={300}>
                              <TooltipTrigger asChild>
                                <div className="day-event-dots">
                                  <div className={`day-event-dot bg-primary`} />
                                  <div className={`day-event-dot bg-primary`} />
                                  <div className={`day-event-dot bg-primary`} />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-h-[200px] overflow-y-auto p-2">
                                <div className="space-y-1">
                                  {dayEvents.map((event, i) => (
                                    <div key={i} className="text-xs border-l-2 pl-2 py-1" style={{ borderColor: event.sessionType === "Phone Call" ? "rgb(59, 130, 246)" : event.sessionType === "Video Call" ? "rgb(168, 85, 247)" : "rgb(34, 197, 94)" }}>
                                      <div className="font-medium">{event.title}</div>
                                      <div className="text-muted-foreground">
                                        {formatTime(event.date)} - {formatTime(event.endTime)} • {event.sessionType}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    );
                  }}
                />
              </CardContent>
            </Card>

            {/* Weekly Summary Card */}
            <div className={isMobile ? "" : "h-full"}>
              <CalendarWeeklySummary 
                events={events}
                date={date || new Date()}
                formatTime={formatTime}
                getSessionTypeIcon={getSessionTypeIcon}
                navigate={navigate}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;