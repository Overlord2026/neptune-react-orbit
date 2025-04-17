
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
            "relative text-[#94a3b8] hover:text-white transition-colors",
            "data-[state=active]:bg-[#0284c7] data-[state=active]:text-white",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            step.id === currentStep ? "bg-[#273549]" : ""
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
