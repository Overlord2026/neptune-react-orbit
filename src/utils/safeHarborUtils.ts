
/**
 * Safe Harbor Utilities
 * 
 * Functions for calculating safe harbor tax payment requirements
 */

export interface SafeHarborInput {
  prior_year_tax?: number;
  current_year_tax: number;
  agi?: number;
  withholding?: number;
  estimated_payments?: number;
  is_high_income?: boolean;
}

export interface SafeHarborResult {
  required_payment: number;
  is_compliant: boolean;
  method_used: string;
}

export function calculateSafeHarbor(input: SafeHarborInput): SafeHarborResult {
  const { 
    prior_year_tax = 0, 
    current_year_tax = 0, 
    agi = 0,
    withholding = 0,
    estimated_payments = 0,
    is_high_income = false
  } = input;
  
  const totalPayments = withholding + estimated_payments;
  
  // Calculate safe harbor amounts using different methods
  const priorYearPercentage = is_high_income ? 1.1 : 1.0;
  const priorYearAmount = prior_year_tax * priorYearPercentage;
  
  // 90% of current year tax liability
  const currentYearAmount = current_year_tax * 0.9;
  
  // Determine the applicable safe harbor amount (the lesser of the two)
  let safeHarborAmount = Math.min(priorYearAmount, currentYearAmount);
  
  // If lower than $1,000, use the fixed amount
  if (current_year_tax - withholding < 1000) {
    safeHarborAmount = current_year_tax;
  }
  
  // Determine which method was used
  let method_used = '';
  if (safeHarborAmount === priorYearAmount) {
    method_used = is_high_income ? '110% of Prior Year' : '100% of Prior Year';
  } else if (safeHarborAmount === currentYearAmount) {
    method_used = '90% of Current Year';
  } else {
    method_used = '$1,000 Remaining Tax Rule';
  }
  
  const is_compliant = totalPayments >= safeHarborAmount;
  
  return {
    required_payment: safeHarborAmount,
    is_compliant,
    method_used
  };
}
