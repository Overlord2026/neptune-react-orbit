
import React, { createContext, useContext, useState } from "react";

export type EquityType = "NSO" | "ISO" | "RSU" | "ESPP" | "Other";

export interface EquityFormState {
  // Basic Info
  equityType: EquityType | "";
  hasDeferredComp: boolean;
  employer: string;
  shareCount: number;
  bonusAmount: number;
  
  // Option Details
  strikePrice: number;
  fairMarketValue: number;
  vestedShares: number;
  unvestedShares: number;
  exerciseStrategy: "full" | "partial" | "split";
  partialShares: number;
  splitYears: number;
  
  // Deferral Strategy
  deferralAmount: number;
  deferralStrategy: "next-year" | "multi-year";
  deferralYears: number;
  sabbaticalYear: number;
  retirementYear: number;
  
  // Planning Approach
  planningApproach: "single-year" | "multi-year";
  year1Exercise: number;
  year2Exercise: number;
  year1Deferral: number;
  year2Deferral: number;
  
  // ISO Specific
  holdingPeriod: "less-than-year" | "more-than-year" | "unknown";
  isDisqualifyingDisposition: boolean;
}

const defaultFormState: EquityFormState = {
  equityType: "",
  hasDeferredComp: false,
  employer: "",
  shareCount: 0,
  bonusAmount: 0,
  
  strikePrice: 0,
  fairMarketValue: 0,
  vestedShares: 0,
  unvestedShares: 0,
  exerciseStrategy: "full",
  partialShares: 0,
  splitYears: 2,
  
  deferralAmount: 0,
  deferralStrategy: "next-year",
  deferralYears: 2,
  sabbaticalYear: new Date().getFullYear() + 3,
  retirementYear: new Date().getFullYear() + 10,
  
  planningApproach: "single-year",
  year1Exercise: 0,
  year2Exercise: 0,
  year1Deferral: 0,
  year2Deferral: 0,
  
  // ISO Specific defaults
  holdingPeriod: "unknown",
  isDisqualifyingDisposition: false,
};

export interface YearlyTaxImpact {
  year: number;
  ordinaryIncome: number;
  amtIncome: number;
  amtAdjustment: number;
  totalTax: number;
  taxWithoutStrategy: number;
  taxSavings: number;
  marginalRate: number;
  incomeBracket: string;
  nextBracket: string;
  distanceToNextBracket: number;
  irmaaImpact: boolean;
}

export interface EquityCompEvent {
  year: number;
  type: EquityType;
  sharesExercised: number;
  spread: number;
  amtImpact: number;
  ordinaryIncome: number;
  isDisqualifyingDisposition?: boolean;
}

export interface DeferralEvent {
  fromYear: number;
  toYear: number;
  amount: number;
  taxSavings: number;
}

type EquityFormContextType = {
  formState: EquityFormState;
  updateForm: (updates: Partial<EquityFormState>) => void;
  calculateAmtImpact: () => number;
  calculateDeferralBenefit: () => number;
  calculateMultiYearImpact: () => YearlyTaxImpact[];
  getEquityEvents: () => EquityCompEvent[];
  getDeferralEvents: () => DeferralEvent[];
  checkIrmaaImpact: (income: number) => boolean;
};

const EquityFormContext = createContext<EquityFormContextType | undefined>(undefined);

export const EquityFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formState, setFormState] = useState<EquityFormState>(defaultFormState);

  const updateForm = (updates: Partial<EquityFormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  };

  const calculateAmtImpact = (): number => {
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

  const calculateDeferralBenefit = (): number => {
    if (!formState.hasDeferredComp) return 0;
    
    // Very simplified calculation assuming current tax rate is higher than future
    // Real calculation would consider progressive tax brackets, other income, etc.
    const currentTaxRate = 0.37; // Assumed highest bracket
    const futureTaxRate = 0.32; // Assumed lower bracket after deferral
    
    const taxSavings = formState.deferralAmount * (currentTaxRate - futureTaxRate);
    return taxSavings;
  };

  // Get current tax bracket based on income
  const getTaxBracket = (income: number): string => {
    if (income < 11000) return "10%";
    if (income < 44725) return "12%";
    if (income < 95375) return "22%";
    if (income < 182100) return "24%";
    if (income < 231250) return "32%";
    if (income < 578125) return "35%";
    return "37%";
  };

  // Get marginal tax rate for a given income
  const getMarginalRate = (income: number): number => {
    if (income < 11000) return 0.10;
    if (income < 44725) return 0.12;
    if (income < 95375) return 0.22;
    if (income < 182100) return 0.24;
    if (income < 231250) return 0.32;
    if (income < 578125) return 0.35;
    return 0.37;
  };

  // Get next bracket threshold
  const getNextBracket = (income: number): { rate: string, threshold: number, distance: number } => {
    if (income < 11000) return { rate: "12%", threshold: 11000, distance: 11000 - income };
    if (income < 44725) return { rate: "22%", threshold: 44725, distance: 44725 - income };
    if (income < 95375) return { rate: "24%", threshold: 95375, distance: 95375 - income };
    if (income < 182100) return { rate: "32%", threshold: 182100, distance: 182100 - income };
    if (income < 231250) return { rate: "35%", threshold: 231250, distance: 231250 - income };
    if (income < 578125) return { rate: "37%", threshold: 578125, distance: 578125 - income };
    return { rate: "Top bracket", threshold: 0, distance: 0 }; // Already in top bracket
  };

  // Check if income would trigger IRMAA surcharges (simplified)
  const checkIrmaaImpact = (income: number): boolean => {
    // Simple IRMAA thresholds for single filers (2024)
    const irmaaThreshold = 97000; // Simplified first threshold
    return income > irmaaThreshold;
  };

  // Get equity event details for tax calculations
  const getEquityEvents = (): EquityCompEvent[] => {
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

  // Get deferral events
  const getDeferralEvents = (): DeferralEvent[] => {
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

  // Calculate multi-year tax impact
  const calculateMultiYearImpact = (): YearlyTaxImpact[] => {
    const impact: YearlyTaxImpact[] = [];
    const currentYear = new Date().getFullYear();
    const baseIncome = 100000; // Simplified base income assumption
    
    // Get all events
    const equityEvents = getEquityEvents();
    const deferralEvents = getDeferralEvents();
    
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
      const marginalRate = getMarginalRate(totalIncomeWithStrategy);
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
  
  return (
    <EquityFormContext.Provider value={{ 
      formState, 
      updateForm, 
      calculateAmtImpact, 
      calculateDeferralBenefit,
      calculateMultiYearImpact,
      getEquityEvents,
      getDeferralEvents,
      checkIrmaaImpact
    }}>
      {children}
    </EquityFormContext.Provider>
  );
};

export const useEquityForm = () => {
  const context = useContext(EquityFormContext);
  if (context === undefined) {
    throw new Error("useEquityForm must be used within a EquityFormProvider");
  }
  return context;
};
