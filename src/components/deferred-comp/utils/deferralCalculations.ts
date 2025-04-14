
/**
 * Deferral calculations utilities
 */

import { EquityFormState, DeferralEvent } from '../types';
import { getTaxBracketRate } from './taxBracketUtils';

/**
 * Calculate benefit from deferred compensation
 */
export const calculateDeferralBenefit = (formState: EquityFormState): number => {
  if (!formState.hasDeferredComp || formState.deferralAmount <= 0) {
    return 0;
  }

  // Simple calculation - assumes tax rate difference of around 3-5% between years
  const currentIncome = formState.bonusAmount;
  const currentRate = getTaxBracketRate(currentIncome);
  const reducedIncome = currentIncome - formState.deferralAmount;
  const reducedRate = getTaxBracketRate(reducedIncome);
  
  // Calculate tax on full bonus amount
  const taxOnFullBonus = currentIncome * currentRate;
  
  // Calculate tax on reduced bonus (after deferral)
  const taxOnReducedBonus = reducedIncome * reducedRate;
  
  // Assume future tax on deferred amount is 3% lower (simplified)
  const assumedFutureRate = Math.max(reducedRate - 0.03, 0.10);
  const futureTaxOnDeferred = formState.deferralAmount * assumedFutureRate;
  
  // Calculate benefit
  const taxSaving = taxOnFullBonus - (taxOnReducedBonus + futureTaxOnDeferred);
  
  return Math.round(taxSaving);
};

/**
 * Get all deferral events based on form state
 */
export const getDeferralEvents = (formState: EquityFormState): DeferralEvent[] => {
  if (!formState.hasDeferredComp || formState.deferralAmount <= 0) {
    return [];
  }
  
  const events: DeferralEvent[] = [];
  const currentYear = new Date().getFullYear();
  const taxSavings = calculateDeferralBenefit(formState);
  const taxRate = getTaxBracketRate(formState.bonusAmount);
  
  if (formState.deferralStrategy === "next-year") {
    // Simple next year deferral
    events.push({
      fromYear: currentYear,
      toYear: currentYear + 1,
      amount: formState.deferralAmount,
      taxSavings,
      // Add required properties
      year: currentYear,
      amountDeferred: formState.deferralAmount,
      taxRate,
      taxesSaved: taxSavings
    });
  } 
  else if (formState.deferralStrategy === "multi-year" || formState.deferralStrategy === "staggered") {
    // Multi-year staggered deferral
    const amountPerYear = formState.deferralAmount / formState.deferralYears;
    const savingsPerYear = taxSavings / formState.deferralYears;
    
    for (let i = 0; i < formState.deferralYears; i++) {
      events.push({
        fromYear: currentYear,
        toYear: currentYear + 1 + i,
        amount: amountPerYear,
        taxSavings: savingsPerYear,
        // Add required properties
        year: currentYear + i,
        amountDeferred: amountPerYear,
        taxRate,
        taxesSaved: savingsPerYear
      });
    }
  }
  
  return events;
};

// Re-export IRMAA check from tax bracket utils
export { checkIrmaaImpact } from './taxBracketUtils';
