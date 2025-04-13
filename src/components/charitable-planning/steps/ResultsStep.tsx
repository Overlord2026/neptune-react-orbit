
import React, { useEffect } from 'react';
import { CharitableScenario } from '../types/CharitableTypes';
import ResultHeader from '../components/ResultHeader';
import ResultMetricsDashboard from '../components/ResultMetricsDashboard';
import StrategyList from '../components/StrategyList';
import YearlyPlanTable from '../components/YearlyPlanTable';
import ResultDisclaimer from '../components/ResultDisclaimer';
import ResultActions from '../components/ResultActions';

interface ResultsStepProps {
  scenario: CharitableScenario;
  onBack: () => void;
  recalculate: () => void;
}

export const ResultsStep: React.FC<ResultsStepProps> = ({ 
  scenario, 
  onBack, 
  recalculate 
}) => {
  useEffect(() => {
    // Recalculate results when component mounts
    recalculate();
  }, [recalculate]);

  // Determine what strategies are being used
  const isUsingQcd = scenario.qcd.useQcd;

  return (
    <div className="space-y-6">
      <div className="bg-[#242A38] p-6 rounded-md">
        <ResultHeader title="Charitable Planning Results" />
        
        <ResultMetricsDashboard
          taxableIncomeReduction={scenario.results.taxableIncomeReduction}
          bracketSavings={scenario.results.bracketSavings}
          irmaaSavings={scenario.results.irmaaSavings}
          showIrmaa={isUsingQcd}
        />
        
        <div className="space-y-4">
          <h4 className="font-medium text-white">Your Charitable Giving Strategy:</h4>
          
          <StrategyList scenario={scenario} />
          
          <YearlyPlanTable scenario={scenario} />
          
          <ResultDisclaimer />
        </div>
        
        <ResultActions 
          onBack={onBack}
          onRecalculate={recalculate}
        />
      </div>
    </div>
  );
};

export default ResultsStep;
