
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  DollarSign,
  Users,
  FileText
} from "lucide-react";
import { ResponsiveContainer, BarChart as RechartBarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

// Mock data for billing by matter
const billingByMatter = [
  { name: "Smith vs. Johnson", hours: 24, amount: 6000 },
  { name: "Property Dispute", hours: 18, amount: 4500 },
  { name: "Brown Employment", hours: 12, amount: 3000 },
  { name: "Wilson Family", hours: 8, amount: 2000 },
  { name: "Corporate Contract", hours: 16, amount: 4000 },
];

// Mock data for time allocation
const timeAllocation = [
  { name: "Client Meetings", value: 35 },
  { name: "Document Preparation", value: 25 },
  { name: "Research", value: 15 },
  { name: "Court Appearances", value: 10 },
  { name: "Administrative", value: 15 },
];

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ReportsPage = () => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-2 shadow-sm rounded-md">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-primary">
            {`Hours: ${payload[0].value}`}
          </p>
          <p className="text-xs text-secondary">
            {`Billing: ${formatCurrency(payload[1].value)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              View insights and analytics about your legal practice
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Last 30 Days
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-2">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{formatCurrency(19500)}</div>
                  <div className="flex items-center text-xs text-green-600">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    <span>+12.5% from last month</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Billable Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-2">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">78</div>
                  <div className="flex items-center text-xs text-amber-600">
                    <ArrowDownRight className="mr-1 h-3 w-3" />
                    <span>-4.2% from last month</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Matters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-2">
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">12</div>
                  <div className="flex items-center text-xs text-green-600">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    <span>+2 from last month</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-2">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">8</div>
                  <div className="flex items-center text-xs text-green-600">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    <span>+1 from last month</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Billing by Matter</CardTitle>
              <CardDescription>Hours billed and revenue by matter</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartBarChart
                    data={billingByMatter}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" tickFormatter={(value) => value.split(' ')[0]} />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="hours" name="Hours" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="amount" name="Amount ($)" fill="#82ca9d" />
                  </RechartBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Time Allocation</CardTitle>
              <CardDescription>How your time is distributed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={timeAllocation}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {timeAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center flex-wrap gap-2">
                  {timeAllocation.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center mx-2">
                      <div 
                        className="w-3 h-3 mr-1 rounded-sm" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                      />
                      <span className="text-xs text-muted-foreground">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ReportsPage;
