
/**
 * Utility functions for formatting values
 */

/**
 * Format a number as currency
 */
export const formatCurrency = (amount: number, options: Intl.NumberFormatOptions = {}): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    ...options
  }).format(amount);
};

/**
 * Format a number as percentage
 */
export const formatPercent = (decimal: number, options: Intl.NumberFormatOptions = {}): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    ...options
  }).format(decimal);
};
