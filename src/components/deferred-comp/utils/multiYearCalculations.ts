
/**
 * Multi-year tax impact calculations for equity compensation and deferrals
 */

import { EquityFormState, YearlyTaxImpact } from '../types/EquityTypes';
import { getEquityEvents } from './equityCalculations';
import { getDeferralEvents } from './deferralCalculations';
import { getTaxBracket, getNextBracket, checkIrmaaImpact } from './taxBracketUtils';

/**
 * Calculate multi-year tax impact of equity compensation and deferrals
 */
export const calculateMultiYearImpact = (formState: EquityFormState): YearlyTaxImpact[] => {
  const impact: YearlyTaxImpact[] = [];
  const currentYear = new Date().getFullYear();
  const baseIncome = 100000; // Simplified base income assumption
  
  // Get all events
  const equityEvents = getEquityEvents(formState);
  const deferralEvents = getDeferralEvents(formState);
  
  // Calculate impact for current year and next year
  for (let yearOffset = 0; yearOffset <= 1; yearOffset++) {
    const year = currentYear + yearOffset;
    
    // Get equity events for this year
    const yearEquityEvents = equityEvents.filter(event => event.year === year);
    
    // Calculate ordinary income from equity
    const equityOrdinaryIncome = yearEquityEvents.reduce((sum, event) => sum + event.ordinaryIncome, 0);
    
    // Calculate AMT income
    const amtIncome = yearEquityEvents.reduce((sum, event) => sum + (event.type === "ISO" && !event.isDisqualifyingDisposition ? event.spread : 0), 0);
    
    // Calculate AMT adjustment (simplified)
    const amtAdjustment = amtIncome > 0 ? amtIncome * 0.26 : 0;
    
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
    
    // Get tax brackets
    const incomeBracket = getTaxBracket(totalIncomeWithStrategy);
    const nextBracketInfo = getNextBracket(totalIncomeWithStrategy);
    
    // Simplified tax calculation
    const marginalRate = getTaxBracketRate(incomeBracket);
    const totalTax = totalIncomeWithStrategy * 0.20; // Simplistic effective tax rate
    const taxWithoutStrategy = totalIncomeWithoutStrategy * 0.20; // Same simplistic rate
    const taxSavings = taxWithoutStrategy - totalTax;
    
    // Check IRMAA impact
    const irmaaImpact = checkIrmaaImpact(totalIncomeWithStrategy);
    
    impact.push({
      year,
      ordinaryIncome: totalIncomeWithStrategy,
      amtIncome,
      amtAdjustment,
      totalTax,
      taxWithoutStrategy,
      taxSavings,
      marginalRate,
      incomeBracket,
      nextBracket: nextBracketInfo.rate,
      distanceToNextBracket: nextBracketInfo.distance,
      irmaaImpact
    });
  }
  
  return impact;
};

// Helper to convert bracket string to number rate
function getTaxBracketRate(bracket: string): number {
  return parseFloat(bracket.replace('%', '')) / 100;
}
