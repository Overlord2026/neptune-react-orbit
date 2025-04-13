
import { useState, useEffect } from 'react';
import { calculateMultiYearScenario } from '@/utils/rothConversion';
import { MultiYearScenarioData, YearlyResult } from '../types/ScenarioTypes';

export function useMultiYearScenario(initialScenarioData: MultiYearScenarioData) {
  const [scenarioData, setScenarioData] = useState<MultiYearScenarioData>(initialScenarioData);
  const [yearlyResults, setYearlyResults] = useState<YearlyResult[]>([]);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  
  useEffect(() => {
    if (hasCalculated) {
      runCalculation();
    }
  }, [scenarioData, hasCalculated]);
  
  const runCalculation = async () => {
    setIsCalculating(true);
    
    try {
      const results = await calculateMultiYearScenario(scenarioData);
      setYearlyResults(results);
    } catch (error) {
      console.error("Error calculating multi-year scenario:", error);
    } finally {
      setIsCalculating(false);
    }
  };
  
  const handleUpdateScenarioData = (newData: Partial<MultiYearScenarioData>) => {
    setScenarioData(prev => ({
      ...prev,
      ...newData
    }));
  };
  
  const handleCalculate = () => {
    setHasCalculated(true);
    runCalculation();
  };

  return {
    scenarioData,
    yearlyResults,
    isCalculating,
    hasCalculated,
    handleUpdateScenarioData,
    handleCalculate
  };
}
