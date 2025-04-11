
import React from 'react';
import { Switch } from "@/components/ui/switch"; 
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

interface NotificationSettingsProps {
  notifyUsers: boolean;
  setNotifyUsers: (value: boolean) => void;
  emailNotifications: boolean;
  setEmailNotifications: (value: boolean) => void;
  autoCreateAlerts: boolean;
  setAutoCreateAlerts: (value: boolean) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  notifyUsers,
  setNotifyUsers,
  emailNotifications,
  setEmailNotifications,
  autoCreateAlerts,
  setAutoCreateAlerts
}) => {
  return (
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
  );
};

export default NotificationSettings;
