
import React from 'react';
import { Card } from "@/components/ui/card";
import WizardHeader from '@/components/charitable-planning/WizardHeader';
import WizardNavigation from '@/components/charitable-planning/WizardNavigation';
import { CharitableProvider, useCharitable } from '@/components/charitable-planning/context/CharitableContext';
import StepContentManager from '@/components/charitable-planning/components/StepContentManager';
import { getMutableSteps } from '@/components/charitable-planning/config/wizardConfig';

// Internal component that uses the context
const CharitableContributionWizardContent: React.FC = () => {
  const { currentStep, setCurrentStep, scenario, updateScenario, nextStep, prevStep } = useCharitable();
  const stepsForComponents = getMutableSteps();

  return (
    <Card className="bg-card border-primary/20">
      <div className="p-6">
        <WizardHeader
          title="Charitable Contribution Planner"
          steps={stepsForComponents}
          currentStep={currentStep}
        />
        <StepContentManager
          currentStep={currentStep}
          scenario={scenario}
          updateScenario={updateScenario}
          nextStep={nextStep}
          prevStep={prevStep}
          shouldSkipQcdStep={scenario.age < 70.5}
          shouldSkipCrtStep={!scenario.advancedStrategies}
        />
        <WizardNavigation 
          steps={stepsForComponents}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          hideSteps={[]}
        />
      </div>
    </Card>
  );
};

// Main exported component that provides the context
export const CharitableContributionWizard: React.FC = () => {
  return (
    <CharitableProvider>
      <CharitableContributionWizardContent />
    </CharitableProvider>
  );
};

export default CharitableContributionWizard;
