
import React from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useMultiYearContext } from './context/MultiYearContext';
import StepNavigation from './navigation/StepNavigation';
import PartialBracketFillStep from './PartialBracketFillStep';
import SpouseDetailsStep from './SpouseDetailsStep';
import RMDCalculationStep from './RMDCalculationStep';
import BeneficiaryStep from './BeneficiaryStep';
import ResultsStep from './ResultsStep';
import SummaryStep from './SummaryStep';

interface TabContentManagerProps {
  currentStep: string;
  onNavigate: (step: string) => void;
  onFinishCalculation: () => void;
}

const TabContentManager: React.FC<TabContentManagerProps> = ({
  currentStep,
  onNavigate,
  onFinishCalculation
}) => {
  const {
    scenarioData,
    results,
    isCalculating,
    handleUpdateScenarioData,
    handleCalculate
  } = useMultiYearContext();

  const handleFinishWithCalculation = () => {
    handleCalculate();
    onFinishCalculation();
  };

  return (
    <Tabs value={currentStep} defaultValue="bracket-fill">
      <TabsContent value="bracket-fill" className="mt-0 space-y-4">
        <PartialBracketFillStep 
          scenarioData={scenarioData} 
          onUpdateScenarioData={handleUpdateScenarioData} 
        />
        <StepNavigation 
          currentStep="bracket-fill" 
          onNavigate={onNavigate} 
        />
      </TabsContent>
      
      <TabsContent value="spouse-details" className="mt-0 space-y-4">
        <SpouseDetailsStep
          scenarioData={scenarioData}
          onUpdateScenarioData={handleUpdateScenarioData}
        />
        <StepNavigation 
          currentStep="spouse-details" 
          onNavigate={onNavigate} 
        />
      </TabsContent>
      
      <TabsContent value="rmd" className="mt-0 space-y-4">
        <RMDCalculationStep 
          scenarioData={scenarioData} 
          onUpdateScenarioData={handleUpdateScenarioData} 
        />
        <StepNavigation 
          currentStep="rmd" 
          onNavigate={onNavigate} 
        />
      </TabsContent>
      
      <TabsContent value="beneficiary" className="mt-0 space-y-4">
        <BeneficiaryStep 
          scenarioData={scenarioData} 
          onUpdateScenarioData={handleUpdateScenarioData} 
        />
        <StepNavigation 
          currentStep="beneficiary" 
          onNavigate={onNavigate}
          onCalculate={handleFinishWithCalculation}
          isCalculating={isCalculating}
        />
      </TabsContent>
      
      <TabsContent value="results" className="mt-0 space-y-4">
        <ResultsStep 
          yearlyResults={results}
          scenarioData={scenarioData}
          isCalculating={isCalculating}
        />
        <StepNavigation 
          currentStep="results" 
          onNavigate={onNavigate}
        />
      </TabsContent>
      
      <TabsContent value="summary" className="mt-0 space-y-4">
        <SummaryStep />
        <StepNavigation 
          currentStep="summary" 
          onNavigate={onNavigate}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TabContentManager;
