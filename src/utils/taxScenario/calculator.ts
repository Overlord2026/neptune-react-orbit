/**
 * Tax Scenario Calculator
 * 
 * Core functions for calculating tax scenarios based on user inputs
 */

import { FilingStatusType } from '@/types/tax/filingTypes';
import { TaxInput, TaxResult } from '../../types/tax/taxCalculationTypes';
import { calculateTaxAmounts } from '../taxCalculator/taxAmountsCalculator';
import { calculateSafeHarbor, SafeHarborInput } from '../safeHarborUtils';
import { checkTaxDataBeforeCalculation } from '../taxCalculator/taxDataUtils';

/**
 * Calculate basic scenario result with core tax calculations
 */
export function calculateBasicScenarioResult(
  input: TaxInput, 
  scenario_name: string, 
  sessionId: string = "default"
): TaxResult {
  // Check tax data currency before calculation
  const taxDataInfo = checkTaxDataBeforeCalculation(input.year, sessionId);
  
  // Calculate tax amounts
  const result = calculateTaxAmounts(input);
  const {
    total_income,
    agi,
    taxable_income,
    ordinary_tax,
    capital_gains_tax,
    total_tax,
    state_tax,
    marginal_rate,
    effective_rate,
    marginal_capital_gains_rate,
  } = result;
  
  // Create default brackets_breakdown if not provided by calculateTaxAmounts
  const brackets_breakdown = result.brackets_breakdown || {
    ordinary: [],
    capitalGains: []
  };
  
  // Return results with standardized property names
  return {
    scenario_name,
    year: input.year,
    filing_status: input.filing_status,
    total_income,
    agi,
    taxable_income,
    total_tax,
    ordinary_tax,
    capital_gains_tax,
    marginal_rate,
    marginal_capital_gains_rate,
    effective_rate,
    updated_at: new Date().toISOString(),
    federal_tax: total_tax - (state_tax || 0),
    state_tax,
    state_code: input.residentState,
    brackets_breakdown, // Added fixed brackets_breakdown
    tax_data_updated_at: new Date(taxDataInfo.dataUpdatedAt).toISOString(),
    tax_data_is_current: taxDataInfo.isCurrent,
    tax_data_version: "2.0"
  };
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
  return calculateBasicScenarioResult(input, scenario_name, sessionId);
}

/**
 * Enhanced tax scenario calculation that includes safe harbor calculation
 */
export function calculateTaxScenarioWithSafeHarbor(
  taxInput: TaxInput, 
  safeHarborInput: SafeHarborInput, 
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
    safe_harbor: {
      required_payment: safeHarborResult.required_payment || 0,
      is_compliant: safeHarborResult.is_compliant || false,
      method_used: safeHarborResult.method_used || ''
    }
  };
}
