
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

// Re-export the types
export type { TaxInput, TaxResult, TaxScenario } from '../taxCalculatorTypes';
export type { EquityFormState, YearlyTaxImpact, EquityCompEvent, DeferralEvent, TaxImpactResult } from '../../types/tax/equityTypes';
