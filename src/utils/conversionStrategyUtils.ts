
/**
 * Conversion Strategy Utilities
 * 
 * Functions for determining Roth conversion amounts based on different strategies.
 */

import { FilingStatusType } from './taxBracketData';
import { getBrackets } from './taxBracketData';

/**
 * Get maximum conversion amount based on bracket fill strategy
 */
export const getMaxConversionAmount = (
  strategy: 'fixed' | 'bracket_12' | 'bracket_12_22',
  income: number,
  year: number,
  filingStatus: FilingStatusType,
  fixedAmount?: number
): number => {
  // If fixed strategy, return the fixed amount
  if (strategy === 'fixed' && fixedAmount !== undefined) {
    return fixedAmount;
  }
  
  // Get bracket information
  const brackets = getBrackets(year, filingStatus, "ordinary");
  
  // Find 12% and 22% brackets
  const bracket12 = brackets.find(b => Math.round(b.rate * 100) === 12);
  const bracket22 = brackets.find(b => Math.round(b.rate * 100) === 22);
  
  if (!bracket12) {
    return 0; // Safety check
  }
  
  // Calculate available space in 12% bracket
  let availableSpace = bracket12.bracket_max - income;
  
  // If we want to go up to 22% bracket and it exists
  if (strategy === 'bracket_12_22' && bracket22) {
    availableSpace = bracket22.bracket_max - income;
  }
  
  // Make sure we don't go negative
  return Math.max(0, availableSpace);
};
