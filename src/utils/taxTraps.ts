
/**
 * Tax Trap Utilities
 * 
 * Functions for checking common tax traps and thresholds
 */

export interface TaxTrapInput {
  scenario_id: string;
  year: number;
  filing_status: string;
  agi: number;
  magi?: number;
  total_income: number;
  taxable_income: number;
  capital_gains_long: number;
  capital_gains_short: number;
  social_security_amount: number;
  household_size: number;
  medicare_enrollment: boolean;
  aca_enrollment: boolean;
  state_of_residence?: string;
}

export interface TaxTrapWarning {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'danger';
  threshold?: number;
  impact?: number;
  mitigationStrategy?: string;
}

export interface TaxTrapResult {
  warnings: TaxTrapWarning[];
  irmaa_data?: {
    partB_surcharge: number;
    partD_surcharge: number;
    annual_impact: number;
  };
  social_security_data?: {
    taxable_percentage: number;
    tax_increase: number;
  };
}

/**
 * Check for tax traps based on tax input
 */
export function checkTaxTraps(input: TaxTrapInput): TaxTrapResult {
  const warnings: TaxTrapWarning[] = [];
  
  // Check for IRMAA thresholds
  if (input.medicare_enrollment && checkIrmaaThreshold(input.agi, input.filing_status)) {
    warnings.push({
      id: 'irmaa_threshold',
      type: 'medicare_irmaa',
      title: 'Medicare IRMAA Surcharge',
      description: 'Your income exceeds a Medicare IRMAA threshold, which may result in higher Medicare premiums.',
      severity: 'warning',
      threshold: getIrmaaThreshold(input.filing_status),
      impact: calculateIrmaaImpact(input.agi, input.filing_status),
      mitigationStrategy: 'Consider income timing strategies to stay below IRMAA thresholds.'
    });
  }
  
  // Check for Social Security tax thresholds
  if (input.social_security_amount > 0 && checkSocialSecurityTaxability(input.agi, input.filing_status)) {
    warnings.push({
      id: 'ss_tax_threshold',
      type: 'ss_taxability',
      title: 'Social Security Taxation Threshold',
      description: 'Your income results in taxable Social Security benefits.',
      severity: 'info',
      threshold: getSocialSecurityTaxThreshold(input.filing_status),
      impact: calculateSocialSecurityTaxImpact(input.agi, input.social_security_amount, input.filing_status),
      mitigationStrategy: 'Consider Roth conversions in low-income years to reduce future RMDs.'
    });
  }
  
  // Create response with any applicable data
  const result: TaxTrapResult = {
    warnings
  };
  
  if (warnings.some(w => w.type === 'medicare_irmaa')) {
    result.irmaa_data = {
      partB_surcharge: 68.50, // Example values
      partD_surcharge: 12.40,
      annual_impact: (68.50 + 12.40) * 12
    };
  }
  
  if (warnings.some(w => w.type === 'ss_taxability')) {
    result.social_security_data = {
      taxable_percentage: calculateSocialSecurityTaxablePercentage(input.agi, input.social_security_amount, input.filing_status),
      tax_increase: calculateSocialSecurityTaxIncrease(input.agi, input.social_security_amount, input.filing_status)
    };
  }
  
  return result;
}

// Helper functions
function checkIrmaaThreshold(income: number, filingStatus: string): boolean {
  return income > getIrmaaThreshold(filingStatus);
}

function getIrmaaThreshold(filingStatus: string): number {
  return filingStatus === 'married' ? 176000 : 88000;
}

function calculateIrmaaImpact(income: number, filingStatus: string): number {
  // Simple implementation
  return 968.40; // Annual impact
}

function checkSocialSecurityTaxability(income: number, filingStatus: string): boolean {
  return income > getSocialSecurityTaxThreshold(filingStatus);
}

function getSocialSecurityTaxThreshold(filingStatus: string): number {
  return filingStatus === 'married' ? 32000 : 25000;
}

function calculateSocialSecurityTaxablePercentage(income: number, ssAmount: number, filingStatus: string): number {
  // Simple implementation
  if (income > (filingStatus === 'married' ? 44000 : 34000)) {
    return 85;
  } else if (income > (filingStatus === 'married' ? 32000 : 25000)) {
    return 50;
  }
  return 0;
}

function calculateSocialSecurityTaxImpact(income: number, ssAmount: number, filingStatus: string): number {
  // Simple implementation
  const taxablePercentage = calculateSocialSecurityTaxablePercentage(income, ssAmount, filingStatus);
  return (ssAmount * taxablePercentage / 100) * 0.22; // Assuming 22% tax bracket
}

function calculateSocialSecurityTaxIncrease(income: number, ssAmount: number, filingStatus: string): number {
  // Simple implementation
  return ssAmount * 0.22 * (calculateSocialSecurityTaxablePercentage(income, ssAmount, filingStatus) / 100);
}
