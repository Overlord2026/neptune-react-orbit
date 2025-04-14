
/**
 * Tax Trap Utilities
 * 
 * Functions for checking tax traps and creating warnings.
 */

import { TaxTrapInput, checkTaxTraps, TaxTrapResult, TaxTrapWarning } from '@/utils/taxTraps';
import { getStandardDeduction } from '../../deductionUtils';

/**
 * Check for tax traps and generate warnings
 */
export function checkForTaxTraps({
  scenarioId,
  year,
  filingStatus,
  baseAGI,
  currentAge,
  isMarried,
  isMedicare
}: {
  scenarioId: string;
  year: number;
  filingStatus: string;
  baseAGI: number;
  currentAge: number;
  isMarried: boolean;
  isMedicare: boolean;
}): { 
  trapResults: TaxTrapResult; 
  warnings: { type: string; message: string; severity: 'low' | 'medium' | 'high'; trapType: string }[] 
} {
  // Create input for tax trap checking
  const taxTrapInput: TaxTrapInput = {
    scenario_id: scenarioId,
    year: year,
    filing_status: filingStatus as any,
    agi: baseAGI,
    total_income: baseAGI,
    taxable_income: baseAGI - getStandardDeduction(filingStatus, year),
    capital_gains_long: 0, // Simplified for this example
    capital_gains_short: 0,
    social_security_amount: 0, // Simplified
    household_size: isMarried ? 2 : 1,
    medicare_enrollment: isMedicare,
    aca_enrollment: false
  };
  
  // Run trap detection
  const trapResults = checkTaxTraps(taxTrapInput);
  
  // Convert warnings to appropriate format
  const warnings = trapResults.warnings.map(warning => ({
    type: warning.type,
    message: warning.description,
    severity: warning.severity === 'alert' ? 'high' as const : 
              warning.severity === 'warning' ? 'medium' as const : 'low' as const,
    trapType: warning.type
  }));

  return { trapResults, warnings };
}
