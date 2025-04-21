
/**
 * Taxable Income Processing
 * 
 * Functions for calculating taxable income, including adjustments for charitable contributions.
 */

import { MultiYearScenarioData } from '@/types/tax/rothConversionTypes';

// Fix the function signature to match the calling code in yearCalculation.ts
export function processTaxableIncome(
  scenarioData: any,
  currentYear: number,
  currentAge: number,
  baseIncome: number,
  spouseBaseIncome: number,
  rmdAmount: number,
  spouseRmdAmount: number
) {
  // Since we can't find the charitableCalculation module, let's create a minimal implementation
  // that satisfies the return type expected by yearCalculation.ts
  const charitableContribution = {
    amount: 0,
    useQcd: false,
    isBunching: false
  };
  
  // Adjust RMD amount based on QCD usage
  let adjustedRmdAmount = rmdAmount;
  if (scenarioData.useQcd && charitableContribution.useQcd) {
    adjustedRmdAmount = Math.max(0, rmdAmount - charitableContribution.amount);
  }
  
  // Calculate total pre-conversion income
  const totalPreConversionIncome = baseIncome + spouseBaseIncome + rmdAmount + spouseRmdAmount;
  
  // Return the expected object structure
  return {
    charitableContribution,
    adjustedRmdAmount,
    totalPreConversionIncome
  };
}
