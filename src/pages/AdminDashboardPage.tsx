
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

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
      
      <div className="mt-8">
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
      
      <div className="mt-6">
        <Card className="bg-[#1E1E1E] border-[#333333]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-[#FFD700]" />
              <CardTitle className="text-[#FFD700] text-xl">Financial Reports</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-[#A0A0A0] mb-6">
              Generate comprehensive reports of your family's financial assets, liabilities and cash flows
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-[#FFD700] text-black hover:bg-[#E5C100] w-full">
                Generate Reports
              </Button>
              <Button variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10 w-full">
                Report History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
