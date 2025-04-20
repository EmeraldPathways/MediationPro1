import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, MessageSquare, Calendar, Clock, Users, Plus, MoreHorizontal } from "lucide-react";
import { getItem, putItem, getItemsByIndex } from "@/services/localDbService";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Meeting {
  id: string;
  caseId: string;
  title: string;
  date: string; // ISO date string
  time: string;
  duration: string;
  location: string;
  participants: string[];
  agenda: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface Matter {
  id: string;
  title: string;
  caseFileNumber?: string;
}

const MeetingsPage = () => {
  const { id: caseId } = useParams<{ id: string }>();
  const [matter, setMatter] = useState<Matter | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewMeetingDialogOpen, setIsNewMeetingDialogOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({
    caseId: caseId || '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    duration: '60',
    location: 'Virtual Meeting',
    participants: [],
    agenda: '',
    notes: '',
  });

  // Load matter details
  useEffect(() => {
    const loadMatter = async () => {
      if (!caseId) {
        setError("No case ID provided.");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const matterData = await getItem('matters', caseId);
        if (matterData) {
          setMatter(matterData);
          setError(null);
        } else {
          setError("Case not found.");
          setMatter(null);
        }
      } catch (e) {
        console.error("Error loading matter data:", e);
        setError("Failed to load case data.");
        setMatter(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMatter();
  }, [caseId]);

  // Load meetings for this case
  useEffect(() => {
    const loadMeetings = async () => {
      if (!caseId) return;
      
      try {
        // Assuming you have an index for meetings by caseId
        const meetingsData = await getItemsByIndex('meetings', 'by-caseId', caseId);
        
        // Sort meetings by date (newest first)
        const sortedMeetings = meetingsData.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setMeetings(sortedMeetings);
      } catch (e) {
        console.error("Error loading meetings:", e);
        toast.error("Failed to load meetings");
        setMeetings([]);
      }
    };
    
    loadMeetings();
  }, [caseId]);

  const handleCreateMeeting = async () => {
    if (!caseId) return;
    
    try {
      const now = new Date().toISOString();
      const meetingToCreate: Meeting = {
        ...newMeeting as any,
        id: crypto.randomUUID(),
        caseId,
        createdAt: now,
        updatedAt: now,
        participants: newMeeting.participants || []
      };
      
      await putItem('meetings', meetingToCreate);
      
      // Update the meetings list
      setMeetings(prev => [meetingToCreate, ...prev]);
      
      // Reset form and close dialog
      setNewMeeting({
        caseId: caseId || '',
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        duration: '60',
        location: 'Virtual Meeting',
        participants: [],
        agenda: '',
        notes: '',
      });
      setIsNewMeetingDialogOpen(false);
      
      toast.success("Meeting created successfully");
    } catch (e) {
      console.error("Error creating meeting:", e);
      toast.error("Failed to create meeting");
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    try {
      // Delete the meeting from the database
      await deleteItem('meetings', meetingId);
      
      // Update the meetings list
      setMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));
      
      toast.success("Meeting deleted");
    } catch (e) {
      console.error("Error deleting meeting:", e);
      toast.error("Failed to delete meeting");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long',
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return "Invalid date";
    }
  };

  if (isLoading) {
    return <Layout><div className="p-6">Loading meetings...</div></Layout>;
  }

  if (error || !matter) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full p-6">
          <h1 className="text-2xl font-bold mb-2">{error || "Case Not Found"}</h1>
          <p className="text-muted-foreground mb-4">The case you're looking for doesn't exist or couldn't be loaded.</p>
          <Button asChild>
            <Link to="/case-files">Back to Case Files</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col space-y-6 p-4 md:p-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" asChild>
              {/* Link back to the main case files list page */}
              <Link to="/case-files">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Meetings</h1>
              <div className="text-sm text-muted-foreground">
                {matter.title} • {matter.caseFileNumber || matter.id}
              </div>
            </div>
          </div>
          <Dialog open={isNewMeetingDialogOpen} onOpenChange={setIsNewMeetingDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Meeting
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create New Meeting</DialogTitle>
                <DialogDescription>
                  Add a new meeting for this case file
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="E.g., Initial Consultation"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newMeeting.date}
                      onChange={(e) => setNewMeeting(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newMeeting.time}
                      onChange={(e) => setNewMeeting(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newMeeting.duration}
                      onChange={(e) => setNewMeeting(prev => ({ ...prev, duration: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newMeeting.location}
                      onChange={(e) => setNewMeeting(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="E.g., Office, Zoom, etc."
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="participants">Participants (comma-separated)</Label>
                  <Input
                    id="participants"
                    value={newMeeting.participants?.join(', ') || ''}
                    onChange={(e) => setNewMeeting(prev => ({ 
                      ...prev, 
                      participants: e.target.value.split(',').map(p => p.trim()).filter(p => p)
                    }))}
                    placeholder="E.g., John Smith, Jane Doe"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="agenda">Agenda</Label>
                  <Textarea
                    id="agenda"
                    value={newMeeting.agenda}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, agenda: e.target.value }))}
                    placeholder="Meeting agenda items..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewMeetingDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateMeeting}>Create Meeting</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Upcoming/Past Meetings */}
        <div className="space-y-6">
          {/* Upcoming Meetings Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Upcoming Meetings</h2>
            <div className="grid gap-4">
              {meetings
                .filter(meeting => new Date(meeting.date) >= new Date(new Date().setHours(0,0,0,0)))
                .length > 0 ? (
                meetings
                  .filter(meeting => new Date(meeting.date) >= new Date(new Date().setHours(0,0,0,0)))
                  .map(meeting => (
                    <Card key={meeting.id} className="transition-all hover:shadow-md">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="bg-primary-50 text-primary p-4 text-center md:w-1/5">
                            <div className="text-sm font-medium">
                              {meeting.date ? new Date(meeting.date).toLocaleDateString('en-US', { month: 'short' }) : 'N/A'}
                            </div>
                            <div className="text-2xl font-bold">
                              {meeting.date ? new Date(meeting.date).getDate() : 'N/A'}
                            </div>
                            <div className="text-sm">
                              {meeting.time || 'N/A'}
                            </div>
                          </div>
                          <div className="p-4 flex-grow">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-lg">{meeting.title}</h3>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>Edit Meeting</DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => handleDeleteMeeting(meeting.id)}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="space-y-2 mt-2">
                              <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Duration: {meeting.duration} minutes</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{meeting.location}</span>
                              </div>
                              {meeting.participants && meeting.participants.length > 0 && (
                                <div className="flex items-center text-sm">
                                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span>{meeting.participants.join(', ')}</span>
                                </div>
                              )}
                              {meeting.agenda && (
                                <div>
                                  <div className="text-xs font-medium text-muted-foreground mt-2">AGENDA</div>
                                  <p className="text-sm mt-1">{meeting.agenda}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <div className="text-center p-6 bg-muted rounded-md">
                  <p className="text-muted-foreground">No upcoming meetings scheduled</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setIsNewMeetingDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          {/* Past Meetings Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Past Meetings</h2>
            <div className="grid gap-4">
              {meetings
                .filter(meeting => new Date(meeting.date) < new Date(new Date().setHours(0,0,0,0)))
                .length > 0 ? (
                meetings
                  .filter(meeting => new Date(meeting.date) < new Date(new Date().setHours(0,0,0,0)))
                  .map(meeting => (
                    <Card key={meeting.id} className="bg-muted/50">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="bg-muted p-4 text-center md:w-1/5">
                            <div className="text-sm font-medium">
                              {meeting.date ? new Date(meeting.date).toLocaleDateString('en-US', { month: 'short' }) : 'N/A'}
                            </div>
                            <div className="text-2xl font-bold">
                              {meeting.date ? new Date(meeting.date).getDate() : 'N/A'}
                            </div>
                            <div className="text-sm">
                              {meeting.time || 'N/A'}
                            </div>
                          </div>
                          <div className="p-4 flex-grow">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-lg">{meeting.title}</h3>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>View Notes</DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => handleDeleteMeeting(meeting.id)}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="space-y-2 mt-2">
                              {meeting.notes ? (
                                <div>
                                  <div className="text-xs font-medium text-muted-foreground">MEETING NOTES</div>
                                  <p className="text-sm mt-1 line-clamp-2">{meeting.notes}</p>
                                </div>
                              ) : (
                                <Button variant="link" className="p-0 h-auto text-sm">
                                  + Add meeting notes
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <div className="text-center p-6 bg-muted rounded-md">
                  <p className="text-muted-foreground">No past meetings</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Import missing components
import { deleteItem } from "@/services/localDbService";
import { MapPin } from "lucide-react";

export default MeetingsPage;