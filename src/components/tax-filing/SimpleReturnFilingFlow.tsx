
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { TaxReturnData, FILING_STEPS, FilingStep } from '@/types/tax/filingTypes';
import StepIndicator from './components/StepIndicator';
import StepManager from './components/StepManager';
import { getInitialTaxData } from './utils/initialState';

const SimpleReturnFilingFlow: React.FC = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<FilingStep>('eligibility');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(false);
  const [taxData, setTaxData] = useState<TaxReturnData>(getInitialTaxData());
  
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
    const currentIndex = FILING_STEPS.findIndex(step => step.id === stepId);
    if (currentIndex < FILING_STEPS.length - 1) {
      const nextStep = FILING_STEPS[currentIndex + 1];
      setCurrentStep(nextStep.id as FilingStep);
      toast({
        title: "Step completed",
        description: `Moving to ${nextStep.label} step`,
      });
    }
  };
  
  const goToStep = (stepId: string) => {
    // Only allow navigation to completed steps or the current step
    if (completedSteps.includes(stepId) || 
        FILING_STEPS.findIndex(s => s.id === stepId) <= 
        FILING_STEPS.findIndex(s => s.id === currentStep)) {
      setCurrentStep(stepId as FilingStep);
    } else {
      toast({
        title: "Complete previous steps first",
        description: "You must complete the previous steps before proceeding.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Step indicators */}
      <Tabs value={currentStep} className="w-full">
        <StepIndicator 
          currentStep={currentStep}
          completedSteps={completedSteps}
          goToStep={goToStep}
        />
        
        {FILING_STEPS.map((step) => (
          <TabsContent key={step.id} value={step.id} className="mt-4">
            <Card>
              <CardContent className="pt-6">
                {step.id === currentStep && (
                  <StepManager
                    currentStep={currentStep}
                    taxData={taxData}
                    onStepComplete={handleStepComplete}
                    disclaimerAcknowledged={disclaimerAcknowledged}
                    setDisclaimerAcknowledged={setDisclaimerAcknowledged}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SimpleReturnFilingFlow;
