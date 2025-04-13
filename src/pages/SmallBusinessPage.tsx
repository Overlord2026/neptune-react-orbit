
import React from 'react';
import { Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      
      <Card className="border-[#2A2F3C] bg-[#1A1F2C]">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Our Small Business & Side-Hustle tax planning tools are currently under development. 
            Check back soon for comprehensive tools that will help you:
          </p>
          
          <ul className="list-disc pl-5 mt-4 space-y-2 text-muted-foreground">
            <li>Compare tax implications of different business structures (Sole Prop, S-Corp, LLC)</li>
            <li>Calculate self-employment tax and strategies to reduce it</li>
            <li>Estimate Qualified Business Income (QBI) deduction based on your income</li>
            <li>Plan for estimated tax payments to avoid penalties</li>
            <li>Model how business expenses and deductions affect your personal tax situation</li>
            <li>Integrate business income with your overall tax planning strategy</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmallBusinessPage;
