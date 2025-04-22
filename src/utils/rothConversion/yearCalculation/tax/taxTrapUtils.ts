
/**
 * Tax Trap Utility Functions
 * 
 * Functions for detecting and analyzing tax traps in various scenarios.
 */

import { TaxTrapWarning, TaxTrapResult } from '@/utils/taxTraps/types';

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
}: TaxTrapCheckParams): { trapResults: TaxTrapResult; warnings: { type: string; message: string; severity: 'low' | 'medium' | 'high'; trapType: string; details: string; }[] } {
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
        type: 'irmaa',
        severity: 'medium',
        title: 'Medicare IRMAA Surcharge',
        description: `Your MAGI of $${baseAGI.toLocaleString()} exceeds the IRMAA threshold, triggering additional Medicare premium costs.`,
        financial_impact: 0, // Will be calculated later
        trapType: 'irmaa',
        message: 'Medicare IRMAA Surcharge Alert'
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
        type: 'social_security',
        severity: 'medium',
        title: '85% of Social Security Taxable',
        description: 'Your combined income has triggered the maximum 85% taxation of your Social Security benefits.',
        trapType: 'social_security',
        message: '85% of Social Security Benefits Taxable',
        financial_impact: Math.round(socialSecurityAmount * 0.85 * 0.22)
      });
      
      trapResults.social_security_data = {
        taxable_percentage: 85,
        tax_increase: Math.round(socialSecurityAmount * 0.85 * 0.22)
      };
    } else if (combinedIncome > threshold1) {
      taxablePercentage = 50;
      warnings.push({
        type: 'social_security',
        severity: 'low',
        title: '50% of Social Security Taxable',
        description: 'Your combined income has triggered partial taxation of your Social Security benefits.',
        trapType: 'social_security',
        message: '50% of Social Security Benefits Taxable',
        financial_impact: Math.round(socialSecurityAmount * 0.5 * 0.12)
      });
      
      trapResults.social_security_data = {
        taxable_percentage: 50,
        tax_increase: Math.round(socialSecurityAmount * 0.5 * 0.12)
      };
    }
  }
  
  // Check for ACA subsidy cliff issues
  if (hasACA) {
    const fplAmount = year >= 2023 ? 13590 : 13590;
    const householdSize = isMarried ? 2 : 1;
    const adjustedFPL = fplAmount + ((householdSize - 1) * 4720);
    const fplPercentage = (baseAGI / adjustedFPL) * 100;
    
    if (fplPercentage > 395 && fplPercentage < 405) {
      warnings.push({
        type: 'aca',
        severity: 'high',
        title: 'ACA Subsidy Cliff Risk',
        description: `Your income is ${fplPercentage.toFixed(1)}% of the Federal Poverty Level, which is near the 400% cliff for ACA premium subsidies.`,
        trapType: 'aca',
        message: 'ACA Subsidy Cliff Risk',
        financial_impact: Math.round(householdSize * 8000)
      });
      
      trapResults.aca_data = {
        current_fpl_percentage: Math.round(fplPercentage),
        subsidy_impact: Math.round(householdSize * 8000)
      };
    }
  }
  
  // Check for capital gains bracket issues
  if (hasCapitalGains && capitalGainsAmount > 0) {
    const incomeWithoutCG = baseAGI - capitalGainsAmount;
    const threshold = filingStatus === 'single' || filingStatus === 'married_separate' ? 44625 : 89250;
    
    if (incomeWithoutCG < threshold && baseAGI > threshold) {
      const amountInHigherBracket = Math.min(capitalGainsAmount, baseAGI - threshold);
      const taxIncrease = amountInHigherBracket * 0.15;
      
      warnings.push({
        type: 'capital_gains',
        severity: 'high',
        title: 'Capital Gains Tax Bracket Jump',
        description: 'Your capital gains have pushed you from the 0% to the 15% capital gains tax bracket.',
        trapType: 'capital_gains',
        message: 'Capital Gains Tax Bracket Jump',
        financial_impact: Math.round(taxIncrease)
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
    message: warning.message || warning.title,
    severity: warning.severity,
    trapType: warning.trapType || warning.type,
    details: warning.description || warning.message || 'No details available'
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
