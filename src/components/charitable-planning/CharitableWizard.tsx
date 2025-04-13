
import React from 'react';
import { Card } from "@/components/ui/card";
import WizardHeader from './WizardHeader';
import WizardNavigation from './WizardNavigation';
import { CharitableProvider, useCharitable } from './context/CharitableContext';
import StepContentManager from './components/StepContentManager';
import { getMutableSteps, shouldSkipQcdStep } from './config/wizardConfig';

// The main wizard component that uses the context
const CharitableWizardContent: React.FC = () => {
  const { currentStep, setCurrentStep, scenario, updateScenario, nextStep, prevStep } = useCharitable();
  
  // Determine if QCD step should be skipped
  const skipQcdStep = shouldSkipQcdStep(scenario.age);
  
  // Get mutable steps for components
  const stepsForComponents = getMutableSteps();

  return (
    <Card className="bg-card border-primary/20">
      <div className="p-6">
        <WizardHeader
          title="Charitable Contribution Planner"
          currentStep={currentStep}
          steps={stepsForComponents}
        />
        
        <StepContentManager
          currentStep={currentStep}
          scenario={scenario}
          updateScenario={updateScenario}
          nextStep={nextStep}
          prevStep={prevStep}
          shouldSkipQcdStep={skipQcdStep}
        />
        
        <WizardNavigation
          steps={stepsForComponents}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          hideSteps={skipQcdStep && currentStep !== 'qcd' ? ['qcd'] : []}
        />
      </div>
    </Card>
  );
};

// Public-facing component that wraps the content with the provider
const CharitableWizard: React.FC = () => {
  return (
    <CharitableProvider>
      <CharitableWizardContent />
    </CharitableProvider>
  );
};

export default CharitableWizard;
