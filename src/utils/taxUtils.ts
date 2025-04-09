
/**
 * Tax Utilities
 * 
 * Helper functions for tax calculations and bracket management
 */

import { 
  FilingStatusType, 
  BracketType, 
  TAX_BRACKETS_DATA, 
  getBrackets, 
  calculateTax, 
  STANDARD_DEDUCTION 
} from './taxBracketData';

/**
 * Calculate taxable income after applying deductions
 */
export const calculateTaxableIncome = (
  income: number,
  year: number,
  filingStatus: FilingStatusType,
  isItemizedDeduction: boolean = false,
  itemizedDeductionAmount: number = 0
): number => {
  // Get standard deduction for the year and filing status
  const standardDeduction = STANDARD_DEDUCTION[year as keyof typeof STANDARD_DEDUCTION]?.[filingStatus] || 0;
  
  // Use itemized deduction if selected and greater than standard deduction
  const deduction = isItemizedDeduction ? itemizedDeductionAmount : standardDeduction;
  
  // Calculate and return taxable income (cannot be negative)
  return Math.max(0, income - deduction);
};

/**
 * Calculate total tax liability (ordinary income + capital gains)
 */
export const calculateTotalTaxLiability = (
  ordinaryIncome: number,
  capitalGains: number,
  year: number,
  filingStatus: FilingStatusType,
  isItemizedDeduction: boolean = false,
  itemizedDeductionAmount: number = 0
): { 
  totalTax: number;
  ordinaryTax: number;
  capitalGainsTax: number;
  effectiveRate: number;
  marginalOrdinaryRate: number;
  marginalCapitalGainsRate: number;
} => {
  // Calculate taxable income
  const totalIncome = ordinaryIncome + capitalGains;
  const taxableIncome = calculateTaxableIncome(
    totalIncome, 
    year, 
    filingStatus, 
    isItemizedDeduction, 
    itemizedDeductionAmount
  );
  
  // Calculate tax on ordinary income
  const ordinaryTaxableIncome = Math.min(ordinaryIncome, taxableIncome);
  const ordinaryTax = calculateTax(ordinaryTaxableIncome, year, filingStatus, "ordinary");
  
  // Calculate tax on capital gains (if any remains after deductions)
  const capitalGainsTaxableIncome = Math.max(0, taxableIncome - ordinaryTaxableIncome);
  const capitalGainsTax = calculateTax(capitalGainsTaxableIncome, year, filingStatus, "ltcg");
  
  // Calculate total tax and effective rate
  const totalTax = ordinaryTax + capitalGainsTax;
  const effectiveRate = totalIncome > 0 ? totalTax / totalIncome : 0;
  
  // Find marginal rates
  const marginalOrdinaryBracket = getBrackets(year, filingStatus, "ordinary")
    .filter(bracket => ordinaryTaxableIncome >= bracket.bracket_min)
    .sort((a, b) => b.bracket_min - a.bracket_min)[0];
    
  const marginalCapitalGainsBracket = getBrackets(year, filingStatus, "ltcg")
    .filter(bracket => capitalGainsTaxableIncome >= bracket.bracket_min)
    .sort((a, b) => b.bracket_min - a.bracket_min)[0];
  
  return {
    totalTax,
    ordinaryTax,
    capitalGainsTax,
    effectiveRate,
    marginalOrdinaryRate: marginalOrdinaryBracket?.rate || 0,
    marginalCapitalGainsRate: marginalCapitalGainsBracket?.rate || 0
  };
};

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

/**
 * Format currency values for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format percentage values for display
 */
export const formatPercent = (rate: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rate);
};
