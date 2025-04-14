
/**
 * Single Year Calculation Utilities
 * 
 * Functions for calculating a single year within a multi-year Roth conversion scenario.
 */

import { MultiYearScenarioData } from '@/components/tax/roth-conversion/types/ScenarioTypes';
import { TaxInput, calculateTaxScenario } from '../taxCalculator';
import { calculateRMD } from '../rmdCalculationUtils';
import { determineConversionAmounts } from './conversionUtils';
import { 
  TaxTrapInput, checkTaxTraps
} from '@/utils/taxTraps';
import { StateCode } from '@/utils/stateTaxData';

// Import additional modular utilities for processing
import { processCharitableContribution, checkForCharitableOpportunities } from './yearCalculation/charitableAdjustments';
import { prepareTaxInput } from './yearCalculation/taxInputPreparation';
import { checkForTaxTraps } from './yearCalculation/taxTrapUtils';
import { applyStateTaxInfo } from './yearCalculation/stateTaxUtils';
import { calculateYearlyIncome } from './yearCalculation/incomeCalculation';
import { 
  getCharitableContributionForYear 
} from './charitableContributionUtils';
import { 
  calculateCharitableImpact 
} from './charitableImpactUtils';
import { 
  calculateCharitableOpportunity 
} from './charitableOpportunityUtils';
import { 
  getStandardDeduction 
} from './deductionUtils';

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
  // Calculate income components using dedicated function
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
  
  // Process charitable contribution and adjust RMD if using QCD
  const { charitableContribution, adjustedRmdAmount } = processCharitableContribution(
    scenarioData,
    currentYear,
    currentAge,
    rmdAmount
  );
  
  // Total income before conversion (using adjusted RMD if applicable)
  const totalPreConversionIncome = baseIncome + spouseBaseIncome + adjustedRmdAmount + spouseRmdAmount;
  
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
    isMarried: scenarioData.filingStatus === 'married',
    isMedicare: currentAge >= 65
  });
  
  // Prepare tax input with charitable impact
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
  
  // Apply state tax information if applicable
  applyStateTaxInfo(yearTaxInput, scenarioData, currentYear);
  
  // Calculate tax on this scenario
  const taxResult = calculateTaxScenario(
    yearTaxInput, 
    `Year ${currentYear} Roth Conversion`,
    "multi_year_analysis"
  );
  
  // Calculate tax on the same scenario without conversion
  const noConversionInput = { ...yearTaxInput, roth_conversion: 0, spouseRothConversion: 0 };
  const noConversionTaxResult = calculateTaxScenario(
    noConversionInput,
    `Year ${currentYear} No Conversion`,
    "multi_year_analysis"
  );

  // Recalculate charitable impact with the actual marginal rate from tax result
  let updatedWarnings = [...warnings];
  let updatedCharitableImpact = charitableImpact;
  
  if (scenarioData.useCharitablePlanning && charitableContribution.amount > 0) {
    updatedCharitableImpact = calculateCharitableImpact(
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
    const opportunityWarning = checkForCharitableOpportunities(
      beforeCharitableTraps,
      scenarioData.filingStatus,
      currentAge,
      baseAGI,
      currentYear
    );
    
    if (opportunityWarning) {
      updatedWarnings.push(opportunityWarning);
    }
  }
  
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
      ...updatedCharitableImpact
    } : undefined,
    warnings: updatedWarnings,
    // Include state tax information in the return
    stateTaxInfo: taxResult.state_tax ? {
      stateCode: taxResult.state_code,
      stateTax: taxResult.state_tax,
      federalTax: taxResult.federal_tax,
      totalTax: taxResult.total_tax,
      stateTaxDifference: taxResult.state_tax - (noConversionTaxResult.state_tax || 0)
    } : undefined
  };
}
