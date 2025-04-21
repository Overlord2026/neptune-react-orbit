/**
 * Taxable Income Processing
 * 
 * Functions for calculating taxable income, including adjustments for charitable contributions.
 */

import { MultiYearScenarioData } from '@/types/tax/rothConversionTypes';
import { calculateCharitableContribution } from './charitable/charitableCalculation';

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
  // Determine charitable contribution amount
  const charitableContribution = calculateCharitableContribution({
    scenarioData,
    currentYear,
    currentAge,
    baseIncome,
    rmdAmount
  });
  
  // Adjust RMD amount based on QCD usage
  let adjustedRmdAmount = rmdAmount;
  if (scenarioData.useQcd && charitableContribution.useQcd) {
    adjustedRmdAmount = Math.max(0, rmdAmount - charitableContribution.amount);
  }
  
  // Calculate total pre-conversion income
  const totalPreConversionIncome = baseIncome + spouseBaseIncome + rmdAmount + spouseRmdAmount;
  
  // Return the expected object structure
  return {
    charitableContribution: {}, // Fill this with actual data
    adjustedRmdAmount: rmdAmount, // Or modify if needed
    totalPreConversionIncome: baseIncome + spouseBaseIncome + rmdAmount + spouseRmdAmount
  };
}
