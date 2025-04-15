
import { useState, useCallback } from 'react';
import { MultiYearScenarioData, CharitableContribution } from '@/types/tax/rothConversionTypes';

export function useCharitableMultiYearIntegration() {
  const [useCharitablePlanning, setUseCharitablePlanning] = useState(false);
  const [charitableAmount, setCharitableAmount] = useState<number>(0);
  const [bunchingEnabled, setBunchingEnabled] = useState(false);
  const [useQcd, setUseQcd] = useState(false);
  
  const integrateCharitableWithScenario = useCallback((scenarioData: MultiYearScenarioData): CharitableContribution => {
    const currentYear = new Date().getFullYear();
    
    if (!useCharitablePlanning || charitableAmount <= 0) {
      return {
        year: currentYear,
        amount: 0,
        type: 'standard',
        isQcd: false,
        isBunching: false,
        taxDeduction: 0
      };
    }

    // Create a standard contribution
    if (!bunchingEnabled) {
      return {
        year: currentYear,
        amount: charitableAmount,
        type: 'standard',
        isQcd: useQcd,
        isBunching: false,
        taxDeduction: charitableAmount
      };
    }

    // Create a bunched contribution for even years
    const startYear = scenarioData.startYear || currentYear;
    
    return {
      year: startYear,
      amount: charitableAmount * 2,
      type: 'bunched',
      isQcd: useQcd,
      isBunching: true,
      taxDeduction: charitableAmount * 2,
      description: `Bunched contribution for ${startYear}`
    };
  }, [useCharitablePlanning, charitableAmount, bunchingEnabled, useQcd]);

  const updateScenarioWithCharitable = useCallback((scenarioData: MultiYearScenarioData): Partial<MultiYearScenarioData> => {
    return {
      ...scenarioData,
      useCharitablePlanning: useCharitablePlanning,
      charitableAmount: charitableAmount
    };
  }, [useCharitablePlanning, charitableAmount]);

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
