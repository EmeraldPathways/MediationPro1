import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Calendar,
  FileText,
  LayoutDashboard,
  CheckSquare,
  Briefcase,
  Users,
  FileSpreadsheet,
  CreditCard,
  BarChart,
  Settings,
  HardDrive,
  Mail,
  FileOutput, // Import FileOutput icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";

export type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "Email",
    href: "/email",
    icon: Mail,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Case Files",
    href: "/case-files",
    icon: Briefcase,
  },
  {
    title: "Contacts",
    href: "/contacts",
    icon: Users,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  {
    title: "Documents",
    href: "/documents",
    icon: HardDrive,
  },
  {
    title: "Templates", // Add Templates link
    href: "/templates",
    icon: FileOutput,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function SidebarNav() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isCollapsed = isMobile;
  const [prevPath, setPrevPath] = useState(location.pathname);

  // Auto collapse sidebar on navigation for mobile
  useEffect(() => {
    if (isMobile && location.pathname !== prevPath) {
      setPrevPath(location.pathname);
    }
  }, [location.pathname, isMobile, prevPath]);

  return (
    <div className="relative">
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <div className={cn("flex items-center", isCollapsed && "justify-center w-full")}>
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-mediator-700">Andrew Rooney Legal</h1>
            )}
            {isCollapsed && (
              <span className="text-2xl font-bold text-mediator-700">AR</span>
            )}
          </div>
          <div className="w-8" /> {/* Spacer to maintain layout */}
        </div>
        <Separator />
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-base transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  location.pathname === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <item.icon className={cn("h-5 w-5", isCollapsed && "h-6 w-6")} />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
