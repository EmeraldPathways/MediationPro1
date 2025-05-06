import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, BookOpen, BookmarkCheck, CircleCheck, CircleDashed, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Mock data for guide chapters and sections
const guideContent = {
  title: "Getting Started with Mediation: A Comprehensive Guide for Divorce and Separation in Ireland",
  description: "A complete guide for understanding and practicing family mediation in Ireland",
  chaptersCount: 10,
  completedChapters: 2,
  totalSections: 30,
  completedSections: 6,
  chapters: [
    {
      id: "chapter1",
      title: "Introduction to Family Mediation in Ireland",
      description: "Understanding family mediation in the Irish context",
      completed: true,
      sections: [
        { id: "c1s1", title: "What is Family Mediation in Ireland?", completed: true, duration: "5 min read" },
        { id: "c1s2", title: "The Irish Context", completed: true, duration: "7 min read" },
        { id: "c1s3", title: "Benefits of Family Mediation in Ireland", completed: true, duration: "6 min read" },
      ]
    },
    {
      id: "chapter2",
      title: "Irish Mediation Regulatory Framework",
      description: "Understanding the legal foundation for mediation practice in Ireland",
      completed: true,
      sections: [
        { id: "c2s1", title: "The Mediation Act 2017", completed: true, duration: "10 min read" },
        { id: "c2s2", title: "Professional Standards and Accreditation", completed: true, duration: "8 min read" },
        { id: "c2s3", title: "Family Law in Ireland", completed: true, duration: "12 min read" },
      ]
    },
    {
      id: "chapter3",
      title: "Core Mediation Principles and Ethics",
      description: "Essential principles and ethical standards for family mediation",
      completed: false,
      sections: [
        { id: "c3s1", title: "Fundamental Principles", completed: false, duration: "8 min read" },
        { id: "c3s2", title: "Ethical Standards for Irish Family Mediators", completed: false, duration: "10 min read" },
      ]
    },
    {
      id: "chapter4",
      title: "Essential Skills for Family Mediators",
      description: "Key skills required for effective family mediation",
      completed: false,
      sections: [
        { id: "c4s1", title: "Communication Skills", completed: false, duration: "9 min read" },
        { id: "c4s2", title: "Emotional Intelligence", completed: false, duration: "7 min read" },
        { id: "c4s3", title: "Negotiation and Problem-Solving", completed: false, duration: "8 min read" },
      ]
    },
    {
      id: "chapter5",
      title: "Pre-Mediation Preparation",
      description: "Preparing for effective mediation sessions",
      completed: false,
      sections: [
        { id: "c5s1", title: "Initial Contact and Screening", completed: false, duration: "8 min read" },
        { id: "c5s2", title: "Information Gathering", completed: false, duration: "7 min read" },
        { id: "c5s3", title: "Session Planning", completed: false, duration: "6 min read" },
      ]
    },
    {
      id: "chapter6",
      title: "The Mediation Process: Step by Step",
      description: "A detailed walkthrough of the mediation process",
      completed: false,
      sections: [
        { id: "c6s1", title: "Opening the Session", completed: false, duration: "8 min read" },
        { id: "c6s2", title: "Issue Identification", completed: false, duration: "7 min read" },
        { id: "c6s3", title: "Exploration and Negotiation", completed: false, duration: "10 min read" },
        { id: "c6s4", title: "Reaching and Documenting Agreement", completed: false, duration: "9 min read" },
      ]
    },
    {
      id: "chapter7",
      title: "Legal Considerations in Irish Family Mediation",
      description: "Understanding the legal aspects of family mediation in Ireland",
      completed: false,
      sections: [
        { id: "c7s1", title: "Separation Agreements", completed: false, duration: "10 min read" },
        { id: "c7s2", title: "Divorce Considerations", completed: false, duration: "11 min read" },
        { id: "c7s3", title: "Child-Related Legal Frameworks", completed: false, duration: "9 min read" },
      ]
    },
    {
      id: "chapter8",
      title: "Documentation and Court Requirements",
      description: "Essential documentation for effective mediation",
      completed: false,
      sections: [
        { id: "c8s1", title: "Mediation Documentation", completed: false, duration: "8 min read" },
        { id: "c8s2", title: "Mediated Agreement Drafting", completed: false, duration: "10 min read" },
        { id: "c8s3", title: "Court Interaction", completed: false, duration: "9 min read" },
      ]
    },
    {
      id: "chapter9",
      title: "Building Your Family Mediation Practice",
      description: "Establishing and growing a successful mediation service",
      completed: false,
      sections: [
        { id: "c9s1", title: "Practice Development", completed: false, duration: "9 min read" },
        { id: "c9s2", title: "Marketing and Client Acquisition", completed: false, duration: "8 min read" },
        { id: "c9s3", title: "Professional Development", completed: false, duration: "7 min read" },
      ]
    },
    {
      id: "chapter10",
      title: "Resources and Continuing Education",
      description: "Ongoing learning and professional development",
      completed: false,
      sections: [
        { id: "c10s1", title: "Professional Resources", completed: false, duration: "6 min read" },
        { id: "c10s2", title: "Training Opportunities", completed: false, duration: "7 min read" },
        { id: "c10s3", title: "Community of Practice", completed: false, duration: "5 min read" },
      ]
    }
  ]
};

// Chapter content for display when a section is selected
const chapterContent = {
  "c1s1": {
    title: "What is Family Mediation in Ireland?",
    content: "Family mediation in Ireland is a voluntary process where separating or divorcing couples work with a qualified mediator to reach agreements on matters such as child custody, financial support, and property division. The process provides an alternative to adversarial court proceedings, allowing couples to maintain control over decisions affecting their family's future while adhering to Irish family law requirements."
  },
  "c1s2": {
    title: "The Irish Context",
    content: "The Mediation Act 2017 formalised mediation practices in Ireland, encouraging parties to consider mediation before proceeding to court. In family law cases, solicitors are required to provide information about mediation services to clients contemplating separation or divorce proceedings."
  },
  "c1s3": {
    title: "Benefits of Family Mediation in Ireland",
    content: "Family mediation offers significant advantages for separating couples in Ireland:\n\n• Cost-Effective: Substantially less expensive than contested court proceedings\n• Time-Efficient: Can achieve resolution in weeks or months rather than years\n• Confidential: Discussions remain private, protecting family privacy\n• Child-Centred: Focuses on arrangements that prioritise children's wellbeing\n• Relationship Preservation: Maintains cooperative communication between parties\n• Compliance: Agreements reached through mediation typically have higher compliance rates"
  },
  // Additional chapter content omitted for brevity
};

const GuidesGettingStarted = () => {
  const isMobile = useIsMobile();
  const [activeChapter, setActiveChapter] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    // Calculate progress based on completed sections
    const totalProgress = (guideContent.completedSections / guideContent.totalSections) * 100;
    setProgress(totalProgress);
  }, []);

  const markCompleted = (sectionId: string) => {
    // In a real implementation, this would update a database
    console.log(`Marked ${sectionId} as completed`);
    // Update the local state to reflect changes immediately
    // In a real app, you'd fetch updated progress from the backend
  };

  const markChapterCompleted = (chapterId: string) => {
    console.log(`Marked entire chapter ${chapterId} as completed`);
    // In a real implementation, this would mark all sections in the chapter as completed
  };

  // Helper for icon size
  const iconSizeClass = isMobile ? "h-3.5 w-3.5" : "h-4 w-4";

  // Toggle section visibility
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <Layout>
      <div className={`flex flex-col ${isMobile ? "space-y-4" : "space-y-6"} p-4 md:p-6`}>
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button variant="outline" size="icon" asChild>
              <Link to="/guides">
                <ChevronLeft className={iconSizeClass} />
              </Link>
            </Button>
            <div>
              <h1 className={`${isMobile ? "text-xl" : "text-3xl"} font-bold tracking-tight`}>Guides</h1>
              <div className={`${isMobile ? "text-xs" : "text-sm"} text-muted-foreground`}>
                {guideContent.title}
              </div>
            </div>
          </div>
          <Badge variant="outline" className={`${isMobile ? "py-1 px-2 text-xs" : "py-1.5 px-3"}`}>
            Learning Course
          </Badge>
        </div>

        <Separator className={isMobile ? "my-1.5" : ""} />

        {/* Progress Bar */}
        <Card>
          <CardHeader className={`${isMobile ? "p-4 pb-2" : "pb-4"}`}>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className={`flex items-center ${isMobile ? "text-base" : ""}`}>
                <BookOpen className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} mr-2 text-primary`} />
                Your Progress
              </CardTitle>
              <span className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}>
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <CardDescription className="mt-2 flex justify-between">
              <span>{guideContent.completedChapters} of {guideContent.chaptersCount} chapters completed</span>
              <span>{guideContent.completedSections} of {guideContent.totalSections} sections completed</span>
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Chapter list with expandable sections */}
        <div className="space-y-4 mt-2">
          <Accordion type="multiple" className="w-full" value={activeChapter ? [activeChapter] : []}>
            {guideContent.chapters.map(chapter => (
              <AccordionItem 
                key={chapter.id} 
                value={chapter.id}
                className={chapter.completed ? "border-l-4 border-l-green-500" : ""}
              >
                <AccordionTrigger 
                  className="px-4 hover:no-underline hover:bg-muted/30"
                  onClick={() => setActiveChapter(activeChapter === chapter.id ? null : chapter.id)}
                >
                  <div className="flex w-full justify-between items-center">
                    <div className="flex items-center">
                      <span className={`${isMobile ? "text-base" : "text-lg"} font-medium`}>{chapter.title}</span>
                      {chapter.completed && <BookmarkCheck className={`${iconSizeClass} text-green-500 ml-2`} />}
                    </div>
                    {chapter.completed ? (
                      <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
                    ) : (
                      <Badge variant="outline">In Progress</Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3">
                  <CardDescription className="mb-3">{chapter.description}</CardDescription>
                  <div className="space-y-3">
                    {chapter.sections.map(section => (
                      <div key={section.id} className="border rounded-md overflow-hidden">
                        <div 
                          className={`flex items-center justify-between p-3 ${
                            isMobile ? "text-sm" : ""
                          } cursor-pointer hover:bg-muted/30`}
                          onClick={() => toggleSection(section.id)}
                        >
                          <div className="flex items-center space-x-2">
                            {section.completed ? (
                              <CircleCheck className={`${iconSizeClass} text-green-500`} />
                            ) : (
                              <CircleDashed className={iconSizeClass} />
                            )}
                            <span className={section.completed ? "text-muted-foreground" : ""}>
                              {section.title}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className={`${isMobile ? "text-xs" : "text-sm"} text-muted-foreground mr-3`}>
                              {section.duration}
                            </span>
                            {expandedSections[section.id] ? (
                              <ChevronUp className={iconSizeClass} />
                            ) : (
                              <ChevronDown className={iconSizeClass} />
                            )}
                          </div>
                        </div>

                        {/* Section content that expands directly below */}
                        {expandedSections[section.id] && (
                          <div>
                            <Separator />
                            <div className={`${isMobile ? "p-3" : "p-5"} prose max-w-none bg-muted/10`}>
                              {chapterContent[section.id]?.content.split('\n\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-4">
                                  {paragraph}
                                </p>
                              ))}
                              
                              <div className="flex justify-end mt-4">
                                <Button 
                                  onClick={() => markCompleted(section.id)}
                                  size={isMobile ? "sm" : "default"}
                                >
                                  Mark as Completed
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className={`${isMobile ? "text-xs" : "text-sm"} text-muted-foreground`}>
                      {chapter.sections.filter(s => s.completed).length} of {chapter.sections.length} completed
                    </span>
                    <Button 
                      size={isMobile ? "sm" : "default"} 
                      variant={chapter.completed ? "outline" : "default"}
                      onClick={() => markChapterCompleted(chapter.id)}
                    >
                      {chapter.completed ? "Review Chapter" : "Complete Chapter"}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </Layout>
  );
};

export default GuidesGettingStarted;