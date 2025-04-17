
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users } from "lucide-react";

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
      <CardHeader>
        <CardTitle>Upcoming Mediations</CardTitle>
        <CardDescription>Your scheduled mediation sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingMediations.map((mediation) => (
            <div
              key={mediation.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border p-4 hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <div className="grid gap-1">
                <h3 className="font-medium">{mediation.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(mediation.date)}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(mediation.date)}</span>
                </div>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-1">
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <Users className="h-4 w-4" />
                  <span>{mediation.participants.length} participants</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {mediation.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
