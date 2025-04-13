
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import WizardHeader from './WizardHeader';
import WizardNavigation from './WizardNavigation';
import { BasicGivingStep } from './steps/BasicGivingStep';
import { DafBunchingStep } from './steps/DafBunchingStep';
import { QcdStep } from './steps/QcdStep';
import { MultiYearIntegrationStep } from './steps/MultiYearIntegrationStep';
import { ResultsStep } from './steps/ResultsStep';
import { CharitableScenario } from './types/CharitableTypes';

// Define wizard steps
export const WIZARD_STEPS = [
  { id: 'basic-giving', label: 'Basic Giving Profile' },
  { id: 'daf-bunching', label: 'Donor-Advised Funds & Bunching' },
  { id: 'qcd', label: 'QCD from IRA' },
  { id: 'multi-year', label: 'Multi-Year Integration' },
  { id: 'results', label: 'Results' },
] as const;

export type WizardStep = typeof WIZARD_STEPS[number]['id'];

const CharitableWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('basic-giving');
  const [scenario, setScenario] = useState<CharitableScenario>({
    annualGiving: {
      type: 'fixed',
      amount: 5000,
    },
    isItemizing: false,
    age: 65,
    dafStrategy: {
      useDaf: false,
      bunchingYears: 1,
      approach: 'annual',
    },
    qcd: {
      amount: 0,
      useQcd: false,
    },
    multiYearPlan: {
      isIntegrated: false,
      years: [],
    },
    results: {
      taxableIncomeReduction: 0,
      bracketSavings: 0,
      irmaaSavings: 0,
    }
  });

  // Update scenario data with new values
  const updateScenario = (data: Partial<CharitableScenario>) => {
    setScenario(prev => ({ ...prev, ...data }));
  };

  // Navigate to next step
  const nextStep = () => {
    const currentIndex = WIZARD_STEPS.findIndex(step => step.id === currentStep);
    if (currentIndex < WIZARD_STEPS.length - 1) {
      setCurrentStep(WIZARD_STEPS[currentIndex + 1].id);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    const currentIndex = WIZARD_STEPS.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(WIZARD_STEPS[currentIndex - 1].id);
    }
  };

  // Conditional rendering of QCD step - only for users over 70½
  const shouldSkipQcdStep = scenario.age < 70.5;

  // Step content based on current step
  const renderStepContent = () => {
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
            onBack={() => setCurrentStep(shouldSkipQcdStep ? 'daf-bunching' : 'qcd')} 
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
              
              updateScenario({
                results: {
                  taxableIncomeReduction,
                  bracketSavings,
                  irmaaSavings
                }
              });
            }} 
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  // Create a non-readonly copy of the steps for the components that expect mutable arrays
  const stepsForComponents = WIZARD_STEPS.map(step => ({
    id: step.id,
    label: step.label
  }));

  return (
    <Card className="bg-card border-primary/20">
      <div className="p-6">
        <WizardHeader
          title="Charitable Contribution Planner"
          currentStep={currentStep}
          steps={stepsForComponents}
        />
        
        {renderStepContent()}
        
        <WizardNavigation
          steps={stepsForComponents}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          hideSteps={shouldSkipQcdStep && currentStep !== 'qcd' ? ['qcd'] : []}
        />
      </div>
    </Card>
  );
};

// Helper calculation functions
const calculateTaxableIncomeReduction = (scenario: CharitableScenario): number => {
  let reduction = 0;
  
  // If itemizing, add charitable contributions to reduction
  if (scenario.isItemizing) {
    if (scenario.annualGiving.type === 'fixed') {
      reduction += scenario.annualGiving.amount;
    } else if (scenario.annualGiving.type === 'variable' && scenario.annualGiving.yearlyAmounts) {
      // Sum up first year's contribution for initial calculation
      reduction += scenario.annualGiving.yearlyAmounts[0]?.amount || 0;
    }
  }
  
  // If using QCD, add QCD amount to reduction (affects AGI directly)
  if (scenario.age >= 70.5 && scenario.qcd.useQcd) {
    reduction += scenario.qcd.amount;
  }
  
  return reduction;
};

const calculateBracketSavings = (scenario: CharitableScenario): number => {
  // Simple estimation - in reality would need tax bracket data
  const estimatedMarginalRate = 0.24; // Example marginal rate
  return calculateTaxableIncomeReduction(scenario) * estimatedMarginalRate;
};

const calculateIrmaaSavings = (scenario: CharitableScenario): number => {
  // Simple estimation - in reality would reference IRMAA thresholds
  let savings = 0;
  if (scenario.age >= 65 && scenario.qcd.useQcd) {
    // Basic logic: if QCD amount helps avoid an IRMAA tier jump
    const estimatedIrmaaThresholdImpact = 800; // Example value
    if (scenario.qcd.amount > 0) {
      savings = estimatedIrmaaThresholdImpact;
    }
  }
  return savings;
};

export default CharitableWizard;
