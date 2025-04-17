
/**
 * Tax Trap Checker
 * 
 * Utility for checking various tax traps in scenarios
 */
import { FilingStatusType } from '@/types/tax/filingTypes';
import { TaxTrapWarning, TaxTrapResult } from '@/types/taxTrapTypes';

export interface TaxTrapInput {
  scenario_id: string;
  year: number;
  filing_status: FilingStatusType | string;
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
  type: string;
  severity: "info" | "warning" | "danger";
  title: string;
  description: string;
  financial_impact?: number;
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
 * Check for tax traps based on input data
 */
export function checkTaxTraps(input: TaxTrapInput): TaxTrapResult {
  const warnings: TaxTrapWarning[] = [];
  const result: TaxTrapResult = {
    warnings: []
  };
  
  // Use MAGI if provided, otherwise use AGI
  const magi = input.magi || input.agi;
  
  // Check for IRMAA (Medicare premium surcharge)
  if (input.medicare_enrollment) {
    const irmaaThreshold = input.filing_status === 'married_joint' || input.filing_status === 'married' ? 194000 : 97000;
    if (magi > irmaaThreshold) {
      const partBSurcharge = 68.00; // Simplified - in reality there are tiers
      const partDSurcharge = 12.20; // Simplified
      const annualSurcharge = (partBSurcharge + partDSurcharge) * 12;
      
      warnings.push({
        type: 'irmaa',
        severity: 'warning',
        title: 'Medicare IRMAA Surcharge',
        description: `Your income may trigger an IRMAA surcharge of approximately $${annualSurcharge.toFixed(2)} annually on your Medicare premiums.`,
        financial_impact: annualSurcharge
      });
      
      result.irmaa_data = {
        partB_surcharge: partBSurcharge,
        partD_surcharge: partDSurcharge,
        annual_impact: annualSurcharge
      };
    }
  }
  
  // Check for Social Security taxation thresholds
  if (input.social_security_amount > 0) {
    const combinedIncome = input.agi + (input.social_security_amount * 0.5);
    const ssThreshold = input.filing_status === 'married_joint' || input.filing_status === 'married' ? 44000 : 34000;
    
    if (combinedIncome > ssThreshold) {
      const taxableAmount = Math.min(input.social_security_amount * 0.85, (combinedIncome - ssThreshold) * 0.85);
      const taxImpact = taxableAmount * 0.22; // Simplified using 22% tax rate
      
      warnings.push({
        type: 'social_security',
        severity: 'info',
        title: 'Social Security Taxation',
        description: `Up to 85% of your Social Security benefits may be taxable due to your income level.`,
        financial_impact: taxImpact
      });
      
      result.social_security_data = {
        taxable_percentage: 85,
        tax_increase: taxImpact
      };
    }
  }
  
  // Add other tax trap checks as needed
  
  // Set the warnings in the result
  result.warnings = warnings;
  
  return result;
}
