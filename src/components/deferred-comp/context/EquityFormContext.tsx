
import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  EquityFormState, 
  YearlyTaxImpact,
  EquityCompEvent,
  DeferralEvent 
} from '../types/EquityTypes';
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
  getTaxBracketRate: (income: number) => number;
  getDistanceToNextBracket: (income: number) => { nextThreshold: number; distance: number };
  checkIrmaaImpact: (income: number) => boolean;
  resetForm: () => void;
}

const EquityFormContext = createContext<EquityFormContextType | undefined>(undefined);

export const EquityFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formState, setFormState] = useState<EquityFormState>(defaultFormState);
  
  const updateForm = useCallback((updates: Partial<EquityFormState>) => {
    setFormState(current => ({ ...current, ...updates }));
  }, []);
  
  const resetForm = useCallback(() => {
    setFormState(defaultFormState);
  }, []);
  
  const value = {
    formState,
    updateForm,
    calculateAmtImpact: () => calculateAmtImpact(formState),
    calculateDeferralBenefit: () => calculateDeferralBenefit(formState),
    calculateMultiYearImpact: () => calculateMultiYearImpact(formState),
    getEquityEvents: () => getEquityEvents(formState),
    getDeferralEvents: () => getDeferralEvents(formState),
    getTaxBracketRate,
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
