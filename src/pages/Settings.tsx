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
import { useIsMobile } from "@/hooks/use-mobile";

const SettingsPage = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const isMobile = useIsMobile();

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
      <div className={`flex flex-col ${isMobile ? "space-y-4" : "space-y-6"}`}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h1 className={`${isMobile ? "text-xl" : "text-3xl"} font-bold tracking-tight`}>Settings</h1>
            <p className="text-muted-foreground text-sm">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className={`grid ${isMobile ? "grid-cols-3 text-xs" : "grid-cols-6"} w-full md:w-[700px]`}>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="subscriptions">{isMobile ? "Subs" : "Subscriptions"}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className={`${isMobile ? "mt-3" : "mt-6"} space-y-4`}>
            <Card>
              <CardHeader className={isMobile ? "p-4" : ""}>
                <CardTitle className={isMobile ? "text-base" : ""}>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className={`space-y-4 ${isMobile ? "p-4 pt-0" : ""}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="first-name">
                      First Name
                    </label>
                    <Input 
                      id="first-name" 
                      placeholder="John" 
                      defaultValue="Andrew" 
                      className={isMobile ? "h-9" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="last-name">
                      Last Name
                    </label>
                    <Input 
                      id="last-name" 
                      placeholder="Smith" 
                      defaultValue="Rooney" 
                      className={isMobile ? "h-9" : ""}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">
                    Email
                  </label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john.smith@example.com" 
                    defaultValue="andrew@mediator-mate.com" 
                    className={isMobile ? "h-9" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="phone">
                    Phone Number
                  </label>
                  <Input 
                    id="phone" 
                    placeholder="(555) 123-4567" 
                    defaultValue="(555) 987-6543" 
                    className={isMobile ? "h-9" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="bio">
                    Professional Bio
                  </label>
                  <Textarea 
                    id="bio" 
                    placeholder="Tell clients about your background and experience"
                    defaultValue="Professional mediator with over 10 years of experience specializing in family law and business disputes."
                    className={`min-h-[100px] ${isMobile ? "text-sm" : ""}`}
                  />
                </div>
                
                <Button size={isMobile ? "sm" : "default"}>Save Changes</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className={isMobile ? "p-4" : ""}>
                <CardTitle className={isMobile ? "text-base" : ""}>Professional Information</CardTitle>
                <CardDescription>
                  Update your professional details
                </CardDescription>
              </CardHeader>
              <CardContent className={`space-y-4 ${isMobile ? "p-4 pt-0" : ""}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="profession">
                      Profession
                    </label>
                    <Input 
                      id="profession" 
                      placeholder="Mediator" 
                      defaultValue="Mediator" 
                      className={isMobile ? "h-9" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="company">
                      Company/Organization
                    </label>
                    <Input 
                      id="company" 
                      placeholder="Mediation Services LLC" 
                      defaultValue="Mediator Mate Solutions" 
                      className={isMobile ? "h-9" : ""}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="specialization">
                      Specialization
                    </label>
                    <Select defaultValue="family">
                      <SelectTrigger 
                        id="specialization" 
                        className={isMobile ? "h-9" : ""}
                      >
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
                    <Input 
                      id="experience" 
                      placeholder="5" 
                      defaultValue="10" 
                      className={isMobile ? "h-9" : ""}
                    />
                  </div>
                </div>
                
                <Button size={isMobile ? "sm" : "default"}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className={`${isMobile ? "mt-3" : "mt-6"} space-y-4`}>
            <Card>
              <CardHeader className={isMobile ? "p-4" : ""}>
                <CardTitle className={isMobile ? "text-base" : ""}>Account Settings</CardTitle>
                <CardDescription>
                  Update your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className={`space-y-4 ${isMobile ? "p-4 pt-0" : ""}`}>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="username">
                    Username
                  </label>
                  <Input 
                    id="username" 
                    defaultValue="andrew_mediator" 
                    className={isMobile ? "h-9" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="password">
                    Change Password
                  </label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className={isMobile ? "h-9" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="password-confirm">
                    Confirm Password
                  </label>
                  <Input 
                    id="password-confirm" 
                    type="password" 
                    placeholder="••••••••" 
                    className={isMobile ? "h-9" : ""}
                  />
                </div>
                
                <Button size={isMobile ? "sm" : "default"}>Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="branding" className={`${isMobile ? "mt-3" : "mt-6"} space-y-4`}>
            <Card>
              <CardHeader className={isMobile ? "p-4" : ""}>
                <CardTitle className={isMobile ? "text-base" : ""}>Business Branding</CardTitle>
                <CardDescription>
                  Customize how your business appears on documents and client communications
                </CardDescription>
              </CardHeader>
              <CardContent className={`space-y-6 ${isMobile ? "p-4 pt-0" : ""}`}>
                <div className="space-y-4">
                  <Label htmlFor="logo" className="text-sm font-medium">Company Logo</Label>
                  {logo ? (
                    <div className={`relative ${isMobile ? "w-40" : "w-60"}`}>
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
                        <X className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                      </Button>
                    </div>
                  ) : (
                    <div className={`flex flex-col items-center justify-center ${isMobile ? "w-40 h-30" : "w-60 h-40"} border border-dashed rounded-lg p-4 cursor-pointer hover:bg-muted/50`}>
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
                        <Upload className={`${isMobile ? "h-8 w-8" : "h-10 w-10"} text-muted-foreground mb-2`} />
                        <span className={`${isMobile ? "text-xs" : "text-sm"} text-muted-foreground`}>Click to upload your logo</span>
                        <span className={`${isMobile ? "text-[10px]" : "text-xs"} text-muted-foreground mt-1`}>SVG, PNG or JPG (max. 2MB)</span>
                      </Label>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className={isMobile ? "text-base font-medium" : "text-lg font-medium"}>Business Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business-name">Business Name</Label>
                    <Input 
                      id="business-name" 
                      placeholder="Mediator Mate Solutions Ltd." 
                      className={isMobile ? "h-9" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business-address">Business Address</Label>
                    <Textarea 
                      id="business-address" 
                      placeholder="123 Mediation Street&#10;City, State 12345&#10;Country"
                      className={`min-h-[80px] ${isMobile ? "text-sm" : ""}`}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="business-email">Business Email</Label>
                      <Input 
                        id="business-email" 
                        type="email" 
                        placeholder="contact@yourcompany.com" 
                        className={isMobile ? "h-9" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-phone">Business Phone</Label>
                      <Input 
                        id="business-phone" 
                        placeholder="(555) 123-4567" 
                        className={isMobile ? "h-9" : ""}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="business-website">Website</Label>
                      <Input 
                        id="business-website" 
                        type="url" 
                        placeholder="https://yourcompany.com" 
                        className={isMobile ? "h-9" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-registration">Company Registration Number</Label>
                      <Input 
                        id="business-registration" 
                        placeholder="12345678" 
                        className={isMobile ? "h-9" : ""}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className={isMobile ? "text-base font-medium" : "text-lg font-medium"}>VAT Information</h3>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox id="vat-registered" />
                    <Label htmlFor="vat-registered" className="text-sm font-medium">My business is VAT registered</Label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vat-number">VAT Number</Label>
                      <Input 
                        id="vat-number" 
                        placeholder="GB123456789" 
                        className={isMobile ? "h-9" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vat-rate">Default VAT Rate (%)</Label>
                      <Input 
                        id="vat-rate" 
                        type="number" 
                        placeholder="20" 
                        className={isMobile ? "h-9" : ""}
                      />
                    </div>
                  </div>
                </div>
                
                <Button size={isMobile ? "sm" : "default"}>Save Branding Information</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className={`${isMobile ? "mt-3" : "mt-6"} space-y-4`}>
            <Card>
              <CardHeader className={isMobile ? "p-4" : ""}>
                <CardTitle className={isMobile ? "text-base" : ""}>Billing Information</CardTitle>
                <CardDescription>
                  Manage your payment methods and billing details
                </CardDescription>
              </CardHeader>
              <CardContent className={`space-y-4 ${isMobile ? "p-4 pt-0" : ""}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={isMobile ? "font-medium text-sm" : "font-medium"}>Current Plan</h4>
                    <p className="text-sm text-muted-foreground">Professional ($29/month)</p>
                  </div>
                  <Button variant="outline" size={isMobile ? "sm" : "default"}>Change Plan</Button>
                </div>
                
                <div className="space-y-4">
                  <h4 className={isMobile ? "font-medium text-sm" : "font-medium"}>Payment Method</h4>
                  <div className="flex items-center justify-between border p-3 rounded">
                    <div className="flex items-center">
                      <div className={`${isMobile ? "h-6 w-10" : "h-8 w-12"} rounded bg-muted`}></div>
                      <span className={`ml-2 ${isMobile ? "text-sm" : ""}`}>•••• •••• •••• 4242</span>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className={isMobile ? "font-medium text-sm" : "font-medium"}>Billing Address</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billing-name">Name on Card</Label>
                      <Input 
                        id="billing-name" 
                        placeholder="John Smith" 
                        className={isMobile ? "h-9" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billing-email">Billing Email</Label>
                      <Input 
                        id="billing-email" 
                        type="email" 
                        placeholder="john.smith@example.com" 
                        className={isMobile ? "h-9" : ""}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="billing-address">Street Address</Label>
                    <Input 
                      id="billing-address" 
                      placeholder="123 Main St" 
                      className={isMobile ? "h-9" : ""}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billing-city">City</Label>
                      <Input 
                        id="billing-city" 
                        placeholder="Anytown" 
                        className={isMobile ? "h-9" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billing-state">State/Province</Label>
                      <Input 
                        id="billing-state" 
                        placeholder="CA" 
                        className={isMobile ? "h-9" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billing-zip">Postal Code</Label>
                      <Input 
                        id="billing-zip" 
                        placeholder="12345" 
                        className={isMobile ? "h-9" : ""}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="billing-country">Country</Label>
                    <Select defaultValue="us">
                      <SelectTrigger 
                        id="billing-country" 
                        className={isMobile ? "h-9" : ""}
                      >
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
                  <Button variant="outline" size={isMobile ? "sm" : "default"}>Billing History</Button>
                  <Button size={isMobile ? "sm" : "default"}>Save Billing Information</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className={`${isMobile ? "mt-3" : "mt-6"} space-y-4`}>
            <Card>
              <CardHeader className={isMobile ? "p-4" : ""}>
                <CardTitle className={isMobile ? "text-base" : ""}>Notification Settings</CardTitle>
                <CardDescription>
                  Control how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className={`space-y-4 ${isMobile ? "p-4 pt-0" : ""}`}>
                <div>
                  <h4 className={`${isMobile ? "text-sm" : ""} font-medium mb-3`}>Email Notifications</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="email-new-case" defaultChecked />
                      <label htmlFor="email-new-case" className={`${isMobile ? "text-xs" : "text-sm"}`}>New case assignments</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="email-meeting" defaultChecked />
                      <label htmlFor="email-meeting" className={`${isMobile ? "text-xs" : "text-sm"}`}>Meeting reminders</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="email-documents" defaultChecked />
                      <label htmlFor="email-documents" className={`${isMobile ? "text-xs" : "text-sm"}`}>Document updates</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="email-task" />
                      <label htmlFor="email-task" className={`${isMobile ? "text-xs" : "text-sm"}`}>Task assignments</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className={`${isMobile ? "text-sm" : ""} font-medium mb-3`}>System Notifications</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="system-meetings" defaultChecked />
                      <label htmlFor="system-meetings" className={`${isMobile ? "text-xs" : "text-sm"}`}>Meeting alerts</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="system-tasks" defaultChecked />
                      <label htmlFor="system-tasks" className={`${isMobile ? "text-xs" : "text-sm"}`}>Task deadlines</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="system-updates" defaultChecked />
                      <label htmlFor="system-updates" className={`${isMobile ? "text-xs" : "text-sm"}`}>System updates</label>
                    </div>
                  </div>
                </div>
                
                <Button size={isMobile ? "sm" : "default"}>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions" className={`${isMobile ? "mt-3" : "mt-6"} space-y-4`}>
            <Card>
              <CardHeader className={isMobile ? "p-4" : ""}>
                <CardTitle className={isMobile ? "text-base" : ""}>Subscription Management</CardTitle>
                <CardDescription>
                  Manage your Mediator Mate subscription plan
                </CardDescription>
              </CardHeader>
              <CardContent className={`space-y-4 ${isMobile ? "p-4 pt-0" : ""}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={isMobile ? "font-medium text-sm" : "font-medium"}>Current Plan</h4>
                    <p className="text-sm text-muted-foreground">Professional ($29/month)</p>
                  </div>
                  <Button variant="outline" size={isMobile ? "sm" : "default"}>Change Plan</Button>
                </div>
                <Button variant="destructive" size={isMobile ? "sm" : "default"}>Cancel Subscription</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
