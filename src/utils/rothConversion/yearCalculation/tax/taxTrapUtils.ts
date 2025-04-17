
/**
 * Tax Trap Utility Functions
 * 
 * Functions for detecting and analyzing tax traps in various scenarios.
 */

import { TaxTrapWarning, TaxTrapResult } from '@/types/taxTrapTypes';

interface TaxTrapCheckParams {
  scenarioId: string;
  year: number;
  filingStatus: string;
  baseAGI: number;
  currentAge: number;
  isMarried?: boolean;
  isMedicare?: boolean;
  hasSocialSecurity?: boolean;
  socialSecurityAmount?: number;
  hasCapitalGains?: boolean;
  capitalGainsAmount?: number;
  hasACA?: boolean;
}

/**
 * Check for potential tax traps based on scenario parameters
 */
export function checkForTaxTraps({
  scenarioId,
  year,
  filingStatus,
  baseAGI,
  currentAge,
  isMarried = false,
  isMedicare = false,
  hasSocialSecurity = false,
  socialSecurityAmount = 0,
  hasCapitalGains = false,
  capitalGainsAmount = 0,
  hasACA = false
}: TaxTrapCheckParams): { trapResults: TaxTrapResult; warnings: { type: string; message: string; severity: 'low' | 'medium' | 'high'; trapType: string }[] } {
  const warnings: TaxTrapWarning[] = [];
  
  // Initialize result object
  const trapResults: TaxTrapResult = {
    warnings: [],
    scenario_id: scenarioId
  };
  
  // Check for Medicare IRMAA surcharges
  if (currentAge >= 65 || isMedicare) {
    const threshold = filingStatus === 'single' || filingStatus === 'married_separate' ? 97000 : 194000;
    
    if (baseAGI > threshold) {
      warnings.push({
        id: `irmaa-${scenarioId}`,
        trapType: 'irmaa',
        type: 'irmaa', // Ensure type is always set
        message: 'Medicare IRMAA Surcharge Triggered',
        details: `Your MAGI of $${baseAGI.toLocaleString()} exceeds the IRMAA threshold, triggering additional Medicare premium costs.`,
        severity: 'medium',
        threshold: {
          value: threshold,
          units: 'USD'
        },
        remediation: 'Consider tax-efficient withdrawal strategies or charitable giving to reduce MAGI.'
      });
      
      // Calculate surcharge amounts
      trapResults.irmaa_data = {
        partB_surcharge: baseAGI > 500000 ? 395.60 : baseAGI > 330000 ? 297.90 : baseAGI > 222000 ? 178.70 : 59.40,
        partD_surcharge: baseAGI > 500000 ? 80.30 : baseAGI > 330000 ? 59.80 : baseAGI > 222000 ? 38.80 : 12.90,
        annual_impact: 0  // Will calculate below
      };
      
      trapResults.irmaa_data.annual_impact = (trapResults.irmaa_data.partB_surcharge + trapResults.irmaa_data.partD_surcharge) * 12;
    }
  }
  
  // Check for Social Security taxation issues
  if (hasSocialSecurity && socialSecurityAmount > 0) {
    const combinedIncome = baseAGI - (socialSecurityAmount * 0.85) + (socialSecurityAmount * 0.5);
    const threshold1 = filingStatus === 'single' || filingStatus === 'married_separate' ? 25000 : 32000;
    const threshold2 = filingStatus === 'single' || filingStatus === 'married_separate' ? 34000 : 44000;
    
    let taxablePercentage = 0;
    if (combinedIncome > threshold2) {
      taxablePercentage = 85;
      warnings.push({
        id: `ss-tax-${scenarioId}`,
        trapType: 'social_security',
        type: 'social_security', // Add type field for compatibility
        message: '85% of Social Security Benefits Taxable',
        details: 'Your combined income has triggered the maximum 85% taxation of your Social Security benefits.',
        severity: 'medium',
        threshold: {
          value: threshold2,
          units: 'USD'
        },
        remediation: 'Consider tax-free income sources or strategic Roth conversions in prior years.'
      });
      
      trapResults.social_security_data = {
        taxable_percentage: 85,
        tax_increase: Math.round(socialSecurityAmount * 0.85 * 0.22) // Rough estimate using 22% tax rate
      };
    } else if (combinedIncome > threshold1) {
      taxablePercentage = 50;
      warnings.push({
        id: `ss-tax-${scenarioId}`,
        trapType: 'social_security',
        type: 'social_security', // Add type field for compatibility
        message: '50% of Social Security Benefits Taxable',
        details: 'Your combined income has triggered partial taxation of your Social Security benefits.',
        severity: 'low',
        threshold: {
          value: threshold1,
          units: 'USD'
        },
        remediation: 'Monitor income levels to avoid reaching the 85% taxation threshold.'
      });
      
      trapResults.social_security_data = {
        taxable_percentage: 50,
        tax_increase: Math.round(socialSecurityAmount * 0.5 * 0.12) // Rough estimate using 12% tax rate
      };
    }
  }
  
  // Check for ACA subsidy cliff issues
  if (hasACA) {
    const fplAmount = year >= 2023 ? 13590 : 13590; // Can be updated with accurate FPL amounts by year
    const householdSize = isMarried ? 2 : 1;
    const adjustedFPL = fplAmount + ((householdSize - 1) * 4720);
    const fplPercentage = (baseAGI / adjustedFPL) * 100;
    
    if (fplPercentage > 395 && fplPercentage < 405) {
      warnings.push({
        id: `aca-cliff-${scenarioId}`,
        trapType: 'aca',
        type: 'aca', // Add type field for compatibility
        message: 'ACA Subsidy Cliff Risk',
        details: `Your income is ${fplPercentage.toFixed(1)}% of the Federal Poverty Level, which is near the 400% cliff for ACA premium subsidies.`,
        severity: 'high',
        threshold: {
          value: 400,
          units: '%'
        },
        remediation: 'Consider reducing income through retirement contributions or charitable giving to maintain subsidy eligibility.'
      });
      
      // Add ACA data
      trapResults.aca_data = {
        current_fpl_percentage: Math.round(fplPercentage),
        subsidy_impact: Math.round(householdSize * 8000) // Rough estimate of potential subsidy loss
      };
    }
  }
  
  // Check for capital gains bracket issues
  if (hasCapitalGains && capitalGainsAmount > 0) {
    const incomeWithoutCG = baseAGI - capitalGainsAmount;
    const threshold = filingStatus === 'single' || filingStatus === 'married_separate' ? 44625 : 89250;
    
    if (incomeWithoutCG < threshold && baseAGI > threshold) {
      const amountInHigherBracket = Math.min(capitalGainsAmount, baseAGI - threshold);
      const taxIncrease = amountInHigherBracket * 0.15; // Difference between 0% and 15% rate
      
      warnings.push({
        id: `cap-gain-jump-${scenarioId}`,
        trapType: 'capital_gains',
        type: 'capital_gains', // Add type field for compatibility
        message: 'Capital Gains Tax Bracket Jump',
        details: 'Your capital gains have pushed you from the 0% to the 15% capital gains tax bracket.',
        severity: 'high',
        threshold: {
          value: threshold,
          units: 'USD'
        },
        remediation: 'Consider spreading capital gains realizations across multiple tax years.'
      });
      
      trapResults.capital_gains_data = {
        current_rate: 15,
        potential_rate: 0,
        tax_increase: Math.round(taxIncrease)
      };
    }
  }
  
  // Sort warnings by severity
  const sortedWarnings = warnings.sort((a, b) => {
    const severityOrder = { high: 3, medium: 2, low: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
  
  // Add the sorted warnings to the result
  trapResults.warnings = sortedWarnings;
  
  // Convert to the format expected by the yearCalculation.ts
  const simpleWarnings = sortedWarnings.map(warning => ({
    type: warning.type,
    message: warning.message,
    severity: warning.severity,
    trapType: warning.trapType
  }));
  
  // Return both formats
  return {
    trapResults,
    warnings: simpleWarnings
  };
}

/**
 * Get total financial impact from all tax traps
 */
export function getTotalTaxTrapImpact(trapResult: TaxTrapResult): number {
  let total = 0;
  
  // Add IRMAA impact if present
  if (trapResult.irmaa_data) {
    total += trapResult.irmaa_data.annual_impact;
  }
  
  // Add Social Security tax impact if present
  if (trapResult.social_security_data) {
    total += trapResult.social_security_data.tax_increase;
  }
  
  // Add ACA subsidy impact if present
  if (trapResult.aca_data) {
    total += trapResult.aca_data.subsidy_impact;
  }
  
  // Add Capital Gains impact if present
  if (trapResult.capital_gains_data) {
    total += trapResult.capital_gains_data.tax_increase;
  }
  
  return total;
}
