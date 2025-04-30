
/**
 * Tax calculation utilities
 */
import { FilingStatusType, LegacyFilingStatusType, convertLegacyFilingStatus } from '@/types/tax/filingTypes';
import { getBrackets } from './bracketUtils';

// Calculate tax for a specific income amount
export function calculateTax(income: number, year: number, filingStatus: FilingStatusType): number {
  const brackets = getBrackets(year, filingStatus);
  let tax = 0;
  
  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    const prevBracketMax = i > 0 ? brackets[i-1].bracket_max : 0;
    
    if (income > prevBracketMax) {
      const taxableInThisBracket = Math.min(income - prevBracketMax, bracket.bracket_max - prevBracketMax);
      tax += taxableInThisBracket * bracket.rate;
    }
  }
  
  return tax;
}

// Calculate effective tax rate
export function calculateEffectiveRate(tax: number, income: number): number {
  if (income <= 0) return 0;
  return tax / income;
}

// Export the function to get distance to next bracket
export function getDistanceToNextBracket(income: number, filingStatus: FilingStatusType | LegacyFilingStatusType = 'single'): {
  nextThreshold: number;
  distance: number;
} {
  // Ensure we're using a valid filing status by checking and converting legacy types
  let normalizedFilingStatus: FilingStatusType;
  
  if (typeof filingStatus === 'string') {
    if (filingStatus === 'married' || filingStatus === 'single' || filingStatus === 'head_of_household' || filingStatus === 'married_separate') {
      normalizedFilingStatus = convertLegacyFilingStatus(filingStatus as LegacyFilingStatusType);
    } else {
      normalizedFilingStatus = filingStatus as FilingStatusType;
    }
  } else {
    normalizedFilingStatus = 'single'; // Default fallback
  }
  
  const brackets = getBrackets(new Date().getFullYear(), normalizedFilingStatus);
  
  // Find the current bracket and calculate distance to next
  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    if (income >= bracket.bracket_min && income < bracket.bracket_max) {
      return {
        nextThreshold: bracket.bracket_max,
        distance: bracket.bracket_max - income
      };
    }
  }
  
  // If we're in the highest bracket
  return {
    nextThreshold: Infinity,
    distance: Infinity
  };
}
