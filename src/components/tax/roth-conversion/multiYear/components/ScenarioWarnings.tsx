
import React from 'react';
import TaxTrapWarningsPanel from '@/components/tax/TaxTrapWarningsPanel';
import TaxConsiderationWarning from '../common/TaxConsiderationWarning';
import { YearlyResult, TrapAlert } from '@/types/tax/rothConversionTypes';

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

  // Convert the severity values to match what TaxTrapWarningsPanel expects
  const convertSeverity = (severity: 'low' | 'medium' | 'high'): "critical" | "warning" | "info" => {
    switch (severity) {
      case 'high': return 'critical';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'info';
    }
  };

  const latestWarnings = yearlyResults.length > 0 
    ? yearlyResults[yearlyResults.length - 1].warnings.map(warning => ({
        title: warning.message || warning.type || '',
        message: warning.message || '',
        type: warning.type || warning.trapType || '',
        trapType: warning.trapType || warning.type || '',
        severity: convertSeverity(warning.severity),
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
