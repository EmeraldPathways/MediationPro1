import { Layout } from "@/components/layout/layout";
import { UpcomingMediations } from "@/components/dashboard/upcoming-mediations";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckSquare, Info, Mail } from "lucide-react";
import { Link } from "react-router-dom";
const Dashboard = () => {
  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to Andrew Rooney Legal management platform.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <QuickActions />
          <UpcomingMediations />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;