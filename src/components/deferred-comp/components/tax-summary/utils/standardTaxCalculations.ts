
/**
 * Standard tax calculation utilities
 */
import { EquityFormState } from "../../../types";
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
    spreadPerShare = formState.fairMarketValue - formState.strikePrice;
    
    if (formState.exerciseStrategy === "full") {
      exercisedShares = formState.vestedShares;
    } else if (formState.exerciseStrategy === "partial") {
      exercisedShares = formState.partialShares;
    } else if (formState.exerciseStrategy === "split") {
      exercisedShares = Math.floor(formState.vestedShares / formState.splitYears);
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
    } else if (formState.deferralStrategy === "multi-year" || formState.deferralStrategy === "staggered") {
      // If staggered, divide by years
      nextYearIncome = deferredIncome / (formState.deferralYears || 2);
    }
  }
  
  return { deferredIncome, nextYearIncome };
};
