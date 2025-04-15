
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

// Re-export the types
export * from './types';
