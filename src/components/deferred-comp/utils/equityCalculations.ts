
/**
 * Calculation utilities for equity compensation
 */

import { EquityFormState, EquityCompEvent } from '../types/EquityTypes';

/**
 * Calculate AMT impact for ISO exercises
 */
export const calculateAmtImpact = (formState: EquityFormState): number => {
  // Simple AMT calculation for demonstration - this would be much more complex in reality
  if (formState.equityType !== "ISO") return 0;
  
  // If it's a disqualifying disposition, there's no AMT impact, but regular income
  if (formState.isDisqualifyingDisposition) return 0;
  
  const spreadPerShare = formState.fairMarketValue - formState.strikePrice;
  let sharesToExercise = 0;
  
  if (formState.exerciseStrategy === "full") {
    sharesToExercise = formState.vestedShares;
  } else if (formState.exerciseStrategy === "partial") {
    sharesToExercise = formState.partialShares;
  } else if (formState.exerciseStrategy === "split") {
    // In split strategy, we divide vested shares roughly evenly across years
    sharesToExercise = Math.floor(formState.vestedShares / formState.splitYears);
  }
  
  // Calculate AMT income from exercise
  const amtIncome = spreadPerShare * sharesToExercise;
  
  // Simplified AMT calculation (assuming 26% AMT rate for demonstration)
  // Real calculation would be much more complex with exemptions, phase-outs, etc.
  const estimatedAmt = amtIncome * 0.26;
  
  return estimatedAmt;
};

/**
 * Get equity event details for tax calculations
 */
export const getEquityEvents = (formState: EquityFormState): EquityCompEvent[] => {
  const events: EquityCompEvent[] = [];
  const currentYear = new Date().getFullYear();
  
  if (formState.equityType === "NSO" || formState.equityType === "ISO") {
    const spreadPerShare = formState.fairMarketValue - formState.strikePrice;
    let year1Shares = 0;
    let year2Shares = 0;
    
    // Determine shares exercised in each year
    if (formState.planningApproach === "single-year") {
      if (formState.exerciseStrategy === "full") {
        year1Shares = formState.vestedShares;
      } else if (formState.exerciseStrategy === "partial") {
        year1Shares = formState.partialShares;
      } else if (formState.exerciseStrategy === "split") {
        year1Shares = Math.floor(formState.vestedShares / formState.splitYears);
        year2Shares = Math.floor(formState.vestedShares / formState.splitYears);
      }
    } else if (formState.planningApproach === "multi-year") {
      year1Shares = formState.year1Exercise;
      year2Shares = formState.year2Exercise;
    }
    
    // For NSO or disqualifying ISO disposition, calculate ordinary income
    const isOrdinaryIncome = formState.equityType === "NSO" || formState.isDisqualifyingDisposition;
    
    // Current year event
    if (year1Shares > 0) {
      events.push({
        year: currentYear,
        type: formState.equityType,
        sharesExercised: year1Shares,
        spread: spreadPerShare * year1Shares,
        amtImpact: !isOrdinaryIncome ? spreadPerShare * year1Shares * 0.26 : 0,
        ordinaryIncome: isOrdinaryIncome ? spreadPerShare * year1Shares : 0,
        isDisqualifyingDisposition: formState.isDisqualifyingDisposition
      });
    }
    
    // Next year event
    if (year2Shares > 0) {
      events.push({
        year: currentYear + 1,
        type: formState.equityType,
        sharesExercised: year2Shares,
        spread: spreadPerShare * year2Shares,
        amtImpact: !isOrdinaryIncome ? spreadPerShare * year2Shares * 0.26 : 0,
        ordinaryIncome: isOrdinaryIncome ? spreadPerShare * year2Shares : 0,
        isDisqualifyingDisposition: formState.isDisqualifyingDisposition
      });
    }
  }
  
  return events;
};
