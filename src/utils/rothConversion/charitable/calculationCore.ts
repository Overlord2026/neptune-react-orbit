
/**
 * Core Charitable Impact Calculation Utilities
 * 
 * Core functions for calculating charitable contribution tax impacts.
 */

import { TaxTrapResult } from '@/utils/taxTraps';
import { getStandardDeduction } from '../deductionUtils';

/**
 * Calculate the baseline tax impact of charitable contribution
 */
export const calculateBaseImpact = (
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
