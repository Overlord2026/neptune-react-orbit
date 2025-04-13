
/**
 * Utility functions for determining conversion strategies
 */

import { getBrackets } from './taxBracketData';
import { ConversionStrategyType } from '../components/tax/roth-conversion/types/ScenarioTypes';

/**
 * Get maximum conversion amount based on strategy
 */
export const getMaxConversionAmount = (
  strategy: ConversionStrategyType,
  currentIncome: number,
  taxYear: number,
  filingStatus: 'single' | 'married' | 'head_of_household' | 'married_separate',
  fixedAmount?: number
): number => {
  // For fixed amount strategy, return the specified amount
  if (strategy === 'fixed') {
    return fixedAmount || 0;
  }
  
  // Get tax brackets for the year and filing status
  const brackets = getBrackets(taxYear, filingStatus, "ordinary");
  
  // Find the target bracket
  let targetBracket;
  
  if (strategy === 'bracket_12') {
    targetBracket = brackets.find(b => b.rate === 0.12);
  } else if (strategy === 'bracket_22') {
    targetBracket = brackets.find(b => b.rate === 0.22);
  } else if (strategy === 'bracket_12_22') {
    // For the combined 12% + 22% strategy, we use the end of the 22% bracket
    targetBracket = brackets.find(b => b.rate === 0.22);
  }
  
  // If target bracket not found, return 0
  if (!targetBracket) {
    return 0;
  }
  
  // Calculate remaining room in the bracket
  const maxIncomeInBracket = targetBracket.bracket_max;
  const roomLeft = maxIncomeInBracket - currentIncome;
  
  // Return maximum 0 (no room left)
  return Math.max(0, roomLeft);
};
