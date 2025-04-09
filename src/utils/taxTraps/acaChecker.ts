
import { TaxTrapWarning } from './types';

// ACA Subsidy Thresholds
interface ACASubsidyThreshold {
  year: number;
  household_size: number;
  fpl_min: number; // % of FPL
  fpl_max: number; // % of FPL
  premium_cap_percent: number;
  fpl_amount: number; // Base Federal Poverty Level for this household size
}

const ACA_SUBSIDY_THRESHOLDS: ACASubsidyThreshold[] = [
  // 2023 - Household Size 1
  { year: 2023, household_size: 1, fpl_min: 0, fpl_max: 150, premium_cap_percent: 0, fpl_amount: 13590 },
  { year: 2023, household_size: 1, fpl_min: 150, fpl_max: 200, premium_cap_percent: 2, fpl_amount: 13590 },
  { year: 2023, household_size: 1, fpl_min: 200, fpl_max: 250, premium_cap_percent: 4, fpl_amount: 13590 },
  { year: 2023, household_size: 1, fpl_min: 250, fpl_max: 300, premium_cap_percent: 6, fpl_amount: 13590 },
  { year: 2023, household_size: 1, fpl_min: 300, fpl_max: 400, premium_cap_percent: 8.5, fpl_amount: 13590 },
  { year: 2023, household_size: 1, fpl_min: 400, fpl_max: Infinity, premium_cap_percent: Infinity, fpl_amount: 13590 },
  
  // 2023 - Household Size 2
  { year: 2023, household_size: 2, fpl_min: 0, fpl_max: 150, premium_cap_percent: 0, fpl_amount: 18310 },
  { year: 2023, household_size: 2, fpl_min: 150, fpl_max: 200, premium_cap_percent: 2, fpl_amount: 18310 },
  { year: 2023, household_size: 2, fpl_min: 200, fpl_max: 250, premium_cap_percent: 4, fpl_amount: 18310 },
  { year: 2023, household_size: 2, fpl_min: 250, fpl_max: 300, premium_cap_percent: 6, fpl_amount: 18310 },
  { year: 2023, household_size: 2, fpl_min: 300, fpl_max: 400, premium_cap_percent: 8.5, fpl_amount: 18310 },
  { year: 2023, household_size: 2, fpl_min: 400, fpl_max: Infinity, premium_cap_percent: Infinity, fpl_amount: 18310 },
  
  // 2023 - Household Size 4 (simplified)
  { year: 2023, household_size: 4, fpl_min: 0, fpl_max: 150, premium_cap_percent: 0, fpl_amount: 27750 },
  { year: 2023, household_size: 4, fpl_min: 150, fpl_max: 200, premium_cap_percent: 2, fpl_amount: 27750 },
  { year: 2023, household_size: 4, fpl_min: 200, fpl_max: 250, premium_cap_percent: 4, fpl_amount: 27750 },
  { year: 2023, household_size: 4, fpl_min: 250, fpl_max: 300, premium_cap_percent: 6, fpl_amount: 27750 },
  { year: 2023, household_size: 4, fpl_min: 300, fpl_max: 400, premium_cap_percent: 8.5, fpl_amount: 27750 },
  { year: 2023, household_size: 4, fpl_min: 400, fpl_max: Infinity, premium_cap_percent: Infinity, fpl_amount: 27750 },
];

/**
 * Check for ACA subsidy impacts
 */
export function checkACASubsidyImpact(
  year: number,
  householdSize: number,
  magi: number
): { fpl_percentage: number; premium_cap_percent: number; subsidy_impact: number } {
  // Find applicable thresholds for the year and household size
  let thresholds = ACA_SUBSIDY_THRESHOLDS.filter(
    t => t.year === year && t.household_size === householdSize
  );
  
  if (thresholds.length === 0) {
    // Try to find thresholds for the closest household size
    const allSizes = [...new Set(ACA_SUBSIDY_THRESHOLDS.map(t => t.household_size))];
    const closestSize = allSizes.reduce((prev, curr) => 
      Math.abs(curr - householdSize) < Math.abs(prev - householdSize) ? curr : prev
    );
    
    thresholds = ACA_SUBSIDY_THRESHOLDS.filter(
      t => t.year === year && t.household_size === closestSize
    );
    
    if (thresholds.length === 0) {
      // Default to no subsidy if no data found
      return { fpl_percentage: 0, premium_cap_percent: Infinity, subsidy_impact: 0 };
    }
  }
  
  // Get FPL amount for this household size
  const fplAmount = thresholds[0].fpl_amount;
  
  // Calculate FPL percentage
  const fpl_percentage = (magi / fplAmount) * 100;
  
  // Find the applicable bracket
  const bracket = thresholds.find(
    t => fpl_percentage >= t.fpl_min && fpl_percentage < t.fpl_max
  );
  
  if (!bracket) {
    // Default to no subsidy if no bracket found
    return { fpl_percentage, premium_cap_percent: Infinity, subsidy_impact: 0 };
  }
  
  // Find the next bracket for potential impact
  const currentIndex = thresholds.indexOf(bracket);
  const nextBracket = currentIndex < thresholds.length - 1 ? thresholds[currentIndex + 1] : null;
  
  // Calculate estimated subsidy impact (simplified)
  // Assume average marketplace premium of $500/month per person
  const avgMonthlyPremium = 500 * householdSize;
  let subsidy_impact = 0;
  
  if (nextBracket && fpl_percentage + 10 >= nextBracket.fpl_min) {
    // If close to next bracket, calculate potential impact
    const currentMaxContribution = (bracket.premium_cap_percent / 100) * magi / 12;
    const nextMaxContribution = (nextBracket.premium_cap_percent / 100) * magi / 12;
    
    // The impact is the difference in monthly contribution, annualized
    subsidy_impact = Math.max(0, (nextMaxContribution - currentMaxContribution) * 12);
    
    // Special case for the subsidy cliff
    if (nextBracket.premium_cap_percent === Infinity) {
      subsidy_impact = Math.max(0, (avgMonthlyPremium - currentMaxContribution) * 12);
    }
  }
  
  return {
    fpl_percentage,
    premium_cap_percent: bracket.premium_cap_percent,
    subsidy_impact
  };
}

export function generateACAWarning(
  acaResult: { fpl_percentage: number; premium_cap_percent: number; subsidy_impact: number }
): TaxTrapWarning | null {
  if (acaResult.subsidy_impact > 1000) {
    return {
      type: 'aca',
      severity: acaResult.subsidy_impact > 5000 ? 'alert' : 'warning',
      title: 'ACA Subsidy Reduction Risk',
      description: `You may lose up to $${acaResult.subsidy_impact.toFixed(0)} in annual health insurance premium assistance.`,
      financial_impact: acaResult.subsidy_impact,
      icon: 'alertCircle'
    };
  }
  
  return null;
}
