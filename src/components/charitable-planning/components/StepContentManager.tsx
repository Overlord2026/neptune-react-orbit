
import React from 'react';
import { WizardStep } from '../config/wizardConfig';
import { BasicGivingStep } from '../steps/BasicGivingStep';
import { DafBunchingStep } from '../steps/DafBunchingStep';
import { QcdStep } from '../steps/QcdStep';
import CrtStep from '../steps/CrtStep';
import { MultiYearIntegrationStep } from '../steps/MultiYearIntegrationStep';
import { ResultsStep } from '../steps/ResultsStep';
import { CharitableScenario } from '../types/CharitableTypes';
import { calculateBracketSavings, calculateCrtResults, calculateIrmaaSavings, calculateTaxableIncomeReduction } from '../utils/calculationUtils';

interface StepContentManagerProps {
  currentStep: WizardStep;
  scenario: CharitableScenario;
  updateScenario: (data: Partial<CharitableScenario>) => void;
  nextStep: () => void;
  prevStep: () => void;
  shouldSkipQcdStep: boolean;
}

const StepContentManager: React.FC<StepContentManagerProps> = ({ 
  currentStep, 
  scenario, 
  updateScenario, 
  nextStep, 
  prevStep,
  shouldSkipQcdStep
}) => {
  switch (currentStep) {
    case 'basic-giving':
      return (
        <BasicGivingStep 
          scenario={scenario} 
          updateScenario={updateScenario} 
          onNext={nextStep} 
        />
      );
    case 'daf-bunching':
      return (
        <DafBunchingStep 
          scenario={scenario} 
          updateScenario={updateScenario} 
          onNext={nextStep} 
          onBack={prevStep} 
        />
      );
    case 'crt':
      return (
        <CrtStep
          scenario={scenario}
          updateScenario={updateScenario}
          onNext={nextStep}
          onBack={prevStep}
        />
      );
    case 'qcd':
      return (
        <QcdStep 
          scenario={scenario} 
          updateScenario={updateScenario} 
          onNext={nextStep} 
          onBack={prevStep} 
        />
      );
    case 'multi-year':
      return (
        <MultiYearIntegrationStep 
          scenario={scenario} 
          updateScenario={updateScenario} 
          onNext={nextStep} 
          onBack={() => prevStep()} 
        />
      );
    case 'results':
      return (
        <ResultsStep 
          scenario={scenario} 
          onBack={prevStep} 
          recalculate={() => {
            // Calculate potential savings based on scenario data
            const taxableIncomeReduction = calculateTaxableIncomeReduction(scenario);
            const bracketSavings = calculateBracketSavings(scenario);
            const irmaaSavings = calculateIrmaaSavings(scenario);
            
            // Calculate CRT benefits if applicable
            const crtResults = scenario.crt?.useCrt ? calculateCrtResults(scenario) : undefined;
            
            updateScenario({
              results: {
                taxableIncomeReduction,
                bracketSavings,
                irmaaSavings,
                ...(crtResults ? {
                  crtDeduction: crtResults.crtDeduction,
                  crtAnnualPayout: crtResults.crtAnnualPayout,
                  estateTaxSavings: crtResults.estateTaxSavings
                } : {})
              }
            });
          }} 
        />
      );
    default:
      return <div>Unknown step</div>;
  }
};

export default StepContentManager;
