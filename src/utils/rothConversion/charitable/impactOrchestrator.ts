
/**
 * Charitable Impact Orchestrator
 * 
 * Main function for orchestrating the calculation of charitable contribution impacts.
 */

import { TaxTrapInput, TaxTrapResult, checkTaxTraps } from '@/utils/taxTraps';
import { TrapAvoidance } from '@/types/tax/rothConversionTypes';
import { calculateBaseImpact } from './calculationCore';
import { analyzeTrapAvoidance, generateTrapCheckInput } from './trapAvoidanceAnalysis';
import { FilingStatusType } from '@/types/tax/filingTypes';

/**
 * Calculate complete tax impact of charitable contribution
 */
export const calculateCharitableImpact = (
  charitableAmount: number,
  useQcd: boolean,
  isBunching: boolean,
  filingStatus: string,
  year: number,
  marginalRate: number,
  rmdAmount: number,
  baseAGI: number,
  originalTrapResults?: TaxTrapResult
): {
  standardDeduction: number;
  itemizedDeduction: number;
  isItemizing: boolean;
  taxSavings: number;
  qcdImpact?: number;
  trapAvoidance?: TrapAvoidance[];
} => {
  // Calculate the base impact of the charitable contribution
  const baseImpact = calculateBaseImpact(
    charitableAmount,
    useQcd,
    isBunching,
    filingStatus,
    year,
    marginalRate,
    rmdAmount
  );
  
  // Calculate adjusted AGI with charitable impact
  let adjustedAGI = baseAGI;
  if (useQcd && baseImpact.qcdImpact) {
    adjustedAGI -= baseImpact.qcdImpact;
  }
  
  // Convert legacy filing status to new format if needed
  const normalizedFilingStatus = filingStatus === 'married' ? 'married_joint' as FilingStatusType : filingStatus as FilingStatusType;

  // Create a base input for trap checking
  const baseInput: TaxTrapInput = {
    scenario_id: `charitable_impact_${year}`,
    year: year,
    filing_status: normalizedFilingStatus as any,
    agi: baseAGI,
    total_income: baseAGI,
    taxable_income: baseAGI - baseImpact.standardDeduction,
    capital_gains_long: 0,
    capital_gains_short: 0,
    social_security_amount: 0,
    household_size: normalizedFilingStatus === 'married_joint' ? 2 : 1,
    medicare_enrollment: true, // Assume Medicare age for this analysis
    aca_enrollment: false
  };
  
  // Create adjusted input for trap checking
  const adjustedInput = generateTrapCheckInput(
    baseInput,
    adjustedAGI,
    baseImpact.isItemizing,
    baseImpact.itemizedDeduction,
    baseImpact.standardDeduction
  );
  
  // Run trap detection on the adjusted scenario
  const afterCharitableTraps = checkTaxTraps(adjustedInput);
  
  // Analyze trap avoidances
  let trapAvoidance: TrapAvoidance[] = [];
  
  if (originalTrapResults) {
    trapAvoidance = analyzeTrapAvoidance(
      originalTrapResults,
      adjustedAGI,
      baseImpact.isItemizing,
      baseImpact.itemizedDeduction,
      baseImpact.standardDeduction,
      useQcd,
      charitableAmount
    );
  }
  
  // Return the complete impact
  return {
    ...baseImpact,
    trapAvoidance: trapAvoidance.length > 0 ? trapAvoidance : undefined
  };
};
