
import { EquityFormState, YearlyTaxImpact, EquityCompEvent, DeferralEvent } from "../../types";

export const getTaxBracketRate = (income: number): string => {
  if (income < 11000) return "10%";
  if (income < 44725) return "12%";
  if (income < 95375) return "22%";
  if (income < 182100) return "24%";
  if (income < 231250) return "32%";
  if (income < 578125) return "35%";
  return "37%";
};

export interface TaxImpactResult {
  totalTaxableIncome: number;
  estimatedTax: number;
  amtIncome: number;
  amtImpact: number;
  deferralBenefit: number;
  spreadPerShare: number;
  exercisedShares: number;
  incomeFromExercise: number;
  deferredIncome: number;
  nextYearIncome: number;
  bracketImpact: boolean;
  bracketBefore: string;
  bracketAfter: string;
  multiYearImpact: YearlyTaxImpact[];
  equityEvents: EquityCompEvent[];
  deferralEvents: DeferralEvent[];
}

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
  let spreadPerShare = 0;
  let exercisedShares = 0;
  let incomeFromExercise = 0;
  let deferredIncome = 0;
  let nextYearIncome = 0;
  
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
  
  // If user has deferred comp
  if (formState.hasDeferredComp) {
    const totalBonus = formState.bonusAmount;
    deferredIncome = formState.deferralAmount;
    
    // Only non-deferred portion is taxed this year
    totalTaxableIncome += (totalBonus - deferredIncome);
    
    // Income added to next year
    if (formState.deferralStrategy === "next-year") {
      nextYearIncome = deferredIncome;
    } else {
      // If staggered, divide by years
      nextYearIncome = deferredIncome / formState.deferralYears;
    }
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
