
/**
 * State Tax Utility Functions
 * 
 * Functions for calculating state taxes in various contexts
 */

import { StateCode } from '../../../stateTaxData';

/**
 * Calculate state tax based on income and state code
 * @param income The taxable income
 * @param stateCode The state code (e.g., 'CA', 'NY')
 * @param filingStatus The filing status
 * @returns The calculated state tax amount
 */
export function calculateStateTax(
  income: number,
  stateCode: StateCode,
  filingStatus: string = 'single'
): number {
  // This is a simplified implementation for the type fix
  // In a real implementation, we would use actual state tax brackets and rates
  
  // Simple mock rates for common states
  const stateRates: Record<string, number> = {
    'CA': 0.093,
    'NY': 0.0685,
    'TX': 0,
    'FL': 0,
    'WA': 0,
    'NV': 0,
    'IL': 0.0495,
    'MA': 0.05
  };
  
  // Use a default rate for unknown states
  const rate = stateRates[stateCode] || 0.05;
  
  // Apply a simplified calculation
  return income * rate;
}
