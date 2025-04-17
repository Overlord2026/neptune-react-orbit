
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check } from 'lucide-react';
import { FILING_STEPS, FilingStep } from '../types/TaxReturnTypes';
import { cn } from '@/lib/utils';

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
    <TabsList className="grid grid-cols-7 w-full bg-[#1e293b] border border-[#334155]">
      {FILING_STEPS.map((step) => (
        <TabsTrigger
          key={step.id}
          value={step.id}
          onClick={() => goToStep(step.id)}
          className={cn(
            "relative text-[#0c4a6e] hover:text-[#075985] transition-colors", // Dark blue text with darker hover
            "data-[state=active]:bg-[#e0f2fe] data-[state=active]:text-[#0c4a6e]", // Light blue background with dark blue text when active
            "disabled:opacity-50 disabled:cursor-not-allowed",
            step.id === currentStep ? "bg-[#f0f9ff]" : "" // Very light blue background for current step
          )}
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
