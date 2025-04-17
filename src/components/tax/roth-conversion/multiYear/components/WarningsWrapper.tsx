
import React from 'react';
import { useMultiYearContext } from '../context/MultiYearContext';
import ScenarioWarnings from './ScenarioWarnings';
import { TrapAlert } from '@/types/tax/rothConversionTypes';

const WarningsWrapper: React.FC = () => {
  const { yearlyResults } = useMultiYearContext();
  
  // Collect all warnings from yearlyResults
  const allWarnings = yearlyResults?.flatMap(result => 
    result.warnings?.map(warning => ({
      ...warning,
      year: result.year,
      details: warning.message || '' // Ensure details property exists
    })) || []
  ) || [];
  
  return (
    <ScenarioWarnings warnings={allWarnings as TrapAlert[]} />
  );
};

export default WarningsWrapper;
