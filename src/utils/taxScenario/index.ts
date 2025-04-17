
/**
 * Tax Scenario Index
 * 
 * Central export point for all tax scenario related functionality
 */

// Re-export functions from calculator module
export { 
  calculateTaxScenario, 
  calculateTaxScenarioWithSafeHarbor 
} from './calculator';

// Re-export utility functions
export { 
  applyCommunityPropertyRules,
  calculateMFSComparison
} from './spouseUtils';

// Re-export fetch functions
export {
  fetchTaxScenario,
  fetchAllScenarios
} from './fetch';

// Re-export storage functions
export {
  saveTaxScenario,
  getSavedScenarios,
  deleteTaxScenario,
  updateTaxScenario
} from './storage';

// Re-export types from our proper types path
export type { 
  TaxInput, 
  TaxResult, 
  TaxScenario 
} from '../../types/tax/taxCalculationTypes';

// Import equity types directly
import type { 
  EquityFormState, 
  YearlyTaxImpact, 
  EquityCompEvent, 
  DeferralEvent, 
  TaxImpactResult 
} from '../../types/tax/equityTypes';

export type { 
  EquityFormState, 
  YearlyTaxImpact, 
  EquityCompEvent, 
  DeferralEvent, 
  TaxImpactResult 
};
