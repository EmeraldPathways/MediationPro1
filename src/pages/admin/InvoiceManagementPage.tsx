import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { 
  Search, 
  Download, 
  FileText,
  Calendar as CalendarIcon,
  ChevronDown,
  Filter,
  PlusCircle,
  Eye,
  MoreHorizontal,
  Send,
  Receipt,
  RefreshCw,
  CreditCard,
  UserCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowDownToLine,
  Trash,
} from "lucide-react";

// Mock invoice data for demonstration
const invoicesData = [
  {
    id: "INV-2025-001",
    customer: {
      id: "cust-123",
      name: "John Doe",
      email: "john.doe@example.com",
      company: "Acme Inc."
    },
    amount: 450.00,
    status: "paid",
    dateIssued: "2025-04-10T10:30:00Z",
    datePaid: "2025-04-15T14:22:15Z",
    dateDue: "2025-04-25T00:00:00Z",
    paymentMethod: "credit_card",
    items: [
      { description: "Mediation Session", quantity: 2, unitPrice: 200.00, total: 400.00 },
      { description: "Document Processing", quantity: 1, unitPrice: 50.00, total: 50.00 }
    ],
    notes: "Thank you for your business",
    stripeInvoiceId: "in_1LkM2WCRy7YtB88Z1XnP2r6e"
  },
  {
    id: "INV-2025-002",
    customer: {
      id: "cust-456",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      company: "Global Solutions Ltd"
    },
    amount: 800.00,
    status: "pending",
    dateIssued: "2025-04-12T09:45:00Z",
    datePaid: null,
    dateDue: "2025-04-27T00:00:00Z",
    paymentMethod: null,
    items: [
      { description: "Mediation Package", quantity: 1, unitPrice: 750.00, total: 750.00 },
      { description: "Consultation", quantity: 1, unitPrice: 50.00, total: 50.00 }
    ],
    notes: "Please pay within 15 days",
    stripeInvoiceId: "in_1LmP3XCRy7YtB88Z3pQw9r2f"
  },
  {
    id: "INV-2025-003",
    customer: {
      id: "cust-789",
      name: "Michael Johnson",
      email: "michael.johnson@example.com",
      company: null
    },
    amount: 150.00,
    status: "overdue",
    dateIssued: "2025-03-28T11:20:00Z",
    datePaid: null,
    dateDue: "2025-04-12T00:00:00Z",
    paymentMethod: null,
    items: [
      { description: "Document Review", quantity: 3, unitPrice: 50.00, total: 150.00 }
    ],
    notes: "Second reminder sent on April 15, 2025",
    stripeInvoiceId: "in_1LjK4WCRy7YtB88Z9pT5k7r3"
  },
  {
    id: "INV-2025-004",
    customer: {
      id: "cust-101",
      name: "Emma Wilson",
      email: "emma.wilson@example.com",
      company: "Wilson Consulting"
    },
    amount: 600.00,
    status: "draft",
    dateIssued: null,
    datePaid: null,
    dateDue: null,
    paymentMethod: null,
    items: [
      { description: "Mediation Session", quantity: 2, unitPrice: 250.00, total: 500.00 },
      { description: "Administrative Fee", quantity: 1, unitPrice: 100.00, total: 100.00 }
    ],
    notes: "Draft invoice - not yet sent",
    stripeInvoiceId: null
  },
  {
    id: "INV-2025-005",
    customer: {
      id: "cust-234",
      name: "David Brown",
      email: "david.brown@example.com",
      company: "Brown Family Trust"
    },
    amount: 350.00,
    status: "paid",
    dateIssued: "2025-04-05T15:10:00Z",
    datePaid: "2025-04-05T15:12:32Z",
    dateDue: "2025-04-20T00:00:00Z",
    paymentMethod: "bank_transfer",
    items: [
      { description: "Consultation Session", quantity: 1, unitPrice: 200.00, total: 200.00 },
      { description: "Document Preparation", quantity: 3, unitPrice: 50.00, total: 150.00 }
    ],
    notes: "Paid immediately upon issue",
    stripeInvoiceId: null
  },
  {
    id: "INV-2025-006",
    customer: {
      id: "cust-567",
      name: "Jennifer Taylor",
      email: "jennifer.taylor@example.com",
      company: "Taylor & Associates"
    },
    amount: 1200.00,
    status: "pending",
    dateIssued: "2025-04-15T10:30:00Z",
    datePaid: null,
    dateDue: "2025-04-30T00:00:00Z",
    paymentMethod: null,
    items: [
      { description: "Full Mediation Package", quantity: 1, unitPrice: 1000.00, total: 1000.00 },
      { description: "Document Processing", quantity: 4, unitPrice: 50.00, total: 200.00 }
    ],
    notes: "Corporate client - NET 15 payment terms",
    stripeInvoiceId: "in_1LpR5WCRy7YtB88Z2qN7t5g9"
  },
  {
    id: "INV-2025-007",
    customer: {
      id: "cust-890",
      name: "Robert Miller",
      email: "robert.miller@example.com",
      company: null
    },
    amount: 400.00,
    status: "paid",
    dateIssued: "2025-03-20T09:15:00Z",
    datePaid: "2025-03-25T14:35:42Z",
    dateDue: "2025-04-04T00:00:00Z",
    paymentMethod: "credit_card",
    items: [
      { description: "Mediation Session", quantity: 2, unitPrice: 175.00, total: 350.00 },
      { description: "Administrative Fee", quantity: 1, unitPrice: 50.00, total: 50.00 }
    ],
    notes: "Thank you for your prompt payment",
    stripeInvoiceId: "in_1LgT3XCRy7YtB88Z7mS9f4t2"
  },
  {
    id: "INV-2025-008",
    customer: {
      id: "cust-345",
      name: "Linda Garcia",
      email: "linda.garcia@example.com",
      company: "Garcia Family Office"
    },
    amount: 550.00,
    status: "refunded",
    dateIssued: "2025-04-02T11:45:00Z",
    datePaid: "2025-04-03T10:22:15Z",
    dateDue: "2025-04-17T00:00:00Z",
    paymentMethod: "credit_card",
    items: [
      { description: "Mediation Session", quantity: 2, unitPrice: 225.00, total: 450.00 },
      { description: "Document Review", quantity: 2, unitPrice: 50.00, total: 100.00 }
    ],
    notes: "Refunded on April 10 due to scheduling conflict",
    stripeInvoiceId: "in_1LhN6WCRy7YtB88Z5rQ8d3e1"
  },
  {
    id: "INV-2025-009",
    customer: {
      id: "cust-678",
      name: "Thomas Anderson",
      email: "thomas.anderson@example.com",
      company: "Matrix Systems"
    },
    amount: 900.00,
    status: "overdue",
    dateIssued: "2025-03-15T14:30:00Z",
    datePaid: null,
    dateDue: "2025-03-30T00:00:00Z",
    paymentMethod: null,
    items: [
      { description: "Complex Mediation", quantity: 3, unitPrice: 250.00, total: 750.00 },
      { description: "Document Preparation", quantity: 3, unitPrice: 50.00, total: 150.00 }
    ],
    notes: "Final reminder sent on April 20, 2025",
    stripeInvoiceId: "in_1LfM1WCRy7YtB88Z3nP6j9h7"
  },
  {
    id: "INV-2025-010",
    customer: {
      id: "cust-901",
      name: "Patricia Martinez",
      email: "patricia.martinez@example.com",
      company: "Martinez Legal"
    },
    amount: 475.00,
    status: "paid",
    dateIssued: "2025-04-18T16:20:00Z",
    datePaid: "2025-04-19T09:45:12Z",
    dateDue: "2025-05-03T00:00:00Z",
    paymentMethod: "bank_transfer",
    items: [
      { description: "Mediation Session", quantity: 1, unitPrice: 350.00, total: 350.00 },
      { description: "Admin & Document Fee", quantity: 1, unitPrice: 125.00, total: 125.00 }
    ],
    notes: "Corporate client - processed through accounts payable",
    stripeInvoiceId: null
  }
];

export default function InvoiceManagementPage() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState(invoicesData);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined
  });
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [actionsDialogOpen, setActionsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>;
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Pending</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
      case "refunded":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get payment method badge
  const getPaymentMethodLabel = (method) => {
    if (!method) return "—";
    
    switch(method) {
      case "credit_card":
        return "Credit Card";
      case "bank_transfer":
        return "Bank Transfer";
      default:
        return method;
    }
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return format(new Date(dateString), "MMM d, yyyy");
  };
  
  // Filter invoices based on search, status and date range
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      invoice.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (invoice.customer.company && invoice.customer.company.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    const matchesPaymentMethod = paymentMethodFilter === "all" || invoice.paymentMethod === paymentMethodFilter;
    
    const matchesDateRange = 
      (!dateRange.from || !invoice.dateIssued || new Date(invoice.dateIssued) >= dateRange.from) && 
      (!dateRange.to || !invoice.dateIssued || new Date(invoice.dateIssued) <= dateRange.to);
    
    return matchesSearch && matchesStatus && matchesPaymentMethod && matchesDateRange;
  });
  
  // Calculate summary statistics
  const invoiceStats = {
    total: invoices.length,
    paid: invoices.filter(inv => inv.status === "paid").length,
    pending: invoices.filter(inv => inv.status === "pending").length,
    overdue: invoices.filter(inv => inv.status === "overdue").length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paidAmount: invoices.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0),
    pendingAmount: invoices.filter(inv => inv.status === "pending").reduce((sum, inv) => sum + inv.amount, 0),
  };
  
  // Handle view invoice
  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setViewDialogOpen(true);
  };
  
  // Handle send invoice
  const handleSendInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setSendDialogOpen(true);
  };
  
  // Simulate sending an invoice
  const handleSendConfirm = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSendDialogOpen(false);
      setIsLoading(false);
      
      toast({
        title: "Invoice sent",
        description: `Invoice ${selectedInvoice.id} has been sent to ${selectedInvoice.customer.email}.`,
      });
      
      // Update the invoice status if it was a draft
      if (selectedInvoice.status === "draft") {
        setInvoices(invoices.map(inv => 
          inv.id === selectedInvoice.id ? { 
            ...inv, 
            status: "pending",
            dateIssued: new Date().toISOString(),
            dateDue: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days from now
          } : inv
        ));
      }
    }, 1500);
  };
  
  // Handle mark as paid
  const handleMarkAsPaid = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setActionsDialogOpen(false);
      setIsLoading(false);
      
      setInvoices(invoices.map(inv => 
        inv.id === selectedInvoice.id ? { 
          ...inv, 
          status: "paid",
          datePaid: new Date().toISOString(),
          paymentMethod: "bank_transfer"
        } : inv
      ));
      
      toast({
        title: "Invoice marked as paid",
        description: `Invoice ${selectedInvoice.id} has been marked as paid.`,
      });
    }, 1000);
  };
  
  // Get icon for invoice status
  const getStatusIcon = (status) => {
    switch(status) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "draft":
        return <FileText className="h-4 w-4 text-gray-500" />;
      case "refunded":
        return <RefreshCw className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Invoice Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage all customer invoices
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            onClick={() => {
              // In a real app, you would download all filtered invoices
              toast({
                title: "Exporting invoices",
                description: `${filteredInvoices.length} invoices are being downloaded as CSV.`,
              });
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          
          <Button size={isMobile ? "sm" : "default"}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoiceStats.total}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {invoiceStats.paid} paid, {invoiceStats.pending} pending, {invoiceStats.overdue} overdue
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(invoiceStats.totalAmount)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Across all invoices
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Paid Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(invoiceStats.paidAmount)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round((invoiceStats.paidAmount / invoiceStats.totalAmount) * 100)}% of total
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{formatCurrency(invoiceStats.pendingAmount)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round((invoiceStats.pendingAmount / invoiceStats.totalAmount) * 100)}% of total
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Date Range</span>
                    )}
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-muted-foreground mb-2">No invoices match your search criteria</div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setPaymentMethodFilter("all");
                  setDateRange({ from: undefined, to: undefined });
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{invoice.customer.name}</div>
                          <div className="text-sm text-muted-foreground">{invoice.customer.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="mr-2">{getStatusIcon(invoice.status)}</span>
                          {getStatusBadge(invoice.status)}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(invoice.dateIssued)}</TableCell>
                      <TableCell>
                        {invoice.status === "overdue" ? (
                          <span className="text-red-600">{formatDate(invoice.dateDue)}</span>
                        ) : (
                          formatDate(invoice.dateDue)
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleViewInvoice(invoice)}
                          >
                            <span className="sr-only">View</span>
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {(invoice.status === "draft" || invoice.status === "pending") && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleSendInvoice(invoice)}
                            >
                              <span className="sr-only">Send</span>
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setActionsDialogOpen(true);
                            }}
                          >
                            <span className="sr-only">More</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* View Invoice Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Invoice {selectedInvoice?.id}</span>
              {selectedInvoice && getStatusBadge(selectedInvoice.status)}
            </DialogTitle>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-6">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{selectedInvoice.customer.name}</h3>
                  <p className="text-sm">{selectedInvoice.customer.email}</p>
                  {selectedInvoice.customer.company && (
                    <p className="text-sm">{selectedInvoice.customer.company}</p>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Invoice Date</div>
                  <div>{formatDate(selectedInvoice.dateIssued) || "Draft"}</div>
                  
                  <div className="text-sm text-muted-foreground mt-2">Due Date</div>
                  <div>{formatDate(selectedInvoice.dateDue) || "N/A"}</div>
                </div>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-end">
                <div className="w-[200px]">
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold">{formatCurrency(selectedInvoice.amount)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Payment Information</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Status:</span>{" "}
                    {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Payment Method:</span>{" "}
                    {getPaymentMethodLabel(selectedInvoice.paymentMethod)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date Paid:</span>{" "}
                    {formatDate(selectedInvoice.datePaid)}
                  </div>
                  {selectedInvoice.stripeInvoiceId && (
                    <div>
                      <span className="text-muted-foreground">Stripe ID:</span>{" "}
                      <span className="font-mono text-xs">{selectedInvoice.stripeInvoiceId}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedInvoice.notes && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Notes</div>
                  <div className="text-sm p-3 bg-muted rounded-md">
                    {selectedInvoice.notes}
                  </div>
                </div>
              )}
              
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" /> Download PDF
                </Button>
                {(selectedInvoice.status === "draft" || selectedInvoice.status === "pending") && (
                  <Button onClick={() => {
                    setViewDialogOpen(false);
                    handleSendInvoice(selectedInvoice);
                  }}>
                    <Send className="h-4 w-4 mr-2" /> Send Invoice
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Send Invoice Dialog */}
      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Invoice</DialogTitle>
            <DialogDescription>
              This will send the invoice to the customer via email.
            </DialogDescription>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient</Label>
                <Input 
                  id="recipient" 
                  value={selectedInvoice.customer.email}
                  readOnly
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  defaultValue={`Invoice ${selectedInvoice.id} from MediatorPro`}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={`Dear ${selectedInvoice.customer.name},\n\nPlease find attached invoice ${selectedInvoice.id} for ${formatCurrency(selectedInvoice.amount)}.\n\nPayment is due by ${formatDate(selectedInvoice.dateDue) || "[Date will be set when sent]"}.\n\nThank you for your business.\n\nBest regards,\nMediatorPro Team`}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="attach-pdf" defaultChecked />
                <label
                  htmlFor="attach-pdf"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Attach PDF invoice
                </label>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setSendDialogOpen(false)}
            >
              Cancel
            </Button>
            
            <Button 
              onClick={handleSendConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">◌</span>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Invoice
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* More Actions Dialog */}
      <Dialog open={actionsDialogOpen} onOpenChange={setActionsDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Invoice Actions</DialogTitle>
            <DialogDescription>
              {selectedInvoice && `Select an action for invoice ${selectedInvoice.id}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedInvoice && selectedInvoice.status !== "paid" && selectedInvoice.status !== "refunded" && (
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={handleMarkAsPaid}
                disabled={isLoading}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark as Paid
              </Button>
            )}
            
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => {
                setActionsDialogOpen(false);
                handleViewInvoice(selectedInvoice);
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Invoice
            </Button>
            
            <Button 
              className="w-full justify-start" 
              variant="outline"
            >
              <ArrowDownToLine className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            
            {(selectedInvoice?.status === "draft" || selectedInvoice?.status === "pending") && (
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => {
                  setActionsDialogOpen(false);
                  handleSendInvoice(selectedInvoice);
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                Send to Customer
              </Button>
            )}
            
            <Button 
              className="w-full justify-start text-red-600 hover:text-red-600" 
              variant="outline"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Invoice
            </Button>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setActionsDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}