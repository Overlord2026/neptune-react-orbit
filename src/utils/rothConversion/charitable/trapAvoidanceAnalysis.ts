
/**
 * Trap Avoidance Analysis Utilities
 * 
 * Functions for analyzing how charitable contributions can avoid tax traps.
 */

import { TaxTrapInput, TaxTrapResult } from '@/utils/taxTraps';
import { TrapAvoidance } from '@/components/tax/roth-conversion/types/ScenarioTypes';

/**
 * Analyze tax trap avoidances from charitable contributions
 */
export const analyzeTrapAvoidance = (
  originalTrapResults: TaxTrapResult | undefined,
  adjustedAGI: number,
  isItemizing: boolean,
  itemizedDeduction: number,
  standardDeduction: number,
  useQcd: boolean,
  charitableAmount: number
): TrapAvoidance[] => {
  // If no original trap results to compare with, return empty array
  if (!originalTrapResults) return [];
  
  // Create an object to collect trap avoidances
  const trapAvoidance: TrapAvoidance[] = [];
  
  // Use a simulated result for comparison when we don't have after-charitable results
  const afterCharitableTraps: TaxTrapResult = {
    warnings: [],
    ...originalTrapResults
  };
  
  // Adjust IRMAA data for simulation if needed
  if (originalTrapResults.irmaa_data && adjustedAGI < originalTrapResults.irmaa_data.threshold) {
    afterCharitableTraps.irmaa_data = {
      ...originalTrapResults.irmaa_data,
      annual_impact: 0
    };
  }
  
  // Check for IRMAA avoidance
  if (originalTrapResults.irmaa_data && (!afterCharitableTraps.irmaa_data || 
      afterCharitableTraps.irmaa_data.annual_impact < originalTrapResults.irmaa_data.annual_impact)) {
    
    // Calculate the savings
    const savedAmount = originalTrapResults.irmaa_data.annual_impact - 
      (afterCharitableTraps.irmaa_data?.annual_impact || 0);
    
    if (savedAmount > 0) {
      trapAvoidance.push({
        type: 'irmaa_avoided',
        title: 'IRMAA Surcharge Reduced',
        description: useQcd 
          ? `Your QCD of $${charitableAmount.toLocaleString()} lowered your MAGI to $${adjustedAGI.toLocaleString()}, reducing or avoiding an IRMAA surcharge.`
          : `Your charitable deduction helped reduce your MAGI enough to lower your IRMAA surcharge.`,
        savings: savedAmount
      });
    }
  }
  
  // Check for capital gains rate improvement
  if (originalTrapResults.capital_gains_data && (!afterCharitableTraps.capital_gains_data ||
      afterCharitableTraps.capital_gains_data.current_rate < originalTrapResults.capital_gains_data.current_rate)) {
    
    const rateReduction = originalTrapResults.capital_gains_data.current_rate - 
      (afterCharitableTraps.capital_gains_data?.current_rate || 0);
    
    if (rateReduction > 0) {
      trapAvoidance.push({
        type: 'capital_gains_improved',
        title: 'Capital Gains Rate Reduced',
        description: `Your charitable strategy reduced your taxable income enough to qualify for a lower capital gains tax rate.`,
        savings: originalTrapResults.capital_gains_data.tax_increase - 
          (afterCharitableTraps.capital_gains_data?.tax_increase || 0)
      });
    }
  }
  
  return trapAvoidance;
};

/**
 * Generate input for tax trap checking with charitable impact
 */
export const generateTrapCheckInput = (
  baseInput: TaxTrapInput,
  adjustedAGI: number,
  isItemizing: boolean,
  itemizedDeduction: number,
  standardDeduction: number
): TaxTrapInput => {
  // Calculate adjusted taxable income based on deductions
  const adjustedTaxableIncome = adjustedAGI - (isItemizing ? itemizedDeduction : standardDeduction);
  
  // Return the adjusted input for trap checking
  return {
    ...baseInput,
    agi: adjustedAGI,
    total_income: adjustedAGI,
    taxable_income: adjustedTaxableIncome
  };
};
