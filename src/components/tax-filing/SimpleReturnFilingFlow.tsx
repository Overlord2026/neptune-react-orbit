import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EligibilityStep from './steps/EligibilityStep';
import PersonalInfoStep from './steps/PersonalInfoStep';
import IncomeStep from './steps/IncomeStep';
import DeductionsStep from './steps/DeductionsStep';
import ReviewStep from './steps/ReviewStep';
import FilingStep from './steps/FilingStep';
import ConfirmationStep from './steps/ConfirmationStep';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';
import TaxDisclaimerWithCheckbox from '@/components/tax/TaxDisclaimerWithCheckbox';

// Define the steps of our filing flow
const steps = [
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'personal', label: 'Personal Info' },
  { id: 'income', label: 'Income' },
  { id: 'deductions', label: 'Deductions' },
  { id: 'review', label: 'Review' },
  { id: 'file', label: 'E-File' },
  { id: 'confirmation', label: 'Confirmation' },
];

// Define the tax return data type
export interface TaxReturnData {
  // Eligibility
  hasOnlyW2Income: boolean | null;
  hasDependents: boolean | null;
  hasSelfEmploymentIncome: boolean | null;
  isEligible: boolean;
  
  // Personal Info
  firstName: string;
  lastName: string;
  ssn: string;
  filingStatus: 'single' | 'married' | 'head_of_household' | '';
  dependents: { name: string; ssn: string; relationship: string }[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  
  // Income
  w2Forms: {
    employer: string;
    wages: number;
    federalWithholding: number;
    stateWithholding: number;
  }[];
  interestIncome: number;
  dividendIncome: number;
  
  // Deductions & Credits
  useStandardDeduction: boolean;
  itemizedDeductions: {
    medicalExpenses: number;
    stateTaxes: number;
    propertyTaxes: number;
    mortgageInterest: number;
    charitableContributions: number;
  };
  childTaxCredit: boolean;
  educationCredit: boolean;
  
  // Results
  calculatedRefund: number;
  calculatedOwed: number;
  
  // Filing
  bankInfo: {
    routingNumber: string;
    accountNumber: string;
    accountType: 'checking' | 'savings' | '';
  };
  
  // Confirmation
  referenceNumber: string;
  
  // Disclaimer
  disclaimerAcknowledged?: boolean;
  
  // Additional properties needed for tax trap checking
  investmentIncome?: number;
  socialSecurityBenefits?: number;
  isOver65?: boolean;
  hasHealthInsurance?: boolean;
}

const SimpleReturnFilingFlow: React.FC = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState('eligibility');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(false);
  const [taxData, setTaxData] = useState<TaxReturnData>({
    // Initialize with default values
    hasOnlyW2Income: null,
    hasDependents: null,
    hasSelfEmploymentIncome: null,
    isEligible: true,
    
    firstName: '',
    lastName: '',
    ssn: '',
    filingStatus: '',
    dependents: [],
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    
    w2Forms: [{ employer: '', wages: 0, federalWithholding: 0, stateWithholding: 0 }],
    interestIncome: 0,
    dividendIncome: 0,
    
    useStandardDeduction: true,
    itemizedDeductions: {
      medicalExpenses: 0,
      stateTaxes: 0,
      propertyTaxes: 0,
      mortgageInterest: 0,
      charitableContributions: 0,
    },
    childTaxCredit: false,
    educationCredit: false,
    
    calculatedRefund: 0,
    calculatedOwed: 0,
    
    bankInfo: {
      routingNumber: '',
      accountNumber: '',
      accountType: '',
    },
    
    referenceNumber: '',
    disclaimerAcknowledged: false,
  });
  
  const handleStepComplete = (stepId: string, data: Partial<TaxReturnData>) => {
    // Update tax data
    setTaxData(prev => ({ ...prev, ...data }));
    
    // Mark step as completed
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId]);
    }
    
    // If this is the review step, ensure disclaimer is acknowledged
    if (stepId === 'review') {
      if (!disclaimerAcknowledged) {
        toast({
          title: "Please acknowledge the disclaimer",
          description: "You must acknowledge the disclaimer before proceeding to e-file.",
          variant: "destructive"
        });
        return;
      } else {
        // Update tax data to include the acknowledgment
        setTaxData(prev => ({ ...prev, disclaimerAcknowledged }));
      }
    }
    
    // Find next step
    const currentIndex = steps.findIndex(step => step.id === stepId);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setCurrentStep(nextStep.id);
      toast({
        title: "Step completed",
        description: `Moving to ${nextStep.label} step`,
      });
    }
  };
  
  const goToStep = (stepId: string) => {
    // Only allow navigation to completed steps or the current step
    if (completedSteps.includes(stepId) || steps.findIndex(s => s.id === stepId) <= steps.findIndex(s => s.id === currentStep)) {
      setCurrentStep(stepId);
    }
  };

  // Render the appropriate step component based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 'eligibility':
        return (
          <EligibilityStep 
            data={taxData} 
            onComplete={(data) => handleStepComplete('eligibility', data)} 
          />
        );
      case 'personal':
        return (
          <PersonalInfoStep 
            data={taxData} 
            onComplete={(data) => handleStepComplete('personal', data)} 
          />
        );
      case 'income':
        return (
          <IncomeStep 
            data={taxData} 
            onComplete={(data) => handleStepComplete('income', data)} 
          />
        );
      case 'deductions':
        return (
          <DeductionsStep 
            data={taxData} 
            onComplete={(data) => handleStepComplete('deductions', data)} 
          />
        );
      case 'review':
        return (
          <>
            <ReviewStep 
              data={taxData} 
              onComplete={(data) => {
                if (disclaimerAcknowledged) {
                  handleStepComplete('review', { ...data, disclaimerAcknowledged });
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
            onComplete={(data) => handleStepComplete('file', data)} 
          />
        );
      case 'confirmation':
        return (
          <ConfirmationStep 
            data={taxData} 
            onComplete={(data) => handleStepComplete('confirmation', data)} 
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Step indicators */}
      <Tabs value={currentStep} className="w-full">
        <TabsList className="grid grid-cols-7 w-full">
          {steps.map((step) => (
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
        
        {steps.map((step) => (
          <TabsContent key={step.id} value={step.id} className="mt-4">
            <Card>
              <CardContent className="pt-6">
                {step.id === currentStep && renderStepContent()}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SimpleReturnFilingFlow;
