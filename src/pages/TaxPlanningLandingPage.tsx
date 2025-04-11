
import React, { useState } from 'react';
import { FileCheck } from "lucide-react";
import EducationResources from '@/components/tax-planning/EducationResources';
import TaxTools from '@/components/tax-planning/TaxTools';
import TaxUpdateDemo from '@/components/tax/TaxUpdateDemo';
import AccountingSoftwareIntegration from '@/components/tax-planning/AccountingSoftwareIntegration';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

const TaxPlanningLandingPage = () => {
  const [isEducationOpen, setIsEducationOpen] = useState<boolean>(true);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <div className="space-y-0.5">
          <h2 className="text-3xl font-semibold tracking-tight text-white flex items-center gap-2">
            <FileCheck className="w-8 h-8 text-[#007BFF]" />
            Tax Planning Hub
          </h2>
          <p className="text-[#B0B0B0]">
            Optimize your tax strategy with our suite of advanced tools.
          </p>
        </div>
      </div>
      <div className="py-4 space-y-8">
        <Card className="border border-[#2A2F3C] bg-[#1A1F2C]">
          <CardHeader>
            <CardTitle className="text-[#E5E5E5]">Education Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <EducationResources 
              isOpen={isEducationOpen}
              onOpenChange={setIsEducationOpen}
            />
          </CardContent>
        </Card>
        
        <Card className="border border-[#2A2F3C] bg-[#1A1F2C]">
          <CardHeader>
            <CardTitle className="text-[#E5E5E5]">Tax Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <TaxTools />
          </CardContent>
        </Card>
        
        <Card className="border border-[#2A2F3C] bg-[#1A1F2C]">
          <CardHeader>
            <CardTitle className="text-[#E5E5E5]">Tax Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <TaxUpdateDemo userId="current-user" />
          </CardContent>
        </Card>
        
        <Card className="border border-[#2A2F3C] bg-[#1A1F2C]">
          <CardHeader>
            <CardTitle className="text-[#E5E5E5]">Software Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <AccountingSoftwareIntegration />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaxPlanningLandingPage;
