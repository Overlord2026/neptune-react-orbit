
import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { TaxTrapWarning } from '@/utils/taxTrapChecker';

interface TaxTrapWarningsProps {
  warnings: TaxTrapWarning[];
}

const TaxTrapWarnings: React.FC<TaxTrapWarningsProps> = ({ warnings }) => {
  if (!warnings || warnings.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No tax traps detected for this scenario.
      </div>
    );
  }

  const getIconForSeverity = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'low':
      default:
        return <Info className="h-5 w-5 text-slate-400" />;
    }
  };

  const getClassesForSeverity = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          border: 'border-red-800/30',
          bg: 'bg-red-950/20',
        };
      case 'medium':
        return {
          border: 'border-amber-800/30',
          bg: 'bg-amber-950/20',
        };
      case 'low':
      default:
        return {
          border: 'border-slate-700/30',
          bg: 'bg-slate-800/20',
        };
    }
  };

  return (
    <div className="space-y-3">
      {warnings.map((warning, index) => {
        const classes = getClassesForSeverity(warning.severity);
        return (
          <div
            key={`${warning.trapType}-${index}`}
            className={`p-3 rounded-md border ${classes.border} ${classes.bg}`}
          >
            <div className="flex items-start gap-2">
              {getIconForSeverity(warning.severity)}
              <div>
                <h4 className="font-medium text-sm">{warning.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{warning.description}</p>
                {warning.financial_impact > 0 && (
                  <p className="text-xs font-medium mt-1">
                    Potential impact: ${warning.financial_impact.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaxTrapWarnings;
