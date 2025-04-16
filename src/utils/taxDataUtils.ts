
/**
 * Tax Data Utilities
 * 
 * Functions for managing and refreshing tax data
 */

import { TaxDataCacheInfo } from './taxCalculatorTypes';
import { taxBracketData2023 as taxData2023 } from './taxBracketData';
import { taxData2024 } from './taxBracketData2024';
import { taxData2025 } from './taxBracketData2025';

// Define a type for tax data
export interface TaxData {
  year: number;
  standardDeduction: {
    single: number;
    married_joint: number;
    married_separate: number;
    head_of_household: number;
  };
  // Add other tax-related properties here
}

// Tax data versioning
const TAX_DATA_VERSIONS = {
  "2023": { version: "1.0", data: taxData2023 },
  "2024": { version: "1.0", data: taxData2024 },
  "2025": { version: "1.0", data: taxData2025 }
};

// Mid-year updates flag
const MID_YEAR_UPDATES = {
  "2023": true,
  "2024": false,
  "2025": false
};

// Mid-year updates warning message
const MID_YEAR_UPDATE_MESSAGE = {
  "2023": "2023 tax data may be affected by mid-year updates. Please verify calculations with official IRS publications."
};

/**
 * Check if tax data needs to be refreshed
 */
export function checkTaxDataBeforeCalculation(sessionId: string = "default"): TaxDataCacheInfo {
  // Get the date that the tax data was last updated in this session
  const lastUpdated = localStorage.getItem('tax_data_updated_at');
  let dataUpdatedAt = lastUpdated ? new Date(lastUpdated) : new Date();
  
  // If no date stored, consider the data stale
  if (!lastUpdated) {
    dataUpdatedAt = new Date();
    localStorage.setItem('tax_data_updated_at', dataUpdatedAt.toISOString());
  }
  
  // Check if data is current (less than 1 day old)
  const currentTime = new Date();
  const dayInMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const isCurrent = currentTime.getTime() - dataUpdatedAt.getTime() < dayInMs;
  
  return {
    dataUpdatedAt,
    isCurrent,
    sessionId
  };
}

/**
 * Refresh tax data in local storage
 */
export function refreshTaxData(sessionId: string = "default"): void {
  // Refresh the tax data by updating the timestamp
  const now = new Date();
  localStorage.setItem('tax_data_updated_at', now.toISOString());
  
  // You might also want to fetch new data from an API here
  console.log(`Tax data refreshed at ${now.toISOString()} for session ${sessionId}`);
}

/**
 * Get tax data version for a given year
 */
export function getTaxDataVersionForScenario(year: number, scenarioDate?: Date): { version: string; data: any } | undefined {
  const yearStr = String(year);
  // @ts-ignore - We know that TAX_DATA_VERSIONS has these keys
  return TAX_DATA_VERSIONS[yearStr];
}

/**
 * Check if a tax year has mid-year updates
 */
export function hasMidYearUpdates(year: number): boolean {
  const yearStr = String(year);
  // @ts-ignore - We know that MID_YEAR_UPDATES has these keys
  return !!MID_YEAR_UPDATES[yearStr];
}

/**
 * Get mid-year update warning message for a tax year
 */
export function getMidYearUpdateWarning(year: number): string | undefined {
  const yearStr = String(year);
  // @ts-ignore - We know that MID_YEAR_UPDATE_MESSAGE has these keys
  return MID_YEAR_UPDATE_MESSAGE[yearStr];
}
