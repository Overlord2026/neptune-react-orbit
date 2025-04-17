
import React from 'react';
import { useMultiYearContext } from './context/MultiYearContext';
import ResultsContent from './components/ResultsContent';
import { YearlyResult, MultiYearScenarioData } from '@/types/tax/rothConversionTypes';
import { AlertCircle } from 'lucide-react';

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
  
  if (isCalculating) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[#0284c7]/30 mb-4"></div>
          <div className="h-5 w-36 bg-[#334155] rounded mb-3"></div>
          <div className="h-4 w-64 bg-[#334155] rounded"></div>
        </div>
      </div>
    );
  }

  if (!hasCalculated) {
    return (
      <div className="p-8 rounded-lg bg-[#1e293b] border border-[#334155] text-center">
        <AlertCircle className="w-12 h-12 text-[#94a3b8] mx-auto mb-4" />
        <h3 className="text-xl font-medium text-[#f8fafc] mb-2">No Results Yet</h3>
        <p className="text-[#94a3b8] max-w-md mx-auto">
          Complete the previous steps and calculate your scenario to see the results.
        </p>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <ResultsContent
        yearlyResults={yearlyResults}
        scenarioData={scenarioData}
        hasCalculated={hasCalculated}
      />
    </div>
  );
};

export default ResultsStep;
