
import React, { useState } from 'react';
import { BusinessIncomeInput, BusinessTaxResult, calculateSmallBusinessTax } from '@/utils/tax/businessTaxCalculator';
import { Card, CardContent } from '@/components/ui/card';
import BusinessInfoStep from './steps/BusinessInfoStep';
import ExpensesStep from './steps/ExpensesStep';
import EntityComparisonStep from './steps/EntityComparisonStep';
import MultiYearPlanStep from './steps/MultiYearPlanStep';
import ResultsSummary from './steps/ResultsSummary';

// Type for the steps in the wizard
type BusinessWizardStep = 'business-info' | 'expenses' | 'entity-comparison' | 'multi-year-plan' | 'results';

// Initial business input state
const initialBusinessInput: BusinessIncomeInput = {
  businessType: 'sole_proprietorship',
  income: 50000,
  expenses: {
    advertising: 0,
    carAndTruck: 0,
    commissions: 0,
    contractLabor: 0,
    insurance: 0,
    legalAndProfessional: 0,
    officeExpenses: 0,
    rentOrLease: 0,
    repairs: 0,
    supplies: 0,
    taxes: 0,
    travel: 0,
    meals: 0,
    utilities: 0,
    otherExpenses: 0,
  },
  year: 2024,
  useHomeOffice: false,
  homeOfficePercent: 0,
  homeOfficeExpenses: 0,
  taxRate: 0.22,
  projectedGrowth: 0.03,
};

const initialTaxResult: BusinessTaxResult = {
  netProfit: 0,
  selfEmploymentTax: 0,
  selfEmploymentTaxDeduction: 0,
  payrollTaxes: 0,
  qbiDeduction: null,
  netTaxableIncome: 0,
  effectiveTaxRate: 0,
  warnings: []
};

const BusinessIncomeWizard: React.FC = () => {
  const [step, setStep] = useState<BusinessWizardStep>('business-info');
  const [businessInput, setBusinessInput] = useState<BusinessIncomeInput>(initialBusinessInput);
  const [taxResult, setTaxResult] = useState<BusinessTaxResult>(initialTaxResult);
  const [isSaving, setIsSaving] = useState(false);

  // Handle step changes
  const goToNext = () => {
    switch (step) {
      case 'business-info':
        setStep('expenses');
        break;
      case 'expenses':
        calculateTaxResults();
        setStep('entity-comparison');
        break;
      case 'entity-comparison':
        setStep('multi-year-plan');
        break;
      case 'multi-year-plan':
        setStep('results');
        break;
      case 'results':
        resetWizard();
        break;
    }
  };

  const goToPrev = () => {
    switch (step) {
      case 'expenses':
        setStep('business-info');
        break;
      case 'entity-comparison':
        setStep('expenses');
        break;
      case 'multi-year-plan':
        setStep('entity-comparison');
        break;
      case 'results':
        setStep('multi-year-plan');
        break;
    }
  };

  const resetWizard = () => {
    setBusinessInput(initialBusinessInput);
    setTaxResult(initialTaxResult);
    setStep('business-info');
  };

  // Calculate tax results based on inputs
  const calculateTaxResults = () => {
    const result = calculateSmallBusinessTax(businessInput);
    setTaxResult(result);
  };

  // Update business input state
  const updateBusinessInput = (newData: Partial<BusinessIncomeInput>) => {
    setBusinessInput(prev => ({
      ...prev,
      ...newData
    }));
  };

  // Update expense in business input
  const updateExpense = (expenseKey: string, value: number) => {
    setBusinessInput(prev => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        [expenseKey]: value
      }
    }));
  };

  // Render content based on current step
  const renderStepContent = () => {
    switch (step) {
      case 'business-info':
        return (
          <BusinessInfoStep 
            businessInput={businessInput}
            onChange={updateBusinessInput}
            onNext={goToNext}
          />
        );
      case 'expenses':
        return (
          <ExpensesStep 
            businessInput={businessInput}
            onChange={updateBusinessInput}
            updateExpense={updateExpense}
            onNext={goToNext}
            onPrev={goToPrev}
          />
        );
      case 'entity-comparison':
        return (
          <EntityComparisonStep 
            businessInput={businessInput}
            taxResult={taxResult}
            onChange={updateBusinessInput}
            onNext={goToNext}
            onPrev={goToPrev}
          />
        );
      case 'multi-year-plan':
        return (
          <MultiYearPlanStep 
            businessInput={businessInput}
            onChange={updateBusinessInput}
            onNext={goToNext}
            onPrev={goToPrev}
          />
        );
      case 'results':
        // Convert business tax result to TaxScenario format for the ResultsSummary component
        const scenarioData = {
          id: `business-${Date.now()}`,
          scenario_name: `${businessInput.businessType} Business ${new Date().toLocaleDateString()}`,
          year: businessInput.year,
          filing_status: "single",
          is_baseline: false,
          total_income: businessInput.income,
          agi: businessInput.income - taxResult.selfEmploymentTaxDeduction,
          taxable_income: taxResult.netTaxableIncome,
          total_tax: taxResult.selfEmploymentTax + (taxResult.netTaxableIncome * (businessInput.taxRate || 0.22)),
          ordinary_tax: taxResult.netTaxableIncome * (businessInput.taxRate || 0.22),
          capital_gains_tax: 0,
          marginal_rate: businessInput.taxRate || 0.22,
          effective_rate: taxResult.effectiveTaxRate,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        return (
          <ResultsSummary
            title="Business Tax Summary"
            description="Review your estimated business tax liability"
            scenarioData={scenarioData}
            onContinue={resetWizard}
            isSaving={isSaving}
            setIsSaving={setIsSaving}
          />
        );
      default:
        return <p>Unknown step</p>;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {renderStepContent()}
      </CardContent>
    </Card>
  );
};

export default BusinessIncomeWizard;
