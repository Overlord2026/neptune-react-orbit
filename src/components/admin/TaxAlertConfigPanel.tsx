import React, { useState } from 'react';
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DynamicContent from "@/components/DynamicContent";
import { formatAlertTemplate, TaxAlertTemplateVars } from "@/utils/taxUpdateUtils";

interface TaxAlertConfigProps {
  type?: string;
  year?: number;
  percentChange?: number;
}

const TaxAlertConfigPanel: React.FC<TaxAlertConfigProps> = ({ 
  type: initialType = "tax_bracket", 
  year: initialYear = new Date().getFullYear(), 
  percentChange: initialPercentChange = 5 
}) => {
  // State for preview values
  const [previewType, setPreviewType] = useState<string>(initialType);
  const [previewYear, setPreviewYear] = useState<number>(initialYear);
  const [previewPercentChange, setPreviewPercentChange] = useState<number>(initialPercentChange);

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
  
  // State for alert templates
  const [majorTemplate, setMajorTemplate] = React.useState("Important: {type} changed by {percentChange}% for tax year {year}.");
  const [minorTemplate, setMinorTemplate] = React.useState("Tax update: Minor changes detected for {year} in {type}.");
  const [infoTemplate, setInfoTemplate] = React.useState("FYI: {type} has been updated for tax year {year}.");
  
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
      autoCreateAlerts,
      templates: {
        major: majorTemplate,
        minor: minorTemplate,
        info: infoTemplate
      }
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
    setMajorTemplate("Important: {type} changed by {percentChange}% for tax year {year}.");
    setMinorTemplate("Tax update: Minor changes detected for {year} in {type}.");
    setInfoTemplate("FYI: {type} has been updated for tax year {year}.");
    
    toast.info("Reset to default configuration");
  };

  // Format example preview with actual values using our utility function
  const formatPreview = (template: string) => {
    const variables: TaxAlertTemplateVars = {
      type: previewType,
      year: previewYear,
      percentChange: previewPercentChange
    };
    return formatAlertTemplate(template, variables);
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
            <TabsTrigger value="preview">Preview Settings</TabsTrigger>
          </TabsList>
          
          {/* Thresholds Tab */}
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
          
          {/* Notifications Tab */}
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
          
          {/* Templates Tab */}
          <TabsContent value="templates">
            <div className="space-y-6">
              <div>
                <Label htmlFor="major-template">Major Update Template</Label>
                <Input 
                  id="major-template" 
                  value={majorTemplate}
                  onChange={(e) => setMajorTemplate(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use {"{type}"}, {"{year}"}, {"{percentChange}"} as placeholders
                </p>
                <div className="text-xs text-muted-foreground mt-1 p-2 bg-slate-50 rounded border">
                  <p className="font-semibold">Preview:</p>
                  <p>{formatPreview(majorTemplate)}</p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="minor-template">Minor Update Template</Label>
                <Input 
                  id="minor-template" 
                  value={minorTemplate}
                  onChange={(e) => setMinorTemplate(e.target.value)}
                  className="mt-1"
                />
                <div className="text-xs text-muted-foreground mt-1 p-2 bg-slate-50 rounded border">
                  <p className="font-semibold">Preview:</p>
                  <p>{formatPreview(minorTemplate)}</p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="info-template">Info Update Template</Label>
                <Input 
                  id="info-template" 
                  value={infoTemplate}
                  onChange={(e) => setInfoTemplate(e.target.value)}
                  className="mt-1"
                />
                <div className="text-xs text-muted-foreground mt-1 p-2 bg-slate-50 rounded border">
                  <p className="font-semibold">Preview:</p>
                  <p>{formatPreview(infoTemplate)}</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Preview Settings Tab */}
          <TabsContent value="preview">
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="preview-type">Update Type</Label>
                  <Select 
                    value={previewType} 
                    onValueChange={setPreviewType}
                  >
                    <SelectTrigger id="preview-type" className="w-full mt-1">
                      <SelectValue placeholder="Select update type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tax_bracket">Tax Bracket</SelectItem>
                      <SelectItem value="standard_deduction">Standard Deduction</SelectItem>
                      <SelectItem value="retirement_limits">Retirement Limits</SelectItem>
                      <SelectItem value="tax_forms">Tax Forms</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="preview-year">Tax Year</Label>
                  <Input
                    id="preview-year"
                    type="number"
                    value={previewYear}
                    onChange={(e) => setPreviewYear(parseInt(e.target.value, 10) || initialYear)}
                    className="mt-1"
                    min="2020"
                    max="2030"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="preview-percent">Percent Change ({previewPercentChange}%)</Label>
                  </div>
                  <Slider
                    id="preview-percent"
                    defaultValue={[previewPercentChange]}
                    value={[previewPercentChange]}
                    onValueChange={(value) => setPreviewPercentChange(value[0])}
                    max={20}
                    step={0.5}
                    className="mt-2"
                  />
                </div>
                
                <div className="pt-6 border-t">
                  <h3 className="text-md font-medium mb-3">Template Previews</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 border border-red-100 rounded-md">
                      <p className="text-sm font-semibold text-red-800">Major:</p>
                      <p className="text-sm">{formatPreview(majorTemplate)}</p>
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-md">
                      <p className="text-sm font-semibold text-amber-800">Minor:</p>
                      <p className="text-sm">{formatPreview(minorTemplate)}</p>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                      <p className="text-sm font-semibold text-blue-800">Info:</p>
                      <p className="text-sm">{formatPreview(infoTemplate)}</p>
                    </div>
                  </div>
                </div>
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
