
import React, { createContext, useState } from 'react';

// Mock integration context for calculators
interface SharedData {
  income?: number;
  filingStatus?: 'single' | 'married';
  currentAge?: number;
  retirementAge?: number;
}

interface CalculatorIntegrationContextType {
  sharedData: SharedData;
  updateSharedData: (data: Partial<SharedData>) => void;
  navigateToRothCalculator: () => void;
  navigateToStockOptionCalculator: () => void;
  navigateToEstateCalculator: () => void;
  navigateToCharitableCalculator: () => void;
}

export const CalculatorIntegrationContext = createContext<CalculatorIntegrationContextType>({
  sharedData: {},
  updateSharedData: () => {},
  navigateToRothCalculator: () => {},
  navigateToStockOptionCalculator: () => {},
  navigateToEstateCalculator: () => {},
  navigateToCharitableCalculator: () => {}
});

export const CalculatorIntegrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sharedData, setSharedData] = useState<SharedData>({
    income: 100000,
    filingStatus: 'single',
    currentAge: 45,
    retirementAge: 65
  });

  const updateSharedData = (newData: Partial<SharedData>) => {
    setSharedData(prev => ({ ...prev, ...newData }));
  };

  return (
    <CalculatorIntegrationContext.Provider
      value={{
        sharedData,
        updateSharedData,
        navigateToRothCalculator: () => {},
        navigateToStockOptionCalculator: () => {},
        navigateToEstateCalculator: () => {},
        navigateToCharitableCalculator: () => {}
      }}
    >
      {children}
    </CalculatorIntegrationContext.Provider>
  );
};
