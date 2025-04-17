
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { TrapAlert } from '@/types/tax/rothConversionTypes';

interface ScenarioWarningsProps {
  warnings: TrapAlert[];
}

const ScenarioWarnings: React.FC<ScenarioWarningsProps> = ({ warnings }) => {
  if (!warnings || warnings.length === 0) {
    return null;
  }

  // Function to get appropriate icon and styles based on severity
  const getSeverityDetails = (severity: string = 'medium') => {
    switch (severity) {
      case 'high':
      case 'critical':
        return {
          icon: AlertCircle,
          bgClass: 'bg-red-950/30 dark:bg-red-900/30',
          borderClass: 'border-red-700',
          textClass: 'text-red-50',
          iconClass: 'text-red-400'
        };
      case 'medium':
      case 'warning':
        return {
          icon: AlertTriangle,
          bgClass: 'bg-amber-950/30 dark:bg-amber-900/30',
          borderClass: 'border-amber-700',
          textClass: 'text-amber-50',
          iconClass: 'text-amber-400'
        };
      case 'low':
      case 'info':
      default:
        return {
          icon: Info,
          bgClass: 'bg-blue-950/30 dark:bg-blue-900/30',
          borderClass: 'border-blue-700',
          textClass: 'text-blue-50',
          iconClass: 'text-blue-400'
        };
    }
  };

  return (
    <div className="space-y-4">
      {warnings.map((warning, index) => {
        const { icon: Icon, bgClass, borderClass, textClass, iconClass } = getSeverityDetails(warning.severity);
        
        return (
          <Alert 
            key={`${warning.trapType}-${index}`} 
            className={`${bgClass} border ${borderClass} ${textClass}`}
          >
            <Icon className={`h-5 w-5 ${iconClass}`} />
            <AlertTitle className="font-medium">{warning.message}</AlertTitle>
            <AlertDescription className="mt-2 text-sm opacity-90">
              {warning.details || warning.message}
            </AlertDescription>
          </Alert>
        );
      })}
    </div>
  );
};

export default ScenarioWarnings;
