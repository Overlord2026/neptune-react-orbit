
/**
 * Conversion Strategy Utilities
 */

/**
 * Calculate maximum conversion amount based on strategy and income
 */
export function getMaxConversionAmount(strategy: string, income: number): number {
  switch (strategy) {
    case 'conservative':
      // Conservative strategy: stay in same tax bracket
      return getConservativeAmount(income);
    case 'moderate':
      // Moderate strategy: use some of next bracket
      return getModerateAmount(income);
    case 'aggressive':
      // Aggressive strategy: use full next bracket
      return getAggressiveAmount(income);
    case 'custom':
      // Return a high limit for custom amount
      return 500000;
    default:
      return 0;
  }
}

// Strategy-specific implementations
function getConservativeAmount(income: number): number {
  // Simple mock implementation
  if (income < 50000) return 20000;
  if (income < 100000) return 15000;
  if (income < 200000) return 10000;
  return 5000;
}

function getModerateAmount(income: number): number {
  // Simple mock implementation
  if (income < 50000) return 30000;
  if (income < 100000) return 25000;
  if (income < 200000) return 20000;
  return 15000;
}

function getAggressiveAmount(income: number): number {
  // Simple mock implementation
  if (income < 50000) return 50000;
  if (income < 100000) return 40000;
  if (income < 200000) return 35000;
  return 25000;
}
