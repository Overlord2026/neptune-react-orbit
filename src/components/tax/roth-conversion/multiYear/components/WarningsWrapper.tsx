
import React from 'react';
import { useMultiYearContext } from '../context/MultiYearContext';
import ScenarioWarnings from './ScenarioWarnings';

const WarningsWrapper: React.FC = () => {
  const { yearlyResults } = useMultiYearContext();
  
  // Collect all warnings from yearlyResults
  const allWarnings = yearlyResults?.flatMap(result => 
    result.warnings?.map(warning => ({
      ...warning,
      year: result.year
    })) || []
  ) || [];
  
  return (
    <ScenarioWarnings warnings={allWarnings} />
  );
};

export default WarningsWrapper;
