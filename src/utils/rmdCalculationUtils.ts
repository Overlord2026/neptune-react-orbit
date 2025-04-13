
/**
 * RMD (Required Minimum Distribution) Calculation Utilities
 * 
 * Functions for calculating RMDs based on age and account balances.
 */

/**
 * Calculate RMD amount based on IRA balance and age
 * Uses IRS Uniform Lifetime Table
 */
export const calculateRMD = (balance: number, age: number): number => {
  // IRS Uniform Lifetime Table (simplified version)
  const lifeExpectancyTable: Record<number, number> = {
    73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0, 79: 21.1,
    80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0, 86: 15.2,
    87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8, 93: 10.1,
    94: 9.5, 95: 8.9, 96: 8.4, 97: 7.8, 98: 7.3, 99: 6.8, 100: 6.4,
    // Add more ages as needed
  };
  
  // If age not found in table or below RMD age, return 0
  if (!lifeExpectancyTable[age]) {
    return 0;
  }
  
  // Calculate RMD: account balance divided by life expectancy factor
  return balance / lifeExpectancyTable[age];
};
