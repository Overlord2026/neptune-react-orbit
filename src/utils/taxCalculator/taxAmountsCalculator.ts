
/**
 * Tax Amounts Calculator
 * 
 * Core tax calculation functions
 */

import { TaxInput } from '../taxCalculatorTypes';
import { FilingStatusType } from '@/types/tax/filingTypes';
import { calculateTaxableIncome } from './taxableIncomeCalculator';
import { getTaxBracket, getCapitalGainsBracket } from '../taxBracketData';

/**
 * Calculate the core tax amounts for a tax input
 */
export function calculateTaxAmounts(input: TaxInput) {
  // Extract and normalize income values
  const wages = input.wages || 0;
  const interest = input.interest || 0;
  const dividends = input.dividends || 0;
  const capital_gains = input.capitalGains || input.capital_gains || 0;
  const ira_distributions = input.ira_distributions || 0;
  const roth_conversion = input.roth_conversion || 0;
  const social_security = input.social_security || 0;
  
  // Taxable portion of social security (simplified as 85%)
  const taxable_ss = social_security * 0.85;
  
  // Calculate total income
  const total_income = 
    wages + 
    interest + 
    dividends + 
    capital_gains + 
    ira_distributions + 
    roth_conversion + 
    taxable_ss;
  
  // Adjusted gross income (simplified)
  const agi = total_income;
  
  // Ordinary income components (excludes capital gains)
  const ordinary_income = 
    wages + 
    interest + 
    dividends + 
    ira_distributions + 
    roth_conversion + 
    taxable_ss;
  
  // Calculate taxable income after deductions
  const taxable_income = calculateTaxableIncome(
    total_income,
    input.year,
    input.filingStatus || input.filing_status as FilingStatusType,
    input.isItemizedDeduction,
    input.itemizedDeductionAmount
  );
  
  // Calculate ordinary tax on ordinary income
  // Capital gains are taxed separately
  const ordinary_taxable = Math.max(0, taxable_income - Math.min(taxable_income, capital_gains));
  const ordinary_tax = calculateOrdinaryTax(ordinary_taxable, input.year, input.filingStatus || input.filing_status as FilingStatusType);
  
  // Calculate capital gains tax
  const taxable_capital_gains = Math.min(taxable_income, capital_gains);
  const capital_gains_tax = calculateCapitalGainsTax(
    taxable_capital_gains, 
    ordinary_taxable, 
    input.year, 
    input.filingStatus || input.filing_status as FilingStatusType
  );
  
  // Total federal tax
  const total_tax = ordinary_tax + capital_gains_tax;
  
  // Calculate state tax if requested
  let state_tax = 0;
  if (input.includeStateTax && input.residentState) {
    const stateRate = getApproximateStateRate(input.residentState, agi);
    state_tax = agi * stateRate;
  }
  
  // Calculate marginal and effective rates
  const marginal_rate = getMarginalRate(taxable_income, input.year, input.filingStatus || input.filing_status as FilingStatusType);
  const marginal_capital_gains_rate = getMarginalCapitalGainsRate(ordinary_income, capital_gains, input.year, input.filingStatus || input.filing_status as FilingStatusType);
  const effective_rate = total_income > 0 ? total_tax / total_income : 0;
  
  return {
    total_income,
    agi,
    taxable_income,
    ordinary_tax,
    capital_gains_tax,
    total_tax,
    state_tax,
    marginal_rate,
    effective_rate,
    marginal_capital_gains_rate
  };
}

/**
 * Calculate ordinary income tax
 */
function calculateOrdinaryTax(amount: number, year: number, filingStatus: FilingStatusType): number {
  // For a simplified implementation, we'll use a progressive bracket approach
  const taxBrackets = [
    { min: 0, max: 10000, rate: 0.10 },
    { min: 10000, max: 40000, rate: 0.12 },
    { min: 40000, max: 85000, rate: 0.22 },
    { min: 85000, max: 165000, rate: 0.24 },
    { min: 165000, max: 210000, rate: 0.32 },
    { min: 210000, max: 520000, rate: 0.35 },
    { min: 520000, max: Infinity, rate: 0.37 }
  ];
  
  let tax = 0;
  let remainingAmount = amount;
  
  for (const bracket of taxBrackets) {
    if (remainingAmount <= 0) break;
    
    const taxableInBracket = Math.min(
      remainingAmount, 
      bracket.max - bracket.min
    );
    
    tax += taxableInBracket * bracket.rate;
    remainingAmount -= taxableInBracket;
  }
  
  return tax;
}

/**
 * Calculate capital gains tax
 */
function calculateCapitalGainsTax(
  amount: number, 
  ordinaryIncome: number, 
  year: number, 
  filingStatus: FilingStatusType
): number {
  // Simplified capital gains brackets
  const cgBrackets = [
    { min: 0, max: 40000, rate: 0 },
    { min: 40000, max: 445000, rate: 0.15 },
    { min: 445000, max: Infinity, rate: 0.20 }
  ];
  
  // Capital gains are stacked on top of ordinary income for bracket determination
  const startingPoint = ordinaryIncome;
  let remainingAmount = amount;
  let tax = 0;
  
  for (const bracket of cgBrackets) {
    if (remainingAmount <= 0) break;
    
    // Skip brackets completely below our starting point
    if (bracket.max <= startingPoint) continue;
    
    // Calculate actual starting point within this bracket
    const adjustedMin = Math.max(bracket.min, startingPoint);
    const bracketSize = bracket.max - adjustedMin;
    const taxableInBracket = Math.min(remainingAmount, bracketSize);
    
    tax += taxableInBracket * bracket.rate;
    remainingAmount -= taxableInBracket;
  }
  
  return tax;
}

/**
 * Get the marginal tax rate based on taxable income
 */
function getMarginalRate(taxableIncome: number, year: number, filingStatus: FilingStatusType): number {
  const bracket = getTaxBracket(taxableIncome, filingStatus);
  return bracket?.rate || 0;
}

/**
 * Get the marginal capital gains rate
 */
function getMarginalCapitalGainsRate(
  ordinaryIncome: number,
  capitalGains: number,
  year: number,
  filingStatus: FilingStatusType
): number {
  const totalIncome = ordinaryIncome + capitalGains;
  const bracket = getCapitalGainsBracket(totalIncome, filingStatus);
  return bracket?.rate || 0;
}

/**
 * Get approximate state tax rate
 */
function getApproximateStateRate(stateCode: string, income: number): number {
  // Map of simplified state rates (for illustration purposes)
  const stateRates: Record<string, number> = {
    'CA': 0.093,
    'NY': 0.068,
    'TX': 0,
    'FL': 0,
    'WA': 0,
    'IL': 0.0495,
    'PA': 0.0307,
    'OH': 0.035,
    'MI': 0.0425,
  };
  
  return stateRates[stateCode] || 0.05; // Default to 5% for states not in the map
}
