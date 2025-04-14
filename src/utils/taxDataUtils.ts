/**
 * Tax Data Utilities
 * 
 * Functions for managing and checking the currency of tax data.
 */

import { TaxDataCacheInfo } from './taxCalculatorTypes';

// Tax data version and update information stored in local storage
const TAX_DATA_STORAGE_KEY = 'tax_data_info';

// Tax data version to compare against
const CURRENT_TAX_DATA_VERSION = '2024.01.01';

// Years with mid-year tax law updates
const YEARS_WITH_MID_YEAR_UPDATES = [2018];

/**
 * Get tax data information from local storage
 */
const getTaxDataInformationFromStorage = (sessionId: string = "default") => {
  try {
    const storedData = localStorage.getItem(`${TAX_DATA_STORAGE_KEY}-${sessionId}`);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error("Error getting tax data info from local storage:", error);
  }
  
  return {
    dataUpdatedAt: new Date(0),
    isCurrent: false,
    version: null
  };
};

/**
 * Save tax data information to local storage
 */
const saveTaxDataInformationToStorage = (
  dataUpdatedAt: Date, 
  isCurrent: boolean, 
  version: string,
  sessionId: string = "default"
) => {
  try {
    const data = {
      dataUpdatedAt: dataUpdatedAt.toISOString(),
      isCurrent,
      version
    };
    localStorage.setItem(`${TAX_DATA_STORAGE_KEY}-${sessionId}`, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving tax data info to local storage:", error);
  }
};

/**
 * Check if tax data is current and refresh if needed
 */
export const checkTaxDataBeforeCalculation = (sessionId: string = "default"): TaxDataCacheInfo => {
  // Convert string date to Date object to match the interface
  const infoFromStorage = getTaxDataInformationFromStorage(sessionId);
  
  return {
    dataUpdatedAt: new Date(infoFromStorage.dataUpdatedAt),
    isCurrent: infoFromStorage.isCurrent
  };
};

/**
 * Refresh tax data by updating the timestamp and version
 */
export const refreshTaxData = (sessionId: string = "default") => {
  const now = new Date();
  saveTaxDataInformationToStorage(now, true, CURRENT_TAX_DATA_VERSION, sessionId);
  
  return {
    dataUpdatedAt: now,
    isCurrent: true
  };
};

/**
 * Get tax data version for a specific year
 */
export const getTaxDataVersionForScenario = (year: number, scenarioDate?: Date) => {
  // For simplicity, we're using a single version for all years
  // In a real application, you might have different versions for different years
  return {
    year,
    version: CURRENT_TAX_DATA_VERSION
  };
};

/**
 * Check if a tax year has mid-year updates
 */
export const hasMidYearUpdates = (year: number): boolean => {
  return YEARS_WITH_MID_YEAR_UPDATES.includes(year);
};

/**
 * Get a warning message for tax years with mid-year updates
 */
export const getMidYearUpdateWarning = (year: number): string => {
  return `Tax year ${year} had mid-year updates that may affect your calculation.`;
};
