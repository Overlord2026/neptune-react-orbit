
/**
 * Tax Input Preparation
 * 
 * Functions for preparing tax inputs for scenario calculations.
 */

import { MultiYearScenarioData } from '@/components/tax/roth-conversion/types/ScenarioTypes';
import { TaxInput } from '../../../taxCalculator';
import { TaxTrapResult } from '@/utils/taxTraps';

interface TaxInputParams {
  currentYear: number;
  baseIncome: number;
  adjustedRmdAmount: number;
  conversionAmount: number;
  scenarioData: MultiYearScenarioData;
  spouseBaseIncome: number;
  spouseRmdAmount: number;
  spouseConversionAmount: number;
  charitableContribution: { 
    amount: number; 
    useQcd: boolean; 
    isBunching: boolean; 
  };
  baseAGI: number;
  beforeCharitableTraps: TaxTrapResult;
  charitableImpact: {
    standardDeduction: number;
    itemizedDeduction: number;
    isItemizing: boolean;
    taxSavings: number;
  };
}

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
  charitableImpact
}: TaxInputParams) {
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
    itemizedDeductionAmount: 0, // Default value, will update if itemizing
    filing_status: scenarioData.filingStatus,
    
    // Add spouse info if applicable
    spouseWages: scenarioData.includeSpouse ? spouseBaseIncome : undefined,
    spouseIraDistributions: scenarioData.includeSpouse ? spouseRmdAmount : undefined,
    spouseRothConversion: scenarioData.includeSpouse ? spouseConversionAmount : undefined,
    
    // Community property settings
    isInCommunityPropertyState: scenarioData.isInCommunityPropertyState,
    splitCommunityIncome: scenarioData.splitCommunityIncome,
  };
  
  // Update tax input with itemized deduction info if applicable
  if (charitableImpact.isItemizing) {
    yearTaxInput.isItemizedDeduction = true;
    yearTaxInput.itemizedDeductionAmount = charitableImpact.itemizedDeduction;
  }

  return { yearTaxInput };
}
