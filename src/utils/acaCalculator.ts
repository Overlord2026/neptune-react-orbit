
/**
 * ACA (Affordable Care Act) Subsidy Calculator
 * 
 * Calculates premium subsidy changes based on income
 */

export interface AcaSubsidyResult {
  fpl_percentage: number;
  subsidy_loss: number;
  premium_increase: number;
  old_premium: number;
  new_premium: number;
}

/**
 * Calculate the impact on ACA premium subsidies based on income changes
 */
export function calculateAcaSubsidyImpact(
  magi: number, 
  householdSize: number, 
  filingStatus: string,
  stateOfResidence?: string
): AcaSubsidyResult {
  // Federal Poverty Level (FPL) for 2023
  const baseFpl = 14580; // Base FPL for 1 person in 2023
  const fplAdjustment = 5140; // Additional amount per person
  
  // Calculate the household FPL
  const householdFpl = baseFpl + (fplAdjustment * (householdSize - 1));
  
  // Calculate percentage of FPL
  const fplPercentage = (magi / householdFpl) * 100;
  
  // Calculate subsidy impact
  let subsidyLoss = 0;
  let premiumIncrease = 0;
  let oldPremium = 0;
  let newPremium = 0;
  
  // Simplified calculation - in reality this is much more complex
  // and depends on benchmark plan costs, age, etc.
  
  // Premium caps as percentage of income based on FPL percentage
  if (fplPercentage <= 150) {
    // 0-150% FPL: capped at 0-2% of income
    oldPremium = magi * 0.0;
    newPremium = magi * 0.0;
  } else if (fplPercentage <= 200) {
    // 150-200% FPL: capped at 2-4% of income
    oldPremium = magi * 0.02;
    newPremium = magi * 0.04;
  } else if (fplPercentage <= 250) {
    // 200-250% FPL: capped at 4-6% of income
    oldPremium = magi * 0.04;
    newPremium = magi * 0.06;
  } else if (fplPercentage <= 300) {
    // 250-300% FPL: capped at 6-8.5% of income
    oldPremium = magi * 0.06;
    newPremium = magi * 0.085;
  } else if (fplPercentage <= 400) {
    // 300-400% FPL: capped at 8.5-9.5% of income
    oldPremium = magi * 0.085;
    newPremium = magi * 0.095;
  } else {
    // Above 400% FPL: no subsidy (cliff)
    oldPremium = magi * 0.095;
    newPremium = 12000; // Average unsubsidized premium
  }
  
  // Calculate the subsidy loss
  subsidyLoss = newPremium - oldPremium;
  premiumIncrease = (subsidyLoss / oldPremium) * 100;
  
  return {
    fpl_percentage: fplPercentage,
    subsidy_loss: subsidyLoss,
    premium_increase: premiumIncrease,
    old_premium: oldPremium,
    new_premium: newPremium
  };
}
