
/**
 * Tax calculation utilities for multi-year scenario planning
 */

import { YearlyTaxImpact } from '@/types/tax/equityTypes';
import { getTaxBracket } from '../taxBracketUtils';

/**
 * Calculate tax for multi-year equity scenarios
 */
export const calculateTaxForMultiYearEquity = (income: number, year: number, filingStatus: string): number => {
  // Simplified implementation of tax calculation for multi-year equity
  const taxRate = income > 200000 ? 0.32 : income > 100000 ? 0.24 : 0.22;
  return income * taxRate;
};

/**
 * Calculate tax metrics for a given year with specified income levels
 */
export const calculateYearlyTaxMetrics = (
  year: number,
  totalIncome: number,
  baseIncome: number,
  equityIncome: number,
  amtIncome: number,
  includeStateTax: boolean,
  totalIncomeWithoutStrategy?: number
): YearlyTaxImpact => {
  // Get tax brackets
  const incomeBracket = getTaxBracket(totalIncome);
  const nextBracketInfo = {
    rate: "Higher bracket",
    distance: 20000 // Simplified for this example
  };

  // Simplified tax calculation
  const marginalRate = parseFloat(incomeBracket.replace('%', '')) / 100;
  const totalTax = totalIncome * 0.20; // Simplistic effective tax rate
  const taxWithoutStrategy = totalIncomeWithoutStrategy 
    ? totalIncomeWithoutStrategy * 0.20 
    : totalTax; // Same simplistic rate
  
  const taxSavings = Math.max(0, taxWithoutStrategy - totalTax);
  const effectiveRate = totalTax / totalIncome;
  
  // AMT calculation (simplified)
  const amtAdjustment = amtIncome > 0 ? amtIncome * 0.26 : 0;
  const amtImpact = amtAdjustment;
  
  // Check IRMAA impact
  const irmaaImpact = totalIncome > 97000;

  // State tax (simplified)
  const stateTax = includeStateTax ? totalIncome * 0.05 : 0;
  const federalTax = totalTax - stateTax;
  
  return {
    year,
    ordinaryIncome: totalIncome,
    totalTax,
    taxWithoutStrategy,
    taxSavings,
    marginalRate,
    effectiveRate,
    taxableIncome: totalIncome * 0.9, // Simplified taxable income calculation
    equityIncome,
    incomeBracket,
    nextBracket: nextBracketInfo.rate,
    distanceToNextBracket: nextBracketInfo.distance,
    irmaaImpact,
    amtAdjustment,
    amtIncome,
    amtImpact,
    stateTax,
    federalTax
  };
};

// Export these functions that are referenced elsewhere
export const getNextBracket = (income: number) => {
  return {
    rate: "Higher bracket",
    distance: 20000 // Simplified for this example
  };
};

export const checkIrmaaImpact = (income: number): boolean => {
  return income > 97000;
};
