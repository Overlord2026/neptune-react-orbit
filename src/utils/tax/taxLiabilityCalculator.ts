
/**
 * Tax Liability Calculator
 * 
 * Utility functions for calculating total tax liability
 */

import { 
  FilingStatusType,
  BracketType, 
  getBrackets
} from '../taxBracketData';
import { calculateTaxableIncome } from './taxableIncomeCalculator';
import { BracketItem } from '../taxCalculatorTypes';

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
  bracketsBreakdown: {
    ordinary: BracketItem[];
    capitalGains: BracketItem[];
  }
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
  const ordinaryBrackets = getBrackets(year, filingStatus, "ordinary");
  
  // Track income in each bracket for breakdown
  let remainingOrdinaryIncome = ordinaryTaxableIncome;
  let ordinaryTax = 0;
  const ordinaryBreakdown: BracketItem[] = [];
  
  for (const bracket of ordinaryBrackets) {
    if (remainingOrdinaryIncome <= 0) break;
    
    const bracketSize = bracket.bracket_max - bracket.bracket_min;
    const amountInBracket = Math.min(remainingOrdinaryIncome, bracketSize);
    const taxInBracket = amountInBracket * bracket.rate;
    
    ordinaryBreakdown.push({
      bracket: bracket.rate * 100, // Convert to percentage
      amount: amountInBracket,
      tax: taxInBracket
    });
    
    ordinaryTax += taxInBracket;
    remainingOrdinaryIncome -= amountInBracket;
  }
  
  // Calculate tax on capital gains (if any remains after deductions)
  // Capital gains get stacked on top of ordinary income for bracket purposes
  const capitalGainsTaxableIncome = Math.max(0, taxableIncome - ordinaryTaxableIncome);
  const ltcgBrackets = getBrackets(year, filingStatus, "ltcg");
  
  // For LTCG brackets, we need to consider the ordinary income already taxed
  // This determines what LTCG bracket to start with
  let remainingCapitalGains = capitalGainsTaxableIncome;
  let capitalGainsTax = 0;
  const capitalGainsBreakdown: BracketItem[] = [];
  
  // First, skip any brackets that are fully consumed by ordinary income
  let effectiveOrdinaryIncome = ordinaryTaxableIncome;
  
  for (const bracket of ltcgBrackets) {
    if (remainingCapitalGains <= 0) break;
    
    // Figure out where in this bracket we are starting from
    let startPoint = Math.max(bracket.bracket_min, effectiveOrdinaryIncome);
    
    // If we're already past this bracket, skip it
    if (startPoint >= bracket.bracket_max) continue;
    
    // Calculate how much room is left in this bracket
    const bracketRoomLeft = bracket.bracket_max - startPoint;
    const amountInBracket = Math.min(remainingCapitalGains, bracketRoomLeft);
    const taxInBracket = amountInBracket * bracket.rate;
    
    capitalGainsBreakdown.push({
      bracket: bracket.rate * 100, // Convert to percentage
      amount: amountInBracket, 
      tax: taxInBracket
    });
    
    capitalGainsTax += taxInBracket;
    remainingCapitalGains -= amountInBracket;
  }
  
  // Calculate total tax and effective rate
  const totalTax = ordinaryTax + capitalGainsTax;
  const effectiveRate = totalIncome > 0 ? totalTax / totalIncome : 0;
  
  // Find marginal rates
  const marginalOrdinaryBracket = getBrackets(year, filingStatus, "ordinary")
    .filter(bracket => ordinaryTaxableIncome >= bracket.bracket_min)
    .sort((a, b) => b.bracket_min - a.bracket_min)[0];
    
  const marginalCapitalGainsBracket = getBrackets(year, filingStatus, "ltcg")
    .filter(bracket => (ordinaryTaxableIncome + capitalGainsTaxableIncome) >= bracket.bracket_min)
    .sort((a, b) => b.bracket_min - a.bracket_min)[0];
  
  return {
    totalTax,
    ordinaryTax,
    capitalGainsTax,
    effectiveRate,
    marginalOrdinaryRate: marginalOrdinaryBracket?.rate || 0,
    marginalCapitalGainsRate: marginalCapitalGainsBracket?.rate || 0,
    bracketsBreakdown: {
      ordinary: ordinaryBreakdown,
      capitalGains: capitalGainsBreakdown
    }
  };
};
