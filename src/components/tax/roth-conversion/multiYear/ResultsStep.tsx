
import React from 'react';
import { useMultiYearContext } from './context/MultiYearContext';
import ResultsContent from './components/ResultsContent';

// Update the interface to match the props passed from TabContentManager
interface ResultsStepProps {
  yearlyResults: YearlyResult[];
  scenarioData: MultiYearScenarioData;
  isCalculating: boolean;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ 
  yearlyResults, 
  scenarioData, 
  isCalculating 
}) => {
  const hasCalculated = yearlyResults && yearlyResults.length > 0;
  
  return (
    <ResultsContent
      yearlyResults={yearlyResults}
      scenarioData={scenarioData}
      hasCalculated={hasCalculated}
    />
  );
};

export default ResultsStep;
