
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
}: TaxInputParams) {
  // Map string filing status to FilingStatusType
  let filingStatus: FilingStatusType = 'single';
  
  // Ensure filingStatus is a valid FilingStatusType
  const validFilingStatuses: FilingStatusType[] = [
    'single', 'married_joint', 'married_separate', 'head_of_household', 'qualifying_widow'
  ];
  
  // If scenarioData.filingStatus is a valid FilingStatusType, use it
  if (typeof scenarioData.filingStatus === 'string' && 
      validFilingStatuses.includes(scenarioData.filingStatus as FilingStatusType)) {
    filingStatus = scenarioData.filingStatus as FilingStatusType;
  } else if (scenarioData.filingStatus === 'married') {
    // Convert 'married' to 'married_joint' for compatibility
    filingStatus = 'married_joint';
  }
  
  // Build the yearTaxInput object with the correct type
  const yearTaxInput: TaxInput = {
    year: currentYear,
    filing_status: filingStatus,
    filingStatus, // Include both properties for compatibility
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
    isInCommunityPropertyState: Boolean(scenarioData.isInCommunityPropertyState),
    splitCommunityIncome: Boolean(scenarioData.splitCommunityIncome),
    
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
