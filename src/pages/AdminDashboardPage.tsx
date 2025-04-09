
import React from 'react';
import { Button } from '@/components/ui/button';

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
    </div>
  );
};

export default AdminDashboardPage;
