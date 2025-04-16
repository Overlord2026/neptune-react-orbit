
/**
 * Spouse Calculation Utilities
 * 
 * Functions for handling spouse-related tax calculations
 */

import { TaxInput } from '../taxCalculatorTypes';
import { calculateTaxScenario } from './calculator';

/**
 * Apply community property rules to a tax input
 */
export function applyCommunityPropertyRules(input: TaxInput): TaxInput {
  // Create a copy of the input to modify
  const result = { ...input };
  
  // Only apply if we have a spouse and are in a community property state
  if (input.isInCommunityPropertyState && input.splitCommunityIncome) {
    // For community property states, income is typically split 50/50
    // Combine all community property income
    const totalWages = (input.wages || 0) + (input.spouseWages || 0);
    const totalInterest = (input.interest || 0) + (input.spouseInterest || 0);
    const totalDividends = (input.dividends || 0) + (input.spouseDividends || 0);
    const totalCapitalGains = (input.capital_gains || 0) + (input.spouseCapitalGains || 0);
    
    // IRA distributions and Social Security are typically separate property
    
    // Split the combined income 50/50
    result.wages = totalWages / 2;
    result.spouseWages = totalWages / 2;
    result.interest = totalInterest / 2;
    result.spouseInterest = totalInterest / 2;
    result.dividends = totalDividends / 2;
    result.spouseDividends = totalDividends / 2;
    result.capital_gains = totalCapitalGains / 2;
    result.spouseCapitalGains = totalCapitalGains / 2;
  }
  
  return result;
}

/**
 * Calculate comparison between MFJ and MFS filing
 */
export function calculateMFSComparison(input: TaxInput) {
  // Only calculate for married filing jointly with spouse income
  if (input.filing_status !== "married_joint" || 
      !(input.spouseWages || 
        input.spouseInterest || 
        input.spouseDividends || 
        input.spouseCapitalGains || 
        input.spouseIraDistributions || 
        input.spouseRothConversion || 
        input.spouseSocialSecurity)) {
    return null;
  }
  
  // Create two separate MFS inputs
  const primaryInput: TaxInput = {
    ...input,
    filing_status: "married_separate",
    filingStatus: "married_separate", // Adding filingStatus for compatibility 
    // Remove spouse fields
    spouseWages: undefined,
    spouseInterest: undefined,
    spouseDividends: undefined,
    spouseCapitalGains: undefined,
    spouseIraDistributions: undefined,
    spouseRothConversion: undefined,
    spouseSocialSecurity: undefined
  };
  
  const spouseInput: TaxInput = {
    year: input.year,
    filing_status: "married_separate",
    filingStatus: "married_separate", // Adding filingStatus for compatibility
    wages: input.spouseWages || 0,
    interest: input.spouseInterest || 0,
    dividends: input.spouseDividends || 0,
    capital_gains: input.spouseCapitalGains || 0,
    ira_distributions: input.spouseIraDistributions || 0,
    roth_conversion: input.spouseRothConversion || 0,
    social_security: input.spouseSocialSecurity || 0,
    isItemizedDeduction: input.isItemizedDeduction,
    // Simplified approach to itemized deduction splitting for MFS
    itemizedDeductionAmount: input.isItemizedDeduction ? 
                            (input.itemizedDeductionAmount || 0) / 2 : 0,
    includeStateTax: input.includeStateTax,
    residentState: input.residentState
  };
  
  // Calculate taxes for each scenario
  const primaryResult = calculateTaxScenario(
    primaryInput, 
    "MFS Primary", 
    "mfs_comparison"
  );
  
  const spouseResult = calculateTaxScenario(
    spouseInput, 
    "MFS Spouse", 
    "mfs_comparison"
  );
  
  // Return comparison result
  return {
    primary_tax: primaryResult.total_tax,
    spouse_tax: spouseResult.total_tax,
    combined_tax: primaryResult.total_tax + spouseResult.total_tax,
    // difference will be calculated by the calling function
  };
}
