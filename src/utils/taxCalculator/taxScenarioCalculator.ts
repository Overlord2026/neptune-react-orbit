
/**
 * Tax Scenario Calculator
 * 
 * Functions for calculating tax scenarios
 */

import { TaxInput, TaxResult } from '../taxCalculatorTypes';
import { FilingStatusType } from '@/types/tax/filingTypes';
import { calculateTaxAmounts } from './taxAmountsCalculator';
import { SafeHarborInput, SafeHarborResult, calculateSafeHarbor } from '../safeHarborUtils';
import { checkTaxDataBeforeCalculation } from './taxDataUtils';

/**
 * Calculate tax scenario based on inputs
 */
export function calculateTaxScenario(
  input: TaxInput, 
  scenarioName: string = "Default Scenario", 
  sessionId: string = "default"
): TaxResult {
  // Check tax data currency before calculation
  const taxDataInfo = checkTaxDataBeforeCalculation(input.year, sessionId);
  
  // Calculate tax amounts
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
    marginal_capital_gains_rate
  } = calculateTaxAmounts(input);
  
  // Prepare and return tax result
  return {
    scenario_name: scenarioName,
    year: input.year,
    filing_status: input.filingStatus || input.filing_status as FilingStatusType,
    total_income,
    agi,
    taxable_income,
    total_tax,
    ordinary_tax,
    capital_gains_tax,
    marginal_rate,
    marginal_capital_gains_rate,
    effective_rate,
    updated_at: new Date(),
    federal_tax: total_tax,
    state_tax,
    state_code: input.residentState,
    tax_data_updated_at: taxDataInfo.dataUpdatedAt,
    tax_data_is_current: taxDataInfo.isCurrent
  };
}

/**
 * Enhanced tax scenario calculation that includes safe harbor calculation
 */
export function calculateTaxScenarioWithSafeHarbor(
  taxInput: TaxInput, 
  safeHarborInput: SafeHarborInput, 
  scenarioName: string,
  sessionId: string = "default"
): TaxResult {
  // First calculate the basic tax scenario
  const basicResult = calculateTaxScenario(taxInput, scenarioName, sessionId);
  
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
