import React, { useState, useEffect } from "react"; // Import useEffect
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { AgreementToMediateForm } from "@/components/forms/AgreementToMediateForm";
import { BillingForm } from "@/components/forms/BillingForm";
import { ClientEnquiryForm } from "@/components/forms/ClientEnquiryForm";
import { StatementOfMeansForm } from "@/components/forms/StatementOfMeansForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Baby,
  Banknote,
  BookOpen,
  Briefcase,
  Calendar,
  Check,
  CheckSquare,
  Clock,
  DollarSign,
  ExternalLink,
  FileEdit,
  FileText,
  Heart,
  Home,
  Link2,
  MessageSquare,
  School,
  StickyNote,
  UserCircle,
  Users,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom"; // Import Link for navigation
import { useIsMobile } from "@/hooks/use-mobile"; // Import the mobile hook

// Define interface for Matter (Aligning with CaseDetail.tsx)
// Note: Ideally, this should be in a shared types file
interface Matter {
  id: string; // Changed to string to match URL param usage in parent
  title: string;
  type: string;
  status: string;
  lastUpdated: string;
  clientName: string; // Keep for potential future use within details
  description: string;
  caseFileNumber: string;
  caseFileName: string;
  // Add fields from CaseDetail's Matter type if needed within this component,
  // but primarily we care about intakeForm here.
  // participants?: string[];
  // documents?: any[]; // Use specific type if needed
  // tasks?: any[]; // Use specific type if needed
  // meetingNotes?: any[]; // Use specific type if needed
  // nextSession?: any | null;
  intakeForm?: z.infer<typeof fullIntakeSchema>;
}

// Define Meeting interface
export interface Meeting {
  id: number;
  title: string;  // Required field
  date: string;
  time: string;
  duration: string;
  notes: string;
  content?: string; // Optional field
}

// Mock meetings data
const mockMeetings: Meeting[] = [
  {
    id: 1,
    title: "Initial Consultation",
    date: "2023-06-15",
    time: "10:00 AM",
    duration: "1 hour",
    notes: "Discussed division of assets and custody arrangements."
  },
  {
    id: 2,
    title: "Follow-up Meeting",
    date: "2023-06-22",
    time: "2:00 PM",
    duration: "45 minutes",
    notes: "Reviewed initial proposal and discussed next steps."
  }
];
// Define the form schema for client intake
const clientIntakeSchema = z.object({
  // Personal Details
  name: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  dateOfBirth: z.string().optional(),
  dateOfMarriage: z.string().optional(),
  placeOfMarriage: z.string().optional(),
  dateOfSeparation: z.string().optional(),
  previousMarriage: z.boolean().optional(),
  previousMarriageDetails: z.string().optional(),

  // Legal Questions
  mediatorRoleExplained: z.boolean().optional(),
  mediatorConcerns: z.string().optional(),
  termsOfMediationExplained: z.boolean().optional(),
  termsAndConditionsSigned: z.boolean().optional(),
  agreementToMediateSigned: z.boolean().optional(),
  solicitor: z.boolean().optional(),
  solicitorDetails: z.string().optional(),
  courtOrder: z.boolean().optional(),
  courtOrderDetails: z.string().optional(),

  // Work Details
  occupation: z.string().optional(),
  employer: z.string().optional(),
  salary: z.string().optional(),

  // Finance Details
  otherAssets: z.string().optional(),
  proposalReSettlement: z.string().optional(),
  pensionDetails: z.string().optional(),
  pensionProposal: z.string().optional(),
});

// Schema for children details
const childrenSchema = z.object({
  childrenDetails: z.array(
    z.object({
      name: z.string().optional(),
      dateOfBirth: z.string().optional(),
      education: z.string().optional(),
      specialNeeds: z.string().optional(),
    })
  ).optional(),

  // Current Arrangements
  currentArrangements: z.string().optional(),

  // Future Needs
  futureNeeds: z.string().optional(),

  // Maintenance Arrangements
  maintenanceArrangements: z.string().optional(),

  // Educational Costs
  educationalCosts: z.string().optional(),

  // Notes
  notes: z.string().optional(),

  // Home Details
  homeAddress: z.string().optional(),
  balanceTermRepayments: z.string().optional(),
  institution: z.string().optional(),
  equity: z.string().optional(),
  settlementProposal: z.string().optional(),
  secondPropertyDetails: z.string().optional(),
  secondPropertyProposal: z.string().optional(),
});

// Combined schema
const fullIntakeSchema = z.object({
  caseFileNumber: z.string(),
  caseFileName: z.string(),
  partyA: clientIntakeSchema,
  partyB: clientIntakeSchema,
  children: childrenSchema,
});

interface MatterDetailsProps {
  matter: Matter;
  onSave?: (updatedMatter: Matter) => void;
}

import { getNotesForCase, getAllItems } from "@/services/localDbService";

export function MatterDetails({ matter, onSave }: MatterDetailsProps) { // Restore onSave prop
  const [activeTab, setActiveTab] = useState("details"); // Restore activeTab state
  const isMobile = useIsMobile(); // Use the mobile hook

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className={`${isMobile ? "grid grid-cols-3 gap-1 p-1 mb-16" : "grid grid-cols-6 mb-4"} w-full`}>
        <TabsTrigger value="details" className={`${isMobile ? "text-xs py-1 px-2 flex flex-col items-center" : ""}`}>
          {isMobile && <Users className="h-4 w-4 mb-1" />}
          Client Details
        </TabsTrigger>
        <TabsTrigger value="meetings" className={`${isMobile ? "text-xs py-1 px-2 flex flex-col items-center" : ""}`}>
          {isMobile && <Calendar className="h-4 w-4 mb-1" />}
          Meetings
        </TabsTrigger>
        <TabsTrigger value="forms" className={`${isMobile ? "text-xs py-1 px-2 flex flex-col items-center" : ""}`}>
          {isMobile && <FileText className="h-4 w-4 mb-1" />}
          Forms
        </TabsTrigger>
        <TabsTrigger value="timeline" className={`${isMobile ? "text-xs py-1 px-2 flex flex-col items-center" : ""}`}>
          {isMobile && <Clock className="h-4 w-4 mb-1" />}
          Timeline
        </TabsTrigger>
        <TabsTrigger value="templates" className={`${isMobile ? "text-xs py-1 px-2 flex flex-col items-center" : ""}`}>
          {isMobile && <BookOpen className="h-4 w-4 mb-1" />}
          Templates
        </TabsTrigger>
        <TabsTrigger value="checklist" className={`${isMobile ? "text-xs py-1 px-2 flex flex-col items-center" : ""}`}>
          {isMobile && <CheckSquare className="h-4 w-4 mb-1" />}
          Checklist
        </TabsTrigger>
      </TabsList>

      {/* Client Details Tab - With Summary Card */}
      <TabsContent value="details" className="space-y-6 px-[5px]">
        <Card>
          <CardHeader className={`${isMobile ? "pb-2 px-3 py-3" : "pb-2"}`}>
            <CardTitle className={`flex items-center justify-between ${isMobile ? "mt-1" : ""}`}>
              <div className="flex items-center gap-2">
                <Users className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} text-primary`} />
                <span className={`${isMobile ? "text-sm" : ""}`}>Client Details Summary</span>
              </div>
              <Button variant="outline" size={isMobile ? "sm" : "default"} className={`${isMobile ? "px-1.5 py-0.5" : ""} flex items-center gap-1`} asChild>
                <Link to={`/case-files/${matter.id}/client-details`}>
                  <ExternalLink className={`${isMobile ? "h-2.5 w-2.5" : "h-4 w-4"}`} />
                  <span className={`${isMobile ? "text-[11px]" : ""}`}>View Full Page</span>
                </Link>
              </Button>
            </CardTitle>
            <CardDescription className={`${isMobile ? "text-xs" : ""}`}>Overview of client information</CardDescription>
          </CardHeader>
          <CardContent className={isMobile ? "p-3" : undefined}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Party A</h4>
                  <p className="text-sm text-muted-foreground">{matter?.intakeForm?.partyA?.name || "Not provided"}</p>
                  <p className="text-xs text-muted-foreground">{matter?.intakeForm?.partyA?.email || "No email"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Party B</h4>
                  <p className="text-sm text-muted-foreground">{matter?.intakeForm?.partyB?.name || "Not provided"}</p>
                  <p className="text-xs text-muted-foreground">{matter?.intakeForm?.partyB?.email || "No email"}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Case File Information</h4>
                <div className="flex gap-2 items-center flex-wrap">
                  <Badge variant="outline">{matter?.caseFileNumber || "No case number"}</Badge>
                  <Badge variant="outline">{matter?.status || "Unknown status"}</Badge>
                  <Badge variant="outline">Last updated: {formatDate(matter?.lastUpdated)}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className={`${isMobile ? "text-xs px-3 py-2" : "text-xs"} text-muted-foreground`}>
            <p>Full details available on Client Details page</p>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Meetings Tab - With Summary Card */}
      <TabsContent value="meetings" className="px-[5px]">
        <Card>
          <CardHeader className={`${isMobile ? "pb-2 px-3 py-3" : "pb-2"}`}>
            <CardTitle className={`flex items-center justify-between ${isMobile ? "mt-1" : ""}`}>
              <div className="flex items-center gap-2">
                <Calendar className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} text-primary`} />
                <span className={`${isMobile ? "text-sm" : ""}`}>Meetings Summary</span>
              </div>
              <Button variant="outline" size={isMobile ? "sm" : "default"} className={`${isMobile ? "px-1.5 py-0.5" : ""} flex items-center gap-1`} asChild>
                <Link to={`/case-files/${matter.id}/meetings`}>
                  <ExternalLink className={`${isMobile ? "h-2.5 w-2.5" : "h-4 w-4"}`} />
                  <span className={`${isMobile ? "text-[11px]" : ""}`}>View Full Page</span>
                </Link>
              </Button>
            </CardTitle>
            <CardDescription className={`${isMobile ? "text-xs" : ""}`}>Summary of upcoming and recent meetings</CardDescription>
          </CardHeader>
          <CardContent className={isMobile ? "p-3" : undefined}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Upcoming</h4>
                  <p className="text-sm text-muted-foreground">Next meeting on {new Date().toLocaleDateString()}</p>
                </div>
                <Badge className="bg-blue-500">2 scheduled</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <span className="font-medium">Initial Consultation</span>
                    <span className="text-muted-foreground ml-2">10:00 AM</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <span className="font-medium">Follow-up</span>
                    <span className="text-muted-foreground ml-2">2:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className={`${isMobile ? "text-xs px-3 py-2" : "text-xs"} text-muted-foreground`}>
            <p>Full schedule available on Meetings page</p>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Forms Tab - With Summary Card */}
      <TabsContent value="forms" className="space-y-4 mt-4 px-[5px]">
        <Card>
          <CardHeader className={`${isMobile ? "pb-2 px-3 py-3" : "pb-2"}`}>
            <CardTitle className={`flex items-center justify-between ${isMobile ? "mt-1" : ""}`}>
              <div className="flex items-center gap-2">
                <FileText className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} text-primary`} />
                <span className={`${isMobile ? "text-sm" : ""}`}>Forms Status</span>
              </div>
              <Button variant="outline" size={isMobile ? "sm" : "default"} className={`${isMobile ? "px-1.5 py-0.5" : ""} flex items-center gap-1`} asChild>
                <Link to={`/case-files/${matter.id}/forms`}>
                  <ExternalLink className={`${isMobile ? "h-2.5 w-2.5" : "h-4 w-4"}`} />
                  <span className={`${isMobile ? "text-[11px]" : ""}`}>View Full Page</span>
                </Link>
              </Button>
            </CardTitle>
            <CardDescription className={`${isMobile ? "text-xs" : ""}`}>Summary of form completion status</CardDescription>
          </CardHeader>
          <CardContent className={isMobile ? "p-3" : undefined}>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Client Enquiry Form</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">Agreement To Mediate</span>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Statement Of Means</span>
                </div>
                <Badge variant="outline">Not started</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Billing Form</span>
                </div>
                <Badge variant="outline">Not started</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter className={`${isMobile ? "text-xs px-3 py-2" : "text-xs"} text-muted-foreground`}>
            <p>Full forms available on Forms page</p>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Timeline Tab - With Summary Card */}
      <TabsContent value="timeline" className="space-y-4 mt-4 px-[5px]">
        <Card>
          <CardHeader className={`${isMobile ? "pb-2 px-3 py-3" : "pb-2"}`}>
            <CardTitle className={`flex items-center justify-between ${isMobile ? "mt-1" : ""}`}>
              <div className="flex items-center gap-2">
                <Clock className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} text-primary`} />
                <span className={`${isMobile ? "text-sm" : ""}`}>Timeline Highlights</span>
              </div>
              <Button variant="outline" size={isMobile ? "sm" : "default"} className={`${isMobile ? "px-1.5 py-0.5" : ""} flex items-center gap-1`} asChild>
                <Link to={`/case-files/${matter.id}/timeline`}>
                  <ExternalLink className={`${isMobile ? "h-2.5 w-2.5" : "h-4 w-4"}`} />
                  <span className={`${isMobile ? "text-[11px]" : ""}`}>View Full Page</span>
                </Link>
              </Button>
            </CardTitle>
            <CardDescription className={`${isMobile ? "text-xs" : ""}`}>Recent timeline events</CardDescription>
          </CardHeader>
          <CardContent className={isMobile ? "p-3" : undefined}>
            <div className="space-y-3">
              <div className="relative pl-5 border-l border-dashed border-gray-200">
                <div className="absolute h-3 w-3 bg-primary rounded-full -left-1.5 top-0.5"></div>
                <div>
                  <p className="text-sm font-medium">Case Created</p>
                  <p className="text-xs text-muted-foreground">{formatDate(matter?.lastUpdated)}</p>
                </div>
              </div>
              <div className="relative pl-5 border-l border-dashed border-gray-200">
                <div className="absolute h-3 w-3 bg-blue-400 rounded-full -left-1.5 top-0.5"></div>
                <div>
                  <p className="text-sm font-medium">First Meeting Scheduled</p>
                  <p className="text-xs text-muted-foreground">20/04/2025</p>
                </div>
              </div>
              <div className="relative pl-5">
                <div className="absolute h-3 w-3 bg-green-400 rounded-full -left-1.5 top-0.5"></div>
                <div>
                  <p className="text-sm font-medium">Form Submitted</p>
                  <p className="text-xs text-muted-foreground">22/04/2025</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className={`${isMobile ? "text-xs px-3 py-2" : "text-xs"} text-muted-foreground`}>
            <p>View complete case timeline on Timeline page</p>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Templates Tab - With Summary Card */}
      <TabsContent value="templates" className="px-[5px] space-y-4 mt-4">
        <Card>
          <CardHeader className={`${isMobile ? "pb-2 px-3 py-3" : "pb-2"}`}>
            <CardTitle className={`flex items-center justify-between ${isMobile ? "mt-1" : ""}`}>
              <div className="flex items-center gap-2">
                <BookOpen className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} text-primary`} />
                <span className={`${isMobile ? "text-sm" : ""}`}>Templates</span>
              </div>
              <Button variant="outline" size={isMobile ? "sm" : "default"} className={`${isMobile ? "px-1.5 py-0.5" : ""} flex items-center gap-1`} asChild>
                <Link to={`/case-files/${matter.id}/templates`}>
                  <ExternalLink className={`${isMobile ? "h-2.5 w-2.5" : "h-4 w-4"}`} />
                  <span className={`${isMobile ? "text-[11px]" : ""}`}>View Full Page</span>
                </Link>
              </Button>
            </CardTitle>
            <CardDescription className={`${isMobile ? "text-xs" : ""}`}>Available document templates</CardDescription>
          </CardHeader>
          <CardContent className={isMobile ? "p-3" : undefined}>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Separation Agreement</span>
                </div>
                <Badge variant="outline">3 sections</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Parenting Agreement</span>
                </div>
                <Badge variant="outline">3 sections</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Mediation Agreement</span>
                </div>
                <Badge variant="outline">3 sections</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter className={`${isMobile ? "text-xs px-3 py-2" : "text-xs"} text-muted-foreground`}>
            <p>Edit and create templates on Templates page</p>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Checklist Tab - With Summary Card */}
      <TabsContent value="checklist" className="space-y-4 mt-4 px-[5px]">
        <Card>
          <CardHeader className={`${isMobile ? "pb-2 px-3 py-3" : "pb-2"}`}>
            <CardTitle className={`flex items-center justify-between ${isMobile ? "mt-1" : ""}`}>
              <div className="flex items-center gap-2">
                <CheckSquare className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} text-primary`} />
                <span className={`${isMobile ? "text-sm" : ""}`}>Checklist Progress</span>
              </div>
              <Button variant="outline" size={isMobile ? "sm" : "default"} className={`${isMobile ? "px-1.5 py-0.5" : ""} flex items-center gap-1`} asChild>
                <Link to={`/case-files/${matter.id}/checklist`}>
                  <ExternalLink className={`${isMobile ? "h-2.5 w-2.5" : "h-4 w-4"}`} />
                  <span className={`${isMobile ? "text-[11px]" : ""}`}>View Full Page</span>
                </Link>
              </Button>
            </CardTitle>
            <CardDescription className={`${isMobile ? "text-xs" : ""}`}>Case checklist progress</CardDescription>
          </CardHeader>
          <CardContent className={isMobile ? "p-3" : undefined}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full w-1/4"></div>
                  </div>
                  <span className="text-sm">25% complete</span>
                </div>
                <Badge variant="secondary">3 of 12 tasks</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox checked={true} className="data-[state=checked]:bg-green-500" />
                  <span className="text-sm">Client Enquiry Form (F.2A)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={true} className="data-[state=checked]:bg-green-500" />
                  <span className="text-sm">Meeting Log (F.6)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={true} className="data-[state=checked]:bg-green-500" />
                  <span className="text-sm">Billing Form</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={false} />
                  <span className="text-sm">Agreement to Mediate (F.2B)</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className={`${isMobile ? "text-xs px-3 py-2" : "text-xs"} text-muted-foreground`}>
            <p>View and complete all checklist items on Checklist page</p>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

// Mock checklist data
const mockChecklist = [
  {
    id: 1,
    title: "Review settlement agreement",
    caseTitle: "Smith vs. Johnson",
    priority: "High",
    dueDate: "Jun 20, 2023",
    status: "In Progress",
    completed: false,
  },
  {
    id: 2,
    title: "Prepare financial disclosure",
    caseTitle: "Smith vs. Johnson",
    priority: "Medium",
    dueDate: "Jun 25, 2023",
    status: "Not Started",
    completed: false,
  },
];