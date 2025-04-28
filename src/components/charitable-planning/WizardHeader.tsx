
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
    <div className="mb-6 bg-[#1a202c] p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-[#f6ad55] mb-2">{title}</h2>
      <div className="flex items-center mb-4">
        <span className="text-sm text-[#e2e8f0]">
          Step {currentIndex + 1} of {steps.length}: {currentStepInfo?.label}
        </span>
      </div>
      <div className="w-full bg-[#2d3748] h-1 rounded-full">
        <div 
          className="bg-[#f6ad55] h-1 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default WizardHeader;
