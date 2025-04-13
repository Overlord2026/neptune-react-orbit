
/**
 * Tax Utilities (Legacy)
 * 
 * This file re-exports tax utility functions from the new modular structure.
 * It's provided for backward compatibility.
 */

// Re-export all functions from the new modular structure
export { 
  calculateTaxableIncome, 
  calculateTotalTaxLiability, 
  getDistanceToNextBracket,
  formatCurrency,
  formatPercent
} from './tax';
