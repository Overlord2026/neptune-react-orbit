
/**
 * Tax Input Preparation
 * 
 * Functions for preparing tax inputs for scenario calculations.
 */

import { MultiYearScenarioData } from '@/components/tax/roth-conversion/types/ScenarioTypes';
import { TaxInput } from '../../taxCalculator';
import { getStandardDeduction } from '../deductionUtils';
import { calculateCharitableImpact } from '../charitableImpactUtils';
import { TaxTrapResult } from '@/utils/taxTraps';

/**
 * Prepare tax input for the scenario
 */
export function prepareTaxInput({
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
}: {
  currentYear: number;
  baseIncome: number;
  adjustedRmdAmount: number;
  conversionAmount: number;
  scenarioData: MultiYearScenarioData;
  spouseBaseIncome: number;
  spouseRmdAmount: number;
  spouseConversionAmount: number;
  charitableContribution: { amount: number; useQcd: boolean; isBunching: boolean };
  baseAGI: number;
  beforeCharitableTraps: TaxTrapResult;
}) {
  // Initialize charitable impact object
  let charitableImpact = {
    standardDeduction: 0,
    itemizedDeduction: 0,
    isItemizing: false,
    taxSavings: 0
  };

  // Create the tax input
  const yearTaxInput: TaxInput = {
    year: currentYear,
    wages: baseIncome,
    interest: 0,
    dividends: 0,
    capital_gains: 0,
    ira_distributions: adjustedRmdAmount, // Use adjusted RMD amount
    roth_conversion: conversionAmount,
    social_security: 0,
    isItemizedDeduction: false, // Will be determined based on charitable contribution
    filing_status: scenarioData.filingStatus,
    
    // Add spouse info if applicable
    spouseWages: scenarioData.includeSpouse ? spouseBaseIncome : undefined,
    spouseIraDistributions: scenarioData.includeSpouse ? spouseRmdAmount : undefined,
    spouseRothConversion: scenarioData.includeSpouse ? spouseConversionAmount : undefined,
    
    // Community property settings
    isInCommunityPropertyState: scenarioData.isInCommunityPropertyState,
    splitCommunityIncome: scenarioData.splitCommunityIncome,
  };
  
  // If charitable planning is enabled, adjust the tax input
  if (scenarioData.useCharitablePlanning && charitableContribution.amount > 0) {
    // Calculate charitable impact on taxes with trap detection
    charitableImpact = calculateCharitableImpact(
      charitableContribution.amount,
      charitableContribution.useQcd,
      charitableContribution.isBunching,
      scenarioData.filingStatus,
      currentYear,
      0.24, // Estimate marginal rate for initial calculation
      adjustedRmdAmount + (scenarioData.includeRMDs ? 0 : adjustedRmdAmount),
      baseAGI,
      beforeCharitableTraps
    );
    
    // Update tax input with itemized deduction info
    if (charitableImpact.isItemizing) {
      yearTaxInput.isItemizedDeduction = true;
      yearTaxInput.itemizedDeductionAmount = charitableImpact.itemizedDeduction;
    }
  }

  return { yearTaxInput, charitableImpact };
}
