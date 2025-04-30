
/**
 * Central formatting utilities
 * 
 * This file provides standardized formatting functions for use across the application.
 * Having these in one place ensures consistency in how numbers, currency, and percentages are displayed.
 */

/**
 * Format a number as currency with $ symbol
 * @param value - The numeric value to format
 * @param minimumFractionDigits - Minimum number of decimal places (default: 0)
 * @param maximumFractionDigits - Maximum number of decimal places (default: 0)
 */
export const formatCurrency = (value: number | undefined, minimumFractionDigits: number = 0, maximumFractionDigits: number = 0): string => {
  if (value === undefined || value === null) return '$0';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
    maximumFractionDigits
  }).format(value);
};

/**
 * Format a number as percentage
 * @param value - The numeric value to format (0.1 = 10%)
 * @param minimumFractionDigits - Minimum number of decimal places (default: 1)
 * @param maximumFractionDigits - Maximum number of decimal places (default: 2)
 */
export const formatPercent = (value: number | undefined, minimumFractionDigits: number = 1, maximumFractionDigits: number = 2): string => {
  if (value === undefined || value === null) return '0%';
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits
  }).format(value);
};

/**
 * Format a number with commas for thousands
 * @param value - The numeric value to format
 * @param minimumFractionDigits - Minimum number of decimal places (default: 0)
 * @param maximumFractionDigits - Maximum number of decimal places (default: 0)
 */
export const formatNumber = (value: number | undefined, minimumFractionDigits: number = 0, maximumFractionDigits: number = 0): string => {
  if (value === undefined || value === null) return '0';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits
  }).format(value);
};

/**
 * Format a date to a readable string
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 */
export const formatDate = (
  date: Date | string | number, 
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
};
