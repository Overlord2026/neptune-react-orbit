
import React from 'react';
import { Card } from "@/components/ui/card";
import WizardHeader from './WizardHeader';
import WizardNavigation from './WizardNavigation';
import { CharitableProvider, useCharitable } from './context/CharitableContext';
import StepContentManager from './components/StepContentManager';
import { getMutableSteps, shouldSkipQcdStep } from './config/wizardConfig';
import { MultiYearProvider } from '../tax/roth-conversion/multiYear/context/MultiYearContext';
import { TaxTrapChecker } from '../tax/TaxTrapChecker';

// The main wizard component that uses the context
const CharitableWizardContent: React.FC = () => {
  const { currentStep, setCurrentStep, scenario, updateScenario, nextStep, prevStep } = useCharitable();
  
  // Determine if QCD step should be skipped
  const skipQcdStep = shouldSkipQcdStep(scenario.age);
  
  // Get mutable steps for components
  const stepsForComponents = getMutableSteps();

  // Prepare data for tax trap checking if we're on the results step
  const showTaxTraps = currentStep === 'results' && scenario.results;
  const trapCheckerData = showTaxTraps ? {
    year: new Date().getFullYear(),
    filing_status: 'single' as const,
    agi: 100000 - (scenario.results.taxableIncomeReduction || 0),
    magi: 100000 - (scenario.results.taxableIncomeReduction || 0),
    total_income: 100000,
    taxable_income: 100000 - (scenario.results.taxableIncomeReduction || 0) - 12950, // Rough standard deduction
    capital_gains_long: 10000,
    capital_gains_short: 0,
    social_security_amount: 0,
    household_size: 1,
    medicare_enrollment: scenario.age >= 65,
    aca_enrollment: false
  } : null;

  return (
    <Card className="bg-card border-primary/20">
      <div className="p-6">
        <WizardHeader
          title="Charitable Contribution Planner"
          currentStep={currentStep}
          steps={stepsForComponents}
        />
        
        <StepContentManager
          currentStep={currentStep}
          scenario={scenario}
          updateScenario={updateScenario}
          nextStep={nextStep}
          prevStep={prevStep}
          shouldSkipQcdStep={skipQcdStep}
        />
        
        {showTaxTraps && trapCheckerData && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-medium mb-3">Tax Impact Analysis</h3>
            <TaxTrapChecker
              scenarioId="charitable_planning"
              scenarioData={trapCheckerData}
            />
          </div>
        )}
        
        <WizardNavigation
          steps={stepsForComponents}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          hideSteps={skipQcdStep && currentStep !== 'qcd' ? ['qcd'] : []}
        />
      </div>
    </Card>
  );
};

// Public-facing component that wraps the content with the provider
const CharitableWizard: React.FC = () => {
  return (
    <MultiYearProvider>
      <CharitableProvider>
        <CharitableWizardContent />
      </CharitableProvider>
    </MultiYearProvider>
  );
};

export default CharitableWizard;
