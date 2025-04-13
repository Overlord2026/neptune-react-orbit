
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  disableNext?: boolean;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onBack, 
  disableNext = false 
}) => {
  return (
    <div className="flex justify-between mt-6">
      <Button 
        onClick={onBack} 
        disabled={currentStep === 0}
        variant="outline"
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Button onClick={onNext} disabled={disableNext || currentStep === totalSteps - 1}>
        {currentStep < totalSteps - 1 ? "Next" : "Complete"} <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default WizardNavigation;
