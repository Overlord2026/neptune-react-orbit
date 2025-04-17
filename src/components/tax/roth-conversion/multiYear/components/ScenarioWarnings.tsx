
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { TrapAlert } from '@/types/tax/rothConversionTypes';

interface ScenarioWarningsProps {
  warnings: TrapAlert[];
}

const ScenarioWarnings: React.FC<ScenarioWarningsProps> = ({ warnings }) => {
  if (!warnings || warnings.length === 0) {
    return null;
  }
  
  // Group warnings by type and severity
  const groupedWarnings = warnings.reduce<Record<string, TrapAlert[]>>((acc, warning) => {
    // Use trapType as the fallback if type is not available
    const key = warning.trapType || 'unknown';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(warning);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Scenario Alerts & Warnings</h3>
      <div className="space-y-2">
        {Object.entries(groupedWarnings).map(([type, alerts]) => (
          <Alert 
            key={type} 
            variant={getVariantForSeverity(alerts[0].severity)}
            className="bg-opacity-20"
          >
            {getIconForSeverity(alerts[0].severity)}
            <AlertTitle>
              {formatWarningType(type)}
            </AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                {alerts.map((alert, idx) => (
                  <li key={`${type}-${idx}`}>{alert.message || alert.details}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
};

// Helper functions for warning appearance
const getVariantForSeverity = (severity: 'low' | 'medium' | 'high'): "default" | "destructive" => {
  switch (severity) {
    case 'high':
      return 'destructive';
    default:
      return 'default';
  }
};

const getIconForSeverity = (severity: 'low' | 'medium' | 'high') => {
  switch (severity) {
    case 'high':
      return <AlertCircle className="h-4 w-4" />;
    case 'medium':
      return <AlertTriangle className="h-4 w-4" />;
    case 'low':
      return <Info className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

const formatWarningType = (type: string): string => {
  // Convert snake_case or camelCase to Title Case
  return type
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

export default ScenarioWarnings;
