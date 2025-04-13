
import React from 'react';

interface WizardHeaderProps {
  currentStep: number;
  stepTitle: string;
  stepDescription: string;
  totalSteps: number;
}

const WizardHeader: React.FC<WizardHeaderProps> = ({ 
  currentStep, 
  stepTitle,
  stepDescription,
  totalSteps 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-[#FFD700] text-[#1A1F2C] font-bold flex items-center justify-center">
          {currentStep + 1}
        </div>
        <div className="ml-3">
          <h2 className="text-xl font-semibold text-white">{stepTitle}</h2>
          <p className="text-[#B0B0B0] text-sm">{stepDescription}</p>
        </div>
      </div>
      <div>
        <span className="text-[#B0B0B0]">Step {currentStep + 1} of {totalSteps}</span>
      </div>
    </div>
  );
};

export default WizardHeader;
