
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-[#B0B0B0]">Manage your account and application preferences.</p>
      </div>
      
      <Card className="border-[#2A2F3C] bg-[#1A1F2C]">
        <CardHeader>
          <CardTitle className="text-white">Application Settings</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <h2 className="text-2xl font-semibold text-[#007BFF] mb-4">Settings View Coming Soon</h2>
          <p className="text-[#B0B0B0]">
            This feature is currently under development. Check back later for updates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
