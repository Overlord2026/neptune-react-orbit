
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';
import { TrapAlert } from '@/types/tax/rothConversionTypes';
import { YearlyResult } from '@/types/tax/rothConversionTypes';

interface ScenarioWarningsProps {
  warnings: TrapAlert[];
}

const ScenarioWarnings: React.FC<ScenarioWarningsProps> = ({ warnings }) => {
  if (!warnings || warnings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {warnings.map((warning, index) => (
        <Alert key={`${warning.trapType}-${index}`} variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{warning.message}</AlertTitle>
          <AlertDescription>
            {warning.details}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default ScenarioWarnings;
