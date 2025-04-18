import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data for upcoming mediations
const upcomingMediations = [
  {
    id: 1,
    title: "Smith vs. Johnson Mediation",
    date: "2023-06-15T10:00:00",
    participants: ["John Smith", "Sarah Johnson"],
    location: "Conference Room A",
  },
  {
    id: 2,
    title: "Property Dispute Resolution",
    date: "2023-06-16T14:30:00",
    participants: ["Michael Brown", "Jennifer Davis"],
    location: "Virtual Meeting",
  },
  {
    id: 3,
    title: "Employment Contract Negotiation",
    date: "2023-06-18T09:00:00",
    participants: ["Robert Wilson", "Emily Taylor", "Corporate Rep"],
    location: "Conference Room B",
  },
];

export function UpcomingMediations() {
  const isMobile = useIsMobile();

  // Format date in a readable way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time from date string
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card>
      <CardHeader className={isMobile ? "pb-2" : ""}>
        <CardTitle className={isMobile ? "text-lg" : ""}>Upcoming Mediations</CardTitle>
        <CardDescription>Your scheduled mediation sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingMediations.map((mediation) => (
            <div
              key={mediation.id}
              className={`flex flex-col rounded-lg border ${isMobile ? 'p-2' : 'p-4'} hover:bg-muted/50 cursor-pointer transition-colors`}
            >
              <h3 className={`font-medium ${isMobile ? 'text-sm' : ''}`}>
                {mediation.title}
              </h3>
              <div className="flex items-center gap-4 mt-1">
                <div className={`flex items-center ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground gap-1`}>
                  <Calendar className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                  <span>{formatDate(mediation.date)}</span>
                </div>
                <div className={`flex items-center ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground gap-1`}>
                  <Clock className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                  <span>{formatTime(mediation.date)}</span>
                </div>
              </div>
              
              {/* Only show participants and location on desktop */}
              {!isMobile && (
                <div className="flex flex-col sm:flex-row justify-between mt-2">
                  <div className="text-sm text-muted-foreground">
                    {mediation.participants.length} participants
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {mediation.location}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
