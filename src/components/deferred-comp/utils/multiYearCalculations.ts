
/**
 * Multi-year tax impact calculations for equity compensation and deferrals
 */

import { EquityFormState, YearlyTaxImpact, EquityCompEvent, DeferralEvent } from '../types/EquityTypes';
import { calculateAmtImpact } from './equityCalculations';
import { getDeferralEvents as getDeferralEventsFromDeferralUtils } from './deferralCalculations';
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
  const deferralEvents = getDeferralEventsFromDeferralUtils(formState);
  
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
    const marginalRate = parseFloat(incomeBracket.replace('%', '')) / 100;
    const totalTax = totalIncomeWithStrategy * 0.20; // Simplistic effective tax rate
    const taxWithoutStrategy = totalIncomeWithoutStrategy * 0.20; // Same simplistic rate
    const taxSavings = taxWithoutStrategy - totalTax;
    const effectiveRate = totalTax / totalIncomeWithStrategy;
    
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
      irmaaImpact,
      // Add missing required fields
      capitalGains: 0, // No capital gains in this context
      effectiveRate,
      taxableIncome: totalIncomeWithStrategy * 0.9, // Simplified taxable income calculation
      equityIncome: equityOrdinaryIncome,
      amtImpact: amtAdjustment,
      stateTax: formState.includeStateTax ? totalIncomeWithStrategy * 0.05 : 0, // Simplified state tax
      federalTax: totalTax - (formState.includeStateTax ? totalIncomeWithStrategy * 0.05 : 0) // Federal tax is total minus state
    });
  }
  
  return impact;
};

/**
 * Get all equity compensation events based on form state
 */
export const getEquityEvents = (formState: EquityFormState): EquityCompEvent[] => {
  if (!formState.equityType || (formState.equityType !== "NSO" && formState.equityType !== "ISO")) {
    return [];
  }
  
  const events: EquityCompEvent[] = [];
  const currentYear = new Date().getFullYear();
  const spreadPerShare = formState.fairMarketValue - formState.strikePrice;
  
  if (formState.planningApproach === "multi-year") {
    // Year 1 exercise
    if (formState.year1Exercise > 0) {
      const spread = spreadPerShare * formState.year1Exercise;
      const ordinaryIncome = formState.equityType === "NSO" || formState.isDisqualifyingDisposition ? spread : 0;
      const amtImpact = formState.equityType === "ISO" && !formState.isDisqualifyingDisposition ? calculateAmtImpact(formState) : 0;
      
      events.push({
        year: currentYear,
        type: formState.equityType,
        sharesExercised: formState.year1Exercise,
        spread,
        amtImpact,
        ordinaryIncome,
        isDisqualifyingDisposition: formState.isDisqualifyingDisposition
      });
    }
    
    // Year 2 exercise
    if (formState.year2Exercise > 0) {
      const spread = spreadPerShare * formState.year2Exercise;
      const ordinaryIncome = formState.equityType === "NSO" || formState.isDisqualifyingDisposition ? spread : 0;
      const amtImpact = formState.equityType === "ISO" && !formState.isDisqualifyingDisposition ? calculateAmtImpact(formState) : 0;
      
      events.push({
        year: currentYear + 1,
        type: formState.equityType,
        sharesExercised: formState.year2Exercise,
        spread,
        amtImpact,
        ordinaryIncome,
        isDisqualifyingDisposition: formState.isDisqualifyingDisposition
      });
    }
  } 
  else {
    // Single-year approach
    if (formState.exerciseStrategy === "full") {
      // Full exercise
      const spread = spreadPerShare * formState.vestedShares;
      const ordinaryIncome = formState.equityType === "NSO" || formState.isDisqualifyingDisposition ? spread : 0;
      const amtImpact = formState.equityType === "ISO" && !formState.isDisqualifyingDisposition ? calculateAmtImpact(formState) : 0;
      
      events.push({
        year: currentYear,
        type: formState.equityType,
        sharesExercised: formState.vestedShares,
        spread,
        amtImpact,
        ordinaryIncome,
        isDisqualifyingDisposition: formState.isDisqualifyingDisposition
      });
    } 
    else if (formState.exerciseStrategy === "partial") {
      // Partial exercise
      const spread = spreadPerShare * formState.partialShares;
      const ordinaryIncome = formState.equityType === "NSO" || formState.isDisqualifyingDisposition ? spread : 0;
      const amtImpact = formState.equityType === "ISO" && !formState.isDisqualifyingDisposition ? calculateAmtImpact(formState) : 0;
      
      events.push({
        year: currentYear,
        type: formState.equityType,
        sharesExercised: formState.partialShares,
        spread,
        amtImpact,
        ordinaryIncome,
        isDisqualifyingDisposition: formState.isDisqualifyingDisposition
      });
    }
    else if (formState.exerciseStrategy === "split") {
      // Split over multiple years
      const sharesPerYear = Math.floor(formState.vestedShares / formState.splitYears);
      let remainingShares = formState.vestedShares;
      
      for (let i = 0; i < formState.splitYears; i++) {
        const sharesToExercise = i === formState.splitYears - 1 
          ? remainingShares 
          : sharesPerYear;
          
        const spread = spreadPerShare * sharesToExercise;
        const ordinaryIncome = formState.equityType === "NSO" || formState.isDisqualifyingDisposition ? spread : 0;
        const amtImpact = formState.equityType === "ISO" && !formState.isDisqualifyingDisposition 
          ? (calculateAmtImpact(formState) / formState.splitYears) 
          : 0;
        
        events.push({
          year: currentYear + i,
          type: formState.equityType,
          sharesExercised: sharesToExercise,
          spread,
          amtImpact,
          ordinaryIncome,
          isDisqualifyingDisposition: formState.isDisqualifyingDisposition
        });
        
        remainingShares -= sharesPerYear;
      }
    }
  }
  
  return events;
};

/**
 * Re-export getDeferralEvents for use elsewhere
 */
export { getDeferralEvents } from './deferralCalculations';
