
import React, { useEffect } from 'react';
import { useMultiYearContext } from './context/MultiYearContext';
import FilingStatusComparison from './components/FilingStatusComparison';
import ScenarioSummaryTable from './components/ScenarioSummaryTable';

const SummaryStep: React.FC = () => {
  const { 
    scenarioData, 
    yearlyResults, 
    hasCalculated, 
    handleCalculate 
  } = useMultiYearContext();

  // Trigger calculation if needed when this step is loaded
  useEffect(() => {
    if (!hasCalculated && yearlyResults.length === 0) {
      handleCalculate();
    }
  }, [hasCalculated, yearlyResults, handleCalculate]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ScenarioSummaryTable 
            yearlyResults={yearlyResults}
            hasCalculated={hasCalculated}
          />
        </div>
        
        <div className="space-y-6">
          <FilingStatusComparison 
            yearlyResults={yearlyResults} 
            showMfsComparison={!!scenarioData.compareMfjVsMfs && scenarioData.filingStatus === 'married_joint'}
          />
        </div>
      </div>
    </div>
  );
};

export default SummaryStep;
