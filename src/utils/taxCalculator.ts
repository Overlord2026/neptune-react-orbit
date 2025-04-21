
/**
 * Tax Calculator Main Module
 * 
 * This file serves as the main entry point for tax calculation functionality,
 * importing and re-exporting functionality from specialized modules.
 */

// Re-export types from the centralized type export
import { FilingStatusType } from '../types/tax/filingTypes';
export type { TaxInput, TaxResult, TaxDataCacheInfo } from './taxCalculatorTypes';
export type { FilingStatusType };

// Re-export constants
export { STANDARD_DEDUCTION } from './taxBracketData';

// Import from the new modular structure
import { 
  checkTaxDataBeforeCalculation as checkTaxData,
  refreshTaxData as refreshData
} from './taxCalculator/taxDataUtils';

import {
  calculateTaxScenario as calcTaxScenario,
  calculateTaxScenarioWithSafeHarbor as calcWithSafeHarbor,
} from './taxCalculator/taxScenarioCalculator';

// Re-export functions with their original names
export const checkTaxDataBeforeCalculation = checkTaxData;
export const refreshTaxData = refreshData;

// Adapter function to handle different TaxInput formats
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
    filing_status: input.filingStatus || input.filing_status,
    capital_gains: input.capitalGains || input.capital_gains || 0,
    wages: input.wages || 0,
    interest: input.interest || 0,
    dividends: input.dividends || 0,
    ira_distributions: input.ira_distributions || 0,
    roth_conversion: input.roth_conversion || 0,
    social_security: input.social_security || 0,
    isInCommunityPropertyState: input.isInCommunityPropertyState || false,
    splitCommunityIncome: input.splitCommunityIncome || false,
    spouseWages: input.spouseWages || 0,
    spouseInterest: input.spouseInterest || 0,
    spouseDividends: input.spouseDividends || 0,
    spouseCapitalGains: input.spouseCapitalGains || 0,
    spouseIraDistributions: input.spouseIraDistributions || 0,
    spouseRothConversion: input.spouseRothConversion || 0,
    spouseSocialSecurity: input.spouseSocialSecurity || 0
  };

  return calcTaxScenario(adaptedInput, scenarioName, sessionId || "default");
};

// Re-export other functions
export const calculateTaxScenarioWithSafeHarbor = calcWithSafeHarbor;
export { calculateSafeHarbor } from './safeHarborUtils';
export { calculateMultiYearScenario } from './rothConversion';
export { calculateRMD } from './rmdCalculationUtils';
export { getMaxConversionAmount } from './conversionStrategyUtils';
