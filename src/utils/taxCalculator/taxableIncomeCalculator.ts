
/**
 * Taxable Income Calculator
 * 
 * Utility functions for calculating taxable income after deductions
 */

import { 
  FilingStatusType,
  STANDARD_DEDUCTION,
  STANDARD_DEDUCTION_BY_YEAR
} from '../taxBracketData';

/**
 * Calculate taxable income after applying deductions
 */
export const calculateTaxableIncome = (
  income: number,
  year: number,
  filingStatus: FilingStatusType,
  isItemizedDeduction: boolean = false,
  itemizedDeductionAmount: number = 0
): number => {
  // Get standard deduction based on filing status
  let standardDeduction;
  
  // Use the year-specific deduction if available, otherwise fall back to current values
  if (STANDARD_DEDUCTION_BY_YEAR[year as keyof typeof STANDARD_DEDUCTION_BY_YEAR]) {
    standardDeduction = STANDARD_DEDUCTION_BY_YEAR[year as keyof typeof STANDARD_DEDUCTION_BY_YEAR][filingStatus];
  } else {
    // Map the filing status to the new structure
    const filingStatusMap: Record<FilingStatusType, keyof typeof STANDARD_DEDUCTION> = {
      "single": "single",
      "married_joint": "marriedFilingJointly",
      "married_separate": "marriedFilingSeparately",
      "head_of_household": "headOfHousehold",
      "qualifying_widow": "marriedFilingJointly" // Qualifying widow uses same standard deduction as MFJ
    };
    standardDeduction = STANDARD_DEDUCTION[filingStatusMap[filingStatus]];
  }
  
  // Use itemized deduction if selected and greater than standard deduction
  const deduction = isItemizedDeduction ? itemizedDeductionAmount : standardDeduction;
  
  // Calculate and return taxable income (cannot be negative)
  return Math.max(0, income - deduction);
};
