
/**
 * Tax Input Preparation
 * 
 * Functions for preparing tax inputs for scenario calculations.
 */

import { TaxInput } from "@/types/tax/taxCalculationTypes";
import { FilingStatusType } from "@/types/tax/filingTypes";

interface TaxInputParams {
  currentYear: number;
  baseIncome: number;
  adjustedRmdAmount: number;
  conversionAmount: number;
  scenarioData: any;
  spouseBaseIncome: number;
  spouseRmdAmount: number;
  spouseConversionAmount: number;
  charitableContribution: { 
    amount: number; 
    useQcd: boolean; 
    isBunching: boolean; 
  };
  baseAGI: number;
  beforeCharitableTraps: any;
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
  charitableContribution,
  baseAGI,
  beforeCharitableTraps,
  charitableImpact
}: any) {
  // Convert string filing status to FilingStatusType, ensuring it's a valid value
  const filingStatusValue = scenarioData.filingStatus;
  
  // Ensure filingStatus is a valid FilingStatusType
  const validFilingStatuses: FilingStatusType[] = [
    'single', 'married_joint', 'married_separate', 'head_of_household', 'qualifying_widow'
  ];
  
  // Default to 'single' if the provided value isn't valid
  const filingStatus: FilingStatusType = validFilingStatuses.includes(filingStatusValue) 
    ? filingStatusValue as FilingStatusType 
    : 'single';
  
  // Build the yearTaxInput object with the correct type
  const yearTaxInput: TaxInput = {
    year: currentYear,
    filing_status: filingStatus,
    filingStatus: filingStatus, // Include both properties for compatibility
    wages: baseIncome,
    interest: 0,
    dividends: 0,
    capital_gains: 0,
    ira_distributions: adjustedRmdAmount,
    roth_conversion: conversionAmount,
    social_security: 0,
    isItemizedDeduction: false, // Will be determined based on charitable contribution
    itemizedDeductionAmount: 0, // Default value, will update if itemizing
    
    // Add spouse info if applicable
    spouseWages: scenarioData.includeSpouse ? spouseBaseIncome : undefined,
    spouseIraDistributions: scenarioData.includeSpouse ? spouseRmdAmount : undefined,
    spouseRothConversion: scenarioData.includeSpouse ? spouseConversionAmount : undefined,
    
    // Community property settings
    isInCommunityPropertyState: scenarioData.isInCommunityPropertyState,
    splitCommunityIncome: scenarioData.splitCommunityIncome,
    
    // State tax info - make sure we're handling string or undefined only
    includeStateTax: Boolean(scenarioData.includeStateTax),
    residentState: scenarioData.residentState ? String(scenarioData.residentState) : undefined,
    stateRelocationYear: scenarioData.stateRelocationYear,
    futureResidentState: scenarioData.futureResidentState ? String(scenarioData.futureResidentState) : undefined
  };
  
  // Update tax input with itemized deduction info if applicable
  if (charitableImpact.isItemizing) {
    yearTaxInput.isItemizedDeduction = true;
    yearTaxInput.itemizedDeductionAmount = charitableImpact.itemizedDeduction;
  }

  return {
    yearTaxInput
  };
}
