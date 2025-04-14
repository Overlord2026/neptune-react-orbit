
/**
 * Business Tax Calculator
 * 
 * Utility functions for calculating small business and side hustle taxes
 */

import { formatCurrency, formatPercent } from '../formatUtils';

// Types for business tax calculations
export interface BusinessIncomeInput {
  businessType: 'sole_proprietorship' | 'single_member_llc' | 's_corp' | 'partnership';
  income: number;
  expenses: Record<string, number>;
  year: number;
  useHomeOffice?: boolean;
  homeOfficePercent?: number;
  homeOfficeExpenses?: number;
  sCorpWages?: number;
  sCorpDistributions?: number;
  partnershipShare?: number;
  taxRate?: number; // For estimating income tax impact
  projectedGrowth?: number; // For multi-year projections
}

export interface BusinessTaxResult {
  netProfit: number;
  selfEmploymentTax: number;
  selfEmploymentTaxDeduction: number;
  payrollTaxes: number;
  qbiDeduction: number | null;
  netTaxableIncome: number;
  effectiveTaxRate: number;
  warnings: Array<{
    type: 'reasonable_compensation' | 'qbi_limitation' | 'home_office' | 'general';
    severity: 'info' | 'warning' | 'error';
    message: string;
  }>;
}

// Constants for tax calculations
const SE_TAX_RATE = 0.153; // 15.3% total SE tax (12.4% Social Security + 2.9% Medicare)
const MEDICARE_RATE = 0.029; // 2.9% Medicare portion
const SS_WAGE_CAP_2023 = 160200; // Social Security wage cap for 2023
const SS_WAGE_CAP_2024 = 168600; // Social Security wage cap for 2024
const SS_WAGE_CAP_2025 = 175000; // Projected Social Security wage cap for 2025 (estimated)
const QBI_DEDUCTION_RATE = 0.20; // 20% QBI deduction
const QBI_THRESHOLD_SINGLE_2024 = 182100; // 2024 threshold for single
const QBI_THRESHOLD_MARRIED_2024 = 364200; // 2024 threshold for married filing jointly

/**
 * Get Social Security wage cap for a given year
 */
const getSocialSecurityWageCap = (year: number): number => {
  switch (year) {
    case 2023: return SS_WAGE_CAP_2023;
    case 2024: return SS_WAGE_CAP_2024;
    case 2025: return SS_WAGE_CAP_2025;
    default: return SS_WAGE_CAP_2024; // Default to 2024 if year not specified
  }
};

/**
 * Calculate total expenses from expense items
 */
const calculateTotalExpenses = (expenses: Record<string, number>, useHomeOffice?: boolean, homeOfficeExpenses?: number): number => {
  const expenseTotal = Object.values(expenses).reduce((sum, expense) => sum + expense, 0);
  return useHomeOffice && homeOfficeExpenses ? expenseTotal + homeOfficeExpenses : expenseTotal;
};

/**
 * Calculate self-employment tax based on net profit
 */
const calculateSelfEmploymentTax = (netProfit: number, year: number): number => {
  const ssWageCap = getSocialSecurityWageCap(year);
  
  // Social Security portion (12.4%) only applies up to wage cap
  const socialSecurityTax = Math.min(netProfit, ssWageCap) * 0.124;
  
  // Medicare portion (2.9%) applies to all earnings
  const medicareTax = netProfit * MEDICARE_RATE;
  
  return socialSecurityTax + medicareTax;
};

/**
 * Calculate QBI deduction (Qualified Business Income)
 */
const calculateQBIDeduction = (
  netProfit: number, 
  businessType: string,
  taxableIncome: number,
  filingStatus: 'single' | 'married' = 'single',
  year: number = 2024
): { amount: number | null; warnings: { type: string; severity: string; message: string }[] } => {
  const warnings: { type: string; severity: string; message: string }[] = [];
  
  // Check eligibility
  if (netProfit <= 0) {
    return { amount: null, warnings: [] };
  }
  
  // Determine income threshold based on filing status
  const threshold = filingStatus === 'single' 
    ? QBI_THRESHOLD_SINGLE_2024 
    : QBI_THRESHOLD_MARRIED_2024;
  
  // Basic QBI calculation (20% of qualified business income)
  let qbiDeduction = netProfit * QBI_DEDUCTION_RATE;
  
  // Check for high-income limitations
  if (taxableIncome > threshold) {
    warnings.push({
      type: 'qbi_limitation',
      severity: 'warning',
      message: `Your income exceeds the QBI threshold (${formatCurrency(threshold)}). The 20% deduction may be limited based on W-2 wages paid or qualified property. Consult a tax professional for a precise calculation.`
    });
  }
  
  // Limit QBI deduction to 20% of taxable income
  qbiDeduction = Math.min(qbiDeduction, taxableIncome * 0.20);
  
  return { 
    amount: qbiDeduction, 
    warnings 
  };
};

/**
 * Check for reasonable compensation warnings for S-Corp owners
 */
const checkReasonableCompensation = (
  netProfit: number, 
  wages: number
): { isReasonable: boolean; warning: { type: string; severity: string; message: string } | null } => {
  // Simplified reasonable compensation check
  const wageRatio = wages / netProfit;
  
  if (wageRatio < 0.3) {
    // Very low wage ratio compared to profits
    return {
      isReasonable: false,
      warning: {
        type: 'reasonable_compensation',
        severity: 'error',
        message: `Your S-Corp wages (${formatCurrency(wages)}) appear to be too low compared to your business profit (${formatCurrency(netProfit)}). The IRS requires S-Corp owners to pay themselves "reasonable compensation" before taking distributions. Consider increasing your wages.`
      }
    };
  } else if (wageRatio < 0.4) {
    // Potentially questionable wage ratio
    return {
      isReasonable: true,
      warning: {
        type: 'reasonable_compensation',
        severity: 'warning',
        message: `Your S-Corp wage-to-profit ratio (${formatPercent(wageRatio)}) may attract IRS scrutiny. Consider documenting how you determined your compensation and consider increasing wages if appropriate for your industry.`
      }
    };
  }
  
  return { isReasonable: true, warning: null };
};

/**
 * Main function to calculate business taxes based on inputs
 */
export const calculateSmallBusinessTax = (
  input: BusinessIncomeInput,
  additionalIncome: number = 0, // Other income to consider for tax bracket purposes
  filingStatus: 'single' | 'married' = 'single'
): BusinessTaxResult => {
  // Step 1: Calculate net profit
  const totalExpenses = calculateTotalExpenses(
    input.expenses, 
    input.useHomeOffice, 
    input.homeOfficeExpenses
  );
  
  let netProfit = input.income - totalExpenses;
  
  // Step 2: Calculate taxes based on business type
  let selfEmploymentTax = 0;
  let selfEmploymentTaxDeduction = 0;
  let payrollTaxes = 0;
  let netTaxableIncome = 0;
  const warnings: Array<{type: string; severity: string; message: string}> = [];
  
  if (input.businessType === 'sole_proprietorship' || input.businessType === 'single_member_llc') {
    // Sole proprietorship or single-member LLC taxed as sole proprietorship
    selfEmploymentTax = calculateSelfEmploymentTax(netProfit, input.year);
    selfEmploymentTaxDeduction = selfEmploymentTax / 2; // Half of SE tax is deductible
    netTaxableIncome = netProfit - selfEmploymentTaxDeduction;
    
    if (netProfit > getSocialSecurityWageCap(input.year)) {
      warnings.push({
        type: 'general',
        severity: 'info',
        message: `Your business income exceeds the Social Security wage cap of ${formatCurrency(getSocialSecurityWageCap(input.year))}. You may want to consider an S-Corporation structure to potentially reduce self-employment taxes.`
      });
    }
    
  } else if (input.businessType === 's_corp' && input.sCorpWages !== undefined && input.sCorpDistributions !== undefined) {
    // S-Corporation
    const { sCorpWages, sCorpDistributions } = input;
    
    // Verify wages + distributions = net profit
    if (Math.abs((sCorpWages + sCorpDistributions) - netProfit) > 0.01) {
      warnings.push({
        type: 'general',
        severity: 'warning',
        message: `The sum of wages (${formatCurrency(sCorpWages)}) and distributions (${formatCurrency(sCorpDistributions)}) does not equal net profit (${formatCurrency(netProfit)}). Make sure these values are correctly allocated.`
      });
    }
    
    // Calculate payroll taxes (employer + employee portion)
    const employerSSTax = Math.min(sCorpWages, getSocialSecurityWageCap(input.year)) * 0.062;
    const employerMedicareTax = sCorpWages * 0.0145;
    const employeeSSTax = Math.min(sCorpWages, getSocialSecurityWageCap(input.year)) * 0.062;
    const employeeMedicareTax = sCorpWages * 0.0145;
    
    payrollTaxes = employerSSTax + employerMedicareTax + employeeSSTax + employeeMedicareTax;
    
    // Check reasonable compensation
    const compensationCheck = checkReasonableCompensation(netProfit, sCorpWages);
    if (compensationCheck.warning) {
      warnings.push(compensationCheck.warning);
    }
    
    // Net taxable income (doesn't include the employer portion of payroll taxes)
    netTaxableIncome = sCorpWages; // Wages are taxable as personal income
    
    // Distributions aren't subject to payroll or self-employment tax
  } else if (input.businessType === 'partnership' && input.partnershipShare !== undefined) {
    // Partnership
    const partnershipProfit = input.partnershipShare;
    
    // General partners pay self-employment tax on their share
    selfEmploymentTax = calculateSelfEmploymentTax(partnershipProfit, input.year);
    selfEmploymentTaxDeduction = selfEmploymentTax / 2;
    netTaxableIncome = partnershipProfit - selfEmploymentTaxDeduction;
  }
  
  // Step 3: Calculate QBI deduction if applicable
  const taxableIncome = netTaxableIncome + additionalIncome;
  const { amount: qbiDeduction, warnings: qbiWarnings } = calculateQBIDeduction(
    netProfit, 
    input.businessType,
    taxableIncome,
    filingStatus,
    input.year
  );
  
  // Add QBI warnings to main warnings array
  warnings.push(...qbiWarnings);
  
  // Reduce taxable income by QBI deduction if applicable
  if (qbiDeduction && qbiDeduction > 0) {
    netTaxableIncome -= qbiDeduction;
  }
  
  // Calculate effective tax rate if tax rate provided
  const totalTax = selfEmploymentTax + (input.taxRate ? netTaxableIncome * input.taxRate : 0);
  const effectiveTaxRate = netProfit > 0 ? totalTax / netProfit : 0;
  
  return {
    netProfit,
    selfEmploymentTax,
    selfEmploymentTaxDeduction,
    payrollTaxes,
    qbiDeduction: qbiDeduction || null,
    netTaxableIncome,
    effectiveTaxRate,
    warnings: warnings as BusinessTaxResult['warnings']
  };
};

/**
 * Project business tax over multiple years
 */
export const projectMultiYearBusinessTax = (
  initialInput: BusinessIncomeInput,
  years: number = 5
): BusinessTaxResult[] => {
  const results: BusinessTaxResult[] = [];
  let currentInput = { ...initialInput };
  
  for (let i = 0; i < years; i++) {
    // Calculate for current year
    const yearResult = calculateSmallBusinessTax(currentInput);
    results.push(yearResult);
    
    // Increase income by growth rate for next year
    if (currentInput.projectedGrowth) {
      const growthFactor = 1 + currentInput.projectedGrowth;
      currentInput = {
        ...currentInput,
        income: currentInput.income * growthFactor,
        year: currentInput.year + 1
      };
      
      // If S-Corp, adjust wages and distributions by same growth rate
      if (currentInput.businessType === 's_corp' && 
          currentInput.sCorpWages !== undefined && 
          currentInput.sCorpDistributions !== undefined) {
        currentInput.sCorpWages = currentInput.sCorpWages * growthFactor;
        currentInput.sCorpDistributions = currentInput.sCorpDistributions * growthFactor;
      }
    }
  }
  
  return results;
};

