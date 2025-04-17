
import { SidebarNav } from "./sidebar-nav";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Chatbot } from "@/components/dashboard/chatbot";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [prevPath, setPrevPath] = useState(location.pathname);
  
  // Reset scroll position when navigating on mobile
  useEffect(() => {
    if (isMobile && location.pathname !== prevPath) {
      window.scrollTo(0, 0);
      setPrevPath(location.pathname);
    }
  }, [location.pathname, isMobile, prevPath]);
  
  return (
    <div className="min-h-screen bg-background flex w-full">
      <SidebarNav />
      <main className={`flex-1 transition-all duration-300 ml-16 md:ml-64 p-4 md:p-8 overflow-x-hidden`}>
        {children}
      </main>
      <Chatbot />
    </div>
  );
}
