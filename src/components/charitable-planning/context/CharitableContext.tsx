
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { CharitableScenario } from '../types/CharitableTypes';
import { WizardStep } from '../config/wizardConfig';

interface CharitableContextType {
  currentStep: WizardStep;
  setCurrentStep: (step: WizardStep) => void;
  scenario: CharitableScenario;
  updateScenario: (data: Partial<CharitableScenario>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const initialScenario: CharitableScenario = {
  annualGiving: {
    type: 'fixed',
    amount: 5000,
  },
  isItemizing: false,
  age: 65,
  advancedStrategies: false,
  dafStrategy: {
    useDaf: false,
    bunchingYears: 1,
    approach: 'annual',
  },
  qcd: {
    amount: 0,
    useQcd: false,
  },
  crt: {
    useCrt: false,
    type: "CRAT",
    fundingAmount: 100000,
    payoutRate: 5,
    trustTerm: "lifetime",
    beneficiaryAge: 65,
    spouseBeneficiary: false
  },
  multiYearPlan: {
    isIntegrated: false,
    years: [],
  },
  results: {
    taxableIncomeReduction: 0,
    bracketSavings: 0,
    irmaaSavings: 0,
  }
};

const CharitableContext = createContext<CharitableContextType | undefined>(undefined);

export const CharitableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('basic-giving');
  const [scenario, setScenario] = useState<CharitableScenario>(initialScenario);

  // Update scenario data with new values
  const updateScenario = (data: Partial<CharitableScenario>) => {
    setScenario(prev => ({ ...prev, ...data }));
  };

  // Navigate to next step based on current config
  const nextStep = () => {
    const steps = ['basic-giving', 'daf-bunching', 'crt', 'qcd', 'multi-year', 'results'] as const;
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex < steps.length - 1) {
      // Skip steps based on scenario configuration
      let nextIndex = currentIndex + 1;
      const nextStepId = steps[nextIndex];
      
      // Skip QCD step if user is under 70.5
      if (nextStepId === 'qcd' && scenario.age < 70.5) {
        nextIndex += 1;
      }
      
      // Skip CRT step if user is not interested in advanced strategies
      if (nextStepId === 'crt' && scenario.advancedStrategies === false) {
        nextIndex += 1;
      }
      
      // Skip QCD again if we landed on it after skipping CRT
      if (steps[nextIndex] === 'qcd' && scenario.age < 70.5) {
        nextIndex += 1;
      }
      
      setCurrentStep(steps[nextIndex]);
    }
  };

  // Navigate to previous step based on current config
  const prevStep = () => {
    const steps = ['basic-giving', 'daf-bunching', 'crt', 'qcd', 'multi-year', 'results'] as const;
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex > 0) {
      // Skip steps based on scenario configuration when going backwards
      let prevIndex = currentIndex - 1;
      const prevStepId = steps[prevIndex];
      
      // Skip QCD step if user is under 70.5
      if (prevStepId === 'qcd' && scenario.age < 70.5) {
        prevIndex -= 1;
      }
      
      // Skip CRT step if user is not interested in advanced strategies
      if (prevStepId === 'crt' && scenario.advancedStrategies === false) {
        prevIndex -= 1;
      }
      
      // Skip QCD again if we landed on it after skipping CRT
      if (steps[prevIndex] === 'qcd' && scenario.age < 70.5) {
        prevIndex -= 1;
      }
      
      setCurrentStep(steps[prevIndex]);
    }
  };

  return (
    <CharitableContext.Provider 
      value={{ 
        currentStep, 
        setCurrentStep, 
        scenario, 
        updateScenario, 
        nextStep, 
        prevStep 
      }}
    >
      {children}
    </CharitableContext.Provider>
  );
};

export const useCharitable = () => {
  const context = useContext(CharitableContext);
  if (context === undefined) {
    throw new Error('useCharitable must be used within a CharitableProvider');
  }
  return context;
};
