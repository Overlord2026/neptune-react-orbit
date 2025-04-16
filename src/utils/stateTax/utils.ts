
/**
 * State Tax Utilities
 * 
 * Utility functions for state tax operations and information display.
 */
import { StateCode } from './types';
import { stateTaxData } from './data';

/**
 * Get the appropriate tax disclaimer for a given state
 * @param stateCode The state code to get the disclaimer for
 * @returns A disclaimer string appropriate for the state
 */
export const getStateTaxDisclaimer = (stateCode: StateCode): string => {
  const state = stateTaxData[stateCode];
  
  if (!state) {
    return "Tax calculations are approximate and may not reflect all state-specific rules.";
  }
  
  if (stateCode === 'NONE') {
    return "No state income tax applied to calculations.";
  }
  
  if (stateCode === 'OTHER') {
    return "Only federal tax calculations are being applied. State taxes are not included in these calculations.";
  }
  
  let baseDisclaimer = `We provide approximate calculations for ${state.name} based on current bracket rates. Actual results may vary by local rules`;
  
  if (state.specialNotes) {
    baseDisclaimer += ` — ${state.specialNotes}`;
  }
  
  return baseDisclaimer + '.';
};

/**
 * Get state tax summary for display
 * @param stateCode The state code to get a summary for
 * @returns A string describing the state's tax structure
 */
export const getStateTaxSummary = (stateCode: StateCode): string => {
  const state = stateTaxData[stateCode];
  
  if (!state) {
    return "Tax information not available.";
  }
  
  if (stateCode === 'NONE') {
    return "No state income tax.";
  }
  
  if (stateCode === 'OTHER') {
    return "Federal tax calculations only.";
  }
  
  if (state.type === 'flat') {
    return `Flat tax rate of ${state.flatRate}%.`;
  }
  
  if (state.type === 'graduated' && state.brackets) {
    const lowestRate = state.brackets[0].rate;
    const highestRate = state.brackets[state.brackets.length - 1].rate;
    return `Progressive tax with rates from ${lowestRate}% to ${highestRate}%.`;
  }
  
  return "Tax information not available.";
};
