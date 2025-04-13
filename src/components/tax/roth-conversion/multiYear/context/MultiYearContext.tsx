
import React, { createContext, useContext, ReactNode } from 'react';
import { MultiYearScenarioData, YearlyResult } from '../../types/ScenarioTypes';
import { useMultiYearScenario } from '../../hooks/useMultiYearScenario';

interface MultiYearContextType {
  scenarioData: MultiYearScenarioData;
  yearlyResults: YearlyResult[];
  isCalculating: boolean;
  hasCalculated: boolean;
  handleUpdateScenarioData: (newData: Partial<MultiYearScenarioData>) => void;
  handleCalculate: () => void;
  scenarioName: string;
}

const MultiYearContext = createContext<MultiYearContextType | undefined>(undefined);

export const useMultiYearContext = () => {
  const context = useContext(MultiYearContext);
  if (context === undefined) {
    throw new Error('useMultiYearContext must be used within a MultiYearProvider');
  }
  return context;
};

interface MultiYearProviderProps {
  children: ReactNode;
}

export const MultiYearProvider: React.FC<MultiYearProviderProps> = ({ children }) => {
  // Initialize with default scenario data
  const {
    scenarioData,
    yearlyResults,
    isCalculating,
    hasCalculated,
    handleUpdateScenarioData,
    handleCalculate
  } = useMultiYearScenario({
    startAge: 55,
    startYear: new Date().getFullYear(),
    numYears: 30,
    filingStatus: 'married',
    traditionalIRAStartBalance: 500000,
    rothIRAStartBalance: 100000,
    expectedAnnualReturn: 0.06,
    baseAnnualIncome: 80000,
    incomeGrowthRate: 0.02,
    conversionStrategy: 'bracket_12',
    includeRMDs: true,
    rmdStartAge: 73,
    includeBeneficiary: false,
    beneficiaryAge: 50,
    beneficiaryIncomeTaxRate: 0.24,
    taxInflationAdjustment: true,
    
    includeSpouse: true,
    spouseAge: 53,
    spouseTraditionalIRAStartBalance: 300000,
    spouseRothIRAStartBalance: 50000,
    spouseBaseAnnualIncome: 60000,
    spouseRmdStartAge: 73,
    
    combinedIRAApproach: true,
    
    isInCommunityPropertyState: false,
    splitCommunityIncome: false,
    
    compareMfjVsMfs: false,
    
    includeIrmaa: true
  });
  
  const scenarioName = `Multi-Year Roth Conversion (${scenarioData.startYear} - ${scenarioData.startYear + scenarioData.numYears - 1})`;

  const value = {
    scenarioData,
    yearlyResults,
    isCalculating,
    hasCalculated,
    handleUpdateScenarioData,
    handleCalculate,
    scenarioName
  };

  return (
    <MultiYearContext.Provider value={value}>
      {children}
    </MultiYearContext.Provider>
  );
};
