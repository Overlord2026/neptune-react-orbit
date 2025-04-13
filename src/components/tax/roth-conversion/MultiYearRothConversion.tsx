
import React, { useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useMultiYearScenario } from './hooks/useMultiYearScenario';
import StepTabs from './multiYear/navigation/StepTabs';
import StepNavigation from './multiYear/navigation/StepNavigation';
import ScenarioWarnings from './multiYear/components/ScenarioWarnings';
import PartialBracketFillStep from './multiYear/PartialBracketFillStep';
import SpouseDetailsStep from './multiYear/SpouseDetailsStep';
import RMDCalculationStep from './multiYear/RMDCalculationStep';
import BeneficiaryStep from './multiYear/BeneficiaryStep';
import ResultsStep from './multiYear/ResultsStep';
import SummaryStep from './multiYear/SummaryStep';

const MultiYearRothConversion: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<string>("bracket-fill");
  
  // Initialize with default scenario data
  const {
    scenarioData,
    yearlyResults,
    isCalculating,
    hasCalculated,
    handleUpdateScenarioData,
    handleCalculate
  } = useMultiYearScenario({
    startAge: 55,
    startYear: new Date().getFullYear(),
    numYears: 30,
    filingStatus: 'married',
    traditionalIRAStartBalance: 500000,
    rothIRAStartBalance: 100000,
    expectedAnnualReturn: 0.06,
    baseAnnualIncome: 80000,
    incomeGrowthRate: 0.02,
    conversionStrategy: 'bracket_12',
    includeRMDs: true,
    rmdStartAge: 73,
    includeBeneficiary: false,
    beneficiaryAge: 50,
    beneficiaryIncomeTaxRate: 0.24,
    taxInflationAdjustment: true,
    
    includeSpouse: true,
    spouseAge: 53,
    spouseTraditionalIRAStartBalance: 300000,
    spouseRothIRAStartBalance: 50000,
    spouseBaseAnnualIncome: 60000,
    spouseRmdStartAge: 73,
    
    combinedIRAApproach: true,
    
    isInCommunityPropertyState: false,
    splitCommunityIncome: false,
    
    compareMfjVsMfs: false,
    
    includeIrmaa: true
  });
  
  const navigateToStep = (step: string) => {
    setCurrentStep(step);
  };
  
  const handleFinishCalculation = () => {
    handleCalculate();
    navigateToStep('results');
  };
  
  const scenarioName = `Multi-Year Roth Conversion (${scenarioData.startYear} - ${scenarioData.startYear + scenarioData.numYears - 1})`;
  
  return (
    <div className="space-y-6">
      <Tabs 
        value={currentStep} 
        onValueChange={setCurrentStep}
        className="w-full"
      >
        <StepTabs 
          currentStep={currentStep} 
          onStepChange={navigateToStep}
          hasCalculated={hasCalculated}
        />
        
        <TabsContent value="bracket-fill" className="mt-0 space-y-4">
          <PartialBracketFillStep 
            scenarioData={scenarioData} 
            onUpdateScenarioData={handleUpdateScenarioData} 
          />
          <StepNavigation 
            currentStep="bracket-fill" 
            onNavigate={navigateToStep} 
          />
        </TabsContent>
        
        <TabsContent value="spouse-details" className="mt-0 space-y-4">
          <SpouseDetailsStep
            scenarioData={scenarioData}
            onUpdateScenarioData={handleUpdateScenarioData}
          />
          <StepNavigation 
            currentStep="spouse-details" 
            onNavigate={navigateToStep} 
          />
        </TabsContent>
        
        <TabsContent value="rmd" className="mt-0 space-y-4">
          <RMDCalculationStep 
            scenarioData={scenarioData} 
            onUpdateScenarioData={handleUpdateScenarioData} 
          />
          <StepNavigation 
            currentStep="rmd" 
            onNavigate={navigateToStep} 
          />
        </TabsContent>
        
        <TabsContent value="beneficiary" className="mt-0 space-y-4">
          <BeneficiaryStep 
            scenarioData={scenarioData} 
            onUpdateScenarioData={handleUpdateScenarioData} 
          />
          <StepNavigation 
            currentStep="beneficiary" 
            onNavigate={navigateToStep}
            onCalculate={handleFinishCalculation}
            isCalculating={isCalculating}
          />
        </TabsContent>
        
        <TabsContent value="results" className="mt-0 space-y-4">
          <ResultsStep 
            yearlyResults={yearlyResults}
            scenarioData={scenarioData}
            isCalculating={isCalculating}
          />
          <StepNavigation 
            currentStep="results" 
            onNavigate={navigateToStep}
          />
        </TabsContent>
        
        <TabsContent value="summary" className="mt-0 space-y-4">
          <SummaryStep 
            yearlyResults={yearlyResults}
            scenarioData={scenarioData}
          />
          <StepNavigation 
            currentStep="summary" 
            onNavigate={navigateToStep}
          />
        </TabsContent>
      </Tabs>
      
      <ScenarioWarnings
        yearlyResults={yearlyResults}
        scenarioName={scenarioName}
        hasCalculated={hasCalculated}
      />
    </div>
  );
};

export default MultiYearRothConversion;
