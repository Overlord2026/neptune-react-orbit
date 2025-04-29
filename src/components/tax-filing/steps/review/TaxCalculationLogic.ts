
import { TaxReturnData } from '../../types/TaxReturnTypes';
import { StateCode, STATE_TAX_RATES } from '@/utils/stateTaxData';

export const calculateTaxValues = (data: TaxReturnData) => {
  // Calculate total income
  const totalW2Wages = data.w2Forms.reduce((sum, form) => sum + Number(form.wages), 0);
  const totalIncome = totalW2Wages + Number(data.interestIncome) + Number(data.dividendIncome);
  
  // Calculate total withholding
  const totalWithholding = data.w2Forms.reduce((sum, form) => sum + Number(form.federalWithholding), 0);
  
  // Standard deduction amount (simplified for example)
  const standardDeduction = data.filingStatus === 'married_joint' ? 25900 : 
                           data.filingStatus === 'head_of_household' ? 19400 : 12950;
  
  // Calculate final deduction amount
  const deductionAmount = data.useStandardDeduction 
    ? standardDeduction
    : Object.values(data.itemizedDeductions).reduce((sum, value) => sum + Number(value), 0);
  
  // Calculate AGI (Adjusted Gross Income)
  const calculatedAGI = totalIncome;
  
  // Calculate taxable income
  const calculatedTaxableIncome = Math.max(0, calculatedAGI - deductionAmount);
  
  // Very simplified tax calculation (for illustrative purposes)
  let calculatedTax = 0;
  if (calculatedTaxableIncome <= 10000) {
    calculatedTax = calculatedTaxableIncome * 0.10;
  } else if (calculatedTaxableIncome <= 40000) {
    calculatedTax = 1000 + (calculatedTaxableIncome - 10000) * 0.12;
  } else if (calculatedTaxableIncome <= 90000) {
    calculatedTax = 4600 + (calculatedTaxableIncome - 40000) * 0.22;
  } else {
    calculatedTax = 15650 + (calculatedTaxableIncome - 90000) * 0.24;
  }
  
  // Apply tax credits
  if (data.childTaxCredit) {
    // Simplified: $2,000 per dependent up to the tax amount
    const childCreditAmount = Math.min(data.dependents.length * 2000, calculatedTax);
    calculatedTax -= childCreditAmount;
  }
  
  if (data.educationCredit) {
    // Simplified: $2,500 education credit up to the tax amount
    calculatedTax = Math.max(0, calculatedTax - 2500);
  }
  
  // Calculate state tax if applicable
  let stateTax = 0;
  if (data.includeStateTax && data.residentState) {
    const stateCode = data.residentState as StateCode;
    const stateRate = STATE_TAX_RATES[stateCode] || 0.05; // default to 5% if state not found
    stateTax = calculatedTaxableIncome * stateRate;
  }
  
  // Calculate refund or amount owed
  const calculatedRefund = totalWithholding > calculatedTax ? totalWithholding - calculatedTax : 0;
  const calculatedOwed = calculatedTax > totalWithholding ? calculatedTax - totalWithholding : 0;
  
  return {
    calculatedTaxableIncome,
    calculatedAGI,
    calculatedTax,
    calculatedRefund,
    calculatedOwed,
    stateTax
  };
};
