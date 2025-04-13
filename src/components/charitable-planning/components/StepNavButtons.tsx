
import React from 'react';
import { Button } from "@/components/ui/button";

interface StepNavButtonsProps {
  onBack: () => void;
  isSubmitting?: boolean;
}

const StepNavButtons: React.FC<StepNavButtonsProps> = ({ 
  onBack,
  isSubmitting = false
}) => {
  return (
    <div className="flex justify-between pt-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onBack}
      >
        Back
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Continue to Results"}
      </Button>
    </div>
  );
};

export default StepNavButtons;
