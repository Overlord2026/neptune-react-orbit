
/**
 * Capital Gains Tax Calculation Utilities
 */

export interface CapitalGainsTaxResult {
  current_rate: number;
  potential_rate: number;
  rate_increase: number;
  tax_increase: number;
}

/**
 * Calculate the impact of income changes on capital gains tax rates
 */
export function calculateCapitalGainsBracketImpact(
  agi: number, 
  capitalGainsAmount: number, 
  filingStatus: string, 
  year: number
): CapitalGainsTaxResult {
  // Default to current year
  const calcYear = year || new Date().getFullYear();
  
  // Capital gains thresholds for 2023
  const threshold1 = filingStatus === 'married_joint' ? 89250 : 44625; // 0% to 15% transition
  const threshold2 = filingStatus === 'married_joint' ? 553850 : 492300; // 15% to 20% transition
  
  // Determine current rate based on AGI without the capital gains
  const baseIncome = agi - capitalGainsAmount;
  let currentRate = 0;
  
  if (baseIncome > threshold2) {
    currentRate = 20;
  } else if (baseIncome > threshold1) {
    currentRate = 15;
  } else {
    currentRate = 0;
  }
  
  // Determine potential new rate with additional income
  let potentialRate = 0;
  
  if (agi > threshold2) {
    potentialRate = 20;
  } else if (agi > threshold1) {
    potentialRate = 15;
  } else {
    potentialRate = 0;
  }
  
  // Calculate the impact
  const rateIncrease = potentialRate - currentRate;
  
  // If the rate increases, calculate the tax impact
  let taxIncrease = 0;
  if (rateIncrease > 0) {
    // Only apply increased rate to portion above threshold
    if (baseIncome < threshold1 && agi > threshold1) {
      // Crossing from 0% to 15%
      const amountInHigherBracket = agi - threshold1;
      taxIncrease = (amountInHigherBracket) * (rateIncrease / 100);
    } else if (baseIncome < threshold2 && agi > threshold2) {
      // Crossing from 15% to 20%
      const amountInHigherBracket = agi - threshold2;
      taxIncrease = (amountInHigherBracket) * (rateIncrease / 100);
    }
  }
  
  return {
    current_rate: currentRate,
    potential_rate: potentialRate,
    rate_increase: rateIncrease,
    tax_increase: taxIncrease
  };
}
