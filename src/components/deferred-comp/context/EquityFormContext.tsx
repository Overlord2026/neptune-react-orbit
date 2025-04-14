
import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  EquityFormState, 
  YearlyTaxImpact,
  EquityCompEvent,
  DeferralEvent 
} from '../types';
import { defaultFormState } from '../utils/defaultValues';
import { calculateAmtImpact } from '../utils/equityCalculations';
import { 
  calculateDeferralBenefit,
  checkIrmaaImpact 
} from '../utils/deferralCalculations';
import { 
  calculateMultiYearImpact,
  getEquityEvents,
  getDeferralEvents
} from '../utils/multiYearCalculations';
import { 
  getTaxBracketRate,
  getDistanceToNextBracket
} from '../utils/taxBracketUtils';

interface EquityFormContextType {
  formState: EquityFormState;
  updateForm: (updates: Partial<EquityFormState>) => void;
  calculateAmtImpact: () => number;
  calculateDeferralBenefit: () => number;
  calculateMultiYearImpact: () => YearlyTaxImpact[];
  getEquityEvents: () => EquityCompEvent[];
  getDeferralEvents: () => DeferralEvent[];
  getTaxBracketRate: (income: number) => string;
  getDistanceToNextBracket: (income: number) => { nextThreshold: number; distance: number };
  checkIrmaaImpact: (income: number) => boolean;
  resetForm: () => void;
}

const EquityFormContext = createContext<EquityFormContextType | undefined>(undefined);

export const EquityFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formState, setFormState] = useState<EquityFormState>({
    ...defaultFormState as Partial<EquityFormState>,
    // Ensure all required properties are present for EquityTypesFormState
    employer: '',
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
    planningApproach: "single-year",
    year1Exercise: 0,
    year2Exercise: 0,
    year1Deferral: 0,
    year2Deferral: 0,
    holdingPeriod: "unknown",
    isDisqualifyingDisposition: false,
    equityType: "",
    hasDeferredComp: false,
    sabbaticalYear: 0,
    retirementYear: 0,
    includeStateTax: false,
    residentState: "",
    includeIrmaa: false
  });
  
  const updateForm = useCallback((updates: Partial<EquityFormState>) => {
    setFormState(current => ({ ...current, ...updates }));
  }, []);
  
  const resetForm = useCallback(() => {
    setFormState({
      ...defaultFormState as Partial<EquityFormState>,
      employer: '',
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
      planningApproach: "single-year",
      year1Exercise: 0,
      year2Exercise: 0,
      year1Deferral: 0,
      year2Deferral: 0,
      holdingPeriod: "unknown",
      isDisqualifyingDisposition: false,
      equityType: "",
      hasDeferredComp: false,
      sabbaticalYear: 0,
      retirementYear: 0,
      includeStateTax: false,
      residentState: "",
      includeIrmaa: false
    });
  }, []);
  
  // Adapting the tax bracket rate function to return a string
  const getTaxBracketRateString = (income: number): string => {
    const rate = getTaxBracketRate(income);
    return rate.toString() + '%';
  };
  
  const value: EquityFormContextType = {
    formState,
    updateForm,
    calculateAmtImpact: () => calculateAmtImpact(formState),
    calculateDeferralBenefit: () => calculateDeferralBenefit(formState),
    calculateMultiYearImpact: () => calculateMultiYearImpact(formState),
    getEquityEvents: () => getEquityEvents(formState),
    getDeferralEvents: () => getDeferralEvents(formState) as DeferralEvent[],
    getTaxBracketRate: getTaxBracketRateString,
    getDistanceToNextBracket,
    checkIrmaaImpact,
    resetForm
  };
  
  return (
    <EquityFormContext.Provider value={value}>
      {children}
    </EquityFormContext.Provider>
  );
};

export const useEquityForm = (): EquityFormContextType => {
  const context = useContext(EquityFormContext);
  if (!context) {
    throw new Error('useEquityForm must be used within an EquityFormProvider');
  }
  return context;
};
