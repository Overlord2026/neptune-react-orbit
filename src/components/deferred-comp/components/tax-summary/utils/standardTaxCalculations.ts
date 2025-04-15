
/**
 * Standard tax calculation utilities
 */
import { EquityFormState } from "../../../../../types/tax/equityTypes";
import { getTaxBracketRate } from "./taxBrackets";

/**
 * Calculate equity-related values based on form state
 */
export const calculateEquityValues = (formState: EquityFormState) => {
  let spreadPerShare = 0;
  let exercisedShares = 0;
  let incomeFromExercise = 0;
  
  // If user has stock options
  if (formState.equityType === "NSO" || formState.equityType === "ISO") {
    // Handle potentially undefined properties safely
    const fairMarketValue = formState.fairMarketValue || 0;
    const strikePrice = formState.strikePrice || 0;
    const vestedShares = formState.vestedShares || 0;
    const partialShares = formState.partialShares || 0;
    const splitYears = formState.splitYears || 1;
    
    spreadPerShare = fairMarketValue - strikePrice;
    
    if (formState.exerciseStrategy === "full") {
      exercisedShares = vestedShares;
    } else if (formState.exerciseStrategy === "partial") {
      exercisedShares = partialShares;
    } else if (formState.exerciseStrategy === "split") {
      exercisedShares = Math.floor(vestedShares / splitYears);
    }
    
    incomeFromExercise = spreadPerShare * exercisedShares;
  }
  
  return { spreadPerShare, exercisedShares, incomeFromExercise };
};

/**
 * Calculate deferred income values based on form state
 */
export const calculateDeferredIncome = (formState: EquityFormState) => {
  let deferredIncome = 0;
  let nextYearIncome = 0;
  
  if (formState.hasDeferredComp) {
    deferredIncome = formState.deferralAmount;
    
    // Income added to next year
    if (formState.deferralStrategy === "next-year") {
      nextYearIncome = deferredIncome;
    } else if (formState.deferralStrategy === "multi-year") {
      // If staggered, divide by years (default to 2 years if undefined)
      nextYearIncome = deferredIncome / (formState.deferralYears || 2);
    }
  }
  
  return { deferredIncome, nextYearIncome };
};
