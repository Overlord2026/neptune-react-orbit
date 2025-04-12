
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle } from "lucide-react";
import ManageTaxYearsSection from '@/components/settings/ManageTaxYearsSection';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-[#B0B0B0]">Manage your account and application preferences.</p>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-[#1A1F2C]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="admin">Admin Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card className="border-[#2A2F3C] bg-[#1A1F2C]">
            <CardHeader>
              <CardTitle className="text-white">Application Settings</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <h2 className="text-2xl font-semibold text-[#007BFF] mb-4">General Settings Coming Soon</h2>
              <p className="text-[#B0B0B0]">
                This feature is currently under development. Check back later for updates.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="admin">
          <div className="space-y-6">
            <ManageTaxYearsSection />
            
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center text-amber-800">
                  <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                  Administrator Access
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-amber-800">
                <p>
                  Changes to tax years and other administrative settings may affect calculations and data throughout 
                  the entire application. Always use caution when making changes to these settings.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="border-[#2A2F3C] bg-[#1A1F2C]">
            <CardHeader>
              <CardTitle className="text-white">Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <h2 className="text-2xl font-semibold text-[#007BFF] mb-4">Notification Settings Coming Soon</h2>
              <p className="text-[#B0B0B0]">
                This feature is currently under development. Check back later for updates.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
