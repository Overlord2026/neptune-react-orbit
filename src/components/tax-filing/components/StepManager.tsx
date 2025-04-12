
import React from 'react';
import { TaxReturnData, FilingStep } from '../types/TaxReturnTypes';
import EligibilityStep from '../steps/EligibilityStep';
import PersonalInfoStep from '../steps/PersonalInfoStep';
import IncomeStep from '../steps/IncomeStep';
import DeductionsStep from '../steps/DeductionsStep';
import ReviewStep from '../steps/ReviewStep';
import FilingStep from '../steps/FilingStep';
import ConfirmationStep from '../steps/ConfirmationStep';
import TaxDisclaimerWithCheckbox from '@/components/tax/TaxDisclaimerWithCheckbox';
import { useToast } from '@/hooks/use-toast';

interface StepManagerProps {
  currentStep: FilingStep;
  taxData: TaxReturnData;
  onStepComplete: (stepId: string, data: Partial<TaxReturnData>) => void;
  disclaimerAcknowledged: boolean;
  setDisclaimerAcknowledged: (value: boolean) => void;
}

const StepManager: React.FC<StepManagerProps> = ({
  currentStep,
  taxData,
  onStepComplete,
  disclaimerAcknowledged,
  setDisclaimerAcknowledged,
}) => {
  const { toast } = useToast();

  switch (currentStep) {
    case 'eligibility':
      return (
        <EligibilityStep 
          data={taxData} 
          onComplete={(data) => onStepComplete('eligibility', data)} 
        />
      );
    case 'personal':
      return (
        <PersonalInfoStep 
          data={taxData} 
          onComplete={(data) => onStepComplete('personal', data)} 
        />
      );
    case 'income':
      return (
        <IncomeStep 
          data={taxData} 
          onComplete={(data) => onStepComplete('income', data)} 
        />
      );
    case 'deductions':
      return (
        <DeductionsStep 
          data={taxData} 
          onComplete={(data) => onStepComplete('deductions', data)} 
        />
      );
    case 'review':
      return (
        <>
          <ReviewStep 
            data={taxData} 
            onComplete={(data) => {
              if (disclaimerAcknowledged) {
                onStepComplete('review', { ...data, disclaimerAcknowledged });
              } else {
                toast({
                  title: "Please acknowledge the disclaimer",
                  description: "You must acknowledge the disclaimer before proceeding to e-file.",
                  variant: "destructive"
                });
              }
            }} 
          />
          
          <div className="mt-6">
            <TaxDisclaimerWithCheckbox
              acknowledged={disclaimerAcknowledged}
              onAcknowledgeChange={setDisclaimerAcknowledged}
            />
          </div>
        </>
      );
    case 'file':
      return (
        <FilingStep 
          data={taxData} 
          onComplete={(data) => onStepComplete('file', data)} 
        />
      );
    case 'confirmation':
      return (
        <ConfirmationStep 
          data={taxData} 
          onComplete={(data) => onStepComplete('confirmation', data)} 
        />
      );
    default:
      return <div>Unknown step</div>;
  }
};

export default StepManager;
