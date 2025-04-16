
/**
 * State Tax Calculations
 * 
 * Functions for calculating state tax based on income and state.
 */
import { StateCode } from './types';
import { stateTaxData } from './data';

/**
 * Calculate estimated state tax based on income and state
 * @param income Taxable income amount
 * @param stateCode The state code to calculate taxes for
 * @returns Estimated state tax amount
 */
export const calculateStateTax = (income: number, stateCode: StateCode): number => {
  const state = stateTaxData[stateCode];
  
  if (!state || state.type === 'none') {
    return 0;
  }
  
  if (state.type === 'flat') {
    return income * (state.flatRate! / 100);
  }
  
  // For graduated brackets
  let totalTax = 0;
  const brackets = state.brackets || [];
  
  for (let i = 0; i < brackets.length; i++) {
    const { min, max, rate } = brackets[i];
    
    if (income > min) {
      const taxableInThisBracket = Math.min(income, max) - min;
      totalTax += (taxableInThisBracket * rate) / 100;
    }
    
    if (income <= max) {
      break;
    }
  }
  
  return totalTax;
};
