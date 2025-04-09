
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Administration</h1>
        <div className="flex flex-wrap gap-3">
          <Button 
            className="bg-[#FFD700] text-black hover:bg-[#E5C100]"
            asChild
          >
            <Link to="/system-health">System Health Dashboard</Link>
          </Button>
          <Button 
            variant="outline" 
            className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10"
            asChild
          >
            <Link to="/system-diagnostics">Full System Diagnostics</Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/admin/data-feeds" className="block">
          <div className="group relative rounded-lg border p-6 hover:border-[#FFD700] hover:shadow-md transition-all">
            <h3 className="text-lg font-semibold">Data Feeds & Live Updates</h3>
            <p className="mt-2 text-sm text-gray-600">
              Configure and monitor real-time data feeds from IRS, state tax authorities, and other data sources.
            </p>
            <div className="mt-4 flex items-center text-sm text-[#FFD700] group-hover:underline">
              Manage data feeds
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
        
        {/* Placeholder for other admin sections */}
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">User Management</h3>
          <p className="mt-2 text-sm text-gray-600">
            Manage user accounts, permissions, and access controls.
          </p>
          <div className="mt-4 flex items-center text-sm text-gray-400">
            Coming soon
          </div>
        </div>
        
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Analytics & Reporting</h3>
          <p className="mt-2 text-sm text-gray-600">
            View system analytics, usage statistics, and generate reports.
          </p>
          <div className="mt-4 flex items-center text-sm text-gray-400">
            Coming soon
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
