
/**
 * Tax calculation utilities for multi-year scenario planning
 */

import { YearlyTaxImpact } from '../../types';
import { getTaxBracket, getNextBracket, checkIrmaaImpact } from '../taxBracketUtils';

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
  const nextBracketInfo = getNextBracket(totalIncome);

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
  
  // Check IRMAA impact
  const irmaaImpact = checkIrmaaImpact(totalIncome);

  // State tax (simplified)
  const stateTax = includeStateTax ? totalIncome * 0.05 : 0;
  const federalTax = totalTax - stateTax;
  
  return {
    year,
    ordinaryIncome: totalIncome,
    amtIncome,
    amtAdjustment,
    totalTax,
    taxWithoutStrategy,
    taxSavings,
    marginalRate,
    incomeBracket,
    nextBracket: nextBracketInfo.rate,
    distanceToNextBracket: nextBracketInfo.distance,
    irmaaImpact,
    // Add missing required fields
    capitalGains: 0, // No capital gains in this context
    effectiveRate,
    taxableIncome: totalIncome * 0.9, // Simplified taxable income calculation
    equityIncome,
    amtImpact: amtAdjustment,
    stateTax,
    federalTax
  };
};
