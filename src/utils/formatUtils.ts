
/**
 * Format utility functions for consistent display throughout the application
 */

/**
 * Format a number as currency with $ symbol
 */
export const formatCurrency = (value: number | undefined): string => {
  if (value === undefined || value === null) return '$0';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Format a number as percentage
 */
export const formatPercent = (value: number | undefined): string => {
  if (value === undefined || value === null) return '0%';
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format a number with commas for thousands
 */
export const formatNumber = (value: number | undefined): string => {
  if (value === undefined || value === null) return '0';
  
  return new Intl.NumberFormat('en-US').format(value);
};
