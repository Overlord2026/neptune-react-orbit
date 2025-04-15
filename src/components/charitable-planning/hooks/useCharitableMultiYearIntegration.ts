
import { useState, useCallback } from 'react';
import { MultiYearScenarioData, CharitableContribution } from '@/types/tax/rothConversionTypes';

export function useCharitableMultiYearIntegration() {
  const [useCharitablePlanning, setUseCharitablePlanning] = useState(false);
  const [charitableAmount, setCharitableAmount] = useState<number>(0);
  const [bunchingEnabled, setBunchingEnabled] = useState(false);
  const [useQcd, setUseQcd] = useState(false);
  
  const integrateCharitableWithScenario = useCallback((scenarioData: MultiYearScenarioData): CharitableContribution => {
    if (!useCharitablePlanning || charitableAmount <= 0) {
      return {
        amount: 0,
        isQcd: false,
        isBunching: false
      };
    }

    // Create a standard contribution
    if (!bunchingEnabled) {
      return {
        amount: charitableAmount,
        isQcd: useQcd,
        isBunching: false
      };
    }

    // Create a bunched contribution for even years
    const currentYear = new Date().getFullYear();
    const startYear = scenarioData.startYear || currentYear;
    const evenYears = Array.from(
      { length: 10 }, 
      (_, i) => startYear + i
    ).filter(year => year % 2 === 0);

    return {
      amount: charitableAmount * 2,
      isQcd: useQcd,
      isBunching: true,
      years: evenYears
    };
  }, [useCharitablePlanning, charitableAmount, bunchingEnabled, useQcd]);

  const updateScenarioWithCharitable = useCallback((scenarioData: MultiYearScenarioData): Partial<MultiYearScenarioData> => {
    return {
      ...scenarioData,
      useCharitablePlanning
    };
  }, [useCharitablePlanning]);

  return {
    useCharitablePlanning,
    setUseCharitablePlanning,
    charitableAmount,
    setCharitableAmount,
    bunchingEnabled,
    setBunchingEnabled,
    useQcd,
    setUseQcd,
    integrateCharitableWithScenario,
    updateScenarioWithCharitable
  };
}
