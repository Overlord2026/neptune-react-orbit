
import React from 'react';
import { WizardStep } from './CharitableWizard';

interface WizardNavigationProps {
  steps: { id: string; label: string }[];
  currentStep: WizardStep;
  onStepChange: (step: WizardStep) => void;
  hideSteps?: WizardStep[];
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({ 
  steps, 
  currentStep, 
  onStepChange,
  hideSteps = [] 
}) => {
  const visibleSteps = steps.filter(step => !hideSteps.includes(step.id as WizardStep));
  
  return (
    <div className="flex justify-center mt-8">
      <div className="flex space-x-2">
        {visibleSteps.map((step) => (
          <button
            key={step.id}
            className={`w-3 h-3 rounded-full transition-colors ${
              step.id === currentStep ? 'bg-[#FFD700]' : 'bg-[#242A38]'
            }`}
            onClick={() => onStepChange(step.id as WizardStep)}
            aria-label={`Go to ${step.label}`}
          />
        ))}
      </div>
    </div>
  );
};

export default WizardNavigation;
