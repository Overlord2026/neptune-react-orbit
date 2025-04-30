
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
    <TabsList className="grid grid-cols-5 w-full">
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
              "flex flex-col items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-white",
              isCompleted && !isActive && "text-primary"
            )}
          >
            <div className={cn(
              "h-6 w-6 rounded-full flex items-center justify-center text-xs",
              isActive ? "bg-white text-primary" : 
              isCompleted ? "bg-primary text-white" :
              "bg-muted text-muted-foreground"
            )}>
              {isCompleted && !isActive ? (
                <CheckIcon className="h-3 w-3" />
              ) : (
                index + 1
              )}
            </div>
            <span className="text-xs hidden sm:block">{step.label}</span>
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
};

export default StepIndicator;
