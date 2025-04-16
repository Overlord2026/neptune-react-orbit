
/**
 * Core calculator for tax scenarios
 * 
 * Implementation of the detailed tax calculation logic
 */

import { TaxInput, TaxResult } from '../taxCalculatorTypes';
import { getTaxDataVersionForScenario } from '../taxDataUtils';
import { hasMidYearUpdates, getMidYearUpdateWarning } from '../taxDataUtils';

/**
 * Calculate a basic tax scenario result
 */
export function calculateBasicScenarioResult(
  input: TaxInput, 
  scenario_name: string = "Default Scenario", 
  sessionId: string = "default"
): TaxResult {
  // Calculate the core tax amounts
  const {
    total_income,
    agi,
    taxable_income,
    ordinary_income,
    capital_gains,
    ordinary_tax,
    capital_gains_tax,
    total_tax,
    state_tax,
  } = calculateTaxAmounts(input);
  
  // Calculate rates
  const marginal_rate = calculateMarginalRate(taxable_income, input.year, input.filing_status);
  const effective_rate = total_income > 0 ? total_tax / total_income : 0;
  const marginal_capital_gains_rate = calculateMarginalCapitalGainsRate(
    ordinary_income, 
    capital_gains, 
    input.year, 
    input.filing_status
  );
  
  // Check if there were tax data mid-year updates
  const hasMidYearTaxUpdates = hasMidYearUpdates(input.year);
  const midYearUpdateWarning = hasMidYearTaxUpdates ? getMidYearUpdateWarning(input.year) : '';
  
  // Get data version info
  const taxDataVersionInfo = getTaxDataVersionForScenario(input.year);
  
  // Prepare result
  return {
    total_income,
    agi,
    taxable_income,
    ordinary_income,
    capital_gains,
    ordinary_tax,
    capital_gains_tax,
    total_tax,
    state_tax,
    marginal_rate,
    effective_rate,
    marginal_capital_gains_rate,
    federal_tax: total_tax,
    year: input.year,
    filing_status: input.filing_status,
    scenario_name: scenario_name,
    has_mid_year_updates: hasMidYearTaxUpdates,
    mid_year_update_warning: midYearUpdateWarning,
    data_version: taxDataVersionInfo.version, 
    data_description: taxDataVersionInfo.description,
    data_updated_at: taxDataVersionInfo.updated.toISOString(), // Convert to string
    calculation_date: new Date().toISOString(), // Convert to string
    calculation_session: sessionId || "default"
  };
}

/**
 * Calculate the core tax amounts for a tax scenario
 */
function calculateTaxAmounts(input: TaxInput) {
  // Calculate total income
  const wages = input.wages || 0;
  const interest = input.interest || 0;
  const dividends = input.dividends || 0;
  const capital_gains = input.capital_gains || 0;
  const ira_distributions = input.ira_distributions || 0;
  const roth_conversion = input.roth_conversion || 0;
  const social_security = input.social_security || 0;
  
  // Taxable portion of social security (simplified as 85%)
  const taxable_ss = social_security * 0.85;
  
  // Total income
  const total_income = 
    wages + 
    interest + 
    dividends + 
    capital_gains + 
    ira_distributions + 
    roth_conversion + 
    taxable_ss;
    
  // Adjusted gross income (simplified)
  const agi = total_income;
  
  // Calculate deduction
  const standard_deduction = getStandardDeduction(input.year, input.filing_status);
  const deduction_amount = input.isItemizedDeduction && input.itemizedDeductionAmount ? 
                          input.itemizedDeductionAmount : 
                          standard_deduction;
  
  // Ordinary income calculation
  const ordinary_income = 
    wages + 
    interest + 
    dividends + 
    ira_distributions + 
    roth_conversion + 
    taxable_ss;
    
  // Taxable income
  const taxable_income = Math.max(0, total_income - deduction_amount);
  
  // Calculate ordinary tax on ordinary income minus capital gains
  // (we'll treat all capital gains as qualified and dividends as non-qualified for simplicity)
  const ordinary_taxable = Math.max(0, taxable_income - Math.min(taxable_income, capital_gains));
  const ordinary_tax = calculateOrdinaryTax(ordinary_taxable, input.year, input.filing_status);
  
  // Calculate tax on capital gains
  // (simplified - would need to account for capital gain brackets based on total income in real implementation)
  const taxable_capital_gains = Math.min(taxable_income, capital_gains);
  const capital_gains_tax = calculateCapitalGainsTax(
    taxable_capital_gains, 
    ordinary_taxable,  
    input.year, 
    input.filing_status
  );
  
  // Total federal tax
  const total_tax = ordinary_tax + capital_gains_tax;
  
  // Calculate state tax if requested
  let state_tax = 0;
  if (input.includeStateTax && input.residentState) {
    const stateRate = getStateRate(input.residentState, agi);
    state_tax = Math.max(0, agi * stateRate);
  }
  
  return {
    total_income,
    agi, 
    taxable_income,
    ordinary_income,
    capital_gains,
    ordinary_tax,
    capital_gains_tax,
    total_tax,
    state_tax
  };
}

/**
 * Calculate the ordinary tax
 */
function calculateOrdinaryTax(amount: number, year: number, filing_status: string): number {
  // For this implementation, we'll use a simplified calculation
  // In a real app, this would use the actual tax brackets for the year
  
  const { calculateTotalTaxLiability } = require('../taxUtils');
  
  // Use tax utility function to calculate ordinary tax
  const result = calculateTotalTaxLiability(
    amount,
    0, // no capital gains for this calculation
    year,
    filing_status
  );
  
  return result.ordinaryTax;
}

/**
 * Calculate capital gains tax
 */
function calculateCapitalGainsTax(
  capital_gains: number,
  ordinary_income: number,
  year: number,
  filing_status: string
): number {
  // For this implementation, we'll use a simplified calculation
  // In a real app, this would use the actual capital gains brackets for the year
  
  const { calculateTotalTaxLiability } = require('../taxUtils');
  
  // Use tax utility function to calculate capital gains tax
  const result = calculateTotalTaxLiability(
    ordinary_income,
    capital_gains,
    year,
    filing_status
  );
  
  return result.capitalGainsTax;
}

/**
 * Calculate the marginal tax rate
 */
function calculateMarginalRate(taxable_income: number, year: number, filing_status: string): number {
  // Call into tax brackets utility to find the correct bracket
  
  // For this implementation, we'll use a simplified approach
  // In a real app, this would look up the marginal rate from tax bracket data
  
  const { getTaxBracket } = require('../taxBracketData');
  const bracket = getTaxBracket(taxable_income, filing_status);
  
  return bracket?.rate || 0;
}

/**
 * Calculate marginal capital gains rate
 */
function calculateMarginalCapitalGainsRate(
  ordinary_income: number,
  capital_gains: number,
  year: number,
  filing_status: string
): number {
  // For this implementation, we'll use a simplified approach
  // In a real app, this would look up the correct capital gains rate
  
  // Simple heuristic - based on ordinary income
  const { getCapitalGainsBracket } = require('../taxBracketData');
  const bracket = getCapitalGainsBracket(ordinary_income + capital_gains, filing_status);
  
  return bracket?.rate || 0;
}

/**
 * Get the appropriate standard deduction amount
 */
function getStandardDeduction(year: number, filing_status: string): number {
  // For simplified implementation - use standard values
  // In real app would lookup from tax data
  
  const { STANDARD_DEDUCTION } = require('../taxBracketData');
  return STANDARD_DEDUCTION[filing_status] || 12550; // Default to 2021 single
}

/**
 * Get the state tax rate for a specific state
 */
function getStateRate(state: string, income: number): number {
  // This is a simplified implementation
  // In a real app, would use actual state tax data and progressive brackets
  
  // Map of simplified state rates (just for example purposes)
  const stateRates: Record<string, number> = {
    'CA': 0.093,
    'NY': 0.068,
    'TX': 0,
    'FL': 0,
    'IL': 0.0495,
    'PA': 0.0307,
  };
  
  return stateRates[state] || 0.05; // Default to 5% for states not in the map
}
