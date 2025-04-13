
/**
 * Safe Harbor Calculation Utilities
 * 
 * Functions for calculating safe harbor requirements to avoid underpayment penalties.
 */

export interface SafeHarborInput {
  current_withholding: number;
  estimated_remaining_withholding: number;
  prior_year_tax: number;
  current_year_tax: number;
  high_income?: boolean; // For the 110% rule if AGI > $150,000
}

export interface SafeHarborResult {
  total_projected_payments: number;
  safe_harbor_minimum: number;
  meets_safe_harbor: boolean;
  shortfall: number;
  recommended_additional_withholding: number;
}

/**
 * Calculate safe harbor requirements to avoid underpayment penalties
 */
export function calculateSafeHarbor(input: SafeHarborInput): SafeHarborResult {
  // Calculate total projected payments for the year
  const total_projected_payments = input.current_withholding + input.estimated_remaining_withholding;
  
  // Calculate safe harbor minimum based on IRS rules:
  // - 90% of current year's tax, or
  // - 100% of prior year's tax (or 110% if high income)
  const current_year_minimum = input.current_year_tax * 0.9;
  const prior_year_minimum = input.prior_year_tax * (input.high_income ? 1.1 : 1.0);
  
  // Safe harbor is the lower of the two requirements
  const safe_harbor_minimum = Math.min(current_year_minimum, prior_year_minimum);
  
  // Check if current withholding meets safe harbor
  const meets_safe_harbor = total_projected_payments >= safe_harbor_minimum;
  
  // Calculate shortfall if any
  const shortfall = meets_safe_harbor ? 0 : (safe_harbor_minimum - total_projected_payments);
  
  // Recommended additional withholding (round up to nearest $100)
  const recommended_additional_withholding = shortfall > 0 
    ? Math.ceil(shortfall / 100) * 100 
    : 0;

  return {
    total_projected_payments,
    safe_harbor_minimum,
    meets_safe_harbor,
    shortfall,
    recommended_additional_withholding
  };
}
