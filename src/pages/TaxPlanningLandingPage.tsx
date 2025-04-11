
import React, { useState } from 'react';
import { FileCheck } from "lucide-react";
import EducationResources from '@/components/tax-planning/EducationResources';
import TaxTools from '@/components/tax-planning/TaxTools';
import TaxUpdateDemo from '@/components/tax/TaxUpdateDemo';
import AccountingSoftwareIntegration from '@/components/tax-planning/AccountingSoftwareIntegration';

const TaxPlanningLandingPage = () => {
  const [isEducationOpen, setIsEducationOpen] = useState<boolean>(true);

  return (
    <div className="container content-padding section-margin">
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
      <div className="py-4">
        <EducationResources 
          isOpen={isEducationOpen}
          onOpenChange={setIsEducationOpen}
        />
        <TaxTools />
        <AccountingSoftwareIntegration />
        <TaxUpdateDemo userId="current-user" />
      </div>
    </div>
  );
};

export default TaxPlanningLandingPage;
