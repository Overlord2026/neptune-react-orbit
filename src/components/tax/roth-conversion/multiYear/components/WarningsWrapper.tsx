
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
      message: warning.message || `Warning for ${result.year}`,
      details: warning.message || '',
      severity: warning.severity || 'medium', // Ensure severity always has a value
      trapType: warning.trapType || 'unknown' // Ensure trapType is always defined
    })) || []
  ) || [];
  
  return (
    <ScenarioWarnings warnings={allWarnings as TrapAlert[]} />
  );
};

export default WarningsWrapper;
