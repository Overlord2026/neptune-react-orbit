/**
 * Tax Scenario Calculator Core
 * 
 * Core calculation functions for tax scenarios
 */

import { FilingStatusType } from '../taxBracketData';
import { TaxInput, TaxResult } from '../taxCalculatorTypes';
import { calculateTotalTaxLiability, calculateTaxableIncome } from '../tax';
import { checkTaxDataBeforeCalculation, getTaxDataVersionForScenario, hasMidYearUpdates, getMidYearUpdateWarning } from '../taxDataUtils';
import { applyCommunityPropertyRules } from './spouseUtils';
import { calculateStateTax, StateCode } from '../stateTax';
import { calculateMFSComparison } from './spouseUtils';

/**
 * Calculate the core tax scenario result
 */
export function calculateBasicScenarioResult(
  input: TaxInput, 
  scenario_name: string, 
  sessionId: string = "default"
): TaxResult {
  // Check tax data currency for this session
  const taxDataInfo = checkTaxDataBeforeCalculation(sessionId);
  
  // Check for appropriate tax data version based on year
  const taxDataVersion = getTaxDataVersionForScenario(input.year);
  
  // Check if this tax year has mid-year updates that might affect calculation
  const taxDataWarning = hasMidYearUpdates(input.year) ? getMidYearUpdateWarning(input.year) : undefined;

  // Apply community property rules if applicable
  if (input.isInCommunityPropertyState && input.splitCommunityIncome) {
    input = applyCommunityPropertyRules(input);
  }
  
  // Calculate income components
  const { 
    total_income,
    ordinary_income,
    capital_gains
  } = calculateIncomeComponents(input);
  
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
    total_income,
    input.year,
    input.filing_status,
    input.isItemizedDeduction,
    input.itemizedDeductionAmount
  );
  
  // Calculate state tax if applicable
  const { state_tax, state_code } = calculateStateTaxComponent(input, taxable_income);
  
  // Calculate MFS comparison if applicable
  const mfs_comparison = calculateMFSComparisonIfNeeded(input, taxResults.totalTax);
  
  // Calculate total tax (federal + state)
  const federal_tax = taxResults.totalTax;
  const total_tax = federal_tax + state_tax;
  
  // Return result with enhanced data including tax data currency and version information
  return {
    scenario_name,
    year: input.year,
    filing_status: input.filing_status,
    total_income,
    agi: total_income, // Simplified AGI calculation for now
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
    updated_at: new Date().toISOString(),
    tax_data_updated_at: taxDataInfo.dataUpdatedAt,
    tax_data_is_current: taxDataInfo.isCurrent,
    tax_data_version: taxDataVersion?.version,
    tax_data_warning: taxDataWarning,
    mfs_comparison,
    standard_deduction: 0,
    brackets: []
  };
}

/**
 * Calculate income components from user inputs
 */
function calculateIncomeComponents(input: TaxInput): { 
  total_income: number; 
  ordinary_income: number; 
  capital_gains: number; 
} {
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
  
  return { total_income, ordinary_income, capital_gains };
}

/**
 * Calculate state tax component if applicable
 */
function calculateStateTaxComponent(input: TaxInput, taxable_income: number): {
  state_tax: number;
  state_code: StateCode | undefined;
} {
  let state_tax = 0;
  let state_code: StateCode | undefined = undefined;
  
  if (input.includeStateTax && input.residentState) {
    state_code = input.residentState as StateCode;
    state_tax = calculateStateTax(taxable_income, state_code);
  }
  
  return { state_tax, state_code };
}

/**
 * Calculate MFS comparison if needed
 */
function calculateMFSComparisonIfNeeded(input: TaxInput, federal_tax: number) {
  // Only calculate for married filing jointly
  if (input.filing_status === "married_joint") {
    const mfs_comparison = calculateMFSComparison(input);
    
    if (mfs_comparison) {
      // Add difference property to the return value instead of modifying the original
      return {
        ...mfs_comparison,
        difference: mfs_comparison.combined_tax - federal_tax
      };
    }
    
    return undefined;
  }
  
  return undefined;
}
