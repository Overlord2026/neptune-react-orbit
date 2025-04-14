
/**
 * Tax calculation utilities for equity compensation
 */
import { EquityFormState, YearlyTaxImpact, EquityCompEvent, DeferralEvent } from "../../types";
import { getTaxBracketRate } from "./utils/taxBrackets";
import { TaxImpactResult } from "./utils/taxTypes";
import { calculateEquityValues, calculateDeferredIncome } from "./utils/standardTaxCalculations";

export { getTaxBracketRate } from "./utils/taxBrackets";
export type { TaxImpactResult } from "./utils/taxTypes";

/**
 * Calculate tax impact based on form state and provided calculation functions
 */
export const calculateTaxImpact = (
  formState: EquityFormState,
  calculateAmtImpact: () => number,
  calculateMultiYearImpact: () => YearlyTaxImpact[],
  getEquityEvents: () => EquityCompEvent[],
  getDeferralEvents: () => DeferralEvent[]
): TaxImpactResult => {
  let totalTaxableIncome = 0;
  let amtIncome = 0;
  let amtImpact = 0;
  let deferralBenefit = 0;
  
  // Calculate equity-related values
  const { 
    spreadPerShare, 
    exercisedShares, 
    incomeFromExercise 
  } = calculateEquityValues(formState);
  
  // If user has stock options
  if (formState.equityType === "NSO" || formState.equityType === "ISO") {
    if (formState.equityType === "NSO") {
      // NSOs generate immediate ordinary income
      totalTaxableIncome += incomeFromExercise;
    } else if (formState.equityType === "ISO" && !formState.isDisqualifyingDisposition) {
      // ISOs have AMT implications instead of ordinary income
      amtIncome = incomeFromExercise;
      amtImpact = calculateAmtImpact();
    } else if (formState.equityType === "ISO" && formState.isDisqualifyingDisposition) {
      // Disqualifying disposition of ISOs creates ordinary income
      totalTaxableIncome += incomeFromExercise;
    }
  }
  
  // Calculate deferred income values
  const { deferredIncome, nextYearIncome } = calculateDeferredIncome(formState);
  
  // If user has deferred comp
  if (formState.hasDeferredComp) {
    const totalBonus = formState.bonusAmount;
    
    // Only non-deferred portion is taxed this year
    totalTaxableIncome += (totalBonus - deferredIncome);
  }
  
  // Simple estimated tax calculation
  const estimatedTaxRate = 0.35; // 35% effective tax rate for demo
  const estimatedTax = totalTaxableIncome * estimatedTaxRate;
  
  // Calculate bracket impact
  const bracketBefore = getTaxBracketRate(formState.bonusAmount - formState.deferralAmount);
  const bracketAfter = getTaxBracketRate(totalTaxableIncome);
  const bracketImpact = bracketBefore !== bracketAfter;
  
  // Get multi-year impact data
  const multiYearImpact = calculateMultiYearImpact();
  const equityEvents = getEquityEvents();
  const deferralEvents = getDeferralEvents();
  
  return {
    totalTaxableIncome,
    estimatedTax,
    amtIncome,
    amtImpact,
    deferralBenefit,
    spreadPerShare,
    exercisedShares,
    incomeFromExercise,
    deferredIncome,
    nextYearIncome,
    bracketImpact,
    bracketBefore,
    bracketAfter,
    multiYearImpact,
    equityEvents,
    deferralEvents
  };
};
