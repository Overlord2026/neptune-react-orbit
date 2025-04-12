
/**
 * Tax Year Utilities
 * 
 * Centralized functions for managing tax years throughout the application
 */

// Store the years as a variable that can be modified
let availableTaxYears: number[] = [2021, 2022, 2023, 2024, 2025];

/**
 * Returns an array of available tax years in the system
 * This can be expanded in the future as new tax years become available
 */
export const getTaxYears = (): number[] => {
  return [...availableTaxYears];
};

/**
 * Returns the most recent tax year
 */
export const getCurrentTaxYear = (): number => {
  return Math.max(...getTaxYears());
};

/**
 * Returns true if the year is still using projected/estimated tax data
 */
export const isProjectedTaxYear = (year: number): boolean => {
  // Currently only years beyond current calendar year use projected data
  const currentCalendarYear = new Date().getFullYear();
  return year > currentCalendarYear;
};

/**
 * Formats a tax year with optional prefix/suffix
 */
export const formatTaxYear = (year: number, options?: { 
  prefix?: string;
  suffix?: string;
}): string => {
  const { prefix = '', suffix = '' } = options || {};
  return `${prefix}${year}${suffix}`;
};

/**
 * Adds a new tax year to the system if it doesn't already exist
 * Returns true if the year was added, false if it already existed
 */
export const addTaxYear = (year: number): boolean => {
  // Validate input
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    throw new Error("Invalid tax year. Must be an integer between 1900 and 2100.");
  }

  // Check if year already exists
  if (availableTaxYears.includes(year)) {
    return false;
  }

  // Add the year
  availableTaxYears.push(year);
  
  // Sort years in descending order
  availableTaxYears.sort((a, b) => b - a);
  
  return true;
};

/**
 * Removes a tax year from the system
 * Returns true if the year was removed, false if it didn't exist
 * Cannot remove all years - must keep at least one
 */
export const removeTaxYear = (year: number): boolean => {
  // Check if year exists
  if (!availableTaxYears.includes(year)) {
    return false;
  }

  // Don't allow removing all years
  if (availableTaxYears.length <= 1) {
    throw new Error("Cannot remove the last remaining tax year.");
  }

  // Remove the year
  availableTaxYears = availableTaxYears.filter(y => y !== year);
  
  return true;
};

/**
 * Ensures the next year exists in the system
 * Useful for automatic year rollovers
 */
export const ensureNextYearExists = (): boolean => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  
  return addTaxYear(nextYear);
};
