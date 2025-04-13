
import React, { useState } from 'react';
import { Tabs } from "@/components/ui/tabs";
import { MultiYearProvider } from './multiYear/context/MultiYearContext';
import StepTabs from './multiYear/navigation/StepTabs';
import TabContentManager from './multiYear/TabContentManager';
import WarningsWrapper from './multiYear/components/WarningsWrapper';

const MultiYearRothConversion: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<string>("bracket-fill");
  
  const navigateToStep = (step: string) => {
    setCurrentStep(step);
  };
  
  const handleFinishCalculation = (context: any) => {
    context.handleCalculate();
    navigateToStep('results');
  };
  
  return (
    <MultiYearProvider>
      <div className="space-y-6">
        <Tabs 
          value={currentStep} 
          onValueChange={setCurrentStep}
          className="w-full"
        >
          <StepTabs 
            currentStep={currentStep} 
            onStepChange={navigateToStep}
          />
          
          <TabContentManager 
            currentStep={currentStep}
            onNavigate={navigateToStep}
            onFinishCalculation={handleFinishCalculation}
          />
        </Tabs>
        
        <WarningsWrapper />
      </div>
    </MultiYearProvider>
  );
};

export default MultiYearRothConversion;
