
import React from 'react';
import { Card } from "@/components/ui/card";
import WizardHeader from '@/components/charitable-planning/WizardHeader';
import WizardNavigation from '@/components/charitable-planning/WizardNavigation';
import { CharitableProvider } from '@/components/charitable-planning/context/CharitableContext';
import StepContentManager from '@/components/charitable-planning/components/StepContentManager';
import { getMutableSteps } from '@/components/charitable-planning/config/wizardConfig';

export const CharitableContributionWizard = () => {
  // Get mutable steps for components
  const stepsForComponents = getMutableSteps();

  // Re-use existing charitable planning components but in a new context
  return (
    <CharitableProvider>
      <Card className="bg-card border-primary/20">
        <div className="p-6">
          <WizardHeader
            title="Charitable Contribution Planner"
            steps={stepsForComponents}
          />
          <StepContentManager />
          <WizardNavigation 
            steps={stepsForComponents}
          />
        </div>
      </Card>
    </CharitableProvider>
  );
};

export default CharitableContributionWizard;
