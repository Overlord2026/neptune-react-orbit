
import React from 'react';
import { useMultiYearContext } from '../context/MultiYearContext';
import ScenarioWarnings from './ScenarioWarnings';
import { TrapAlert } from '@/types/tax/rothConversionTypes';

const WarningsWrapper: React.FC = () => {
  const { yearlyResults } = useMultiYearContext();
  
  // Collect all warnings from yearlyResults and ensure they have all required properties
  const allWarnings = yearlyResults?.flatMap(result => 
    result.warnings?.map(warning => ({
      ...warning,
      year: result.year,
      message: warning.message || `Warning for ${result.year}`,
      details: warning.details || warning.message || 'No additional details available', // Ensure details is always present
      severity: warning.severity || 'medium', // Ensure severity always has a value
      trapType: warning.trapType || 'unknown' // Ensure trapType is always defined
    })) || []
  ) || [];
  
  return (
    <div className="warnings-container mt-6 rounded-lg overflow-hidden shadow-lg">
      <ScenarioWarnings warnings={allWarnings as TrapAlert[]} />
    </div>
  );
};

export default WarningsWrapper;
