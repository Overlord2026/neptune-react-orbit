
/**
 * Tax Data Versioning
 * 
 * Helper functions for managing tax data versions
 */

import { getTaxBracket } from './taxBracketData';

// Define tax bracket type
export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

/**
 * Check if tax data needs update
 */
export function checkTaxDataVersion(year: number): boolean {
  // Simple version check based on year
  const currentYear = new Date().getFullYear();
  return year >= currentYear;
}

/**
 * Get tax bracket for a specific year and filing status
 */
export function getYearSpecificTaxBracket(
  year: number, 
  filingStatus: string, 
  income: number
): TaxBracket | null {
  // Use the core getTaxBracket function with the year parameter
  const bracket = getTaxBracket(income, filingStatus as any);
  
  // Convert string to TaxBracket object if needed
  if (bracket && typeof bracket !== 'string') {
    return bracket;
  }
  
  return null;
}
