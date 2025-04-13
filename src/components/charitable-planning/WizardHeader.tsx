
import React from 'react';
import { WizardStep } from './config/wizardConfig';

interface WizardHeaderProps {
  title: string;
  currentStep: WizardStep;
  steps: { id: string; label: string }[];
}

const WizardHeader: React.FC<WizardHeaderProps> = ({ title, currentStep, steps }) => {
  // Find current step info
  const currentStepInfo = steps.find(step => step.id === currentStep);
  const currentIndex = steps.findIndex(step => step.id === currentStep);
  
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-[#FFD700] mb-2">{title}</h2>
      <div className="flex items-center mb-4">
        <span className="text-sm text-muted-foreground">
          Step {currentIndex + 1} of {steps.length}: {currentStepInfo?.label}
        </span>
      </div>
      <div className="w-full bg-[#242A38] h-1 rounded-full">
        <div 
          className="bg-[#FFD700] h-1 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default WizardHeader;
