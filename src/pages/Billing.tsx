import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, Plus, DollarSign, FileText, Eye, Edit, 
  Trash, Check, Receipt, BanknoteIcon, CircleDollarSign, Files
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

// Define invoice and payment types
interface Invoice {
  id: string;
  clientName: string;
  matter: string;
  amount: number;
  status: "Draft" | "Unpaid" | "Paid";
  date: string;
}

interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: string;
  notes?: string;
}

// Mock data for billing
const initialInvoices: Invoice[] = [
  {
    id: "INV-001",
    clientName: "John Smith",
    matter: "Smith vs. Johnson",
    amount: 2500.00,
    status: "Draft",
    date: "2023-06-15",
  },
  {
    id: "INV-002",
    clientName: "Sarah Johnson",
    matter: "Property Dispute Resolution",
    amount: 1800.00,
    status: "Unpaid",
    date: "2023-06-10",
  },
  {
    id: "INV-003",
    clientName: "Robert Brown",
    matter: "Brown Employment Dispute",
    amount: 3200.00,
    status: "Paid",
    date: "2023-05-28",
  }
];

const initialPayments: Payment[] = [
  {
    id: "PMT-001",
    invoiceId: "INV-003",
    amount: 3200.00,
    date: "2023-05-28",
    method: "Credit Card",
    notes: "Payment received in full"
  }
];

// Mock data for clients and matters
const clients = [
  { id: 1, name: "John Smith" },
  { id: 2, name: "Sarah Johnson" },
  { id: 3, name: "Robert Brown" }
];

const matters = [
  { id: 1, title: "Smith vs. Johnson" },
  { id: 2, title: "Property Dispute Resolution" },
  { id: 3, title: "Brown Employment Dispute" }
];

const BillingPage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [activeTab, setActiveTab] = useState("all");
  const isMobile = useIsMobile();
  
  // New invoice form state
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  const [newInvoice, setNewInvoice] = useState<Omit<Invoice, 'id'>>({
    clientName: "",
    matter: "",
    amount: 0,
    status: "Draft",
    date: new Date().toISOString().split('T')[0],
  });
  
  // New payment form state
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);
  const [newPayment, setNewPayment] = useState<Omit<Payment, 'id'>>({
    invoiceId: "",
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    method: "Credit Card",
    notes: ""
  });
  
  // Edit invoice state
  const [isEditingInvoice, setIsEditingInvoice] = useState(false);
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Handle creating a new invoice
  const handleCreateInvoice = () => {
    const id = `INV-${String(invoices.length + 1).padStart(3, '0')}`;
    const invoice: Invoice = {
      id,
      ...newInvoice
    };
    
    setInvoices([...invoices, invoice]);
    setIsCreatingBill(false);
    setNewInvoice({
      clientName: "",
      matter: "",
      amount: 0,
      status: "Draft",
      date: new Date().toISOString().split('T')[0],
    });
    
    toast.success("Invoice created successfully");
  };
  
  // Handle recording a new payment
  const handleRecordPayment = () => {
    const id = `PMT-${String(payments.length + 1).padStart(3, '0')}`;
    const payment: Payment = {
      id,
      ...newPayment
    };
    
    // Update the related invoice status to "Paid"
    const updatedInvoices = invoices.map(invoice => 
      invoice.id === payment.invoiceId ? { ...invoice, status: "Paid" as const } : invoice
    );
    
    setPayments([...payments, payment]);
    setInvoices(updatedInvoices);
    setIsRecordingPayment(false);
    setNewPayment({
      invoiceId: "",
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      method: "Credit Card",
      notes: ""
    });
    
    toast.success("Payment recorded successfully");
  };
  
  // Handle updating an invoice
  const handleUpdateInvoice = () => {
    if (!editInvoice) return;
    
    const updatedInvoices = invoices.map(invoice => 
      invoice.id === editInvoice.id ? editInvoice : invoice
    );
    
    setInvoices(updatedInvoices);
    setIsEditingInvoice(false);
    setEditInvoice(null);
    
    toast.success("Invoice updated successfully");
  };
  
  // Start editing an invoice
  const startEditInvoice = (invoice: Invoice) => {
    setEditInvoice({...invoice});
    setIsEditingInvoice(true);
  };
  
  // Filter invoices based on active tab
  const getFilteredInvoices = () => {
    if (activeTab === "all") return invoices;
    return invoices.filter(invoice => invoice.status.toLowerCase() === activeTab);
  };
  
  // Get unpaid invoices for payment dropdown
  const unpaidInvoices = invoices.filter(invoice => invoice.status === "Unpaid");
  
  // Calculate totals
  const draftTotal = invoices
    .filter(i => i.status === "Draft")
    .reduce((sum, inv) => sum + inv.amount, 0);
    
  const unpaidTotal = invoices
    .filter(i => i.status === "Unpaid")
    .reduce((sum, inv) => sum + inv.amount, 0);
    
  const paidTotal = invoices
    .filter(i => i.status === "Paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const getTabTitle = () => {
    switch(activeTab) {
      case "draft": return "Draft Invoices";
      case "unpaid": return "Unpaid Invoices";
      case "paid": return "Paid Invoices";
      default: return "All Invoices";
    }
  };

  return (
    <Layout>
      <div className={`flex flex-col h-full ${isMobile ? "space-y-4" : "space-y-6"}`}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h1 className={`${isMobile ? "text-xl" : "text-3xl"} font-bold tracking-tight`}>Billing</h1>
            <p className="text-muted-foreground text-sm">
              Manage invoices, track payments, and set billing targets
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isCreatingBill} onOpenChange={setIsCreatingBill}>
              <DialogTrigger asChild>
                <Button variant="outline" size={isMobile ? "sm" : "default"} className="flex items-center gap-2">
                  <FileText className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
                  Create Bill
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Bill</DialogTitle>
                  <DialogDescription>
                    Create a new invoice for a client
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="client">Client</Label>
                    <Select 
                      value={newInvoice.clientName} 
                      onValueChange={(value) => setNewInvoice({...newInvoice, clientName: value})}
                    >
                      <SelectTrigger id="client" className={isMobile ? "h-8 text-xs" : ""}>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.name}>{client.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="matter">Matter</Label>
                    <Select 
                      value={newInvoice.matter} 
                      onValueChange={(value) => setNewInvoice({...newInvoice, matter: value})}
                    >
                      <SelectTrigger id="matter" className={isMobile ? "h-8 text-xs" : ""}>
                        <SelectValue placeholder="Select matter" />
                      </SelectTrigger>
                      <SelectContent>
                        {matters.map((matter) => (
                          <SelectItem key={matter.id} value={matter.title}>{matter.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={newInvoice.amount}
                      onChange={(e) => setNewInvoice({...newInvoice, amount: parseFloat(e.target.value)})}
                      className={isMobile ? "h-8 text-xs" : ""}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="invoice-date">Date</Label>
                    <Input
                      id="invoice-date"
                      type="date"
                      value={newInvoice.date}
                      onChange={(e) => setNewInvoice({...newInvoice, date: e.target.value})}
                      className={isMobile ? "h-8 text-xs" : ""}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={newInvoice.status} 
                      onValueChange={(value: "Draft" | "Unpaid" | "Paid") => setNewInvoice({...newInvoice, status: value})}
                    >
                      <SelectTrigger id="status" className={isMobile ? "h-8 text-xs" : ""}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Unpaid">Unpaid</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreatingBill(false)}
                    size={isMobile ? "sm" : "default"}
                    className={isMobile ? "text-xs" : ""}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateInvoice}
                    size={isMobile ? "sm" : "default"}
                    className={isMobile ? "text-xs" : ""}
                  >
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isRecordingPayment} onOpenChange={setIsRecordingPayment}>
              <DialogTrigger asChild>
                <Button size={isMobile ? "sm" : "default"} className="flex items-center gap-2">
                  <Plus className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
                  Record Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Record Payment</DialogTitle>
                  <DialogDescription>
                    Record a new payment for an invoice
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="invoice">Invoice</Label>
                    <Select 
                      value={newPayment.invoiceId} 
                      onValueChange={(value) => {
                        const invoice = invoices.find(inv => inv.id === value);
                        setNewPayment({
                          ...newPayment, 
                          invoiceId: value,
                          amount: invoice ? invoice.amount : 0
                        });
                      }}
                    >
                      <SelectTrigger id="invoice" className={isMobile ? "h-8 text-xs" : ""}>
                        <SelectValue placeholder="Select invoice" />
                      </SelectTrigger>
                      <SelectContent>
                        {unpaidInvoices.map((invoice) => (
                          <SelectItem key={invoice.id} value={invoice.id}>
                            {invoice.id} - {invoice.clientName} ({formatCurrency(invoice.amount)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="payment-amount">Payment Amount ($)</Label>
                    <Input
                      id="payment-amount"
                      type="number"
                      step="0.01"
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment({...newPayment, amount: parseFloat(e.target.value)})}
                      className={isMobile ? "h-8 text-xs" : ""}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="payment-date">Payment Date</Label>
                    <Input
                      id="payment-date"
                      type="date"
                      value={newPayment.date}
                      onChange={(e) => setNewPayment({...newPayment, date: e.target.value})}
                      className={isMobile ? "h-8 text-xs" : ""}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Select 
                      value={newPayment.method} 
                      onValueChange={(value) => setNewPayment({...newPayment, method: value})}
                    >
                      <SelectTrigger id="payment-method" className={isMobile ? "h-8 text-xs" : ""}>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Check">Check</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="payment-notes">Notes</Label>
                    <Textarea 
                      id="payment-notes" 
                      placeholder="Additional payment details..."
                      value={newPayment.notes || ""}
                      onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
                      className={isMobile ? "text-xs" : ""}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsRecordingPayment(false)}
                    size={isMobile ? "sm" : "default"}
                    className={isMobile ? "text-xs" : ""}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleRecordPayment}
                    size={isMobile ? "sm" : "default"}
                    className={isMobile ? "text-xs" : ""}
                    disabled={!newPayment.invoiceId || newPayment.amount <= 0}
                  >
                    Record Payment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isEditingInvoice} onOpenChange={setIsEditingInvoice}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Invoice</DialogTitle>
                  <DialogDescription>
                    Update invoice details
                  </DialogDescription>
                </DialogHeader>
                
                {editInvoice && (
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-id">Invoice ID</Label>
                      <Input
                        id="edit-id"
                        value={editInvoice.id}
                        disabled
                        className={isMobile ? "h-8 text-xs" : ""}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="edit-client">Client</Label>
                      <Select 
                        value={editInvoice.clientName} 
                        onValueChange={(value) => setEditInvoice({...editInvoice, clientName: value})}
                      >
                        <SelectTrigger id="edit-client" className={isMobile ? "h-8 text-xs" : ""}>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.name}>{client.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="edit-matter">Matter</Label>
                      <Select 
                        value={editInvoice.matter} 
                        onValueChange={(value) => setEditInvoice({...editInvoice, matter: value})}
                      >
                        <SelectTrigger id="edit-matter" className={isMobile ? "h-8 text-xs" : ""}>
                          <SelectValue placeholder="Select matter" />
                        </SelectTrigger>
                        <SelectContent>
                          {matters.map((matter) => (
                            <SelectItem key={matter.id} value={matter.title}>{matter.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="edit-amount">Amount ($)</Label>
                      <Input
                        id="edit-amount"
                        type="number"
                        step="0.01"
                        value={editInvoice.amount}
                        onChange={(e) => setEditInvoice({...editInvoice, amount: parseFloat(e.target.value)})}
                        className={isMobile ? "h-8 text-xs" : ""}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="edit-date">Date</Label>
                      <Input
                        id="edit-date"
                        type="date"
                        value={editInvoice.date}
                        onChange={(e) => setEditInvoice({...editInvoice, date: e.target.value})}
                        className={isMobile ? "h-8 text-xs" : ""}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="edit-status">Status</Label>
                      <Select 
                        value={editInvoice.status} 
                        onValueChange={(value: "Draft" | "Unpaid" | "Paid") => setEditInvoice({...editInvoice, status: value})}
                      >
                        <SelectTrigger id="edit-status" className={isMobile ? "h-8 text-xs" : ""}>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Unpaid">Unpaid</SelectItem>
                          <SelectItem value="Paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditingInvoice(false)}
                    size={isMobile ? "sm" : "default"}
                    className={isMobile ? "text-xs" : ""}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      if (!editInvoice) return;
                      setInvoices(invoices.filter(inv => inv.id !== editInvoice.id));
                      setIsEditingInvoice(false);
                      toast.success("Invoice deleted successfully");
                    }}
                    size={isMobile ? "sm" : "default"}
                    className={`${isMobile ? "text-xs" : ""} mr-2`}
                  >
                    Delete
                  </Button>
                  <Button 
                    onClick={handleUpdateInvoice}
                    size={isMobile ? "sm" : "default"}
                    className={isMobile ? "text-xs" : ""}
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className={`pb-2 ${isMobile ? "p-3" : ""}`}>
              <CardTitle className="text-sm font-medium">Draft Bills</CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? "p-3 pt-0" : ""}>
              <div className="flex items-center justify-between">
                <div className={`${isMobile ? "text-lg" : "text-2xl"} font-bold`}>{formatCurrency(draftTotal)}</div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setActiveTab("draft")}
                >View</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className={`pb-2 ${isMobile ? "p-3" : ""}`}>
              <CardTitle className="text-sm font-medium">Unpaid Invoices</CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? "p-3 pt-0" : ""}>
              <div className="flex items-center justify-between">
                <div className={`${isMobile ? "text-lg" : "text-2xl"} font-bold`}>{formatCurrency(unpaidTotal)}</div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setActiveTab("unpaid")}
                >View</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className={`pb-2 ${isMobile ? "p-3" : ""}`}>
              <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? "p-3 pt-0" : ""}>
              <div className="flex items-center justify-between">
                <div className={`${isMobile ? "text-lg" : "text-2xl"} font-bold`}>{formatCurrency(paidTotal)}</div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setActiveTab("paid")}
                >View</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="h-[calc(100vh-380px)] flex flex-col overflow-hidden">
          <CardHeader className={`${isMobile ? "px-2 py-2" : "pb-0"}`}>
            <div className="flex justify-between items-center">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className={`grid grid-cols-4 ${isMobile ? "w-full text-xs" : "w-[400px]"}`}>
                  <TabsTrigger value="all" className="flex items-center gap-1">
                    <Files className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
                    All
                  </TabsTrigger>
                  <TabsTrigger value="draft" className="flex items-center gap-1">
                    <FileText className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
                    Draft
                  </TabsTrigger>
                  <TabsTrigger value="unpaid" className="flex items-center gap-1">
                    <BanknoteIcon className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
                    Unpaid
                  </TabsTrigger>
                  <TabsTrigger value="paid" className="flex items-center gap-1">
                    <CircleDollarSign className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
                    Paid
                  </TabsTrigger>
                </TabsList>
                
                <div className={`flex flex-col ${isMobile ? "gap-2" : "gap-0"} sm:flex-row sm:justify-between sm:items-center ${isMobile ? "mt-2 mb-1" : "mt-4 mb-2"}`}>
                  <CardTitle className={isMobile ? "text-base" : ""}>{getTabTitle()}</CardTitle>
                  <Input 
                    placeholder="Search invoices..." 
                    className={`${isMobile ? "text-sm h-8" : "max-w-xs"}`}
                  />
                </div>
                
                <TabsContent value="all" className="m-0 overflow-hidden">
                  <CardContent className="flex-1 overflow-y-auto overflow-x-hidden p-0">
                    <div className="divide-y">
                      {getFilteredInvoices().length > 0 ? (
                        getFilteredInvoices().map((invoice) => (
                          <div
                            key={invoice.id}
                            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${isMobile ? "p-2" : "p-4"} hover:bg-muted/50 transition-colors`}
                          >
                            <div className="flex items-center">
                              <div className={`${isMobile ? "h-8 w-8" : "h-10 w-10"} rounded-full bg-primary/10 flex items-center justify-center text-primary`}>
                                {invoice.status === "Paid" ? (
                                  <Check className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} />
                                ) : invoice.status === "Unpaid" ? (
                                  <BanknoteIcon className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} />
                                ) : (
                                  <FileText className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} />
                                )}
                              </div>
                              <div className="ml-3 min-w-0">
                                <div className="flex items-center">
                                  <p className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}>{invoice.id}</p>
                                  <span className={`ml-2 inline-flex px-2 py-0.5 rounded-full text-xs ${
                                    invoice.status === "Paid" 
                                      ? "bg-green-100 text-green-800" 
                                      : invoice.status === "Unpaid"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}>
                                    {invoice.status}
                                  </span>
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                  <span className={isMobile ? "text-[0.65rem]" : ""}>{invoice.clientName} • {formatDate(invoice.date)}</span>
                                </div>
                              </div>
                            </div>
                            <div className={`${isMobile ? "mt-1 ml-11" : "mt-0"} sm:mt-0 flex items-center`}>
                              <p className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}>{formatCurrency(invoice.amount)}</p>
                              <div className="ml-4 flex items-center">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => startEditInvoice(invoice)}
                                  title="Edit"
                                  className="h-8 w-8"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                {invoice.status === "Unpaid" && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => {
                                      setNewPayment({
                                        invoiceId: invoice.id,
                                        amount: invoice.amount,
                                        date: new Date().toISOString().split('T')[0],
                                        method: "Credit Card",
                                        notes: ""
                                      });
                                      setIsRecordingPayment(true);
                                    }}
                                    title="Record Payment"
                                    className="h-8 w-8"
                                  >
                                    <Check className="h-4 w-4 text-green-500" />
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  title="View"
                                  className="h-8 w-8"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={`${isMobile ? "p-4 text-sm" : "p-6"} text-center text-muted-foreground`}>
                          <p>No invoices found.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="draft" className="m-0 overflow-hidden">
                  <CardContent className="flex-1 overflow-y-auto overflow-x-hidden p-0">
                    <div className="divide-y">
                      {getFilteredInvoices().length > 0 ? (
                        getFilteredInvoices().map((invoice) => (
                          <div
                            key={invoice.id}
                            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${isMobile ? "p-2" : "p-4"} hover:bg-muted/50 transition-colors`}
                          >
                            {/* Same invoice item structure as "all" tab */}
                            <div className="flex items-center">
                              <div className={`${isMobile ? "h-8 w-8" : "h-10 w-10"} rounded-full bg-primary/10 flex items-center justify-center text-primary`}>
                                <FileText className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} />
                              </div>
                              <div className="ml-3 min-w-0">
                                <div className="flex items-center">
                                  <p className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}>{invoice.id}</p>
                                  <span className={`ml-2 inline-flex px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800`}>
                                    {invoice.status}
                                  </span>
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                  <span className={isMobile ? "text-[0.65rem]" : ""}>{invoice.clientName} • {formatDate(invoice.date)}</span>
                                </div>
                              </div>
                            </div>
                            <div className={`${isMobile ? "mt-1 ml-11" : "mt-0"} sm:mt-0 flex items-center`}>
                              <p className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}>{formatCurrency(invoice.amount)}</p>
                              <div className="ml-4 flex items-center">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => startEditInvoice(invoice)}
                                  title="Edit"
                                  className="h-8 w-8"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  title="View"
                                  className="h-8 w-8"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={`${isMobile ? "p-4 text-sm" : "p-6"} text-center text-muted-foreground`}>
                          <p>No draft invoices found.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="unpaid" className="m-0 overflow-hidden">
                  <CardContent className="flex-1 overflow-y-auto overflow-x-hidden p-0">
                    <div className="divide-y">
                      {getFilteredInvoices().length > 0 ? (
                        getFilteredInvoices().map((invoice) => (
                          <div
                            key={invoice.id}
                            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${isMobile ? "p-2" : "p-4"} hover:bg-muted/50 transition-colors`}
                          >
                            {/* Same invoice item structure as "all" tab */}
                            <div className="flex items-center">
                              <div className={`${isMobile ? "h-8 w-8" : "h-10 w-10"} rounded-full bg-primary/10 flex items-center justify-center text-primary`}>
                                <BanknoteIcon className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} />
                              </div>
                              <div className="ml-3 min-w-0">
                                <div className="flex items-center">
                                  <p className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}>{invoice.id}</p>
                                  <span className={`ml-2 inline-flex px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800`}>
                                    {invoice.status}
                                  </span>
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                  <span className={isMobile ? "text-[0.65rem]" : ""}>{invoice.clientName} • {formatDate(invoice.date)}</span>
                                </div>
                              </div>
                            </div>
                            <div className={`${isMobile ? "mt-1 ml-11" : "mt-0"} sm:mt-0 flex items-center`}>
                              <p className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}>{formatCurrency(invoice.amount)}</p>
                              <div className="ml-4 flex items-center">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => startEditInvoice(invoice)}
                                  title="Edit"
                                  className="h-8 w-8"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => {
                                    setNewPayment({
                                      invoiceId: invoice.id,
                                      amount: invoice.amount,
                                      date: new Date().toISOString().split('T')[0],
                                      method: "Credit Card",
                                      notes: ""
                                    });
                                    setIsRecordingPayment(true);
                                  }}
                                  title="Record Payment"
                                  className="h-8 w-8"
                                >
                                  <Check className="h-4 w-4 text-green-500" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  title="View"
                                  className="h-8 w-8"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={`${isMobile ? "p-4 text-sm" : "p-6"} text-center text-muted-foreground`}>
                          <p>No unpaid invoices found.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="paid" className="m-0 overflow-hidden">
                  <CardContent className="flex-1 overflow-y-auto overflow-x-hidden p-0">
                    <div className="divide-y">
                      {getFilteredInvoices().length > 0 ? (
                        getFilteredInvoices().map((invoice) => (
                          <div
                            key={invoice.id}
                            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${isMobile ? "p-2" : "p-4"} hover:bg-muted/50 transition-colors`}
                          >
                            {/* Same invoice item structure as "all" tab */}
                            <div className="flex items-center">
                              <div className={`${isMobile ? "h-8 w-8" : "h-10 w-10"} rounded-full bg-primary/10 flex items-center justify-center text-primary`}>
                                <Check className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} />
                              </div>
                              <div className="ml-3 min-w-0">
                                <div className="flex items-center">
                                  <p className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}>{invoice.id}</p>
                                  <span className={`ml-2 inline-flex px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800`}>
                                    {invoice.status}
                                  </span>
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                  <span className={isMobile ? "text-[0.65rem]" : ""}>{invoice.clientName} • {formatDate(invoice.date)}</span>
                                </div>
                              </div>
                            </div>
                            <div className={`${isMobile ? "mt-1 ml-11" : "mt-0"} sm:mt-0 flex items-center`}>
                              <p className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}>{formatCurrency(invoice.amount)}</p>
                              <div className="ml-4 flex items-center">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => startEditInvoice(invoice)}
                                  title="Edit"
                                  className="h-8 w-8"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  title="View"
                                  className="h-8 w-8"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={`${isMobile ? "p-4 text-sm" : "p-6"} text-center text-muted-foreground`}>
                          <p>No paid invoices found.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </div>
          </CardHeader>
        </Card>
      </div>
    </Layout>
  );
};

export default BillingPage;
