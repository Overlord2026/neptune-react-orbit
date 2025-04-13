
/**
 * Bracket Analyzer
 * 
 * Utility functions for analyzing tax bracket positions and thresholds
 */

import { 
  FilingStatusType,
  BracketType,
  getBrackets
} from '../taxBracketData';

/**
 * Get distance to next tax bracket
 */
export const getDistanceToNextBracket = (
  income: number,
  year: number,
  filingStatus: FilingStatusType,
  bracketType: BracketType = "ordinary"
): { nextBracketRate: number | null; distance: number } => {
  const brackets = getBrackets(year, filingStatus, bracketType);
  
  // Find current bracket
  const currentBracketIndex = brackets.findIndex(
    bracket => income >= bracket.bracket_min && income <= bracket.bracket_max
  );
  
  // If in top bracket or not found, return null
  if (currentBracketIndex === -1 || currentBracketIndex === brackets.length - 1) {
    return { nextBracketRate: null, distance: 0 };
  }
  
  // Get next bracket and calculate distance
  const nextBracket = brackets[currentBracketIndex + 1];
  const distance = nextBracket.bracket_min - income;
  
  return {
    nextBracketRate: nextBracket.rate,
    distance: distance
  };
};
