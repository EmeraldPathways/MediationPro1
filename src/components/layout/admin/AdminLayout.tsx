import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import navConfig from "./config";
import AdminNavSection from "./AdminNavSection";
import { GlobalSearch } from "@/components/layout/global-search";

// Shadcn UI components
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Icons
import { Menu, X, ArrowLeft, Home } from "lucide-react";

export default function AdminLayout() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile navigation */}
      {isMobile ? (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 left-4 z-50"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center p-4">
                <h1 className="text-xl font-semibold">Admin Panel</h1>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setOpen(false)} 
                  className="ml-auto"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              <Separator />
              <ScrollArea className="flex-1 mt-2 mb-2">
                <AdminNavSection data={navConfig} onCloseMobile={() => setOpen(false)} />
                
                {/* Back to Dashboard Button for Mobile */}
                <div className="px-3 py-2 mt-4">
                  <Link 
                    to="/"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Back to Dashboard</span>
                  </Link>
                </div>
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        /* Desktop navigation (persistent sidebar) */
        <div className="hidden md:flex w-64 flex-col fixed inset-y-0 border-r">
          <div className="flex flex-col h-full">
            <div className="px-6 py-5">
              <h1 className="text-xl font-semibold">Admin Panel</h1>
            </div>
            <Separator />
            <ScrollArea className="flex-1 mt-2 mb-2">
              <AdminNavSection data={navConfig} />
              
              {/* Back to Dashboard Button for Desktop */}
              <div className="px-3 py-2 mt-4">
                <Separator className="my-4" />
                <Link 
                  to="/"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back to Dashboard</span>
                </Link>
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={`flex-1 flex flex-col min-h-screen ${!isMobile ? "md:pl-64" : ""}`}>
        {/* Shared Header for Admin Content Area */}
        <header className={`sticky top-0 z-40 bg-background border-b h-16 flex items-center px-4 md:px-6 ${isMobile ? 'pl-16' : ''}`}>
          {/* Mobile Title Area (placeholder if needed, or adjust layout) */}
          {isMobile && (
            <div className="flex-1">
              {/* Title could potentially be dynamic here based on route */}
            </div>
          )}
          
          {/* Global Search - aligned to the right */}
          <div className={`ml-auto ${isMobile ? '' : 'w-full max-w-md'}`}> 
            <GlobalSearch />
          </div>
          
          {/* Optional: Add other header elements like user menu here */}
        </header>
        
        {/* Content area */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}