
import React, { createContext, useContext, useState } from "react";
import { 
  EquityFormState, 
  YearlyTaxImpact, 
  EquityCompEvent, 
  DeferralEvent 
} from "../types/EquityTypes";
import { defaultFormState } from "../utils/defaultValues";
import { calculateAmtImpact, getEquityEvents } from "../utils/equityCalculations";
import { calculateDeferralBenefit, getDeferralEvents } from "../utils/deferralCalculations";
import { calculateMultiYearImpact } from "../utils/multiYearCalculations";
import { checkIrmaaImpact } from "../utils/taxBracketUtils";

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

  // Wrapper methods that use the imported utility functions with the current form state
  const calculateAmtImpactWrapper = () => {
    return calculateAmtImpact(formState);
  };

  const calculateDeferralBenefitWrapper = () => {
    return calculateDeferralBenefit(formState);
  };

  const calculateMultiYearImpactWrapper = () => {
    return calculateMultiYearImpact(formState);
  };

  const getEquityEventsWrapper = () => {
    return getEquityEvents(formState);
  };

  const getDeferralEventsWrapper = () => {
    return getDeferralEvents(formState);
  };
  
  return (
    <EquityFormContext.Provider value={{ 
      formState, 
      updateForm, 
      calculateAmtImpact: calculateAmtImpactWrapper, 
      calculateDeferralBenefit: calculateDeferralBenefitWrapper,
      calculateMultiYearImpact: calculateMultiYearImpactWrapper,
      getEquityEvents: getEquityEventsWrapper,
      getDeferralEvents: getDeferralEventsWrapper,
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
