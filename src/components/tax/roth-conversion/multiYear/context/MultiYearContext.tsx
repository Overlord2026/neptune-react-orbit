
import React, { createContext, useContext, useState } from 'react';
import { MultiYearScenarioData, YearlyResult } from '@/types/tax/rothConversionTypes';
import { FilingStatusType } from '@/types/tax/filingTypes';
import { calculateMultiYearScenario } from '@/utils/rothConversion/calculateMultiYearScenario';
import { toast } from 'sonner';

interface MultiYearContextType {
  scenarioData: MultiYearScenarioData;
  updateScenarioData: (data: Partial<MultiYearScenarioData>) => void;
  results: YearlyResult[];
  setResults: (results: YearlyResult[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  calculationError: string | null;
  setCalculationError: (error: string | null) => void;
  yearlyResults?: YearlyResult[];
  scenarioName?: string;
  hasCalculated?: boolean;
  isCalculating?: boolean;
  handleCalculate: () => Promise<void>;
  handleUpdateScenarioData: (data: Partial<MultiYearScenarioData>) => void;
}

const defaultScenarioData: MultiYearScenarioData = {
  startAge: 60,
  startYear: new Date().getFullYear(),
  numYears: 10,
  traditionalIraBalance: 500000,
  rothIraBalance: 100000,
  // Using the proper property names aligned with the interface
  traditionalIRAStartBalance: 500000,
  rothIRAStartBalance: 100000,
  inflationRate: 0.025,
  investmentReturn: 0.06,
  expectedAnnualReturn: 0.06,
  filingStatus: 'married_joint',
  baseAnnualIncome: 120000,
  conversionStrategy: 'fixed',
  fixedConversionAmount: 50000,
  includeSpouse: true,
  spouseAge: 58,
  spouseTraditionalIRAStartBalance: 250000,
  spouseRothIRAStartBalance: 75000,
  rmdStartAge: 73,
  spouseRmdStartAge: 73,
  includeRMDs: true,
  includeIrmaa: true,
  assumedGrowthRate: 0.06
};

const MultiYearContext = createContext<MultiYearContextType | undefined>(undefined);

export const MultiYearProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scenarioData, setScenarioData] = useState<MultiYearScenarioData>(defaultScenarioData);
  const [results, setResults] = useState<YearlyResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [calculationError, setCalculationError] = useState<string | null>(null);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [scenarioName, setScenarioName] = useState<string>("Roth Conversion");

  const updateScenarioData = (data: Partial<MultiYearScenarioData>) => {
    setScenarioData(prev => ({ ...prev, ...data }));
  };

  const handleUpdateScenarioData = updateScenarioData;

  const handleCalculate = async () => {
    setIsCalculating(true);
    setCalculationError(null);
    
    try {
      const calculatedResults = await calculateMultiYearScenario(scenarioData);
      setResults(calculatedResults);
      setHasCalculated(true);
      
      if (calculatedResults.length > 0) {
        toast.success("Calculation completed successfully");
      } else {
        toast.error("No results were generated");
        setCalculationError("Failed to generate results. Please check your inputs and try again.");
      }
    } catch (error) {
      console.error("Error calculating scenario:", error);
      toast.error("Failed to calculate scenario");
      setCalculationError(error instanceof Error ? error.message : "Unknown calculation error");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <MultiYearContext.Provider
      value={{
        scenarioData,
        updateScenarioData,
        results,
        setResults,
        isLoading,
        setIsLoading,
        currentStep,
        setCurrentStep,
        calculationError,
        setCalculationError,
        yearlyResults: results,
        scenarioName,
        hasCalculated,
        isCalculating,
        handleCalculate,
        handleUpdateScenarioData
      }}
    >
      {children}
    </MultiYearContext.Provider>
  );
};

export const useMultiYear = () => {
  const context = useContext(MultiYearContext);
  if (context === undefined) {
    throw new Error('useMultiYear must be used within a MultiYearProvider');
  }
  return context;
};

// Export for components that need the context
export const useMultiYearContext = useMultiYear;
