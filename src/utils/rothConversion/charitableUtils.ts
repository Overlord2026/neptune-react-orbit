import { CharitableContribution, MultiYearScenarioData } from '@/components/tax/roth-conversion/types/ScenarioTypes';

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
  rmdAmount: number
): {
  standardDeduction: number;
  itemizedDeduction: number;
  isItemizing: boolean;
  taxSavings: number;
  qcdImpact?: number;
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
  
  return {
    standardDeduction,
    itemizedDeduction,
    isItemizing,
    taxSavings,
    qcdImpact: useQcd ? qcdImpact : undefined
  };
};
