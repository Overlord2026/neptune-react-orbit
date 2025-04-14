
import React from 'react';
import { Briefcase, ArrowRight } from "lucide-react";
import BusinessIncomeWizard from '@/components/tax-planning/business/BusinessIncomeWizard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const SmallBusinessPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center gap-3">
        <Briefcase className="h-8 w-8 text-[#FFD700]" />
        <h1 className="text-3xl font-bold text-white">Small Business & Side-Hustle Tax Planning</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <p className="text-lg text-muted-foreground">
            Plan for your business taxes efficiently. Compare entity structures, estimate self-employment taxes, 
            and understand how your side income affects your overall tax situation.
          </p>
        </div>
        
        <Card className="border-[#2A2F3C] bg-[#1A1F2C]/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Integration Features</CardTitle>
            <CardDescription>Combine with other tax tools</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 text-[#FFD700]" />
                <span>Save business scenarios to your multi-year plan</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 text-[#FFD700]" />
                <span>Track business income alongside personal income, capital gains, and more</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 text-[#FFD700]" />
                <span>Export summaries to share with your accountant or advisor</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Separator />
      
      <Alert className="bg-[#2A2F3C]/70 border-[#3A3F4C]">
        <AlertTitle>Small Business Tax Beta</AlertTitle>
        <AlertDescription>
          This tool is in beta. We're constantly improving our calculations and adding new features. 
          Your feedback helps us improve.
        </AlertDescription>
      </Alert>
      
      <BusinessIncomeWizard />
    </div>
  );
};

export default SmallBusinessPage;
