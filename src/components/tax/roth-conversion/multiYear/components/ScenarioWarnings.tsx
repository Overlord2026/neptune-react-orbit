
import React from 'react';
import TaxTrapWarningsPanel from '@/components/tax/TaxTrapWarningsPanel';
import TaxConsiderationWarning from '../common/TaxConsiderationWarning';
import { YearlyResult, TrapAlert } from '../../types/ScenarioTypes';

interface ScenarioWarningsProps {
  yearlyResults: YearlyResult[];
  scenarioName: string;
  hasCalculated: boolean;
}

const ScenarioWarnings: React.FC<ScenarioWarningsProps> = ({ 
  yearlyResults, 
  scenarioName, 
  hasCalculated 
}) => {
  if (!hasCalculated || yearlyResults.length === 0) {
    return null;
  }

  const latestWarnings: TrapAlert[] = yearlyResults.length > 0 
    ? yearlyResults[yearlyResults.length - 1].warnings.map(warning => ({
        title: warning.message || warning.type || '',
        message: warning.message || '',
        type: warning.type || warning.trapType || '',
        trapType: warning.trapType || warning.type || '',
        severity: (warning.severity === 'high' ? 'critical' : 
                 warning.severity === 'medium' ? 'warning' : 'info') as "critical" | "warning" | "info",
        details: warning.message,
        description: warning.message
      }))
    : [];

  return (
    <>
      <TaxConsiderationWarning />
      <TaxTrapWarningsPanel
        alerts={latestWarnings}
        scenarioName={scenarioName}
        className="mt-2"
      />
    </>
  );
};

export default ScenarioWarnings;
