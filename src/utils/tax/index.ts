
/**
 * Tax Utilities Index
 * 
 * Re-exports all tax-related utility functions
 */

// Re-export all tax utility functions
export { calculateTaxableIncome } from './taxableIncomeCalculator';
export { calculateTotalTaxLiability } from './taxLiabilityCalculator';
export { getDistanceToNextBracket } from './bracketAnalyzer';
export { formatCurrency, formatPercent } from '../formatUtils';

// Re-export tax scenario utilities
export * from '../taxScenario';
