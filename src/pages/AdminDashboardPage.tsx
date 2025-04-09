
import React from 'react';
import { Button } from '@/components/ui/button';
import StatCard from '../components/StatCard';
import { Wallet, CreditCard, ArrowRightLeft, Percent } from 'lucide-react';
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
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Income" 
          value="$14,250" 
          change="+3.2%" 
          timeframe="vs last month" 
          budget="$15,000 monthly target" 
          icon={<Wallet className="h-4 w-4 text-[#FFD700]" />} 
        />
        
        <StatCard 
          title="Expenses" 
          value="$8,430" 
          change="-1.5%" 
          timeframe="vs last month" 
          budget="$9,000 monthly budget" 
          icon={<CreditCard className="h-4 w-4 text-[#FFD700]" />} 
        />
        
        <StatCard 
          title="Cash Flow" 
          value="$5,820" 
          change="+12.4%" 
          timeframe="vs last month" 
          budget="$6,000 monthly target" 
          icon={<ArrowRightLeft className="h-4 w-4 text-[#FFD700]" />} 
        />
        
        <StatCard 
          title="Savings Rate" 
          value="40.8%" 
          change="+5.3%" 
          timeframe="vs last month" 
          budget="45% target" 
          icon={<Percent className="h-4 w-4 text-[#FFD700]" />} 
        />
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
    </div>
  );
};

export default AdminDashboardPage;
