
/**
 * Tax Data Utilities
 * 
 * Functions for managing tax data versions and currency
 */

import { getTaxDataUpdatedTimestamp } from './taxDataUpdater';
import { taxBracketData } from './taxBracketData';
import { taxData2024 } from './taxBracketData2024';
import { taxData2025 } from './taxBracketData2025';

// Map of session IDs to tax data cache info
const sessionTaxDataInfo: Map<string, {
  dataUpdatedAt: Date;
  isCurrent: boolean;
}> = new Map();

/**
 * Check tax data for a specific session
 */
export function checkTaxDataBeforeCalculation(sessionId: string = "default") {
  // If we don't have info for this session yet, create it
  if (!sessionTaxDataInfo.has(sessionId)) {
    const currentDate = new Date();
    const lastUpdated = getTaxDataUpdatedTimestamp() || new Date();
    
    // Is the tax data current? (less than 30 days old)
    const isCurrent = (currentDate.getTime() - lastUpdated.getTime()) < (30 * 24 * 60 * 60 * 1000);
    
    sessionTaxDataInfo.set(sessionId, {
      dataUpdatedAt: lastUpdated,
      isCurrent
    });
  }
  
  return sessionTaxDataInfo.get(sessionId)!;
}

/**
 * Get tax data version information for a specific year
 */
export function getTaxDataVersionForScenario(year: number) {
  // Dynamically determine which tax data to use based on year
  if (year === 2025) {
    return {
      version: "2025.1",
      description: "Projected 2025 tax brackets",
      updated: new Date("2024-01-15")
    };
  } else if (year === 2024) {
    return {
      version: "2024.2",
      description: "2024 tax brackets with inflation adjustments",
      updated: new Date("2023-11-10")
    };
  } else {
    return {
      version: `${year}.base`,
      description: `Standard tax data for ${year}`,
      updated: getTaxDataUpdatedTimestamp() || new Date()
    };
  }
}

/**
 * Check if a tax year has mid-year updates that might affect calculation
 */
export function hasMidYearUpdates(year: number): boolean {
  // For this example, we'll say 2024 has mid-year updates
  return year === 2024;
}

/**
 * Get warning message for years with mid-year tax updates
 */
export function getMidYearUpdateWarning(year: number): string {
  if (year === 2024) {
    return "Tax brackets for 2024 were updated mid-year. Different brackets may apply to income earned before and after the update date.";
  }
  return "";
}
