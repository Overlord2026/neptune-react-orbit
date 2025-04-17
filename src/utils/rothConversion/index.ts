
/**
 * Roth Conversion Utilities
 * 
 * Central export point for all Roth conversion utility functions.
 */

// Export named functions directly
export { calculateMultiYearScenario } from './calculateMultiYearScenario';
export { processSingleYearCalculation } from './yearCalculation';
export { updateAccountBalances } from './accountBalanceUtils';
export { determineConversionAmounts } from './conversionUtils';
export {
  getCharitableContributionForYear,
  calculateCharitableImpact,
  calculateCharitableOpportunity,
  getStandardDeduction
} from './charitableUtils';

// Export specific functions from yearCalculation
export { 
  calculateYearlyIncome,
  processTaxableIncome,
  calculateCharitableEffect,
  prepareTaxInput,
  checkForTaxTraps,
  processTaxResults,
  applyStateTaxInfo
} from './yearCalculation/index';
