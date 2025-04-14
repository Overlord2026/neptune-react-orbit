
import React from 'react';
import { Briefcase } from "lucide-react";
import BusinessIncomeWizard from '@/components/tax-planning/business/BusinessIncomeWizard';

const SmallBusinessPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center gap-3">
        <Briefcase className="h-8 w-8 text-[#FFD700]" />
        <h1 className="text-3xl font-bold text-white">Small Business & Side-Hustle Tax Planning</h1>
      </div>
      
      <p className="text-lg text-muted-foreground">
        Plan for your business taxes efficiently. Compare entity structures, estimate self-employment taxes, 
        and understand how your side income affects your overall tax situation.
      </p>
      
      <BusinessIncomeWizard />
    </div>
  );
};

export default SmallBusinessPage;
