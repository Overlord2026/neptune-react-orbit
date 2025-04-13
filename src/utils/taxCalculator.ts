
/**
 * Tax Calculator Main Module
 * 
 * This file serves as the main entry point for tax calculation functionality,
 * importing and re-exporting functionality from specialized modules.
 */

// Re-export types
export type { TaxInput, TaxResult, TaxDataCacheInfo } from './taxCalculatorTypes';
export type { FilingStatusType } from './taxBracketData';

// Re-export constants
export { STANDARD_DEDUCTION } from './taxBracketData';

// Import from the new modular structure
import { 
  checkTaxDataBeforeCalculation as checkTaxData,
  refreshTaxData as refreshData,
} from './taxDataUtils';

import {
  calculateTaxScenario as calcTaxScenario,
  calculateTaxScenarioWithSafeHarbor as calcWithSafeHarbor,
} from './taxScenarioCalculator';

import {
  saveScenario as saveTaxScenario,
  fetchScenarios as fetchTaxScenarios,
} from './taxScenarioStorage';

// Re-export functions from modules with their original names
export const checkTaxDataBeforeCalculation = checkTaxData;
export const refreshTaxData = refreshData;
export const calculateTaxScenario = calcTaxScenario;
export const calculateTaxScenarioWithSafeHarbor = calcWithSafeHarbor;
export const saveScenario = saveTaxScenario;
export const fetchScenarios = fetchTaxScenarios;

// Re-export utility functions that are part of the public API
export { calculateSafeHarbor } from './safeHarborUtils';
export { calculateMultiYearScenario } from './rothConversion';
export { calculateRMD } from './rmdCalculationUtils';
export { getMaxConversionAmount } from './conversionStrategyUtils';
