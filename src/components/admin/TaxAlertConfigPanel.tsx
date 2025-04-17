import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

import ThresholdSettings from './tax-alert-config/ThresholdSettings';
import NotificationSettings from './tax-alert-config/NotificationSettings';
import TemplateSettings from './tax-alert-config/TemplateSettings';
import PreviewSettings from './tax-alert-config/PreviewSettings';
import ActionButtons from './tax-alert-config/ActionButtons';

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
          
          <TabsContent value="thresholds">
            <ThresholdSettings 
              thresholds={thresholds} 
              onThresholdChange={handleThresholdChange} 
            />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationSettings 
              notifyUsers={notifyUsers}
              setNotifyUsers={setNotifyUsers}
              emailNotifications={emailNotifications}
              setEmailNotifications={setEmailNotifications}
              autoCreateAlerts={autoCreateAlerts}
              setAutoCreateAlerts={setAutoCreateAlerts}
            />
          </TabsContent>
          
          <TabsContent value="templates">
            <TemplateSettings 
              majorTemplate={majorTemplate}
              setMajorTemplate={setMajorTemplate}
              minorTemplate={minorTemplate}
              setMinorTemplate={setMinorTemplate}
              infoTemplate={infoTemplate}
              setInfoTemplate={setInfoTemplate}
              previewType={previewType}
              previewYear={previewYear}
              previewPercentChange={previewPercentChange}
            />
          </TabsContent>
          
          <TabsContent value="preview">
            <PreviewSettings 
              previewType={previewType}
              setPreviewType={setPreviewType}
              previewYear={previewYear}
              setPreviewYear={setPreviewYear}
              previewPercentChange={previewPercentChange}
              setPreviewPercentChange={setPreviewPercentChange}
              initialYear={initialYear}
              majorTemplate={majorTemplate}
              minorTemplate={minorTemplate}
              infoTemplate={infoTemplate}
            />
          </TabsContent>
        </Tabs>
        
        <ActionButtons 
          onSave={handleSaveConfig} 
          onReset={handleResetDefaults} 
        />
      </CardContent>
    </Card>
  );
};

export default TaxAlertConfigPanel;
