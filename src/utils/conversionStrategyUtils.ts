
/**
 * Conversion Strategy Utilities
 * 
 * Functions for determining conversion amounts based on different strategies.
 */

import { ConversionStrategyType } from '@/types/tax/rothConversionTypes';
import { FilingStatusType } from '@/types/tax/filingTypes';

// This is a mock implementation until the real tax bracket data is available
// In a real implementation, this would come from a tax bracket data source
const getTaxBracketsForYear = (year: number, filingStatus: FilingStatusType, type: string) => {
  // Return simplified brackets for demonstration
  if (filingStatus === 'single') {
    return [
      { min: 0, max: 11000, rate: 0.10 },
      { min: 11000, max: 44725, rate: 0.12 },
      { min: 44725, max: 95375, rate: 0.22 },
      { min: 95375, max: 182100, rate: 0.24 },
      { min: 182100, max: 231250, rate: 0.32 },
      { min: 231250, max: 578125, rate: 0.35 },
      { min: 578125, max: Infinity, rate: 0.37 }
    ];
  } else if (filingStatus === 'married_joint') {
    return [
      { min: 0, max: 22000, rate: 0.10 },
      { min: 22000, max: 89450, rate: 0.12 },
      { min: 89450, max: 190750, rate: 0.22 },
      { min: 190750, max: 364200, rate: 0.24 },
      { min: 364200, max: 462500, rate: 0.32 },
      { min: 462500, max: 693750, rate: 0.35 },
      { min: 693750, max: Infinity, rate: 0.37 }
    ];
  } else {
    // Default to simplified brackets for other filing statuses
    return [
      { min: 0, max: 15000, rate: 0.10 },
      { min: 15000, max: 60000, rate: 0.12 },
      { min: 60000, max: 120000, rate: 0.22 },
      { min: 120000, max: 240000, rate: 0.24 },
      { min: 240000, max: 300000, rate: 0.32 },
      { min: 300000, max: 600000, rate: 0.35 },
      { min: 600000, max: Infinity, rate: 0.37 }
    ];
  }
};

export const determineConversionAmountForStrategy = (
  strategy: ConversionStrategyType,
  fixedAmount: number,
  totalPreConversionIncome: number,
  year: number,
  filingStatus: FilingStatusType
): number => {
  switch (strategy) {
    case 'fixed':
      return fixedAmount;
    case 'bracket_12':
      return fillUpTo12PercentBracket(totalPreConversionIncome, year, filingStatus);
    case 'bracket_22':
      return fillUpTo22PercentBracket(totalPreConversionIncome, year, filingStatus);
    case 'bracket_12_22':
      return fillUpTo22PercentBracket(totalPreConversionIncome, year, filingStatus);
    case 'bracket_fill':
      return calculateOptimalFill(totalPreConversionIncome, year, filingStatus);
    case 'tax_efficient':
      return calculateEfficientAmount(totalPreConversionIncome, year, filingStatus);
    case 'partial':
    case 'custom':
    default:
      return Math.min(fixedAmount, 50000); // Default to fixed amount with a reasonable cap
  }
};

export const getStrategyLabel = (strategy: ConversionStrategyType): string => {
  switch (strategy) {
    case 'fixed':
      return 'Fixed Amount';
    case 'bracket_12':
      return 'Fill 12% Bracket';
    case 'bracket_22':
      return 'Fill 22% Bracket';
    case 'bracket_12_22':
      return 'Fill 12% + 22% Brackets';
    case 'bracket_fill':
      return 'Bracket Optimization';
    case 'tax_efficient':
      return 'Tax Efficiency';
    case 'partial':
      return 'Partial Conversion';
    case 'custom':
      return 'Custom Strategy';
    default:
      return 'Undefined Strategy';
  }
};

// Fill up to the 12% tax bracket
function fillUpTo12PercentBracket(
  currentIncome: number,
  year: number,
  filingStatus: FilingStatusType
): number {
  const brackets = getTaxBracketsForYear(year, filingStatus, 'ordinary');
  
  // Find the end of the 12% bracket
  const bracket12End = brackets.find(b => b.rate === 0.12)?.max || 0;
  
  // Calculate amount to fill up to the end of 12% bracket
  const amountToFill = Math.max(0, bracket12End - currentIncome);
  
  return amountToFill;
}

// Fill up to the 22% tax bracket
function fillUpTo22PercentBracket(
  currentIncome: number,
  year: number,
  filingStatus: FilingStatusType
): number {
  const brackets = getTaxBracketsForYear(year, filingStatus, 'ordinary');
  
  // Find the end of the 22% bracket
  const bracket22End = brackets.find(b => b.rate === 0.22)?.max || 0;
  
  // Calculate amount to fill up to the end of 22% bracket
  const amountToFill = Math.max(0, bracket22End - currentIncome);
  
  return amountToFill;
}

// Calculate the optimal fill amount based on tax brackets
function calculateOptimalFill(
  currentIncome: number,
  year: number,
  filingStatus: FilingStatusType
): number {
  // Optimal bracket strategy logic would go here
  // For now, use a simplified version that fills up to the 22% bracket
  return fillUpTo22PercentBracket(currentIncome, year, filingStatus);
}

// Calculate the most tax-efficient conversion amount
function calculateEfficientAmount(
  currentIncome: number,
  year: number,
  filingStatus: FilingStatusType
): number {
  // Tax-efficient strategy logic
  const brackets = getTaxBracketsForYear(year, filingStatus, 'ordinary');
  
  // Find where the 24% bracket starts (end of 22% bracket)
  const bracket22End = brackets.find(b => b.rate === 0.22)?.max || 0;
  
  // Find where the 12% bracket ends
  const bracket12End = brackets.find(b => b.rate === 0.12)?.max || 0;
  
  if (currentIncome < bracket12End) {
    // If in 10% or 12% bracket, fill up to end of 12% bracket
    return Math.max(0, bracket12End - currentIncome);
  } else if (currentIncome < bracket22End) {
    // If in 22% bracket, fill up to end of 22% bracket
    return Math.max(0, bracket22End - currentIncome);
  } else {
    // If in 24% or higher bracket, don't convert anything
    // unless there are special circumstances (e.g., future expected higher tax rates)
    return 0;
  }
}

export const getMaxConversionAmount = (traditionalIRABalance: number): number => {
  // Simple implementation that just returns the balance
  return traditionalIRABalance;
};
