
import React, { useState } from 'react';
import EducationResources from '@/components/tax-planning/EducationResources';
import TaxTools from '@/components/tax-planning/TaxTools';

const TaxPlanningLandingPage = () => {
  const [isEducationOpen, setIsEducationOpen] = useState<boolean>(true);

  return (
    <div className="container content-padding section-margin">
      <div className="flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <div className="space-y-0.5">
          <h2 className="text-3xl font-bold tracking-tight neptune-gold">Tax Planning Hub</h2>
          <p className="text-muted-foreground">
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
      </div>
    </div>
  );
};

export default TaxPlanningLandingPage;
