
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch"; 
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";
import { toast } from "sonner";

const TaxAlertConfigPanel = () => {
  // State for thresholds
  const [thresholds, setThresholds] = React.useState({
    tax_bracket: 5, // 5%
    standard_deduction: 8, // 8%
    retirement_limits: 10, // 10%
    tax_forms: 0, // Any change
    other: 3, // 3%
  });
  
  // State for notification preferences
  const [notifyUsers, setNotifyUsers] = React.useState(true);
  const [emailNotifications, setEmailNotifications] = React.useState(false);
  const [autoCreateAlerts, setAutoCreateAlerts] = React.useState(true);
  
  const handleThresholdChange = (key: string, value: number[]) => {
    setThresholds(prev => ({
      ...prev,
      [key]: value[0]
    }));
  };
  
  const handleSaveConfig = () => {
    // In a real app, this would save the configuration to a database
    console.log("Saving configuration:", {
      thresholds,
      notifyUsers,
      emailNotifications,
      autoCreateAlerts
    });
    
    toast.success("Tax alert configuration saved successfully");
  };
  
  const handleResetDefaults = () => {
    setThresholds({
      tax_bracket: 5,
      standard_deduction: 8,
      retirement_limits: 10,
      tax_forms: 0,
      other: 3,
    });
    setNotifyUsers(true);
    setEmailNotifications(false);
    setAutoCreateAlerts(true);
    
    toast.info("Reset to default configuration");
  };
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Tax Update Alert Configuration</CardTitle>
        <CardDescription>
          Configure how the system handles tax code updates and user notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="thresholds" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="thresholds">Change Detection Thresholds</TabsTrigger>
            <TabsTrigger value="notifications">Notification Settings</TabsTrigger>
            <TabsTrigger value="templates">Alert Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="thresholds">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Tax Bracket Changes ({thresholds.tax_bracket}%)</Label>
                  <span className="text-sm text-muted-foreground">
                    Changes exceeding this percentage are considered major
                  </span>
                </div>
                <Slider 
                  defaultValue={[thresholds.tax_bracket]} 
                  max={20} 
                  step={1}
                  onValueChange={(value) => handleThresholdChange('tax_bracket', value)} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Standard Deduction Changes ({thresholds.standard_deduction}%)</Label>
                  <span className="text-sm text-muted-foreground">
                    Changes exceeding this percentage are considered major
                  </span>
                </div>
                <Slider 
                  defaultValue={[thresholds.standard_deduction]} 
                  max={20} 
                  step={1}
                  onValueChange={(value) => handleThresholdChange('standard_deduction', value)} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Retirement Limits Changes ({thresholds.retirement_limits}%)</Label>
                  <span className="text-sm text-muted-foreground">
                    Changes exceeding this percentage are considered major
                  </span>
                </div>
                <Slider 
                  defaultValue={[thresholds.retirement_limits]} 
                  max={20} 
                  step={1}
                  onValueChange={(value) => handleThresholdChange('retirement_limits', value)} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Tax Forms</Label>
                  <span className="text-sm text-muted-foreground">
                    Any change to tax forms is considered major
                  </span>
                </div>
                <Slider 
                  defaultValue={[0]} 
                  max={5} 
                  step={1}
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Other Tax Updates ({thresholds.other}%)</Label>
                  <span className="text-sm text-muted-foreground">
                    Changes exceeding this percentage are considered major
                  </span>
                </div>
                <Slider 
                  defaultValue={[thresholds.other]} 
                  max={20} 
                  step={1}
                  onValueChange={(value) => handleThresholdChange('other', value)} 
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notify-users">Notify Users of Major Changes</Label>
                  <p className="text-sm text-muted-foreground">
                    Show alerts to users when major tax changes are detected
                  </p>
                </div>
                <Switch 
                  id="notify-users" 
                  checked={notifyUsers} 
                  onCheckedChange={setNotifyUsers} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Send Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email notifications for major tax changes to opted-in users
                  </p>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-create-alerts">Automatically Create Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically create alerts when major tax changes are detected
                  </p>
                </div>
                <Switch 
                  id="auto-create-alerts" 
                  checked={autoCreateAlerts} 
                  onCheckedChange={setAutoCreateAlerts} 
                />
              </div>
              
              <div className="pt-4">
                <Label htmlFor="alert-email">Admin Notification Email</Label>
                <Input 
                  id="alert-email" 
                  type="email" 
                  placeholder="admin@example.com" 
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Receive a notification whenever the system detects major tax changes
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="templates">
            <div className="space-y-6">
              <div>
                <Label htmlFor="major-template">Major Update Template</Label>
                <Input 
                  id="major-template" 
                  defaultValue="Important: Tax changes for {year} may affect your calculations. Learn more." 
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use {"{type}"}, {"{year}"}, {"{percentChange}"} as placeholders
                </p>
              </div>
              
              <div>
                <Label htmlFor="minor-template">Minor Update Template</Label>
                <Input 
                  id="minor-template" 
                  defaultValue="Tax update: Minor changes detected for {year} in {type}." 
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="info-template">Info Update Template</Label>
                <Input 
                  id="info-template" 
                  defaultValue="FYI: {type} has been updated for tax year {year}." 
                  className="mt-1"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-8 pt-4 border-t">
          <Button variant="outline" onClick={handleResetDefaults}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveConfig}>
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxAlertConfigPanel;
