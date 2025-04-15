
/**
 * Tax Utilities Index
 * 
 * Re-exports all tax-related utility functions
 */

// Re-export named functions directly
export { calculateTaxableIncome } from './taxableIncomeCalculator';
export { calculateTotalTaxLiability } from './taxLiabilityCalculator';
export { getDistanceToNextBracket } from './bracketAnalyzer';
export { formatCurrency, formatPercent } from '../formatUtils';

// Re-export specific named exports from taxScenario instead of using star exports
export { 
  saveTaxScenario, 
  getSavedScenarios, 
  deleteTaxScenario, 
  updateTaxScenario 
} from '../taxScenario/storage';

export { 
  fetchTaxScenario,
  fetchAllScenarios
} from '../taxScenario/fetch';

export type { 
  TaxScenario, 
  EquityScenario 
} from '../taxScenario/types';
