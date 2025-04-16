/**
 * Single Year Calculation Utilities
 * 
 * Functions for calculating a single year within a multi-year Roth conversion scenario.
 * This file orchestrates the various specialized utility modules to process a full year calculation.
 */

import { MultiYearScenarioData } from '@/components/tax/roth-conversion/types/ScenarioTypes';
import { calculateTaxScenario } from '../taxCalculator';
import { FilingStatusType } from '@/types/tax/filingTypes';

// Import specialized calculation modules
import { calculateYearlyIncome } from './yearCalculation/income/incomeCalculation';
import { determineConversionAmounts } from './conversionUtils';
import { processTaxableIncome } from './yearCalculation/income/taxableIncomeProcessor';
import { calculateCharitableEffect } from './yearCalculation/charitable/charitableProcessor';
import { prepareTaxInput } from './yearCalculation/tax/taxInputPreparation';
import { applyStateTaxInfo } from './yearCalculation/tax/stateTaxUtils';
import { processTaxResults } from './yearCalculation/tax/taxResultProcessor';
import { checkForTaxTraps } from './yearCalculation/tax/taxTrapUtils';

/**
 * Input parameters for a single year calculation
 */
interface YearCalculationInput {
  scenarioData: MultiYearScenarioData;
  currentYear: number;
  currentAge: number;
  spouseAge?: number;
  traditionalIRABalance: number;
  spouseTraditionalIRABalance: number;
  i: number; // Year index
}

/**
 * Process a single year calculation in a multi-year Roth conversion scenario
 */
export function processSingleYearCalculation({
  scenarioData,
  currentYear,
  currentAge,
  spouseAge,
  traditionalIRABalance,
  spouseTraditionalIRABalance,
  i
}: YearCalculationInput) {
  // Calculate income components
  const {
    baseIncome,
    spouseBaseIncome,
    rmdAmount,
    spouseRmdAmount
  } = calculateYearlyIncome({
    scenarioData,
    currentYear,
    currentAge,
    spouseAge,
    traditionalIRABalance,
    spouseTraditionalIRABalance,
    i
  });
  
  // Process taxable income with charitable adjustments
  const { 
    charitableContribution, 
    adjustedRmdAmount,
    totalPreConversionIncome 
  } = processTaxableIncome(
    scenarioData,
    currentYear,
    currentAge,
    baseIncome,
    spouseBaseIncome,
    rmdAmount,
    spouseRmdAmount
  );
  
  // Determine conversion amounts
  const { conversionAmount, spouseConversionAmount } = determineConversionAmounts({
    scenarioData,
    totalPreConversionIncome,
    currentYear,
    baseIncome,
    rmdAmount: adjustedRmdAmount, // Use the adjusted RMD amount
    spouseBaseIncome,
    spouseRmdAmount,
    traditionalIRABalance,
    spouseTraditionalIRABalance
  });
  
  // Calculate total AGI before any charitable impacts
  const baseAGI = totalPreConversionIncome + conversionAmount + (spouseConversionAmount || 0);
  
  // Check for tax traps before charitable contributions
  const { trapResults: beforeCharitableTraps, warnings } = checkForTaxTraps({
    scenarioId: `year_${currentYear}_before`,
    year: currentYear,
    filingStatus: scenarioData.filingStatus,
    baseAGI,
    currentAge,
    isMarried: scenarioData.filingStatus === 'married_joint' || scenarioData.filingStatus === 'married_separate',
    isMedicare: currentAge >= 65
  });
  
  // Calculate charitable effects
  const { charitableImpact, updatedWarnings } = calculateCharitableEffect({
    scenarioData,
    currentYear,
    currentAge,
    baseAGI,
    charitableContribution,
    beforeCharitableTraps,
    warnings
  });
  
  // Prepare tax input with charitable impact
  const { yearTaxInput } = prepareTaxInput({
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
    beforeCharitableTraps,
    charitableImpact
  });
  
  // Apply state tax information if applicable
  const yearTaxInputWithStateTax = applyStateTaxInfo(yearTaxInput, scenarioData);
  
  // Calculate tax results for this scenario and no-conversion scenario
  const results = processTaxResults({
    yearTaxInput: yearTaxInputWithStateTax,
    charitableContribution,
    charitableImpact,
    scenarioName: `Year ${currentYear} Roth Conversion`,
    updatedWarnings,
    rmdAmount
  });

  return {
    baseIncome,
    spouseBaseIncome,
    rmdAmount,
    spouseRmdAmount,
    totalPreConversionIncome,
    conversionAmount,
    spouseConversionAmount,
    ...results
  };
}
