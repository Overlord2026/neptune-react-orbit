
/**
 * Multi-year tax impact calculations for equity compensation and deferrals
 */

import { EquityFormState, YearlyTaxImpact, EquityCompEvent, DeferralEvent } from '../../types';
import { getTaxBracket, getNextBracket, checkIrmaaImpact } from '../taxBracketUtils';
import { getEquityEvents } from './equityEvents';
import { calculateYearlyTaxMetrics } from './taxCalculations';
import { getDeferralEvents as getDeferralEventsFromDeferralUtils } from '../deferralCalculations';

/**
 * Calculate multi-year tax impact of equity compensation and deferrals
 */
export const calculateMultiYearImpact = (formState: EquityFormState): YearlyTaxImpact[] => {
  const impact: YearlyTaxImpact[] = [];
  const currentYear = new Date().getFullYear();
  const baseIncome = 100000; // Simplified base income assumption
  
  // Get all events
  const equityEvents = getEquityEvents(formState);
  const deferralEvents = getDeferralEventsFromDeferralUtils(formState) as unknown as DeferralEvent[];
  
  // Calculate impact for current year and next year
  for (let yearOffset = 0; yearOffset <= 1; yearOffset++) {
    const year = currentYear + yearOffset;
    
    // Get equity events for this year
    const yearEquityEvents = equityEvents.filter(event => event.year === year);
    
    // Calculate ordinary income from equity
    const equityOrdinaryIncome = yearEquityEvents.reduce((sum, event) => {
      return sum + (event.ordinaryIncome || 0);
    }, 0);
    
    // Calculate AMT income
    const amtIncome = yearEquityEvents.reduce(
      (sum, event) => {
        return sum + (event.type === "ISO" && !event.isDisqualifyingDisposition ? event.spread : 0);
      }, 
      0
    );
    
    // Calculate deferrals out for this year
    const deferralsOut = deferralEvents
      .filter(event => event.fromYear === year)
      .reduce((sum, event) => sum + event.amount, 0);
    
    // Calculate deferrals in for this year
    const deferralsIn = deferralEvents
      .filter(event => event.toYear === year)
      .reduce((sum, event) => sum + event.amount, 0);
    
    // Calculate total income with strategy
    const totalIncomeWithStrategy = baseIncome + equityOrdinaryIncome + deferralsIn - deferralsOut;
    
    // Calculate total income without strategy (no deferrals)
    const totalIncomeWithoutStrategy = baseIncome + equityOrdinaryIncome + (yearOffset === 0 ? formState.deferralAmount : 0);
    
    // Calculate yearly tax metrics
    const yearlyMetrics = calculateYearlyTaxMetrics(
      year,
      totalIncomeWithStrategy,
      baseIncome,
      equityOrdinaryIncome,
      amtIncome,
      !!formState.includeStateTax,
      totalIncomeWithoutStrategy
    );
    
    impact.push(yearlyMetrics);
  }
  
  return impact;
};
