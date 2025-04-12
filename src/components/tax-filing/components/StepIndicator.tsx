
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check } from 'lucide-react';
import { FILING_STEPS, FilingStep } from '../types/TaxReturnTypes';

interface StepIndicatorProps {
  currentStep: FilingStep;
  completedSteps: string[];
  goToStep: (stepId: string) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  completedSteps,
  goToStep,
}) => {
  return (
    <TabsList className="grid grid-cols-7 w-full">
      {FILING_STEPS.map((step) => (
        <TabsTrigger
          key={step.id}
          value={step.id}
          onClick={() => goToStep(step.id)}
          className="relative"
          disabled={!completedSteps.includes(step.id) && step.id !== currentStep}
        >
          {step.label}
          {completedSteps.includes(step.id) && (
            <span className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
              <Check className="h-3 w-3 text-white" />
            </span>
          )}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default StepIndicator;
