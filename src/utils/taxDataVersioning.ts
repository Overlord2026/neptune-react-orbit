
/**
 * Tax Data Versioning
 * 
 * Helper functions for managing tax data versions
 */

import { getTaxBracket } from './taxBracketData';

// Define tax bracket type manually since it's not exported from taxBracketData
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
  
  // Convert to TaxBracket type if not null and not string
  if (bracket && typeof bracket !== 'string') {
    return {
      min: bracket.bracket_min,
      max: bracket.bracket_max,
      rate: bracket.rate
    } as TaxBracket;
  }
  
  return null;
}

/**
 * Get tax data version for a specific year
 */
export function getTaxDataVersionForScenario(year: number) {
  return {
    version: `${year}.1.0`,
    description: `Tax data for ${year}`,
    updated: new Date(),
    isProvisional: year >= new Date().getFullYear()
  };
}

/**
 * Check if tax data had mid-year updates
 */
export function hasMidYearUpdates(year: number): boolean {
  // Example implementation - in real app would check version history
  return false;
}

/**
 * Get warning message for mid-year updates
 */
export function getMidYearUpdateWarning(year: number): string {
  return `Tax data for ${year} had mid-year updates that may affect calculations.`;
}
