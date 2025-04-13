
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface StepNavigationProps {
  currentStep: string;
  onNavigate: (step: string) => void;
  onCalculate?: () => void;
  isCalculating?: boolean;
  hasCalculated?: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  onNavigate,
  onCalculate,
  isCalculating = false,
  hasCalculated = false,
}) => {
  const getNextStep = (): string => {
    switch (currentStep) {
      case 'bracket-fill': return 'spouse-details';
      case 'spouse-details': return 'rmd';
      case 'rmd': return 'beneficiary';
      case 'beneficiary': return 'results';
      case 'results': return 'summary';
      default: return '';
    }
  };

  const getPrevStep = (): string => {
    switch (currentStep) {
      case 'spouse-details': return 'bracket-fill';
      case 'rmd': return 'spouse-details';
      case 'beneficiary': return 'rmd';
      case 'results': return 'beneficiary';
      case 'summary': return 'results';
      default: return '';
    }
  };

  const isLastStep = currentStep === 'beneficiary';
  const isFirstStep = currentStep === 'bracket-fill';

  return (
    <div className={`flex ${isFirstStep ? 'justify-end' : 'justify-between'} mt-4`}>
      {!isFirstStep && (
        <Button 
          variant="outline" 
          onClick={() => onNavigate(getPrevStep())}
        >
          Back
        </Button>
      )}

      {isLastStep ? (
        <Button 
          onClick={onCalculate}
          className="flex items-center gap-2"
          disabled={isCalculating}
        >
          {isCalculating ? "Calculating..." : "Calculate Results"}
        </Button>
      ) : (
        !['results', 'summary'].includes(currentStep) && (
          <Button 
            onClick={() => onNavigate(getNextStep())}
            className="flex items-center gap-2"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        )
      )}

      {currentStep === 'results' && (
        <Button 
          onClick={() => onNavigate('summary')}
          className="flex items-center gap-2"
        >
          View Summary <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {currentStep === 'summary' && (
        <Button 
          variant="outline"
          onClick={() => onNavigate('bracket-fill')}
        >
          Start New Scenario
        </Button>
      )}
    </div>
  );
};

export default StepNavigation;
