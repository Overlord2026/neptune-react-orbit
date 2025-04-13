
import { TaxTrapInput, TaxTrapResult, checkTaxTraps } from '@/utils/taxTraps';
import { TrapAvoidance } from '@/components/tax/roth-conversion/types/ScenarioTypes';
import { getStandardDeduction } from './deductionUtils';

/**
 * Calculate tax impact of charitable contribution
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
  // Get standard deduction for this filing status and year
  const standardDeduction = getStandardDeduction(filingStatus, year);
  
  // Assume other itemized deductions (state taxes, mortgage interest, etc.) total $10,000
  const otherItemizedDeductions = 10000;
  
  let itemizedDeduction = otherItemizedDeductions;
  let qcdImpact = 0;
  
  // If using QCD, it doesn't add to itemized deductions but reduces AGI directly
  if (useQcd) {
    qcdImpact = Math.min(charitableAmount, rmdAmount);
    // Don't add QCD amount to itemized deductions
  } else {
    // Regular charitable contribution - add to itemized deductions
    itemizedDeduction += charitableAmount;
  }
  
  // Determine if itemizing makes sense
  const isItemizing = itemizedDeduction > standardDeduction;
  
  // Calculate tax savings
  let taxSavings = 0;
  
  // QCD savings (reduces AGI directly)
  if (useQcd) {
    taxSavings += qcdImpact * marginalRate;
  }
  
  // Itemization savings (if itemizing)
  if (isItemizing) {
    // Only the amount above standard deduction provides additional savings
    taxSavings += (itemizedDeduction - standardDeduction) * marginalRate;
  }

  // Check for tax trap avoidances
  let trapAvoidance: TrapAvoidance[] = [];
  
  // Create input for trap checking with and without charitable impact
  const baseInput: TaxTrapInput = {
    scenario_id: `year_${year}`,
    year: year,
    filing_status: filingStatus as any,
    agi: baseAGI,
    total_income: baseAGI,
    taxable_income: baseAGI - standardDeduction,
    capital_gains_long: 0, // Simplified for this example
    capital_gains_short: 0,
    social_security_amount: 0, // Simplified
    household_size: filingStatus === 'married' ? 2 : 1,
    medicare_enrollment: true, // Assume Medicare age for this analysis
    aca_enrollment: false
  };
  
  // Calculate adjusted AGI and taxable income with charitable impact
  let adjustedAGI = baseAGI;
  if (useQcd) {
    adjustedAGI -= qcdImpact;
  }
  
  const adjustedTaxableIncome = adjustedAGI - (isItemizing ? itemizedDeduction : standardDeduction);
  
  // Check traps with adjusted values
  const adjustedInput: TaxTrapInput = {
    ...baseInput,
    agi: adjustedAGI,
    total_income: adjustedAGI,
    taxable_income: adjustedTaxableIncome
  };
  
  // Run trap detection on the adjusted scenario
  const afterCharitableTraps = checkTaxTraps(adjustedInput);
  
  // If we have original trap results to compare with (before charitable impact)
  if (originalTrapResults) {
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
  }
  
  return {
    standardDeduction,
    itemizedDeduction,
    isItemizing,
    taxSavings,
    qcdImpact: useQcd ? qcdImpact : undefined,
    trapAvoidance: trapAvoidance.length > 0 ? trapAvoidance : undefined
  };
};
