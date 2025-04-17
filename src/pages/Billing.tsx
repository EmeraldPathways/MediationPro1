
import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, DollarSign, FileText, Eye, Edit, Trash, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
            <p className="text-muted-foreground">
              Manage invoices, track payments, and set billing targets
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isCreatingBill} onOpenChange={setIsCreatingBill}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Bill
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new invoice below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="client">Client</Label>
                    <Select 
                      value={newInvoice.clientName} 
                      onValueChange={(value) => setNewInvoice({...newInvoice, clientName: value})}
                    >
                      <SelectTrigger id="client">
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.name}>
                            {client.name}
                          </SelectItem>
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
                      <SelectTrigger id="matter">
                        <SelectValue placeholder="Select a matter" />
                      </SelectTrigger>
                      <SelectContent>
                        {matters.map(matter => (
                          <SelectItem key={matter.id} value={matter.title}>
                            {matter.title}
                          </SelectItem>
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
                      value={newInvoice.amount || ''} 
                      onChange={(e) => setNewInvoice({...newInvoice, amount: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      value={newInvoice.date} 
                      onChange={(e) => setNewInvoice({...newInvoice, date: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={newInvoice.status} 
                      onValueChange={(value: "Draft" | "Unpaid" | "Paid") => 
                        setNewInvoice({...newInvoice, status: value})
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select a status" />
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
                  <Button type="submit" onClick={handleCreateInvoice}>Create Invoice</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isRecordingPayment} onOpenChange={setIsRecordingPayment}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Record Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Record Payment</DialogTitle>
                  <DialogDescription>
                    Record a payment for an existing invoice.
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
                      <SelectTrigger id="invoice">
                        <SelectValue placeholder="Select an invoice" />
                      </SelectTrigger>
                      <SelectContent>
                        {unpaidInvoices.map(invoice => (
                          <SelectItem key={invoice.id} value={invoice.id}>
                            {invoice.id} - {invoice.clientName} - {formatCurrency(invoice.amount)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="payment-amount">Amount ($)</Label>
                    <Input 
                      id="payment-amount" 
                      type="number" 
                      step="0.01" 
                      value={newPayment.amount || ''} 
                      onChange={(e) => setNewPayment({...newPayment, amount: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="payment-date">Date</Label>
                    <Input 
                      id="payment-date" 
                      type="date" 
                      value={newPayment.date} 
                      onChange={(e) => setNewPayment({...newPayment, date: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Select 
                      value={newPayment.method} 
                      onValueChange={(value) => setNewPayment({...newPayment, method: value})}
                    >
                      <SelectTrigger id="payment-method">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Check">Check</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="payment-notes">Notes</Label>
                    <Textarea 
                      id="payment-notes" 
                      value={newPayment.notes || ''} 
                      onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleRecordPayment}>Record Payment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isEditingInvoice} onOpenChange={setIsEditingInvoice}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Invoice {editInvoice?.id}</DialogTitle>
                  <DialogDescription>
                    Update the invoice details.
                  </DialogDescription>
                </DialogHeader>
                {editInvoice && (
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-client">Client</Label>
                      <Select 
                        value={editInvoice.clientName} 
                        onValueChange={(value) => setEditInvoice({...editInvoice, clientName: value})}
                      >
                        <SelectTrigger id="edit-client">
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map(client => (
                            <SelectItem key={client.id} value={client.name}>
                              {client.name}
                            </SelectItem>
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
                        <SelectTrigger id="edit-matter">
                          <SelectValue placeholder="Select a matter" />
                        </SelectTrigger>
                        <SelectContent>
                          {matters.map(matter => (
                            <SelectItem key={matter.id} value={matter.title}>
                              {matter.title}
                            </SelectItem>
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
                        value={editInvoice.amount || ''} 
                        onChange={(e) => setEditInvoice({...editInvoice, amount: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-date">Date</Label>
                      <Input 
                        id="edit-date" 
                        type="date" 
                        value={editInvoice.date} 
                        onChange={(e) => setEditInvoice({...editInvoice, date: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-status">Status</Label>
                      <Select 
                        value={editInvoice.status} 
                        onValueChange={(value: "Draft" | "Unpaid" | "Paid") => 
                          setEditInvoice({...editInvoice, status: value})
                        }
                      >
                        <SelectTrigger id="edit-status">
                          <SelectValue placeholder="Select a status" />
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
                  <Button type="submit" onClick={handleUpdateInvoice}>Update Invoice</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Draft Bills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{formatCurrency(draftTotal)}</div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setActiveTab("draft")}
                >View</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Unpaid Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{formatCurrency(unpaidTotal)}</div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setActiveTab("unpaid")}
                >View</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{formatCurrency(paidTotal)}</div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setActiveTab("paid")}
                >View</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">All Invoices</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Invoice</th>
                      <th className="text-left p-4 font-medium">Client</th>
                      <th className="text-left p-4 font-medium">Matter</th>
                      <th className="text-left p-4 font-medium">Date</th>
                      <th className="text-left p-4 font-medium">Amount</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-right p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredInvoices().map((invoice) => (
                      <tr key={invoice.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-4">{invoice.id}</td>
                        <td className="p-4">{invoice.clientName}</td>
                        <td className="p-4">{invoice.matter}</td>
                        <td className="p-4">{formatDate(invoice.date)}</td>
                        <td className="p-4">{formatCurrency(invoice.amount)}</td>
                        <td className="p-4">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                            invoice.status === "Paid" 
                              ? "bg-green-100 text-green-800" 
                              : invoice.status === "Unpaid"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => startEditInvoice(invoice)}
                              title="Edit"
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
                              >
                                <Check className="h-4 w-4 text-green-500" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {getFilteredInvoices().length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center p-6 text-muted-foreground">
                          No invoices found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default BillingPage;
