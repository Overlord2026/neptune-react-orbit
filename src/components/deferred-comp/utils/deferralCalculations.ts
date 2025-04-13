
/**
 * Calculation utilities for deferred compensation
 */

import { EquityFormState, DeferralEvent } from '../types/EquityTypes';
import { getMarginalRate } from './taxBracketUtils';

/**
 * Calculate benefit of deferring compensation
 */
export const calculateDeferralBenefit = (formState: EquityFormState): number => {
  if (!formState.hasDeferredComp) return 0;
  
  // Very simplified calculation assuming current tax rate is higher than future
  // Real calculation would consider progressive tax brackets, other income, etc.
  const currentTaxRate = 0.37; // Assumed highest bracket
  const futureTaxRate = 0.32; // Assumed lower bracket after deferral
  
  const taxSavings = formState.deferralAmount * (currentTaxRate - futureTaxRate);
  return taxSavings;
};

/**
 * Get deferral events for tax impact analysis
 */
export const getDeferralEvents = (formState: EquityFormState): DeferralEvent[] => {
  const events: DeferralEvent[] = [];
  const currentYear = new Date().getFullYear();
  
  if (formState.hasDeferredComp && formState.deferralAmount > 0) {
    // Calculate tax benefit (simplified)
    const currentRate = getMarginalRate(formState.bonusAmount);
    let futureRate = getMarginalRate(formState.bonusAmount * 0.7); // Assume lower income in future
    const taxSavings = formState.deferralAmount * (currentRate - futureRate);
    
    if (formState.planningApproach === "single-year") {
      if (formState.deferralStrategy === "next-year") {
        events.push({
          fromYear: currentYear,
          toYear: currentYear + 1,
          amount: formState.deferralAmount,
          taxSavings
        });
      } else if (formState.deferralStrategy === "multi-year") {
        // Distribute evenly across years
        const yearlyAmount = formState.deferralAmount / formState.deferralYears;
        for (let i = 0; i < formState.deferralYears; i++) {
          events.push({
            fromYear: currentYear,
            toYear: currentYear + i + 1,
            amount: yearlyAmount,
            taxSavings: taxSavings / formState.deferralYears
          });
        }
      }
    } else if (formState.planningApproach === "multi-year") {
      // Year 1 deferral
      if (formState.year1Deferral > 0) {
        events.push({
          fromYear: currentYear,
          toYear: currentYear + 1,
          amount: formState.year1Deferral,
          taxSavings: formState.year1Deferral * (currentRate - futureRate)
        });
      }
      
      // Year 2 deferral
      if (formState.year2Deferral > 0) {
        events.push({
          fromYear: currentYear + 1,
          toYear: currentYear + 2,
          amount: formState.year2Deferral,
          taxSavings: formState.year2Deferral * (currentRate - futureRate)
        });
      }
    }
  }
  
  return events;
};
