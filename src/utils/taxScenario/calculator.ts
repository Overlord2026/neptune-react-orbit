
/**
 * Tax Scenario Calculator
 * 
 * Core functions for calculating tax scenarios based on user inputs
 */

import { FilingStatusType } from '../taxBracketData';
import { TaxInput, TaxResult } from '../taxCalculatorTypes';
import { calculateBasicScenarioResult } from './calculatorCore';
import { calculateSafeHarbor, SafeHarborInput, SafeHarborResult } from '../safeHarborUtils';

/**
 * Calculate tax scenario based on inputs
 * Includes data currency information in the result
 */
export function calculateTaxScenario(
  input: TaxInput, 
  scenario_name: string, 
  sessionId: string = "default"
): TaxResult {
  // Calculate the basic scenario result with all core tax calculations
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
