
import { TaxTrapInput, TaxTrapResult, TaxTrapWarning } from './types';
import { checkIRMAASurcharges, generateIRMAAWarning } from './irmaaChecker';
import { checkCapitalGainsRate, generateCapitalGainsWarning } from './capitalGainsChecker';
import { calculateTaxableSocialSecurity, generateSocialSecurityWarning } from './socialSecurityChecker';
import { checkACASubsidyImpact, generateACAWarning } from './acaChecker';

/**
 * Main function to check various tax traps
 */
export function checkTaxTraps(input: TaxTrapInput): TaxTrapResult {
  const warnings: TaxTrapWarning[] = [];
  const result: TaxTrapResult = {
    scenario_id: input.scenario_id,
    warnings: [],
  };
  
  // Use MAGI if provided, otherwise use AGI
  const magi = input.magi || input.agi;
  
  // 1. Check IRMAA (Medicare) surcharges
  if (input.medicare_enrollment) {
    const irmaaResult = checkIRMAASurcharges(
      input.year, 
      input.filing_status,
      magi
    );
    
    if (irmaaResult.partB_surcharge > 0 || irmaaResult.partD_surcharge > 0) {
      const annual_impact = (irmaaResult.partB_surcharge + irmaaResult.partD_surcharge) * 12;
      
      result.irmaa_data = {
        partB_surcharge: irmaaResult.partB_surcharge,
        partD_surcharge: irmaaResult.partD_surcharge,
        annual_impact
      };
      
      const warning = generateIRMAAWarning(irmaaResult);
      if (warning) warnings.push(warning);
    }
  }
  
  // 2. Check capital gains tax rate changes
  if (input.capital_gains_long > 0) {
    const cgResult = checkCapitalGainsRate(
      input.year,
      input.filing_status,
      input.taxable_income
    );
    
    const warning = generateCapitalGainsWarning(cgResult, input.taxable_income, input.capital_gains_long);
    
    if (warning) {
      result.capital_gains_data = {
        current_rate: cgResult.current_rate,
        potential_rate: cgResult.current_rate === 0 ? 15 : 20,
        tax_increase: warning.financial_impact
      };
      
      warnings.push(warning);
    }
  }
  
  // 3. Check Social Security taxation
  if (input.social_security_amount > 0) {
    const otherIncome = input.total_income - input.social_security_amount;
    
    const warning = generateSocialSecurityWarning(
      input.social_security_amount,
      otherIncome,
      input.filing_status
    );
    
    if (warning) {
      const taxableSS = calculateTaxableSocialSecurity(
        input.social_security_amount,
        otherIncome,
        input.filing_status
      );
      const taxablePercentage = (taxableSS / input.social_security_amount) * 100;
      
      result.social_security_data = {
        taxable_percentage: taxablePercentage,
        tax_increase: warning.financial_impact
      };
      
      warnings.push(warning);
    }
  }
  
  // 4. Check ACA subsidy impacts
  if (input.aca_enrollment) {
    const acaResult = checkACASubsidyImpact(
      input.year,
      input.household_size,
      magi
    );
    
    result.aca_data = {
      current_fpl_percentage: acaResult.fpl_percentage,
      subsidy_impact: acaResult.subsidy_impact
    };
    
    const warning = generateACAWarning(acaResult);
    if (warning) warnings.push(warning);
  }
  
  // Sort warnings by financial impact (highest first)
  result.warnings = warnings.sort((a, b) => b.financial_impact - a.financial_impact);
  
  return result;
}

/**
 * Save tax trap results to database (placeholder function)
 */
export function saveTaxTrapResults(results: TaxTrapResult): Promise<void> {
  // This would be a database operation in a real application
  console.log('Tax trap results saved:', results);
  
  // Simulate async operation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
}

// Re-export types for convenience
export type { TaxTrapInput, TaxTrapResult, TaxTrapWarning } from './types';
