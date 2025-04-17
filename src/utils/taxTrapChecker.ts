
/**
 * Tax Trap Checker
 * 
 * Utility for checking various tax traps in scenarios
 */
import { FilingStatusType } from '@/types/tax/filingTypes';

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

// Standardize the warning severity to match taxTrapTypes.ts
export interface TaxTrapWarning {
  type: string;
  severity: "low" | "medium" | "high";  // Changed to match taxTrapTypes
  title: string;
  description: string;
  financial_impact?: number;
  trapType?: string;  // Added for compatibility
}

export interface TaxTrapResult {
  scenario_id: string;  // Made required
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
  aca_data?: {
    current_fpl_percentage: number;
    subsidy_impact: number;
  };
}

/**
 * Check for tax traps based on input data
 */
export function checkTaxTraps(input: TaxTrapInput): TaxTrapResult {
  const warnings: TaxTrapWarning[] = [];
  const result: TaxTrapResult = {
    scenario_id: input.scenario_id,
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
        severity: 'medium',  // Changed from 'warning' to 'medium'
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
        severity: 'low',  // Changed from 'info' to 'low'
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
  
  // Add ACA subsidy check
  if (input.aca_enrollment) {
    const fplAmount = 13590; // Base FPL amount for 2023
    const householdSize = input.household_size || 1;
    const adjustedFPL = fplAmount + ((householdSize - 1) * 4720);
    const fplPercentage = (input.agi / adjustedFPL) * 100;
    
    if (fplPercentage > 395) {
      const estimatedSubsidyLoss = householdSize * 5000; // Rough estimate
      
      warnings.push({
        type: 'aca',
        severity: 'high',
        title: 'ACA Subsidy Cliff',
        description: `Your income is close to or over 400% FPL, which may cause loss of ACA premium subsidies.`,
        financial_impact: estimatedSubsidyLoss
      });
      
      result.aca_data = {
        current_fpl_percentage: Math.round(fplPercentage),
        subsidy_impact: estimatedSubsidyLoss
      };
    }
  }
  
  // Set the warnings in the result
  result.warnings = warnings;
  
  return result;
}
