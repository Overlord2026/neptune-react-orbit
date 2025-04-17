
import { TaxTrapWarning } from './types';

// FPL values for 2023
// These should be updated each year as the Federal Poverty Level values change
const FPL_BASE_2023 = 13590;
const FPL_ADDITIONAL_2023 = 4720;

// Premium subsidy thresholds - % of income expected to be paid for benchmark plan
// After the American Rescue Plan Act (ARPA), extended by the Inflation Reduction Act
interface SubsidyThreshold {
  fpl_percent_min: number;
  fpl_percent_max: number;
  income_percent_2023: number;
  income_percent_2024: number;
  notes: string;
}

const SUBSIDY_THRESHOLDS: SubsidyThreshold[] = [
  { fpl_percent_min: 0, fpl_percent_max: 150, income_percent_2023: 0, income_percent_2024: 0, notes: 'Maximum subsidy' },
  { fpl_percent_min: 150, fpl_percent_max: 200, income_percent_2023: 2, income_percent_2024: 2, notes: 'High subsidy' },
  { fpl_percent_min: 200, fpl_percent_max: 250, income_percent_2023: 4, income_percent_2024: 4, notes: 'Significant subsidy' },
  { fpl_percent_min: 250, fpl_percent_max: 300, income_percent_2023: 6, income_percent_2024: 6, notes: 'Moderate subsidy' },
  { fpl_percent_min: 300, fpl_percent_max: 400, income_percent_2023: 8.5, income_percent_2024: 8.5, notes: 'Some subsidy' },
  { fpl_percent_min: 400, fpl_percent_max: Infinity, income_percent_2023: 8.5, income_percent_2024: 8.5, notes: 'Limited subsidy' }
];

/**
 * Calculate FPL percentage for a household
 */
export function calculateFplPercentage(
  income: number,
  householdSize: number,
  year: number = 2023
): number {
  // For now we only have 2023 data
  const baseAmount = FPL_BASE_2023;
  const additionalAmount = FPL_ADDITIONAL_2023;
  
  const fplForHousehold = baseAmount + ((householdSize - 1) * additionalAmount);
  return (income / fplForHousehold) * 100;
}

/**
 * Estimate ACA subsidy amount
 * This is a simplified calculation - actual subsidies involve age, location, etc.
 */
export function estimateSubsidyAmount(
  income: number,
  householdSize: number,
  year: number = 2023
): number {
  const fplPercentage = calculateFplPercentage(income, householdSize, year);
  
  // Approximate average annual premium for benchmark plan
  const averagePremium = householdSize * 7500;
  
  // Find applicable threshold
  const threshold = SUBSIDY_THRESHOLDS.find(
    t => fplPercentage >= t.fpl_percent_min && fplPercentage < t.fpl_percent_max
  ) || SUBSIDY_THRESHOLDS[SUBSIDY_THRESHOLDS.length - 1];
  
  // Expected contribution percentage
  const contributionPercentage = threshold.income_percent_2023;
  
  // Maximum household contribution
  const householdContribution = (income * contributionPercentage) / 100;
  
  // Subsidy is difference between premium and expected contribution
  const subsidy = Math.max(0, averagePremium - householdContribution);
  
  return subsidy;
}

/**
 * Check if at risk of subsidy cliff
 */
export function checkSubsidyCliff(
  income: number,
  householdSize: number,
  year: number = 2023
): { 
  isAtRisk: boolean; 
  fplPercentage: number; 
  subsidyAmount: number;
  distanceToCliff: number | null;
} {
  const fplPercentage = calculateFplPercentage(income, householdSize, year);
  const subsidyAmount = estimateSubsidyAmount(income, householdSize, year);
  
  // FPL threshold for household
  const fplForHousehold = FPL_BASE_2023 + ((householdSize - 1) * FPL_ADDITIONAL_2023);
  
  // Calculate distance to 400% FPL
  const threshold = fplForHousehold * 4; // 400% FPL
  const distanceToCliff = threshold - income;
  
  // Determine if at risk (within 10% of threshold)
  const isAtRisk = fplPercentage >= 360 && fplPercentage <= 410;
  
  return {
    isAtRisk,
    fplPercentage,
    subsidyAmount,
    distanceToCliff: distanceToCliff > 0 ? distanceToCliff : null
  };
}

/**
 * Generate ACA subsidy warning if applicable
 */
export function generateAcaWarning(
  income: number,
  householdSize: number,
  year: number = 2023
): TaxTrapWarning | null {
  const { isAtRisk, fplPercentage, subsidyAmount, distanceToCliff } = checkSubsidyCliff(
    income,
    householdSize,
    year
  );
  
  if (isAtRisk) {
    // Calculate financial impact (potential loss of subsidy)
    const financialImpact = subsidyAmount;
    
    if (distanceToCliff !== null && distanceToCliff > 0) {
      // Close to cliff but not over
      return {
        type: 'aca',
        severity: 'medium', // Fixed: changed from 'warning' to 'medium'
        title: 'ACA Subsidy Cliff Risk',
        description: `You are ${Math.round(fplPercentage)}% of FPL, only $${Math.round(distanceToCliff).toLocaleString()} from the premium subsidy cliff.`,
        financial_impact: financialImpact,
        icon: 'alertTriangle'
      };
    } else {
      // Over cliff
      return {
        type: 'aca',
        severity: 'high', // Fixed: changed from 'alert' to 'high'
        title: 'ACA Subsidy Cliff Impact',
        description: `You are at ${Math.round(fplPercentage)}% of FPL, which may put you beyond the premium subsidy eligibility threshold.`,
        financial_impact: financialImpact,
        icon: 'alertCircle'
      };
    }
  }
  
  return null;
}
