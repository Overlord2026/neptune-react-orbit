
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
  updateFormState: (updates: Partial<EquityFormState>) => void; // Alias for updateForm
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
    ...defaultFormState,
    equityType: "none", // Use "none" instead of empty string
    hasDeferredComp: false,
  });
  
  const updateForm = useCallback((updates: Partial<EquityFormState>) => {
    setFormState(current => ({ ...current, ...updates }));
  }, []);
  
  // Alias for updateForm to maintain compatibility
  const updateFormState = updateForm;
  
  const resetForm = useCallback(() => {
    setFormState({
      ...defaultFormState,
      equityType: "none", // Use "none" instead of empty string
      hasDeferredComp: false,
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
    updateFormState, // Added alias
    calculateAmtImpact: () => calculateAmtImpact(formState),
    calculateDeferralBenefit: () => calculateDeferralBenefit(formState),
    calculateMultiYearImpact: () => calculateMultiYearImpact(formState),
    getEquityEvents: () => getEquityEvents(formState),
    getDeferralEvents: () => getDeferralEvents(formState),
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
