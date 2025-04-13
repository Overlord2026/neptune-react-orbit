/**
 * Tax Calculation Utilities
 * 
 * This file contains functions for calculating tax scenarios based on user inputs.
 * It leverages the tax bracket data from taxBracketData.ts and other utility files.
 */

import { 
  FilingStatusType,
  STANDARD_DEDUCTION
} from './taxBracketData';
import {
  calculateTaxableIncome,
  calculateTotalTaxLiability
} from './taxUtils';
import { 
  checkTaxDataCurrency, 
  markTaxDataAsCurrent
} from './dataFeedUtils';
import { 
  getTaxDataVersionForScenario,
  hasMidYearUpdates,
  getMidYearUpdateWarning
} from './taxDataVersioning';
import { applyCommunityPropertyRules } from './spouseCalculationUtils';
import { calculateSafeHarbor } from './safeHarborUtils';
import { calculateMultiYearScenario } from './rothConversion';
import { calculateRMD } from './rmdCalculationUtils';
import { getMaxConversionAmount } from './conversionStrategyUtils';
import { TaxInput, TaxResult, TaxDataCacheInfo } from './taxCalculatorTypes';

// Re-export types and functions we want to keep as part of the public API
export type { TaxInput, TaxResult, TaxDataCacheInfo } from './taxCalculatorTypes';
export type { FilingStatusType } from './taxBracketData';
export { STANDARD_DEDUCTION } from './taxBracketData';
export { calculateSafeHarbor } from './safeHarborUtils';
export { calculateMultiYearScenario } from './rothConversion';
export { calculateRMD } from './rmdCalculationUtils';
export { getMaxConversionAmount } from './conversionStrategyUtils';

/**
 * Pre-check if tax data is current before calculation
 * Returns information about data currency and when it was last updated
 */
export function checkTaxDataBeforeCalculation(
  sessionId: string = "default",
  cacheTimeoutMinutes: number = 15
): TaxDataCacheInfo {
  return checkTaxDataCurrency(sessionId, cacheTimeoutMinutes);
}

/**
 * Mark the user's session tax data as current (after they choose to refresh)
 */
export function refreshTaxData(sessionId: string = "default"): void {
  markTaxDataAsCurrent(sessionId);
}

/**
 * Calculate tax scenario based on inputs
 * Includes data currency information in the result
 */
export function calculateTaxScenario(
  input: TaxInput, 
  scenario_name: string, 
  sessionId: string = "default"
): TaxResult {
  // Check tax data currency for this session
  const taxDataInfo = checkTaxDataCurrency(sessionId);
  
  // Check for appropriate tax data version based on year and scenario date
  const taxDataVersion = getTaxDataVersionForScenario(input.year, input.scenarioDate);
  
  // Check if this tax year has mid-year updates that might affect calculation
  const taxDataWarning = hasMidYearUpdates(input.year) ? getMidYearUpdateWarning(input.year) : undefined;

  // Apply community property rules if applicable
  if (input.isInCommunityPropertyState && input.splitCommunityIncome) {
    input = applyCommunityPropertyRules(input);
  }
  
  // Calculate total income
  let total_income = 
    input.wages + 
    input.interest + 
    input.dividends + 
    input.capital_gains + 
    input.ira_distributions + 
    input.roth_conversion + 
    (input.social_security * 0.85); // 85% of Social Security is typically taxable
    
  // Add spouse income for MFJ filing status
  if (input.filing_status === "married" && 
      (input.spouseWages || 
       input.spouseInterest || 
       input.spouseDividends || 
       input.spouseCapitalGains || 
       input.spouseIraDistributions || 
       input.spouseRothConversion || 
       input.spouseSocialSecurity)) {
    
    total_income += 
      (input.spouseWages || 0) + 
      (input.spouseInterest || 0) + 
      (input.spouseDividends || 0) + 
      (input.spouseCapitalGains || 0) + 
      (input.spouseIraDistributions || 0) + 
      (input.spouseRothConversion || 0) + 
      ((input.spouseSocialSecurity || 0) * 0.85);
  }

  // AGI (Adjusted Gross Income) - simplification for this scenario
  // In real life, there would be above-the-line deductions
  const agi = total_income;
  
  // Split income into ordinary income and capital gains
  let ordinary_income = 
    input.wages + 
    input.interest + 
    input.dividends + 
    input.ira_distributions + 
    input.roth_conversion + 
    (input.social_security * 0.85);
    
  // Add spouse's ordinary income for MFJ
  if (input.filing_status === "married") {
    ordinary_income +=
      (input.spouseWages || 0) + 
      (input.spouseInterest || 0) + 
      (input.spouseDividends || 0) + 
      (input.spouseIraDistributions || 0) + 
      (input.spouseRothConversion || 0) + 
      ((input.spouseSocialSecurity || 0) * 0.85);
  }
  
  // For simplicity, assuming capital gains are all long-term
  let capital_gains = input.capital_gains;
  
  // Add spouse's capital gains for MFJ
  if (input.filing_status === "married") {
    capital_gains += (input.spouseCapitalGains || 0);
  }
  
  // Calculate tax using our utility function that properly handles ordinary income and capital gains
  const taxResults = calculateTotalTaxLiability(
    ordinary_income,
    capital_gains,
    input.year,
    input.filing_status,
    input.isItemizedDeduction,
    input.itemizedDeductionAmount
  );
  
  // Calculate taxable income using the utility function
  const taxable_income = calculateTaxableIncome(
    agi,
    input.year,
    input.filing_status,
    input.isItemizedDeduction,
    input.itemizedDeductionAmount
  );
  
  // Calculate MFS comparison if requested and filing status is MFJ
  let mfs_comparison;
  
  // Import the function to avoid circular dependencies
  const { calculateMFSComparison } = require('./spouseCalculationUtils');
  mfs_comparison = calculateMFSComparison(input);
  
  if (mfs_comparison) {
    // Calculate the difference between MFJ and MFS
    mfs_comparison.difference = mfs_comparison.combined_tax - taxResults.totalTax;
  }
  
  // Return result with enhanced data including tax data currency and version information
  return {
    scenario_name,
    year: input.year,
    filing_status: input.filing_status,
    total_income,
    agi,
    taxable_income,
    total_tax: taxResults.totalTax,
    ordinary_tax: taxResults.ordinaryTax,
    capital_gains_tax: taxResults.capitalGainsTax,
    marginal_rate: taxResults.marginalOrdinaryRate,
    marginal_capital_gains_rate: taxResults.marginalCapitalGainsRate,
    effective_rate: taxResults.effectiveRate,
    brackets_breakdown: taxResults.bracketsBreakdown,
    updated_at: new Date(),
    tax_data_updated_at: taxDataInfo.dataUpdatedAt,
    tax_data_is_current: taxDataInfo.isCurrent,
    tax_data_version: taxDataVersion?.version,
    tax_data_warning: taxDataWarning,
    mfs_comparison
  };
}

/**
 * Enhanced tax scenario calculation that includes safe harbor calculation
 */
export function calculateTaxScenarioWithSafeHarbor(
  taxInput: TaxInput, 
  safeHarborInput: import('./safeHarborUtils').SafeHarborInput, 
  scenario_name: string,
  sessionId: string = "default"
): TaxResult {
  // First calculate the basic tax scenario with tax data currency check
  const basicResult = calculateTaxScenario(taxInput, scenario_name, sessionId);
  
  // Calculate safe harbor with the newly calculated tax amount
  const safeHarborResult = calculateSafeHarbor({
    ...safeHarborInput,
    current_year_tax: basicResult.total_tax
  });
  
  // Return the combined result
  return {
    ...basicResult,
    safe_harbor: safeHarborResult
  };
}

/**
 * Save tax scenario to database or state
 * This is a placeholder function and would be replaced with actual database operations
 */
export function saveScenario(scenario: TaxResult): Promise<TaxResult> {
  // This would be a database operation in a real application
  // For now, we'll just log to console and return the scenario
  console.log('Saving scenario:', scenario);
  
  // Simulate async operation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(scenario);
    }, 500);
  });
}

/**
 * Fetch saved scenarios
 * This is a placeholder function and would be replaced with actual database operations
 */
export function fetchScenarios(): Promise<TaxResult[]> {
  // This would be a database operation in a real application
  // For now, we'll just return a mock array
  
  // Simulate async operation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 500);
  });
}
