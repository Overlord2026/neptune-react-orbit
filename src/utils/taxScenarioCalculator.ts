
/**
 * Tax Scenario Calculator
 * 
 * Core functions for calculating tax scenarios based on user inputs
 */

import { 
  FilingStatusType,
} from './taxBracketData';

import {
  calculateTaxableIncome,
  calculateTotalTaxLiability
} from './tax';

import {
  checkTaxDataBeforeCalculation,
  getTaxDataVersionForScenario,
  hasMidYearUpdates,
  getMidYearUpdateWarning
} from './taxDataUtils';

import { applyCommunityPropertyRules } from './spouseCalculationUtils';
import { calculateSafeHarbor } from './safeHarborUtils';
import { calculateStateTax, StateCode } from './stateTaxData';

import { TaxInput, TaxResult } from './taxCalculatorTypes';

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
  const taxDataInfo = checkTaxDataBeforeCalculation(sessionId);
  
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
  if (input.filing_status === "married_joint" && 
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
  if (input.filing_status === "married_joint") {
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
  if (input.filing_status === "married_joint") {
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
  
  // Calculate state tax if applicable
  let state_tax = 0;
  let state_code: StateCode | undefined = undefined;
  
  if (input.includeStateTax && input.residentState) {
    state_code = input.residentState as StateCode;
    state_tax = calculateStateTax(taxable_income, state_code);
  }
  
  // Calculate MFS comparison if requested and filing status is MFJ
  let mfs_comparison;
  
  // Import the function to avoid circular dependencies
  const { calculateMFSComparison } = require('./spouseCalculationUtils');
  mfs_comparison = calculateMFSComparison(input);
  
  if (mfs_comparison) {
    // Calculate the difference between MFJ and MFS
    mfs_comparison.difference = mfs_comparison.combined_tax - taxResults.totalTax;
  }
  
  // Calculate total tax (federal + state)
  const federal_tax = taxResults.totalTax;
  const total_tax = federal_tax + state_tax;
  
  // Return result with enhanced data including tax data currency and version information
  return {
    scenario_name,
    year: input.year,
    filing_status: input.filing_status,
    total_income,
    agi,
    taxable_income,
    federal_tax,
    state_tax,
    state_code,
    total_tax,
    ordinary_tax: taxResults.ordinaryTax,
    capital_gains_tax: taxResults.capitalGainsTax,
    marginal_rate: taxResults.marginalOrdinaryRate,
    marginal_capital_gains_rate: taxResults.marginalCapitalGainsRate,
    effective_rate: total_tax / total_income,
    brackets_breakdown: taxResults.bracketsBreakdown,
    updated_at: new Date(),
    tax_data_updated_at: taxDataInfo.dataUpdatedAt,
    tax_data_is_current: taxDataInfo.isCurrent,
    tax_data_version: taxDataVersion?.version,
    tax_data_warning: taxDataWarning,
    mfs_comparison,
    standard_deduction: taxResults.standardDeduction,
    brackets: taxResults.brackets
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
