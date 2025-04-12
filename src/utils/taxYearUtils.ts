
/**
 * Tax Year Utilities
 * 
 * Centralized functions for managing tax years throughout the application
 */

/**
 * Returns an array of available tax years in the system
 * This can be expanded in the future as new tax years become available
 */
export const getTaxYears = (): number[] => {
  return [2021, 2022, 2023, 2024, 2025];
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
  // Currently only 2025 uses projected data
  return year === 2025;
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
