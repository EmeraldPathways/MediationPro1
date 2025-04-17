import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Upload, X } from "lucide-react";

const SettingsPage = () => {
  const [logo, setLogo] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogo(null);
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-6 w-full md:w-[700px]">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="first-name">
                      First Name
                    </label>
                    <Input id="first-name" placeholder="John" defaultValue="Andrew" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="last-name">
                      Last Name
                    </label>
                    <Input id="last-name" placeholder="Smith" defaultValue="Rooney" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="john.smith@example.com" defaultValue="andrew@mediator-mate.com" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="phone">
                    Phone Number
                  </label>
                  <Input id="phone" placeholder="(555) 123-4567" defaultValue="(555) 987-6543" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="bio">
                    Professional Bio
                  </label>
                  <Textarea 
                    id="bio" 
                    placeholder="Tell clients about your background and experience"
                    defaultValue="Professional mediator with over 10 years of experience specializing in family law and business disputes."
                    className="min-h-[100px]"
                  />
                </div>
                
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
                <CardDescription>
                  Update your professional details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="profession">
                      Profession
                    </label>
                    <Input id="profession" placeholder="Mediator" defaultValue="Mediator" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="company">
                      Company/Organization
                    </label>
                    <Input id="company" placeholder="Mediation Services LLC" defaultValue="Mediator Mate Solutions" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="specialization">
                      Specialization
                    </label>
                    <Select defaultValue="family">
                      <SelectTrigger id="specialization">
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="family">Family Mediation</SelectItem>
                        <SelectItem value="business">Business Mediation</SelectItem>
                        <SelectItem value="workplace">Workplace Mediation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="experience">
                      Years of Experience
                    </label>
                    <Input id="experience" placeholder="5" defaultValue="10" />
                  </div>
                </div>
                
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Update your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="username">
                    Username
                  </label>
                  <Input id="username" defaultValue="andrew_mediator" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="password">
                    Change Password
                  </label>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="password-confirm">
                    Confirm Password
                  </label>
                  <Input id="password-confirm" type="password" placeholder="••••••••" />
                </div>
                
                <Button>Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="branding" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Business Branding</CardTitle>
                <CardDescription>
                  Customize how your business appears on documents and client communications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="logo" className="text-sm font-medium">Company Logo</Label>
                  {logo ? (
                    <div className="relative w-60">
                      <img 
                        src={logo} 
                        alt="Company logo" 
                        className="max-h-40 max-w-full object-contain border rounded p-2" 
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-foreground/10 hover:bg-foreground/20"
                        onClick={removeLogo}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-60 h-40 border border-dashed rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                      <Label 
                        htmlFor="logo" 
                        className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
                      >
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Click to upload your logo</span>
                        <span className="text-xs text-muted-foreground mt-1">SVG, PNG or JPG (max. 2MB)</span>
                      </Label>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Business Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business-name">Business Name</Label>
                    <Input id="business-name" placeholder="Mediator Mate Solutions Ltd." />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business-address">Business Address</Label>
                    <Textarea 
                      id="business-address" 
                      placeholder="123 Mediation Street&#10;City, State 12345&#10;Country"
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="business-email">Business Email</Label>
                      <Input id="business-email" type="email" placeholder="contact@yourcompany.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-phone">Business Phone</Label>
                      <Input id="business-phone" placeholder="(555) 123-4567" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="business-website">Website</Label>
                      <Input id="business-website" type="url" placeholder="https://yourcompany.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-registration">Company Registration Number</Label>
                      <Input id="business-registration" placeholder="12345678" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">VAT Information</h3>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox id="vat-registered" />
                    <Label htmlFor="vat-registered" className="text-sm font-medium">My business is VAT registered</Label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vat-number">VAT Number</Label>
                      <Input id="vat-number" placeholder="GB123456789" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vat-rate">Default VAT Rate (%)</Label>
                      <Input id="vat-rate" type="number" placeholder="20" />
                    </div>
                  </div>
                </div>
                
                <Button>Save Branding Information</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>
                  Manage your payment methods and billing details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Current Plan</h4>
                    <p className="text-sm text-muted-foreground">Professional ($29/month)</p>
                  </div>
                  <Button variant="outline">Change Plan</Button>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Payment Method</h4>
                  <div className="flex items-center justify-between border p-3 rounded">
                    <div className="flex items-center">
                      <div className="h-8 w-12 rounded bg-muted"></div>
                      <span className="ml-2">•••• •••• •••• 4242</span>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Billing Address</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billing-name">Name on Card</Label>
                      <Input id="billing-name" placeholder="John Smith" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billing-email">Billing Email</Label>
                      <Input id="billing-email" type="email" placeholder="john.smith@example.com" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="billing-address">Street Address</Label>
                    <Input id="billing-address" placeholder="123 Main St" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billing-city">City</Label>
                      <Input id="billing-city" placeholder="Anytown" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billing-state">State/Province</Label>
                      <Input id="billing-state" placeholder="CA" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billing-zip">Postal Code</Label>
                      <Input id="billing-zip" placeholder="12345" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="billing-country">Country</Label>
                    <Select defaultValue="us">
                      <SelectTrigger id="billing-country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4">
                  <Button variant="outline">Billing History</Button>
                  <Button>Save Billing Information</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Control how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Email Notifications</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="email-new-case" defaultChecked />
                      <label htmlFor="email-new-case" className="text-sm">New case assignments</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="email-meeting" defaultChecked />
                      <label htmlFor="email-meeting" className="text-sm">Meeting reminders</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="email-documents" defaultChecked />
                      <label htmlFor="email-documents" className="text-sm">Document updates</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="email-task" />
                      <label htmlFor="email-task" className="text-sm">Task assignments</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">System Notifications</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="system-meetings" defaultChecked />
                      <label htmlFor="system-meetings" className="text-sm">Meeting alerts</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="system-tasks" defaultChecked />
                      <label htmlFor="system-tasks" className="text-sm">Task deadlines</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="system-updates" defaultChecked />
                      <label htmlFor="system-updates" className="text-sm">System updates</label>
                    </div>
                  </div>
                </div>
                
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
                <CardDescription>
                  Manage your Mediator Mate subscription plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Current Plan</h4>
                    <p className="text-sm text-muted-foreground">Professional ($29/month)</p>
                  </div>
                  <Button variant="outline">Change Plan</Button>
                </div>
                <Button variant="destructive">Cancel Subscription</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
