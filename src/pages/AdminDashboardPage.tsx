
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboardPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Administration</h1>
        <div className="flex flex-wrap gap-3">
          <Button 
            className="bg-[#FFD700] text-black hover:bg-[#E5C100]"
          >
            System Health Dashboard
          </Button>
          <Button 
            variant="outline" 
            className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10"
          >
            Full System Diagnostics
          </Button>
        </div>
      </div>
      
      <div>
        <Card className="bg-[#1E1E1E] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-[#FFD700] text-xl">Financial Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#A0A0A0] mb-4">
              Generate comprehensive financial reports for various time periods and metrics.
            </p>
            <Button className="bg-[#FFD700] text-black hover:bg-[#E5C100]">
              Generate Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
