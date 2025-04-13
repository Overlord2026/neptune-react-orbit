
/**
 * Income Calculation
 * 
 * Functions for calculating income components in a Roth conversion scenario.
 */

import { MultiYearScenarioData } from '@/components/tax/roth-conversion/types/ScenarioTypes';
import { calculateRMD } from '../../rmdCalculationUtils';

interface IncomeParams {
  scenarioData: MultiYearScenarioData;
  currentYear: number;
  currentAge: number;
  spouseAge?: number;
  traditionalIRABalance: number;
  spouseTraditionalIRABalance: number;
  i: number; // Year index
}

/**
 * Calculate various income components for a year
 */
export function calculateYearlyIncome({
  scenarioData,
  currentAge,
  spouseAge,
  traditionalIRABalance,
  spouseTraditionalIRABalance,
  i
}: IncomeParams) {
  // Calculate projected income for this year with growth
  const baseIncome = scenarioData.baseAnnualIncome * 
    Math.pow(1 + scenarioData.incomeGrowthRate, i);
  
  // Calculate spouse income if applicable
  let spouseBaseIncome = 0;
  if (scenarioData.includeSpouse && scenarioData.spouseBaseAnnualIncome) {
    spouseBaseIncome = scenarioData.spouseBaseAnnualIncome *
      Math.pow(1 + scenarioData.incomeGrowthRate, i);
  }
  
  // Calculate RMD if applicable
  let rmdAmount = 0;
  if (scenarioData.includeRMDs && currentAge >= scenarioData.rmdStartAge) {
    rmdAmount = calculateRMD(traditionalIRABalance, currentAge);
  }
  
  // Calculate spouse RMD if applicable
  let spouseRmdAmount = 0;
  if (scenarioData.includeSpouse && scenarioData.includeRMDs && 
      spouseAge && spouseAge >= (scenarioData.spouseRmdStartAge || scenarioData.rmdStartAge)) {
    spouseRmdAmount = calculateRMD(spouseTraditionalIRABalance, spouseAge);
  }

  return {
    baseIncome,
    spouseBaseIncome,
    rmdAmount,
    spouseRmdAmount
  };
}
