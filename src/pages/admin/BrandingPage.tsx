import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Upload, Palette, Globe, Check, AlertCircle } from "lucide-react";

export default function BrandingPage() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#0066cc");
  const [secondaryColor, setSecondaryColor] = useState("#4caf50");
  const [accentColor, setAccentColor] = useState("#ff9800");
  const [isSaving, setIsSaving] = useState(false);
  
  // Preview states
  const [logoPreview, setLogoPreview] = useState<string | null>("/placeholder.svg");
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setLogoFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleFaviconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFaviconFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaviconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      
      toast({
        title: "Branding updated",
        description: "Your branding changes have been saved successfully.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Branding</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Customize the appearance of your MediatorPro instance
          </p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="mt-4 sm:mt-0" 
          size={isMobile ? "sm" : "default"}
        >
          {isSaving ? (
            <>
              <span className="animate-spin mr-2">◌</span>
              Saving...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
      
      <Tabs defaultValue="visuals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visuals">Visual Identity</TabsTrigger>
          <TabsTrigger value="text">Text & Messaging</TabsTrigger>
          <TabsTrigger value="email">Email Branding</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visuals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logos & Icons</CardTitle>
              <CardDescription>
                Upload your company logo and favicon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="logo-upload">Company Logo</Label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 transition cursor-pointer">
                    {logoPreview ? (
                      <div className="flex flex-col items-center gap-2">
                        <img 
                          src={logoPreview} 
                          alt="Logo Preview" 
                          className="h-20 object-contain mb-2" 
                        />
                        <Button variant="outline" size="sm" asChild>
                          <label htmlFor="logo-upload" className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-1" />
                            Change Logo
                          </label>
                        </Button>
                      </div>
                    ) : (
                      <label htmlFor="logo-upload" className="flex flex-col items-center gap-2 cursor-pointer">
                        <Upload className="h-12 w-12 text-muted-foreground" />
                        <span className="text-sm font-medium">Upload Logo</span>
                        <span className="text-xs text-muted-foreground">SVG, PNG or JPG (max 2MB)</span>
                      </label>
                    )}
                    <Input 
                      id="logo-upload" 
                      type="file" 
                      accept=".svg,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recommended size: 200x50px, transparent background
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="favicon-upload">Favicon</Label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 transition cursor-pointer">
                    {faviconPreview ? (
                      <div className="flex flex-col items-center gap-2">
                        <img 
                          src={faviconPreview} 
                          alt="Favicon Preview" 
                          className="h-12 w-12 object-contain mb-2" 
                        />
                        <Button variant="outline" size="sm" asChild>
                          <label htmlFor="favicon-upload" className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-1" />
                            Change Favicon
                          </label>
                        </Button>
                      </div>
                    ) : (
                      <label htmlFor="favicon-upload" className="flex flex-col items-center gap-2 cursor-pointer">
                        <Globe className="h-12 w-12 text-muted-foreground" />
                        <span className="text-sm font-medium">Upload Favicon</span>
                        <span className="text-xs text-muted-foreground">ICO, PNG or SVG (max 1MB)</span>
                      </label>
                    )}
                    <Input 
                      id="favicon-upload" 
                      type="file" 
                      accept=".ico,.png,.svg"
                      className="hidden"
                      onChange={handleFaviconChange}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Square image, min 32x32px
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
              <CardDescription>
                Set your brand colors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex">
                    <div 
                      className="w-10 h-10 rounded-l border border-r-0" 
                      style={{ backgroundColor: primaryColor }}
                    />
                    <Input 
                      id="primary-color" 
                      type="text" 
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="rounded-l-none"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Used for primary buttons and accents
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex">
                    <div 
                      className="w-10 h-10 rounded-l border border-r-0" 
                      style={{ backgroundColor: secondaryColor }}
                    />
                    <Input 
                      id="secondary-color" 
                      type="text" 
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="rounded-l-none"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Used for secondary UI elements
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <div className="flex">
                    <div 
                      className="w-10 h-10 rounded-l border border-r-0" 
                      style={{ backgroundColor: accentColor }}
                    />
                    <Input 
                      id="accent-color" 
                      type="text" 
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="rounded-l-none"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Used for highlights and notifications
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <Label>Color Theme Preview</Label>
                <div className="mt-2 p-4 border rounded-lg">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <div className="p-4 rounded-md flex items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>
                        Primary
                      </div>
                      <div className="p-4 rounded-md flex items-center justify-center text-white" style={{ backgroundColor: secondaryColor }}>
                        Secondary
                      </div>
                      <div className="p-4 rounded-md flex items-center justify-center text-white" style={{ backgroundColor: accentColor }}>
                        Accent
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button style={{ backgroundColor: primaryColor, color: 'white', borderColor: primaryColor }}>
                        Primary Button
                      </Button>
                      <Button variant="outline" style={{ borderColor: secondaryColor, color: secondaryColor }}>
                        Secondary Button
                      </Button>
                      <div className="p-2 px-3 rounded-full text-sm" style={{ backgroundColor: accentColor, color: 'white' }}>
                        Accent Label
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="text" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Text</CardTitle>
              <CardDescription>
                Customize the text and terminology used in your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="app-name">Application Name</Label>
                  <Input id="app-name" defaultValue="MediatorPro" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instance-name">Instance Name</Label>
                  <Input id="instance-name" defaultValue="Your Organization" placeholder="Your Organization" />
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="text-sm font-medium mb-3">Terminology Customization</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="term-client">Term for "Client"</Label>
                    <Input id="term-client" defaultValue="Client" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="term-case">Term for "Case"</Label>
                    <Input id="term-case" defaultValue="Case" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="term-session">Term for "Session"</Label>
                    <Input id="term-session" defaultValue="Session" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="term-mediator">Term for "Mediator"</Label>
                    <Input id="term-mediator" defaultValue="Mediator" />
                  </div>
                </div>
              </div>
              
              <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800 mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Changing terminology will update labels throughout the application, but may not affect already generated documents.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Legal Information</CardTitle>
              <CardDescription>
                Update your organization's legal information shown in the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="legal-name">Legal Company Name</Label>
                <Input id="legal-name" defaultValue="Your Company Legal Name" />
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="copyright">Copyright Text</Label>
                  <Input id="copyright" defaultValue="© 2025 Your Company" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="terms-url">Terms of Service URL</Label>
                  <Input id="terms-url" defaultValue="https://example.com/terms" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Branding</CardTitle>
              <CardDescription>
                Customize the appearance of emails sent from your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-header-image">Email Header Image</Label>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-center">
                    Drop your email header image here, or <label htmlFor="email-header" className="text-primary underline cursor-pointer">browse</label>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG or JPG, 600px wide recommended
                  </p>
                  <Input id="email-header" type="file" className="hidden" />
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email-from-name">Email "From" Name</Label>
                  <Input id="email-from-name" defaultValue="MediatorPro" />
                  <p className="text-xs text-muted-foreground">
                    Display name for outgoing emails
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-from-address">Email "From" Address</Label>
                  <Input id="email-from-address" defaultValue="no-reply@example.com" />
                  <p className="text-xs text-muted-foreground">
                    Must be verified in your email provider
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-footer">Email Footer Text</Label>
                <Input id="email-footer" defaultValue="© 2025 Your Company. All rights reserved." />
              </div>
              
              <div className="flex items-center space-x-2 mt-2">
                <input type="checkbox" id="include-social" defaultChecked />
                <Label htmlFor="include-social">Include social media links in email footer</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}