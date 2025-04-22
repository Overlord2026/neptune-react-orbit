
/**
 * Tax Calculator Main Module
 * 
 * This file serves as the main entry point for tax calculation functionality,
 * importing and re-exporting functionality from specialized modules.
 */

// Re-export types from the centralized type export
import { FilingStatusType } from '@/types/tax/filingTypes';
export type { TaxInput, TaxResult, TaxDataCacheInfo } from '../taxCalculatorTypes';
export type { FilingStatusType };

// Re-export constants
export { STANDARD_DEDUCTION } from '../taxBracketData';

// Import specialized modules
import { calculateTaxableIncome as calcTaxable } from './taxableIncomeCalculator';
import { checkTaxDataBeforeCalculation as checkTaxData, refreshTaxData as refreshData } from './taxDataUtils';
import { 
  calculateTaxScenario as calcTaxScenario,
  calculateTaxScenarioWithSafeHarbor as calcWithSafeHarbor
} from './taxScenarioCalculator';
import { 
  saveTaxScenario as saveTaxScenarioFunc,
  getSavedScenarios as fetchTaxScenariosFunc 
} from '../taxScenario/storage';
import { calculateMultiYearScenario } from '../rothConversion';

// Re-export functions with renamed variables to avoid conflicts
export const calculateTaxableIncome = calcTaxable;
export const checkTaxDataBeforeCalculation = checkTaxData;
export const refreshTaxData = refreshData;

// Main calculation function with adapter for different input formats
export const calculateTaxScenario = (input: any, scenarioName: string, sessionId?: string) => {
  // Adapt input to the format expected by the core calculator
  const adaptedInput = {
    year: input.year,
    filingStatus: input.filingStatus || input.filing_status,
    income: input.wages || 0, 
    capitalGains: input.capitalGains || input.capital_gains || 0,
    adjustments: 0,
    deductions: 0,
    credits: 0,
    isItemizedDeduction: input.isItemizedDeduction || false,
    itemizedDeductionAmount: input.itemizedDeductionAmount || 0,
    residentState: input.residentState,
    includeStateTax: input.includeStateTax || false,
    filing_status: input.filingStatus || input.filing_status, // Keep both for backwards compatibility
    capital_gains: input.capitalGains || input.capital_gains || 0, // Keep both for backwards compatibility
    wages: input.wages || 0,
    interest: input.interest || 0,
    dividends: input.dividends || 0,
    ira_distributions: input.ira_distributions || 0,
    roth_conversion: input.roth_conversion || 0,
    social_security: input.social_security || 0
  };

  return calcTaxScenario(adaptedInput, scenarioName, sessionId || "default");
};

export const calculateTaxScenarioWithSafeHarbor = calcWithSafeHarbor;
export const saveScenario = saveTaxScenarioFunc;
export const fetchScenarios = fetchTaxScenariosFunc;

// Re-export utility functions that are part of the public API
export { calculateSafeHarbor } from '../safeHarborUtils';
export { calculateMultiYearScenario } from '../rothConversion';
export { calculateRMD } from '../rmdCalculationUtils';
export { getMaxConversionAmount } from '../conversionStrategyUtils';
