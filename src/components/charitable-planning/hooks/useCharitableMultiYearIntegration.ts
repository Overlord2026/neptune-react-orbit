
import { useState, useCallback } from 'react';
import { CharitableContribution, MultiYearScenarioData } from '@/components/tax/roth-conversion/types/ScenarioTypes';
import { CharitableScenario } from '../types/CharitableTypes';
import { useMultiYearContext } from '@/components/tax/roth-conversion/multiYear/context/MultiYearContext';

export const useCharitableMultiYearIntegration = (charitableScenario: CharitableScenario) => {
  const { scenarioData: rothScenarioData, handleUpdateScenarioData, handleCalculate } = useMultiYearContext();
  const [isIntegrated, setIsIntegrated] = useState(false);
  
  const integrateWithMultiYear = useCallback(() => {
    // Extract data from charitable scenario to create contributions array
    const contributions: CharitableContribution[] = [];
    const startYear = rothScenarioData.startYear;
    
    // Process charitable scenario data
    if (charitableScenario.multiYearPlan.isIntegrated) {
      // If we have specific yearly data in the charitable scenario
      charitableScenario.multiYearPlan.years.forEach(yearData => {
        contributions.push({
          year: yearData.year,
          amount: yearData.contribution,
          useQcd: charitableScenario.qcd.useQcd && charitableScenario.age >= 70.5,
          isBunching: yearData.isItemizing && charitableScenario.dafStrategy.approach === 'bunching'
        });
      });
    } 
    // If no specific data, create basic contributions based on annual giving
    else if (charitableScenario.annualGiving.type === 'fixed') {
      for (let i = 0; i < 5; i++) {
        contributions.push({
          year: startYear + i,
          amount: charitableScenario.annualGiving.amount,
          useQcd: charitableScenario.qcd.useQcd && charitableScenario.age + i >= 70.5
        });
      }
    } else if (charitableScenario.annualGiving.type === 'variable' && charitableScenario.annualGiving.yearlyAmounts) {
      charitableScenario.annualGiving.yearlyAmounts.forEach(yearAmount => {
        contributions.push({
          year: yearAmount.year,
          amount: yearAmount.amount,
          useQcd: charitableScenario.qcd.useQcd && charitableScenario.age + (yearAmount.year - startYear) >= 70.5
        });
      });
    }
    
    // Update the Roth conversion scenario data
    handleUpdateScenarioData({
      useCharitablePlanning: true,
      charitableContributions: contributions,
      dafBunching: charitableScenario.dafStrategy.useDaf && charitableScenario.dafStrategy.approach === 'bunching' ? {
        enabled: true,
        bunchingYears: charitableScenario.dafStrategy.bunchingYears,
        bunchingAmount: charitableScenario.dafStrategy.bunchingAmount || charitableScenario.annualGiving.amount * charitableScenario.dafStrategy.bunchingYears
      } : undefined
    });
    
    // Run the calculation
    handleCalculate();
    setIsIntegrated(true);
  }, [charitableScenario, rothScenarioData, handleUpdateScenarioData, handleCalculate]);
  
  return {
    integrateWithMultiYear,
    isIntegrated
  };
};
