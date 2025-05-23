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
  Baby, // Add Baby icon
  Banknote,
  BookOpen,
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  FileEdit,
  FileText,
  Heart, // Add Heart icon
  Home,
  School, // Add School icon
  StickyNote,
  UserCircle,
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
  const [checklist, setChecklist] = useState([
    { title: "Client Enquiry Form (F.2A)", description: "<p>Upload information directly to the contact’s form (Upgrade needed for auto-upload from a website).</p>", done: false },
    { title: "Meeting Log (F.6)", description: "<p>Attach to each case file; can also be downloaded for manual files.</p>", done: false },
    { title: "Billing Form", description: "<p>Send payment link to Client A and Client B via Stripe.</p>", done: false },
    { title: "Agreement to Mediate (F.2B)", description: "<p>Client signs prior to mediation. Add DocuSign at stage 2.</p>", done: false },
    { title: "Client Intake Meeting Forms", description: "<p>Take notes during Client 1 and Client 2 Intake Meetings.</p>", done: false },
    { title: "Client Information Form (F.3A)", description: "<p>Record and store client details in each client file.</p>", done: false },
    { title: "Meeting Notes (F.3B)", description: "<p>Use in mediation meetings to record notes, options, and conclusions; add to Case Files tab.</p>", done: false },
    { title: "Statement of Means Form (F.4)", description: "<p>Completed by each client and verified by mediator.</p>", done: false },
    { title: "Statement of Means Checklist (F.5)", description: "<p>Mediator verifies client’s documentation.</p>", done: false },
    { title: "Decisions Made (F.3C)", description: "<p>Record case decisions; add to Case Files tab.</p>", done: false },
    { title: "Closing a File (F.7)", description: "<p>Record end date, outcome, hours, payment/billing status; use for manual files.</p>", done: false },
    { title: "Invoice Template (F.8)", description: "<p>Offer Stripe integration for invoicing; assist clients in setting up Stripe.</p>", done: false },
  ]);
  const [separationSections, setSeparationSections] = useState<string[]>([
    "<p>This section covers the division of assets and liabilities.</p>",
    "<p>This section outlines spousal support arrangements.</p>",
    "<p>This section details property settlement terms.</p>",
  ]);
  const [parentingSections, setParentingSections] = useState<string[]>([
    "<p>This section defines custody and visitation schedules.</p>",
    "<p>This section addresses parental responsibilities.</p>",
    "<p>This section covers dispute resolution methods.</p>",
  ]);
  const [mediationSections, setMediationSections] = useState<string[]>([
    "<p>This section explains mediation procedures.</p>",
    "<p>This section lists confidentiality agreements.</p>",
    "<p>This section outlines the scope of mediation.</p>",
  ]);
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    if (!matter?.id) {
      setNotes([]);
      return;
    }
    getAllItems('notes')
      .then((allNotes) => {
        const filtered = allNotes.filter(
          (note: any) => note.caseId === matter.id
        );
        setNotes(filtered);
      })
      .catch((error) => {
        console.error("Failed to load notes:", error);
        setNotes([]);
      });
  }, [matter?.id]);
  const [activeTab, setActiveTab] = useState("details"); // Restore activeTab state
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings); // Restore meetings state
  
  const mockTimeline = [
    {
      id: 1,
      description: "Client Enquiry Form saved",
      date: "2025-04-08",
      time: "10:00 AM",
    },
    {
      id: 2,
      description: "Meeting added: Initial Consultation",
      date: "2025-04-09",
      time: "2:30 PM",
    },
    {
      id: 3,
      description: "Agreement to Mediate signed",
      date: "2025-04-10",
      time: "11:15 AM",
    },
  ];
  const [newNoteId, setNewNoteId] = useState<number | null>(null); // Restore notes state
  const [meetingNotes, setMeetingNotes] = useState<{[key: number]: string}>({}); // Restore notes state
  const [meetingNames, setMeetingNames] = useState<{[key: number]: string}>({}); // New: meeting names state

  // Initialize the form
  const form = useForm<z.infer<typeof fullIntakeSchema>>({
    resolver: zodResolver(fullIntakeSchema),
    // Load default values from matter.intakeForm if it exists, otherwise use defaults
    defaultValues: matter.intakeForm
      ? { // If intakeForm data exists in the matter prop
          ...matter.intakeForm, // Spread the saved data
          // Ensure top-level fields are also correctly sourced or defaulted
          caseFileNumber: matter.caseFileNumber || matter.intakeForm.caseFileNumber || "",
          caseFileName: matter.caseFileName || matter.intakeForm.caseFileName || "",
        }
      : { // If no intakeForm data exists, provide the full default structure
          caseFileNumber: matter.caseFileNumber || "",
          caseFileName: matter.caseFileName || "",
          partyA: {
            name: "", address: "", phone: "", email: "", dateOfBirth: "", dateOfMarriage: "",
            placeOfMarriage: "", dateOfSeparation: "", previousMarriage: false, previousMarriageDetails: "",
            mediatorRoleExplained: false, mediatorConcerns: "", termsOfMediationExplained: false,
            termsAndConditionsSigned: false, agreementToMediateSigned: false, solicitor: false,
            solicitorDetails: "", courtOrder: false, courtOrderDetails: "", occupation: "",
            employer: "", salary: "", otherAssets: "", proposalReSettlement: "",
            pensionDetails: "", pensionProposal: ""
          },
          partyB: { // Same default structure for Party B
            name: "", address: "", phone: "", email: "", dateOfBirth: "", dateOfMarriage: "",
            placeOfMarriage: "", dateOfSeparation: "", previousMarriage: false, previousMarriageDetails: "",
            mediatorRoleExplained: false, mediatorConcerns: "", termsOfMediationExplained: false,
            termsAndConditionsSigned: false, agreementToMediateSigned: false, solicitor: false,
            solicitorDetails: "", courtOrder: false, courtOrderDetails: "", occupation: "",
            employer: "", salary: "", otherAssets: "", proposalReSettlement: "",
            pensionDetails: "", pensionProposal: ""
          },
          children: {
            childrenDetails: [{ name: "", dateOfBirth: "", education: "", specialNeeds: "" }],
            currentArrangements: "", futureNeeds: "", maintenanceArrangements: "",
            educationalCosts: "", notes: "", homeAddress: "", balanceTermRepayments: "",
            institution: "", equity: "", settlementProposal: "", secondPropertyDetails: "",
            secondPropertyProposal: ""
          }
        },
  });

  // Reset form when matter prop changes
  useEffect(() => {
    form.reset(matter.intakeForm
      ? { // If intakeForm data exists in the matter prop
          ...matter.intakeForm, // Spread the saved data
          // Ensure top-level fields are also correctly sourced or defaulted
          caseFileNumber: matter.caseFileNumber || matter.intakeForm.caseFileNumber || "",
          caseFileName: matter.caseFileName || matter.intakeForm.caseFileName || "",
        }
      : { // If no intakeForm data exists, provide the full default structure
          caseFileNumber: matter.caseFileNumber || "",
          caseFileName: matter.caseFileName || "",
          partyA: {
            name: "", address: "", phone: "", email: "", dateOfBirth: "", dateOfMarriage: "",
            placeOfMarriage: "", dateOfSeparation: "", previousMarriage: false, previousMarriageDetails: "",
            mediatorRoleExplained: false, mediatorConcerns: "", termsOfMediationExplained: false,
            termsAndConditionsSigned: false, agreementToMediateSigned: false, solicitor: false,
            solicitorDetails: "", courtOrder: false, courtOrderDetails: "", occupation: "",
            employer: "", salary: "", otherAssets: "", proposalReSettlement: "",
            pensionDetails: "", pensionProposal: ""
          },
          partyB: { // Same default structure for Party B
            name: "", address: "", phone: "", email: "", dateOfBirth: "", dateOfMarriage: "",
            placeOfMarriage: "", dateOfSeparation: "", previousMarriage: false, previousMarriageDetails: "",
            mediatorRoleExplained: false, mediatorConcerns: "", termsOfMediationExplained: false,
            termsAndConditionsSigned: false, agreementToMediateSigned: false, solicitor: false,
            solicitorDetails: "", courtOrder: false, courtOrderDetails: "", occupation: "",
            employer: "", salary: "", otherAssets: "", proposalReSettlement: "",
            pensionDetails: "", pensionProposal: ""
          },
          children: {
            childrenDetails: [{ name: "", dateOfBirth: "", education: "", specialNeeds: "" }],
            currentArrangements: "", futureNeeds: "", maintenanceArrangements: "",
            educationalCosts: "", notes: "", homeAddress: "", balanceTermRepayments: "",
            institution: "", equity: "", settlementProposal: "", secondPropertyDetails: "",
            secondPropertyProposal: ""
          }
        }
    );
  }, [matter]);

  // Function to add a child to the form
  const addChild = () => {
    const currentChildren = form.getValues("children.childrenDetails") || [];
    form.setValue("children.childrenDetails", [
      ...currentChildren,
      { name: "", dateOfBirth: "", education: "", specialNeeds: "" }
    ]);
  };

  // Function to remove a child from the form
  const removeChild = (index: number) => {
    const currentChildren = form.getValues("children.childrenDetails") || [];
    if (currentChildren.length > 1) {
      form.setValue("children.childrenDetails",
        currentChildren.filter((_, i) => i !== index)
      );
    }
  };

  // Function to handle form submission
  function onSubmit(data: z.infer<typeof fullIntakeSchema>) {
    console.log("Submitting intake form data:", data); // Added log
    toast.success("Client intake form saved successfully");
    // Update the matter with the intake form data
    const updatedMatter = {
      ...matter,
      intakeForm: data,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    if (onSave) {
      onSave(updatedMatter);
    }
  }

  // Function to add a new meeting
  const addMeeting = () => {
    const newMeeting: Meeting = {
      id: meetings.length + 1,
      title: "New Meeting",
      date: new Date().toISOString().split('T')[0],
      time: "10:00 AM",
      duration: "1 hour",
      notes: ""
    };
    setMeetings([...meetings, newMeeting]);
  };

  // Function to update meeting notes
  const updateMeetingNotes = (id: number, notes: string) => {
    setMeetingNotes({
      ...meetingNotes,
      [id]: notes
    });
  };

  const updateMeetingName = (id: number, name: string) => {
    setMeetingNames({
      ...meetingNames,
      [id]: name
    });
  };

  // Function to toggle note editing
  const toggleNoteEditing = (id: number) => {
    if (newNoteId === id) {
      // Save changes
      setMeetings(prevMeetings =>
        prevMeetings.map(meeting =>
          meeting.id === id
            ? {
                ...meeting,
                notes: meetingNotes[id] !== undefined ? meetingNotes[id] : meeting.notes,
                title: meetingNames[id] !== undefined ? meetingNames[id] : meeting.title,
              }
            : meeting
        )
      );
      setNewNoteId(null);
    } else {
      // Start editing
      setMeetingNotes(prev => ({
        ...prev,
        [id]: meetings.find(m => m.id === id)?.notes || "",
      }));
      setMeetingNames(prev => ({
        ...prev,
        [id]: meetings.find(m => m.id === id)?.title || "",
      }));
      setNewNoteId(id);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-6 mb-4">
        <TabsTrigger value="details">Client Details</TabsTrigger>
        <TabsTrigger value="meetings">Meetings</TabsTrigger>
        <TabsTrigger value="forms">Forms</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
        <TabsTrigger value="checklist">Checklist</TabsTrigger>
      </TabsList>

      {/* Client Details Tab (The Form) */}
      <TabsContent value="details" className="space-y-6 px-[5px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10"> {/* Increased spacing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <FormField
                  control={form.control}
                  name="caseFileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case File Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Case file number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="caseFileName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case File Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Case file name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6"> {/* Increased gap */}
                {/* Party A Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Party A</h3>

                <Accordion type="multiple" className="w-full space-y-3"> {/* Allow multiple open, add space */}
                    {/* Personal Details Section */}
                  <AccordionItem value="personalDetails-a" className="border-b-0"> {/* Remove border */}
                    <AccordionTrigger className="py-2 px-3 bg-gray-50 rounded hover:bg-gray-100"> {/* Add background, padding, hover */}
                        <div className="flex items-center">
                        <UserCircle className="h-5 w-5 mr-2 text-gray-600" /> {/* Style icon */}
                          <span>Personal Details</span>
                        </div>
                      </AccordionTrigger>
                    <AccordionContent className="space-y-4 px-3 pt-3"> {/* Adjust padding */}
                        <FormField
                          control={form.control}
                          name="partyA.name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Full Name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyA.address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyA.phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="Phone Number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyA.email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Email Address" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyA.dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth</FormLabel>
                              <FormControl>
                                <Input placeholder="DD/MM/YYYY" type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyA.dateOfMarriage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Marriage (DoM)</FormLabel>
                              <FormControl>
                                <Input placeholder="DD/MM/YYYY" type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyA.placeOfMarriage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Place of Marriage (PoM)</FormLabel>
                              <FormControl>
                                <Input placeholder="Place of Marriage" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyA.dateOfSeparation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Separation (DoS)</FormLabel>
                              <FormControl>
                                <Input placeholder="DD/MM/YYYY" type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyA.previousMarriage"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Previous Marriage?</FormLabel>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyA.previousMarriageDetails"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Previous Marriage Details</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Details if applicable" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>

                  {/* Legal Questions - A */}
                  <AccordionItem value="legalQuestions-a" className="border-b-0">
                     <AccordionTrigger className="py-2 px-3 bg-gray-50 rounded hover:bg-gray-100">
                       <div className="flex items-center">
                         <FileText className="h-5 w-5 mr-2 text-gray-600" />
                         <span>Legal Questions</span>
                       </div>
                     </AccordionTrigger>
                     <AccordionContent className="space-y-4 px-3 pt-3">
                        <FormField
                          control={form.control}
                          name="partyA.mediatorRoleExplained"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Mediator Role Explained?</FormLabel>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyA.mediatorConcerns"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Concerns about Mediator</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Any concerns?" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyA.termsOfMediationExplained"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Terms of Mediation Explained?</FormLabel>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyA.termsAndConditionsSigned"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Terms & Conditions Signed?</FormLabel>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyA.agreementToMediateSigned"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Agreement to Mediate Signed?</FormLabel>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyA.solicitor"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Solicitor Instructed?</FormLabel>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyA.solicitorDetails"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Solicitor Details</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Solicitor's name and firm" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyA.courtOrder"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Court Order in Place?</FormLabel>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyA.courtOrderDetails"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Court Order Details</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Details of court order" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>

                   {/* Work Details - A */}
                   <AccordionItem value="workDetails-a" className="border-b-0">
                     <AccordionTrigger className="py-2 px-3 bg-gray-50 rounded hover:bg-gray-100">
                       <div className="flex items-center">
                         <Briefcase className="h-5 w-5 mr-2 text-gray-600" />
                         <span>Work Details</span>
                       </div>
                     </AccordionTrigger>
                     <AccordionContent className="space-y-4 px-3 pt-3">
                        <FormField
                          control={form.control}
                          name="partyA.occupation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Occupation</FormLabel>
                              <FormControl>
                                <Input placeholder="Job Title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyA.employer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Employer</FormLabel>
                              <FormControl>
                                <Input placeholder="Employer Name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyA.salary"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Salary</FormLabel>
                              <FormControl>
                                <Input placeholder="Annual Salary" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>

                   {/* Finance Details - A */}
                   <AccordionItem value="financeDetails-a" className="border-b-0">
                     <AccordionTrigger className="py-2 px-3 bg-gray-50 rounded hover:bg-gray-100">
                       <div className="flex items-center">
                         <DollarSign className="h-5 w-5 mr-2 text-gray-600" />
                         <span>Finance Details</span>
                       </div>
                     </AccordionTrigger>
                     <AccordionContent className="space-y-4 px-3 pt-3">
                        <FormField
                          control={form.control}
                          name="partyA.otherAssets"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Other Assets</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Details of other assets" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyA.proposalReSettlement"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Proposal re settlement</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Settlement proposal" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyA.pensionDetails"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pension Details</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Pension information" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyA.pensionProposal"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Proposal re settlement (Pension)</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Pension settlement proposal" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

              {/* Party B Section */}
              <div className="space-y-4">
                 <h3 className="text-lg font-semibold mb-4">Party B</h3>
                 <Accordion type="multiple" className="w-full space-y-3"> {/* Allow multiple open, add space */}
                   {/* Personal Details - B */}
                   <AccordionItem value="personalDetails-b" className="border-b-0">
                     <AccordionTrigger className="py-2 px-3 bg-gray-50 rounded hover:bg-gray-100">
                       <div className="flex items-center">
                         <UserCircle className="h-5 w-5 mr-2 text-gray-600" />
                         <span>Personal Details</span>
                       </div>
                     </AccordionTrigger>
                     <AccordionContent className="space-y-4 px-3 pt-3">
                        <FormField
                          control={form.control}
                          name="partyB.name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Full Name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyB.address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyB.phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="Phone Number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyB.email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Email Address" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyB.dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth</FormLabel>
                              <FormControl>
                                <Input placeholder="DD/MM/YYYY" type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyB.dateOfMarriage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Marriage (DoM)</FormLabel>
                              <FormControl>
                                <Input placeholder="DD/MM/YYYY" type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyB.placeOfMarriage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Place of Marriage (PoM)</FormLabel>
                              <FormControl>
                                <Input placeholder="Place of Marriage" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyB.dateOfSeparation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Separation (DoS)</FormLabel>
                              <FormControl>
                                <Input placeholder="DD/MM/YYYY" type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyB.previousMarriage"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Previous Marriage?</FormLabel>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyB.previousMarriageDetails"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Previous Marriage Details</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Details if applicable" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>

                   {/* Legal Questions - B */}
                   <AccordionItem value="legalQuestions-b" className="border-b-0">
                     <AccordionTrigger className="py-2 px-3 bg-gray-50 rounded hover:bg-gray-100">
                       <div className="flex items-center">
                         <FileText className="h-5 w-5 mr-2 text-gray-600" />
                         <span>Legal Questions</span>
                       </div>
                     </AccordionTrigger>
                     <AccordionContent className="space-y-4 px-3 pt-3">
                        <FormField
                          control={form.control}
                          name="partyB.mediatorRoleExplained"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Mediator Role Explained?</FormLabel>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyB.mediatorConcerns"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Concerns about Mediator</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Any concerns?" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyB.termsOfMediationExplained"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Terms of Mediation Explained?</FormLabel>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyB.termsAndConditionsSigned"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Terms & Conditions Signed?</FormLabel>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyB.agreementToMediateSigned"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Agreement to Mediate Signed?</FormLabel>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyB.solicitor"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Solicitor Instructed?</FormLabel>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyB.solicitorDetails"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Solicitor Details</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Solicitor's name and firm" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyB.courtOrder"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Court Order in Place?</FormLabel>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyB.courtOrderDetails"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Court Order Details</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Details of court order" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>

                   {/* Work Details - B */}
                   <AccordionItem value="workDetails-b" className="border-b-0">
                     <AccordionTrigger className="py-2 px-3 bg-gray-50 rounded hover:bg-gray-100">
                       <div className="flex items-center">
                         <Briefcase className="h-5 w-5 mr-2 text-gray-600" />
                         <span>Work Details</span>
                       </div>
                     </AccordionTrigger>
                     <AccordionContent className="space-y-4 px-3 pt-3">
                        <FormField
                          control={form.control}
                          name="partyB.occupation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Occupation</FormLabel>
                              <FormControl>
                                <Input placeholder="Job Title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyB.employer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Employer</FormLabel>
                              <FormControl>
                                <Input placeholder="Employer Name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyB.salary"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Salary</FormLabel>
                              <FormControl>
                                <Input placeholder="Annual Salary" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>

                   {/* Finance Details - B */}
                   <AccordionItem value="financeDetails-b" className="border-b-0">
                     <AccordionTrigger className="py-2 px-3 bg-gray-50 rounded hover:bg-gray-100">
                       <div className="flex items-center">
                         <DollarSign className="h-5 w-5 mr-2 text-gray-600" />
                         <span>Finance Details</span>
                       </div>
                     </AccordionTrigger>
                     <AccordionContent className="space-y-4 px-3 pt-3">
                        <FormField
                          control={form.control}
                          name="partyB.otherAssets"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Other Assets</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Details of other assets" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyB.proposalReSettlement"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Proposal re settlement</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Settlement proposal" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyB.pensionDetails"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pension Details</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Pension information" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partyB.pensionProposal"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Proposal re settlement (Pension)</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Pension settlement proposal" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>

            {/* Children Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Children Details</h3>
              <Accordion type="multiple" className="w-full space-y-3">
                <AccordionItem value="childrenInfo" className="border-b-0">
                  <AccordionTrigger className="py-2 px-3 bg-gray-50 rounded hover:bg-gray-100">
                    <div className="flex items-center">
                      <Baby className="h-5 w-5 mr-2 text-gray-600" /> {/* Changed Icon */}
                      <span>Children Information</span> {/* Changed Text */}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 px-3 pt-3">
                    {form.getValues("children.childrenDetails")?.map((_, index) => (
                      <div key={index} className="space-y-4 border p-4 rounded-md">
                        <div className="flex justify-between items-center">
                          <h4 className="text-md font-medium">Child {index + 1}</h4>
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeChild(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>

                        <FormField
                          control={form.control}
                          name={`children.childrenDetails.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Child's name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`children.childrenDetails.${index}.dateOfBirth`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`children.childrenDetails.${index}.education`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Education</FormLabel>
                              <FormControl>
                                <Input placeholder="Current school/education" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`children.childrenDetails.${index}.specialNeeds`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Special Needs</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Any special needs or requirements" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                     <Button
                       type="button"
                       variant="outline"
                       size="sm"
                       onClick={addChild}
                       className="mt-2"
                     >
                       Add Child
                     </Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Current & Future Arrangements Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Current & Future Arrangements</h3>
              <Accordion type="multiple" className="w-full space-y-3">
                {/* Current Arrangements */}
                <AccordionItem value="currentArrangements" className="border-b-0">
                  <AccordionTrigger className="py-2 px-3 bg-gray-50 rounded hover:bg-gray-100">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-gray-600" />
                      <span>Current Arrangements</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 px-3 pt-3">
                    <FormField
                      control={form.control}
                      name="children.currentArrangements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Arrangements for Children</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the current living and care arrangements for the children"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Future Needs */}
                <AccordionItem value="futureNeeds" className="border-b-0">
                  <AccordionTrigger className="py-2 px-3 bg-gray-50 rounded hover:bg-gray-100">
                    <div className="flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-gray-600" /> {/* Changed Icon */}
                      <span>Future Needs of Parents and Children</span> {/* Changed Text */}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 px-3 pt-3">
                    <FormField
                      control={form.control}
                      name="children.futureNeeds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Future Needs</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe future needs and arrangements"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Maintenance Arrangements */}
                <AccordionItem value="maintenanceArrangements" className="border-b-0">
                  <AccordionTrigger className="py-2 px-3 bg-gray-50 rounded hover:bg-gray-100">
                    <div className="flex items-center">
                      <Banknote className="h-5 w-5 mr-2 text-gray-600" />
                      <span>Maintenance Arrangements</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 px-3 pt-3">
                    <FormField
                      control={form.control}
                      name="children.maintenanceArrangements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maintenance Arrangements</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe maintenance arrangements and agreements"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Educational Costs */}
                <AccordionItem value="educationalCosts" className="border-b-0">
                  <AccordionTrigger className="py-2 px-3 bg-gray-50 rounded hover:bg-gray-100">
                    <div className="flex items-center">
                      <School className="h-5 w-5 mr-2 text-gray-600" /> {/* Changed Icon */}
                      <span>Educational, Health, Dental & Extracurricular Costs</span> {/* Changed Text */}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 px-3 pt-3">
                    <FormField
                      control={form.control}
                      name="children.educationalCosts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Educational and Other Costs</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe arrangements for educational and other costs"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Additional Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
              <Accordion type="multiple" className="w-full space-y-3">
                {/* Notes */}
                <AccordionItem value="notes" className="border-b-0">
                  <AccordionTrigger className="py-2 px-3 bg-gray-50 rounded hover:bg-gray-100">
                    <div className="flex items-center">
                      <StickyNote className="h-5 w-5 mr-2 text-gray-600" />
                      <span>Notes</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 px-3 pt-3">
                    <FormField
                      control={form.control}
                      name="children.notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any additional notes or information"
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Home Details */}
                <AccordionItem value="homeDetails" className="border-b-0">
                  <AccordionTrigger className="py-2 px-3 bg-gray-50 rounded hover:bg-gray-100">
                    <div className="flex items-center">
                      <Home className="h-5 w-5 mr-2 text-gray-600" />
                      <span>Home Details</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 px-3 pt-3">
                    <FormField
                      control={form.control}
                      name="children.homeAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Home address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="children.balanceTermRepayments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Balance/Term/Repayments</FormLabel>
                          <FormControl>
                            <Input placeholder="Mortgage details" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="children.institution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institution</FormLabel>
                          <FormControl>
                            <Input placeholder="Financial institution" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="children.equity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Equity</FormLabel>
                          <FormControl>
                            <Input placeholder="Home equity" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="children.settlementProposal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Settlement Proposal</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Proposal for home settlement" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="children.secondPropertyDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Second Property Details</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Information about second property if applicable" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="children.secondPropertyProposal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Second Property Proposal settlement</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Settlement proposal for second property" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button type="submit">Save Client Intake Form</Button>
            </div>
          </form>
        </Form>
      </TabsContent>

      {/* Meetings Tab */}
      <TabsContent value="meetings" className="px-[5px]">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Meetings</h3>
            <Button onClick={addMeeting} size="sm">Add Meeting</Button>
          </div>

          <div className="space-y-4">
            {meetings.map(meeting => (
              <div key={meeting.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{meeting.title}</h4>
                    <div className="text-sm text-muted-foreground mt-1">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="mr-3">{meeting.date}</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{meeting.time}</span>
                        <span className="mx-2">•</span>
                        <span>{meeting.duration}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleNoteEditing(meeting.id)}
                  >
                    <FileEdit className="h-4 w-4 mr-1" />
                    {newNoteId === meeting.id ? "Save Meeting" : "Edit Meeting"}
                  </Button>
                </div>

                <Collapsible open={newNoteId === meeting.id}>
                  <CollapsibleContent>
                    {newNoteId === meeting.id ? (
                      <div className="flex flex-col gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="Meeting name"
                          value={meetingNames[meeting.id] || meeting.title}
                          onChange={(e) => updateMeetingName(meeting.id, e.target.value)}
                          className="border rounded px-2 py-1"
                        />
                        <input
                          type="date"
                          value={meeting.date}
                          onChange={(e) => {
                            const updated = meetings.map(m =>
                              m.id === meeting.id ? { ...m, date: e.target.value } : m
                            );
                            setMeetings(updated);
                          }}
                          className="border rounded px-2 py-1"
                        />
                        <input
                          type="time"
                          value={meeting.time}
                          onChange={(e) => {
                            const updated = meetings.map(m =>
                              m.id === meeting.id ? { ...m, time: e.target.value } : m
                            );
                            setMeetings(updated);
                          }}
                          className="border rounded px-2 py-1"
                        />
                        <ReactQuill
                          theme="snow"
                          value={meetingNotes[meeting.id] || meeting.notes}
                          onChange={(content) => updateMeetingNotes(meeting.id, content)}
                          className="mt-2"
                        />
                      </div>
                    ) : (
                      <>
                        <p className="font-semibold">{meeting.title}</p>
                        <p className="text-sm mt-2 text-muted-foreground">{meetingNotes[meeting.id] || meeting.notes || "No notes added."}</p>
                      </>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
      <TabsContent value="timeline" className="space-y-4 mt-4 px-[5px]">
        {mockTimeline.map((entry) => (
          <div key={entry.id} className="border rounded p-4 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-medium">{entry.description}</span>
              <span className="text-xs text-gray-500">{entry.date} {entry.time}</span>
            </div>
          </div>
        ))}
      </TabsContent>

      {/* Documents Tab (Placeholder) */}
      <TabsContent value="forms" className="space-y-4 mt-4 px-[5px]">
        <div className="space-y-4">
          <Accordion type="multiple" className="w-full space-y-2">
            <AccordionItem value="clientEnquiry">
              <AccordionTrigger className="px-4 py-2 font-semibold bg-gray-100 hover:bg-gray-200 data-[state=open]:bg-blue-100">
                Client Enquiry Form
              </AccordionTrigger>
              <AccordionContent className="p-4 border rounded-b-md">
                <ClientEnquiryForm />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="agreementToMediate">
              <AccordionTrigger className="px-4 py-2 font-semibold bg-gray-100 hover:bg-gray-200 data-[state=open]:bg-blue-100">
                Agreement To Mediate Form
              </AccordionTrigger>
              <AccordionContent className="p-4 border rounded-b-md">
                <AgreementToMediateForm />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="billing">
              <AccordionTrigger className="px-4 py-2 font-semibold bg-gray-100 hover:bg-gray-200 data-[state=open]:bg-blue-100">
                Billing Form
              </AccordionTrigger>
              <AccordionContent className="p-4 border rounded-b-md">
                <BillingForm />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="statementOfMeans">
              <AccordionTrigger className="px-4 py-2 font-semibold bg-gray-100 hover:bg-gray-200 data-[state=open]:bg-blue-100">
                Statement Of Means Form
              </AccordionTrigger>
              <AccordionContent className="p-4 border rounded-b-md">
                <StatementOfMeansForm />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </TabsContent>

      <TabsContent value="timeline" className="space-y-4 mt-4 px-[5px]">
        <p>Timeline content goes here.</p>
      </TabsContent>

      <TabsContent value="templates" className="px-[5px] space-y-4 mt-4">
        <Accordion type="multiple" className="space-y-4">
          <AccordionItem value="sep-agreement">
            <AccordionTrigger className="px-4 py-2 font-semibold bg-gray-100 hover:bg-gray-200 data-[state=open]:bg-blue-100">
              Separation Agreement
            </AccordionTrigger>
            <AccordionContent className="border rounded-md p-4 space-y-4">
              <Accordion type="multiple" className="w-full space-y-2">
                {separationSections.map((section, idx) => (
                  <AccordionItem key={idx} value={`sep-${idx}`}>
                    <AccordionTrigger className="px-4 py-2 font-semibold bg-gray-100 hover:bg-gray-200 data-[state=open]:bg-blue-100">
                      Section {idx + 1}
                    </AccordionTrigger>
                    <AccordionContent className="p-2 border rounded-b-md">
                      <ReactQuill theme="snow" value={section} onChange={(content) => {
                        const updated = [...separationSections];
                        updated[idx] = content;
                        setSeparationSections(updated);
                      }} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <Button size="sm" className="mt-2" onClick={() => setSeparationSections([...separationSections, 'New section content'])}>
                Add Section
              </Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="parenting-agreement">
            <AccordionTrigger className="px-4 py-2 font-semibold bg-gray-100 hover:bg-gray-200 data-[state=open]:bg-blue-100">
              Parenting Agreement
            </AccordionTrigger>
            <AccordionContent className="border rounded-md p-4 space-y-4">
              <Accordion type="multiple" className="w-full space-y-2">
                {parentingSections.map((section, idx) => (
                  <AccordionItem key={idx} value={`par-${idx}`}>
                    <AccordionTrigger className="px-4 py-2 font-semibold bg-gray-100 hover:bg-gray-200 data-[state=open]:bg-blue-100">
                      Section {idx + 1}
                    </AccordionTrigger>
                    <AccordionContent className="p-2 border rounded-b-md">
                      <ReactQuill theme="snow" value={section} onChange={(content) => {
                        const updated = [...parentingSections];
                        updated[idx] = content;
                        setParentingSections(updated);
                      }} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <Button size="sm" className="mt-2" onClick={() => setParentingSections([...parentingSections, 'New section content'])}>
                Add Section
              </Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="mediation-agreement">
            <AccordionTrigger className="px-4 py-2 font-semibold bg-gray-100 hover:bg-gray-200 data-[state=open]:bg-blue-100">
              Mediation Agreement
            </AccordionTrigger>
            <AccordionContent className="border rounded-md p-4 space-y-4">
              <Accordion type="multiple" className="w-full space-y-2">
                {mediationSections.map((section, idx) => (
                  <AccordionItem key={idx} value={`med-${idx}`}>
                    <AccordionTrigger className="px-4 py-2 font-semibold bg-gray-100 hover:bg-gray-200 data-[state=open]:bg-blue-100">
                      Section {idx + 1}
                    </AccordionTrigger>
                    <AccordionContent className="p-2 border rounded-b-md">
                      <ReactQuill theme="snow" value={section} onChange={(content) => {
                        const updated = [...mediationSections];
                        updated[idx] = content;
                        setMediationSections(updated);
                      }} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <Button size="sm" className="mt-2" onClick={() => setMediationSections([...mediationSections, 'New section content'])}>
                Add Section
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabsContent>

      {/* Notes Tab (Placeholder) */}
      <TabsContent value="checklist" className="space-y-4 mt-4 px-[5px]">
        {checklist.map((item, idx) => (
          <div key={idx} className="border rounded p-4 mb-2 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">{idx + 1}.</span>
              <Checkbox
                checked={item.done}
                onCheckedChange={() => {
                  const updated = [...checklist];
                  updated[idx].done = !updated[idx].done;
                  setChecklist(updated);
                }}
              />
              <input
                type="text"
                value={item.title}
                onChange={(e) => {
                  const updated = [...checklist];
                  updated[idx].title = e.target.value;
                  setChecklist(updated);
                }}
                className="flex-1 border rounded px-2 py-1"
              />
            </div>
            <ReactQuill
              theme="snow"
              value={item.description}
              onChange={(content) => {
                const updated = [...checklist];
                updated[idx].description = content;
                setChecklist(updated);
              }}
            />
          </div>
        ))}
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