
import React from 'react';
import { Button } from "@/components/ui/button";
import { LucideIcon, ArrowLeft, ArrowRight } from 'lucide-react';

interface StepNavButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  isSubmitting?: boolean;
  backLabel?: string;
  nextLabel?: string;
  BackIcon?: LucideIcon;
  NextIcon?: LucideIcon;
  hideBackButton?: boolean;
  disableNextButton?: boolean;
  variant?: 'default' | 'outline' | 'secondary';
}

const StepNavButtons: React.FC<StepNavButtonsProps> = ({ 
  onBack,
  onNext,
  isSubmitting = false,
  backLabel = "Back",
  nextLabel = "Continue",
  BackIcon = ArrowLeft,
  NextIcon = ArrowRight,
  hideBackButton = false,
  disableNextButton = false,
  variant = 'default'
}) => {
  // Determine if the button is a submit button or a regular button
  const isSubmitButton = !onNext;
  
  return (
    <div className="flex justify-between pt-2">
      {!hideBackButton && onBack && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          className="flex items-center"
        >
          <BackIcon className="mr-2 h-4 w-4" />
          {backLabel}
        </Button>
      )}
      
      {hideBackButton && <div></div>}
      
      {isSubmitButton ? (
        <Button 
          type="submit" 
          disabled={isSubmitting || disableNextButton}
          variant={variant}
          className="flex items-center"
        >
          {isSubmitting ? "Processing..." : nextLabel}
          {!isSubmitting && <NextIcon className="ml-2 h-4 w-4" />}
        </Button>
      ) : (
        <Button 
          type="button" 
          onClick={onNext} 
          disabled={isSubmitting || disableNextButton}
          variant={variant}
          className="flex items-center"
        >
          {nextLabel}
          <NextIcon className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default StepNavButtons;
