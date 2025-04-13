
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
};

type EquityFormContextType = {
  formState: EquityFormState;
  updateForm: (updates: Partial<EquityFormState>) => void;
  calculateAmtImpact: () => number;
  calculateDeferralBenefit: () => number;
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
  
  return (
    <EquityFormContext.Provider value={{ formState, updateForm, calculateAmtImpact, calculateDeferralBenefit }}>
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
