
/**
 * Spouse Calculation Utilities
 * 
 * Functions for handling spouse-related tax calculations including
 * community property rules and MFJ/MFS comparisons.
 */

import { TaxInput } from './taxCalculatorTypes';
import { calculateTaxScenario } from './taxCalculator';

/**
 * Apply community property rules to income
 * Split income 50/50 between spouses if applicable
 */
export function applyCommunityPropertyRules(input: TaxInput): TaxInput {
  if (!input.isInCommunityPropertyState || !input.splitCommunityIncome) {
    return input;
  }
  
  // Deep clone the input to avoid mutation
  const result = { ...input };
  
  // Income types typically considered community property and split 50/50
  // Wages are typically the most common community property
  const primaryWages = input.wages || 0;
  const spouseWages = input.spouseWages || 0;
  
  if (primaryWages > 0 || spouseWages > 0) {
    const totalWages = primaryWages + spouseWages;
    result.wages = totalWages / 2;
    result.spouseWages = totalWages / 2;
  }
  
  // Interest and dividends from community property are typically split
  const primaryInterest = input.interest || 0;
  const spouseInterest = input.spouseInterest || 0;
  
  if (primaryInterest > 0 || spouseInterest > 0) {
    const totalInterest = primaryInterest + spouseInterest;
    result.interest = totalInterest / 2;
    result.spouseInterest = totalInterest / 2;
  }
  
  const primaryDividends = input.dividends || 0;
  const spouseDividends = input.spouseDividends || 0;
  
  if (primaryDividends > 0 || spouseDividends > 0) {
    const totalDividends = primaryDividends + spouseDividends;
    result.dividends = totalDividends / 2;
    result.spouseDividends = totalDividends / 2;
  }
  
  // Note: IRA distributions and capital gains may have special rules
  // For simplicity, we'll leave them as-is, as they often relate to
  // separate property or have special considerations
  
  return result;
}

/**
 * Calculate Married Filing Separately comparison
 * Useful for determining if filing MFJ or MFS is more beneficial
 */
export function calculateMFSComparison(input: TaxInput) {
  if (input.filing_status !== "married_joint" ||
      (input.spouseWages === undefined && 
       input.spouseInterest === undefined && 
       input.spouseDividends === undefined && 
       input.spouseCapitalGains === undefined && 
       input.spouseIraDistributions === undefined && 
       input.spouseRothConversion === undefined && 
       input.spouseSocialSecurity === undefined)) {
    return undefined;
  }
  
  // Create inputs for primary taxpayer and spouse
  const primaryInput: TaxInput = {
    year: input.year,
    filingStatus: "married_separate", // Add filingStatus for TaxInput compatibility
    wages: input.wages || 0,
    interest: input.interest || 0,
    dividends: input.dividends || 0,
    capital_gains: input.capital_gains || 0,
    ira_distributions: input.ira_distributions || 0,
    roth_conversion: input.roth_conversion || 0,
    social_security: input.social_security || 0,
    isItemizedDeduction: input.isItemizedDeduction,
    itemizedDeductionAmount: input.itemizedDeductionAmount ? input.itemizedDeductionAmount / 2 : undefined,
    filing_status: "married_separate"
  };
  
  const spouseInput: TaxInput = {
    year: input.year,
    filingStatus: "married_separate", // Add filingStatus for TaxInput compatibility
    wages: input.spouseWages || 0,
    interest: input.spouseInterest || 0,
    dividends: input.spouseDividends || 0,
    capital_gains: input.spouseCapitalGains || 0,
    ira_distributions: input.spouseIraDistributions || 0,
    roth_conversion: input.spouseRothConversion || 0,
    social_security: input.spouseSocialSecurity || 0,
    isItemizedDeduction: input.isItemizedDeduction,
    itemizedDeductionAmount: input.itemizedDeductionAmount ? input.itemizedDeductionAmount / 2 : undefined,
    filing_status: "married_separate"
  };
  
  // Calculate taxes for primary taxpayer and spouse as MFS
  const primaryTaxResult = calculateTaxBasic(primaryInput);
  const spouseTaxResult = calculateTaxBasic(spouseInput);
  
  // Combined MFS taxes
  const combined_tax = primaryTaxResult.total_tax + spouseTaxResult.total_tax;
  
  return {
    primary_tax: primaryTaxResult.total_tax,
    spouse_tax: spouseTaxResult.total_tax,
    combined_tax
  };
}

/**
 * Simplified version of calculateTaxScenario to use for internal calculations
 * like MFJ vs MFS comparisons
 */
function calculateTaxBasic(input: TaxInput): {
  total_tax: number;
  ordinary_tax: number;
  capital_gains_tax: number;
} {
  // This is imported from taxCalculator - but defined here to avoid circular dependencies
  // In a real implementation, we might restructure further to avoid this
  
  // Calculate total income
  const total_income = 
    input.wages + 
    input.interest + 
    input.dividends + 
    input.capital_gains + 
    input.ira_distributions + 
    input.roth_conversion + 
    (input.social_security * 0.85);
    
  // AGI
  const agi = total_income;
  
  // Split income types
  const ordinary_income = 
    input.wages + 
    input.interest + 
    input.dividends + 
    input.ira_distributions + 
    input.roth_conversion + 
    (input.social_security * 0.85);
    
  const capital_gains = input.capital_gains;
  
  // Calculate tax using utility function
  const { calculateTotalTaxLiability } = require('./taxUtils');
  const taxResults = calculateTotalTaxLiability(
    ordinary_income,
    capital_gains,
    input.year,
    input.filing_status,
    input.isItemizedDeduction,
    input.itemizedDeductionAmount
  );
  
  return {
    total_tax: taxResults.totalTax,
    ordinary_tax: taxResults.ordinaryTax,
    capital_gains_tax: taxResults.capitalGainsTax
  };
}
