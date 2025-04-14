
/**
 * Taxable Income Processor
 * 
 * Functions for processing taxable income, including charitable adjustments.
 */

import { MultiYearScenarioData } from '@/components/tax/roth-conversion/types/ScenarioTypes';
import { getCharitableContributionForYear } from '../../charitableContributionUtils';

/**
 * Process taxable income with charitable contribution adjustments
 */
export function processTaxableIncome(
  scenarioData: MultiYearScenarioData,
  currentYear: number,
  currentAge: number,
  baseIncome: number,
  spouseBaseIncome: number,
  rmdAmount: number,
  spouseRmdAmount: number
) {
  // Get charitable contribution for this year
  const charitableContribution = getCharitableContributionForYear(
    scenarioData,
    currentYear,
    currentAge
  );
  
  // Calculate any reduction to RMD amount if using QCD
  let adjustedRmdAmount = rmdAmount;
  if (charitableContribution.useQcd && currentAge >= 70.5) {
    // QCD can reduce or eliminate RMD up to the contribution amount
    adjustedRmdAmount = Math.max(0, rmdAmount - charitableContribution.amount);
  }

  // Total income before conversion (using adjusted RMD if applicable)
  const totalPreConversionIncome = baseIncome + spouseBaseIncome + adjustedRmdAmount + spouseRmdAmount;

  return { 
    charitableContribution, 
    adjustedRmdAmount,
    totalPreConversionIncome
  };
}
