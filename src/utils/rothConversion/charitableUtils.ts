
import { CharitableContribution, MultiYearScenarioData, TrapAvoidance } from '@/components/tax/roth-conversion/types/ScenarioTypes';
import { checkTaxTraps, TaxTrapInput, TaxTrapResult } from '@/utils/taxTraps';

/**
 * Get charitable contribution for a specific year
 */
export const getCharitableContributionForYear = (
  scenarioData: MultiYearScenarioData,
  currentYear: number,
  currentAge: number
): { amount: number; useQcd: boolean; isBunching: boolean } => {
  if (!scenarioData.useCharitablePlanning) {
    return { amount: 0, useQcd: false, isBunching: false };
  }

  // If we have a specific contribution for this year, use it
  if (scenarioData.charitableContributions && scenarioData.charitableContributions.length > 0) {
    const yearContribution = scenarioData.charitableContributions.find(c => c.year === currentYear);
    if (yearContribution) {
      return {
        amount: yearContribution.amount,
        useQcd: yearContribution.useQcd,
        isBunching: yearContribution.isBunching || false
      };
    }
  }

  // Otherwise, check if we should apply DAF bunching logic
  if (scenarioData.dafBunching?.enabled) {
    const startYear = scenarioData.startYear;
    const yearIndex = currentYear - startYear;
    const cyclePosition = yearIndex % (scenarioData.dafBunching.bunchingYears || 1);
    
    // If we're at the start of a bunching cycle, use bunching amount
    if (cyclePosition === 0) {
      return { 
        amount: scenarioData.dafBunching.bunchingAmount,
        useQcd: false, // Bunching typically done with cash contributions
        isBunching: true
      };
    }
    // Otherwise, no contribution in non-bunching years
    return { amount: 0, useQcd: false, isBunching: false };
  }

  // Default case (no contribution)
  return { amount: 0, useQcd: false, isBunching: false };
};

/**
 * Calculate standard deduction based on filing status and tax year
 */
export const getStandardDeduction = (filingStatus: string, year: number): number => {
  // Basic standard deduction values - would ideally come from a tax data source
  // These are simplified examples based on 2023 values
  const baseValues: Record<string, number> = {
    'single': 13850,
    'married': 27700,
    'head_of_household': 20800,
    'married_separate': 13850
  };
  
  return baseValues[filingStatus as keyof typeof baseValues] || 12950;
};

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
    
    // Additional trap avoidance checks can be added here
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

/**
 * Calculate potential additional charitable contribution to avoid a tax trap
 */
export const calculateCharitableOpportunity = (
  trapResults: TaxTrapResult,
  filingStatus: string,
  currentAge: number,
  currentAGI: number,
  year: number
): { 
  amount: number;
  useQcd: boolean;
  description: string;
  trapType: string;
  severity: 'low' | 'medium' | 'high';
} | null => {
  // Only check for opportunities if we have traps
  if (!trapResults.warnings || trapResults.warnings.length === 0) {
    return null;
  }
  
  // Check for IRMAA opportunity
  if (trapResults.irmaa_data) {
    // Find the next lower IRMAA threshold
    const relevantWarning = trapResults.warnings.find(w => w.type === 'irmaa');
    if (!relevantWarning) return null;
    
    // Calculate how much AGI reduction is needed to avoid this IRMAA tier
    // This is a simplified example - in reality, we'd need to check against actual IRMAA thresholds
    const irmaaTiers = {
      'single': [97000, 123000, 153000, 183000, 500000],
      'married': [194000, 246000, 306000, 366000, 750000]
    };
    
    // Find the next lowest tier
    const tiers = irmaaTiers[filingStatus as keyof typeof irmaaTiers] || irmaaTiers.single;
    const currentTier = tiers.findIndex(tier => currentAGI > tier);
    
    if (currentTier > 0) {
      const targetThreshold = tiers[currentTier - 1];
      const neededReduction = currentAGI - targetThreshold;
      
      if (neededReduction > 0 && neededReduction < 20000) { // Only suggest if it's reasonably achievable
        // Determine if QCD is an option based on age
        const canUseQCD = currentAge >= 70.5;
        
        return {
          amount: neededReduction + 100, // Add a small buffer
          useQcd: canUseQCD,
          description: canUseQCD
            ? `An additional QCD of $${(neededReduction + 100).toLocaleString()} would reduce your MAGI below $${targetThreshold.toLocaleString()}, potentially avoiding an IRMAA tier.`
            : `An additional charitable contribution of $${(neededReduction + 100).toLocaleString()} could help reduce your MAGI below $${targetThreshold.toLocaleString()}, potentially avoiding an IRMAA tier.`,
          trapType: 'charitable_opportunity',
          severity: 'medium'
        };
      }
    }
  }
  
  return null;
};
