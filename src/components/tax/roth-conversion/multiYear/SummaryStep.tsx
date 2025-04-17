
import React, { useEffect } from 'react';
import { useMultiYearContext } from './context/MultiYearContext';
import ResultsContent from './components/ResultsContent';

const SummaryStep: React.FC = () => {
  const { 
    scenarioData, 
    yearlyResults, 
    hasCalculated, 
    handleCalculate,
    isCalculating
  } = useMultiYearContext();

  // Trigger calculation if needed when this step is loaded
  useEffect(() => {
    if (!hasCalculated && yearlyResults.length === 0 && !isCalculating) {
      handleCalculate();
    }
  }, [hasCalculated, yearlyResults, handleCalculate, isCalculating]);

  return (
    <div className="space-y-6">
      <ResultsContent 
        yearlyResults={yearlyResults}
        scenarioData={scenarioData}
        hasCalculated={hasCalculated}
      />
    </div>
  );
};

export default SummaryStep;
