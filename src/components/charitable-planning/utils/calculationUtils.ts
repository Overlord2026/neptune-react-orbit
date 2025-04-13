
import { CharitableScenario } from '../types/CharitableTypes';

/**
 * Calculate the reduction in taxable income based on charitable giving strategy
 */
export const calculateTaxableIncomeReduction = (scenario: CharitableScenario): number => {
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

/**
 * Calculate estimated tax bracket savings based on charitable strategies
 */
export const calculateBracketSavings = (scenario: CharitableScenario): number => {
  // Simple estimation - in reality would need tax bracket data
  const estimatedMarginalRate = 0.24; // Example marginal rate
  return calculateTaxableIncomeReduction(scenario) * estimatedMarginalRate;
};

/**
 * Calculate potential IRMAA surcharge savings from QCD
 */
export const calculateIrmaaSavings = (scenario: CharitableScenario): number => {
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
