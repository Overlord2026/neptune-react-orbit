
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FILING_STEPS } from '@/types/tax/filingTypes';
import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: string;
  completedSteps: string[];
  goToStep: (stepId: string) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  completedSteps,
  goToStep
}) => {
  return (
    <TabsList className="grid grid-cols-5 w-full bg-[#1a202c] border border-[#2d3748] p-1">
      {FILING_STEPS.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = completedSteps.includes(step.id);
        const isDisabled = !isCompleted && step.id !== currentStep;
        
        return (
          <TabsTrigger
            key={step.id}
            value={step.id}
            onClick={() => !isDisabled && goToStep(step.id)}
            disabled={isDisabled}
            className={cn(
              "flex flex-col items-center gap-1.5 py-2 px-1",
              isActive ? "bg-[#4299e1] text-white data-[state=active]:bg-[#4299e1] data-[state=active]:text-white" : 
              isCompleted ? "text-[#4299e1]" :
              "text-[#a0aec0]"
            )}
          >
            <div className={cn(
              "h-7 w-7 rounded-full flex items-center justify-center text-xs transition-colors",
              isActive ? "bg-white text-[#4299e1]" : 
              isCompleted ? "bg-[#4299e1] text-white" :
              "bg-[#2d3748] text-[#a0aec0]"
            )}>
              {isCompleted && !isActive ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            <span className="text-xs font-medium whitespace-nowrap hidden sm:block">
              {step.label}
            </span>
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
};

export default StepIndicator;
