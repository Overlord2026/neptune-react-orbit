
import { TaxReturnData } from '../../types/TaxReturnTypes';
import { calculateStateTax, StateCode } from '@/utils/stateTaxData';

export const calculateTaxValues = (data: TaxReturnData): {
  calculatedRefund: number;
  calculatedOwed: number;
  calculatedAGI: number;
  calculatedTaxableIncome: number;
  stateTax?: number;
} => {
  // Calculate total income
  const totalW2Income = data.w2Forms.reduce((sum, form) => sum + form.wages, 0);
  const totalIncome = totalW2Income + data.interestIncome + data.dividendIncome;
  
  // Calculate AGI (simplified)
  const calculatedAGI = totalIncome;
  
  // Calculate deductions
  const deduction = data.useStandardDeduction 
    ? 12950 // Example standard deduction for single filer
    : Object.values(data.itemizedDeductions).reduce((sum, value) => sum + value, 0);
    
  // Calculate taxable income
  const taxableIncome = Math.max(0, totalIncome - deduction);
  const calculatedTaxableIncome = taxableIncome;
  
  // Very simplified tax bracket calculation
  // This is just for demonstration; real tax calculations are much more complex
  let tax = 0;
  if (taxableIncome <= 10275) {
    tax = taxableIncome * 0.1;
  } else if (taxableIncome <= 41775) {
    tax = 1027.50 + (taxableIncome - 10275) * 0.12;
  } else if (taxableIncome <= 89075) {
    tax = 4807.50 + (taxableIncome - 41775) * 0.22;
  } else {
    tax = 15213.50 + (taxableIncome - 89075) * 0.24;
  }
  
  // Apply tax credits (very simplified)
  if (data.childTaxCredit) {
    tax -= data.dependents.length * 2000;
  }
  if (data.educationCredit) {
    tax -= 2500; // Simplified American Opportunity Credit
  }
  tax = Math.max(0, tax);

  // Calculate state tax if applicable
  let stateTax = 0;
  if (data.includeStateTax && data.residentState) {
    stateTax = calculateStateTax(taxableIncome, data.residentState as StateCode);
  }
  
  // Calculate total withholding
  const totalWithholding = data.w2Forms.reduce((sum, form) => 
    sum + form.federalWithholding, 0);
    
  // Calculate refund or amount owed (including state tax)
  let calculatedRefund = 0;
  let calculatedOwed = 0;
  const totalTax = tax + stateTax;
  
  if (totalWithholding > totalTax) {
    calculatedRefund = totalWithholding - totalTax;
    calculatedOwed = 0;
  } else {
    calculatedRefund = 0;
    calculatedOwed = totalTax - totalWithholding;
  }
  
  return {
    calculatedRefund,
    calculatedOwed,
    calculatedAGI,
    calculatedTaxableIncome,
    stateTax
  };
};
