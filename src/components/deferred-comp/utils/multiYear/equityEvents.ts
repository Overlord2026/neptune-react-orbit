
/**
 * Equity events calculations for multi-year tax analysis
 */
import { EquityFormState, EquityCompEvent } from '../../types';
import { calculateAmtImpact } from '../equityCalculations';

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
  
  // Use nullish coalescing to handle potentially missing properties
  const year1Exercise = formState.year1Exercise || 0;
  const year2Exercise = formState.year2Exercise || 0;
  
  if (formState.planningApproach === "multi-year") {
    // Year 1 exercise
    if (year1Exercise > 0) {
      const spread = spreadPerShare * year1Exercise;
      const ordinaryIncome = formState.equityType === "NSO" || formState.isDisqualifyingDisposition ? spread : 0;
      const amtImpact = formState.equityType === "ISO" && !formState.isDisqualifyingDisposition ? calculateAmtImpact(formState) : 0;
      
      events.push({
        year: currentYear,
        type: formState.equityType,
        sharesExercised: year1Exercise,
        spread,
        amtImpact,
        ordinaryIncome,
        isDisqualifyingDisposition: formState.isDisqualifyingDisposition,
        // Add required properties
        incomeRecognized: ordinaryIncome,
        taxRate: 0.30, // Simplified tax rate
        taxesPaid: ordinaryIncome * 0.30 // Simplified tax calculation
      });
    }
    
    // Year 2 exercise
    if (year2Exercise > 0) {
      const spread = spreadPerShare * year2Exercise;
      const ordinaryIncome = formState.equityType === "NSO" || formState.isDisqualifyingDisposition ? spread : 0;
      const amtImpact = formState.equityType === "ISO" && !formState.isDisqualifyingDisposition ? calculateAmtImpact(formState) : 0;
      
      events.push({
        year: currentYear + 1,
        type: formState.equityType,
        sharesExercised: year2Exercise,
        spread,
        amtImpact,
        ordinaryIncome,
        isDisqualifyingDisposition: formState.isDisqualifyingDisposition,
        // Add required properties
        incomeRecognized: ordinaryIncome,
        taxRate: 0.30, // Simplified tax rate
        taxesPaid: ordinaryIncome * 0.30 // Simplified tax calculation
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
        isDisqualifyingDisposition: formState.isDisqualifyingDisposition,
        // Add required properties
        incomeRecognized: ordinaryIncome,
        taxRate: 0.30, // Simplified tax rate
        taxesPaid: ordinaryIncome * 0.30 // Simplified tax calculation
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
        isDisqualifyingDisposition: formState.isDisqualifyingDisposition,
        // Add required properties
        incomeRecognized: ordinaryIncome,
        taxRate: 0.30, // Simplified tax rate
        taxesPaid: ordinaryIncome * 0.30 // Simplified tax calculation
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
          isDisqualifyingDisposition: formState.isDisqualifyingDisposition,
          // Add required properties
          incomeRecognized: ordinaryIncome,
          taxRate: 0.30, // Simplified tax rate
          taxesPaid: ordinaryIncome * 0.30 // Simplified tax calculation
        });
        
        remainingShares -= sharesPerYear;
      }
    }
  }
  
  return events;
};
