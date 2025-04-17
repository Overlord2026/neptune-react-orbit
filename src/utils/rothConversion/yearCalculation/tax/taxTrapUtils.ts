/**
 * Tax Trap Utility Functions
 * 
 * Functions for detecting and handling tax traps in Roth conversion scenarios
 */

import { TaxTrapResult, TaxTrapWarning } from '@/utils/taxTraps';
import { calculateIrmaaImpact } from '@/utils/irmaaCalculator';
import { calculateAcaSubsidyImpact } from '@/utils/acaCalculator';
import { calculateSocialSecurityTaxability } from '@/utils/socialSecurityUtils';
import { calculateCapitalGainsBracketImpact } from '@/utils/capitalGainsUtils';

interface TaxTrapParams {
  year: number;
  agi: number;
  magi: number;
  totalIncome: number;
  taxableIncome: number;
  socialSecurityAmount: number;
  capitalGainsAmount: number;
  filingStatus: string;
  isOnMedicare: boolean;
  hasAcaInsurance: boolean;
  stateOfResidence?: string;
  householdSize: number;
}

/**
 * Detect potential tax traps based on income and other factors
 */
export function detectTaxTraps(params: TaxTrapParams): TaxTrapResult {
  const {
    year,
    agi,
    magi,
    totalIncome,
    taxableIncome,
    socialSecurityAmount,
    capitalGainsAmount,
    filingStatus,
    isOnMedicare,
    hasAcaInsurance,
    stateOfResidence,
    householdSize
  } = params;
  
  // Initialize result
  const result: TaxTrapResult = {
    scenario_id: `${year}_${filingStatus}_${Math.round(agi)}`,
    warnings: []
  };
  
  // Check for IRMAA cliff if on Medicare
  if (isOnMedicare) {
    const irmaaImpact = calculateIrmaaImpact(magi, filingStatus, year);
    if (irmaaImpact.total_surcharge > 0) {
      result.warnings.push({
        type: 'irmaa',
        severity: 'warning',
        title: 'Medicare IRMAA Surcharge',
        description: `Your income may trigger an IRMAA surcharge of $${irmaaImpact.total_surcharge.toFixed(2)} per month ($${(irmaaImpact.total_surcharge * 12).toFixed(2)} per year).`,
        financial_impact: irmaaImpact.total_surcharge * 12
      });
      
      result.irmaa_data = {
        partB_surcharge: irmaaImpact.part_b_surcharge,
        partD_surcharge: irmaaImpact.part_d_surcharge,
        annual_impact: irmaaImpact.total_surcharge * 12
      };
    }
  }
  
  // Check for ACA subsidy cliff
  if (hasAcaInsurance) {
    const acaImpact = calculateAcaSubsidyImpact(magi, householdSize, filingStatus, stateOfResidence);
    if (acaImpact.subsidy_loss > 0) {
      result.warnings.push({
        type: 'aca',
        severity: 'warning',
        title: 'ACA Subsidy Reduction',
        description: `Your income may reduce your ACA premium subsidy by $${acaImpact.subsidy_loss.toFixed(2)} per year.`,
        financial_impact: acaImpact.subsidy_loss
      });
      
      result.aca_data = {
        current_fpl_percentage: acaImpact.fpl_percentage,
        subsidy_impact: acaImpact.subsidy_loss
      };
    }
  }
  
  // Check for Social Security taxation threshold
  if (socialSecurityAmount > 0) {
    const ssTaxability = calculateSocialSecurityTaxability(agi, socialSecurityAmount, filingStatus);
    if (ssTaxability.additional_taxable_amount > 0) {
      result.warnings.push({
        type: 'social_security',
        severity: 'info',
        title: 'Social Security Taxation',
        description: `Your income may cause up to ${ssTaxability.taxable_percentage}% of your Social Security benefits to be taxable.`,
        financial_impact: ssTaxability.tax_impact
      });
      
      result.social_security_data = {
        taxable_percentage: ssTaxability.taxable_percentage,
        tax_increase: ssTaxability.tax_impact
      };
    }
  }
  
  // Check for capital gains bracket changes
  if (capitalGainsAmount > 0) {
    const cgImpact = calculateCapitalGainsBracketImpact(agi, capitalGainsAmount, filingStatus, year);
    if (cgImpact.rate_increase > 0) {
      result.warnings.push({
        type: 'capital_gains',
        severity: 'warning',
        title: 'Capital Gains Rate Increase',
        description: `Your income may push some capital gains from ${cgImpact.current_rate}% to ${cgImpact.potential_rate}% tax rate.`,
        financial_impact: cgImpact.tax_increase
      });
      
      result.capital_gains_data = {
        current_rate: cgImpact.current_rate,
        potential_rate: cgImpact.potential_rate,
        tax_increase: cgImpact.tax_increase
      };
    }
  }
  
  return result;
}

/**
 * Filter warnings based on severity level
 */
export function filterWarningsBySeverity(warnings: TaxTrapWarning[], minSeverity: 'info' | 'warning' | 'alert' = 'info'): TaxTrapWarning[] {
  return warnings.filter(warning => {
    if (minSeverity === 'info') {
      return true; // Return all warnings
    } else if (minSeverity === 'warning') {
      return warning.severity === 'warning' || warning.severity === 'alert';
    } else {
      return warning.severity === 'alert';
    }
  });
}

/**
 * Calculate the total financial impact of all warnings
 */
export function calculateTotalFinancialImpact(warnings: TaxTrapWarning[]): number {
  return warnings.reduce((total, warning) => total + warning.financial_impact, 0);
}

/**
 * Check if a specific trap type exists in the warnings
 */
export function hasTrapType(warnings: TaxTrapWarning[], trapType: string): boolean {
  return warnings.some(warning => warning.type === trapType);
}

/**
 * Get the most severe warning from a list
 */
export function getMostSevereWarning(warnings: TaxTrapWarning[]): TaxTrapWarning | null {
  if (warnings.length === 0) return null;
  
  // Sort by severity (alert > warning > info)
  const severityOrder = { 'alert': 3, 'warning': 2, 'info': 1 };
  
  return warnings.reduce((mostSevere, current) => {
    const currentSeverity = severityOrder[current.severity] || 0;
    const mostSevereSeverity = mostSevere ? (severityOrder[mostSevere.severity] || 0) : 0;
    
    return currentSeverity > mostSevereSeverity ? current : mostSevere;
  }, null as TaxTrapWarning | null);
}

/**
 * Format warnings for display in UI
 */
export function formatWarningsForDisplay(warnings: TaxTrapWarning[]): Array<{
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  trapType: string;
}> {
  return warnings.map(warning => {
    // Map severity to UI-friendly format
    let uiSeverity: 'low' | 'medium' | 'high';
    switch (warning.severity) {
      case 'alert':
        uiSeverity = 'high';
        break;
      case 'warning':
        uiSeverity = 'medium';
        break;
      default:
        uiSeverity = 'low';
    }
    
    return {
      type: warning.title,
      message: warning.description,
      severity: uiSeverity,
      trapType: warning.type
    };
  });
}
