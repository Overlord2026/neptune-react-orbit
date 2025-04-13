
/**
 * Single Year Calculation Utilities
 * 
 * Functions for calculating a single year within a multi-year Roth conversion scenario.
 */

import { MultiYearScenarioData } from '@/components/tax/roth-conversion/types/ScenarioTypes';
import { calculateTaxScenario } from '../taxCalculator';
import { determineConversionAmounts } from './conversionUtils';
import { calculateCharitableImpact } from './charitableImpactUtils';
import { calculateYearlyIncome } from './yearCalculation/incomeCalculation';
import { processCharitableContribution, checkForCharitableOpportunities } from './yearCalculation/charitableAdjustments';
import { checkForTaxTraps } from './yearCalculation/taxTrapUtils';
import { prepareTaxInput } from './yearCalculation/taxInputPreparation';

interface YearCalculationInput {
  scenarioData: MultiYearScenarioData;
  currentYear: number;
  currentAge: number;
  spouseAge?: number;
  traditionalIRABalance: number;
  spouseTraditionalIRABalance: number;
  i: number; // Year index
}

export function processSingleYearCalculation({
  scenarioData,
  currentYear,
  currentAge,
  spouseAge,
  traditionalIRABalance,
  spouseTraditionalIRABalance,
  i
}: YearCalculationInput) {
  // Step 1: Calculate income components
  const { baseIncome, spouseBaseIncome, rmdAmount, spouseRmdAmount } = calculateYearlyIncome({
    scenarioData,
    currentYear,
    currentAge,
    spouseAge,
    traditionalIRABalance,
    spouseTraditionalIRABalance,
    i
  });
  
  // Step 2: Process charitable contributions and adjust RMD if necessary
  const { charitableContribution, adjustedRmdAmount } = processCharitableContribution(
    scenarioData,
    currentYear,
    currentAge,
    rmdAmount
  );
  
  // Step 3: Calculate total pre-conversion income
  const totalPreConversionIncome = baseIncome + spouseBaseIncome + adjustedRmdAmount + spouseRmdAmount;
  
  // Step 4: Determine conversion amounts
  const { conversionAmount, spouseConversionAmount } = determineConversionAmounts({
    scenarioData,
    totalPreConversionIncome,
    currentYear,
    baseIncome,
    rmdAmount: adjustedRmdAmount,
    spouseBaseIncome,
    spouseRmdAmount,
    traditionalIRABalance,
    spouseTraditionalIRABalance
  });
  
  // Step 5: Calculate total AGI before any charitable impacts
  const baseAGI = totalPreConversionIncome + conversionAmount + (spouseConversionAmount || 0);
  
  // Step 6: Check for tax traps
  const { trapResults: beforeCharitableTraps, warnings } = checkForTaxTraps({
    scenarioId: `year_${currentYear}_before`,
    year: currentYear,
    filingStatus: scenarioData.filingStatus,
    baseAGI,
    currentAge,
    isMarried: scenarioData.filingStatus === 'married',
    isMedicare: currentAge >= 65
  });
  
  // Step 7: Prepare tax input and calculate initial charitable impact
  const { yearTaxInput, charitableImpact } = prepareTaxInput({
    currentYear,
    baseIncome,
    adjustedRmdAmount,
    conversionAmount,
    scenarioData,
    spouseBaseIncome,
    spouseRmdAmount,
    spouseConversionAmount,
    charitableContribution,
    baseAGI,
    beforeCharitableTraps
  });
  
  // Step 8: Calculate tax on this scenario
  const taxResult = calculateTaxScenario(
    yearTaxInput, 
    `Year ${currentYear} Roth Conversion`,
    "multi_year_analysis"
  );
  
  // Step 9: Calculate tax on the same scenario without conversion
  const noConversionInput = { ...yearTaxInput, roth_conversion: 0, spouseRothConversion: 0 };
  const noConversionTaxResult = calculateTaxScenario(
    noConversionInput,
    `Year ${currentYear} No Conversion`,
    "multi_year_analysis"
  );

  // Step 10: Recalculate charitable impact with the actual marginal rate from tax result
  let finalCharitableImpact = charitableImpact;
  let warningsWithOpportunities = [...warnings];
  
  if (scenarioData.useCharitablePlanning && charitableContribution.amount > 0) {
    finalCharitableImpact = calculateCharitableImpact(
      charitableContribution.amount,
      charitableContribution.useQcd,
      charitableContribution.isBunching,
      scenarioData.filingStatus,
      currentYear,
      taxResult.marginal_rate, // Use actual marginal rate
      rmdAmount,
      baseAGI,
      beforeCharitableTraps
    );
    
    // Check for additional charitable opportunities
    const opportunity = checkForCharitableOpportunities(
      beforeCharitableTraps,
      scenarioData.filingStatus,
      currentAge,
      baseAGI,
      currentYear
    );
    
    if (opportunity) {
      warningsWithOpportunities.push(opportunity);
    }
  }
  
  // Step 11: Return the final results
  return {
    baseIncome,
    spouseBaseIncome,
    rmdAmount,
    spouseRmdAmount,
    totalPreConversionIncome,
    conversionAmount,
    spouseConversionAmount,
    taxResult,
    noConversionTaxResult,
    charitableContribution: scenarioData.useCharitablePlanning ? {
      ...charitableContribution,
      ...finalCharitableImpact
    } : undefined,
    warnings: warningsWithOpportunities
  };
}
