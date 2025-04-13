
import React from 'react';
import { useMultiYearContext } from '../context/MultiYearContext';
import ScenarioWarnings from './ScenarioWarnings';

const WarningsWrapper: React.FC = () => {
  const { yearlyResults, scenarioName, hasCalculated } = useMultiYearContext();
  
  return (
    <ScenarioWarnings
      yearlyResults={yearlyResults}
      scenarioName={scenarioName}
      hasCalculated={hasCalculated}
    />
  );
};

export default WarningsWrapper;
