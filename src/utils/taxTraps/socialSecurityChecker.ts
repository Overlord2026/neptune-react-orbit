
import { TaxTrapWarning } from './types';

// Social Security Taxation Thresholds
interface SocialSecurityThreshold {
  filing_status: string;
  threshold1: number; // 50% taxable threshold
  threshold2: number; // 85% taxable threshold
  notes: string;
}

const SOCIAL_SECURITY_THRESHOLDS: SocialSecurityThreshold[] = [
  { 
    filing_status: 'single', 
    threshold1: 25000, 
    threshold2: 34000, 
    notes: 'Income between threshold1 and threshold2 makes up to 50% of benefits taxable. Above threshold2, up to 85% may be taxable.'
  },
  { 
    filing_status: 'married', 
    threshold1: 32000, 
    threshold2: 44000, 
    notes: 'Income between threshold1 and threshold2 makes up to 50% of benefits taxable. Above threshold2, up to 85% may be taxable.'
  },
  { 
    filing_status: 'married_separate', 
    threshold1: 0, 
    threshold2: 0, 
    notes: 'Up to 85% of benefits may be taxable regardless of income.'
  },
  { 
    filing_status: 'head_of_household', 
    threshold1: 25000, 
    threshold2: 34000, 
    notes: 'Uses same thresholds as single filers.'
  }
];

/**
 * Calculate the taxable portion of Social Security benefits based on income thresholds
 */
export function calculateTaxableSocialSecurity(
  socialSecurityAmount: number, 
  otherIncome: number, 
  filingStatus: string
): number {
  // Find applicable threshold
  const threshold = SOCIAL_SECURITY_THRESHOLDS.find(t => t.filing_status === filingStatus) || 
    SOCIAL_SECURITY_THRESHOLDS[0]; // Default to single if not found
  
  // Calculate provisional income (other income + 50% of social security)
  const provisionalIncome = otherIncome + (socialSecurityAmount * 0.5);
  
  // Calculate taxable amount
  if (provisionalIncome <= threshold.threshold1) {
    // Below first threshold - none taxable
    return 0;
  } else if (provisionalIncome <= threshold.threshold2) {
    // Between thresholds - up to 50% taxable
    const taxableAmount = Math.min(
      socialSecurityAmount * 0.5,
      (provisionalIncome - threshold.threshold1) * 0.5
    );
    return Math.max(0, taxableAmount);
  } else {
    // Above second threshold - up to 85% taxable
    const baseAmount = Math.min(
      socialSecurityAmount * 0.5,
      (threshold.threshold2 - threshold.threshold1) * 0.5
    );
    const additionalAmount = Math.min(
      socialSecurityAmount * 0.85 - baseAmount,
      (provisionalIncome - threshold.threshold2) * 0.85
    );
    return Math.max(0, baseAmount + additionalAmount);
  }
}

export function generateSocialSecurityWarning(
  socialSecurityAmount: number,
  otherIncome: number,
  filingStatus: string
): TaxTrapWarning | null {
  if (socialSecurityAmount <= 0) {
    return null;
  }
  
  const taxableSS = calculateTaxableSocialSecurity(
    socialSecurityAmount,
    otherIncome,
    filingStatus
  );
  
  const taxablePercentage = (taxableSS / socialSecurityAmount) * 100;
  
  // Estimate the tax impact using marginal rate (simplified approach)
  const marginalRate = 0.22; // Assume 22% marginal rate - could be refined
  const tax_increase = taxableSS * marginalRate;
  
  if (taxablePercentage > 50) {
    return {
      type: 'social_security',
      severity: taxablePercentage > 80 ? 'alert' : 'warning',
      title: 'Social Security Tax Impact',
      description: `${Math.round(taxablePercentage)}% of your Social Security benefits may be taxable.`,
      financial_impact: tax_increase,
      icon: 'alertTriangle'
    };
  }
  
  return null;
}
