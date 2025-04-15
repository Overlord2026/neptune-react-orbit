
/**
 * Tax Trap Alerts
 * 
 * Re-exports TrapAlert types for backward compatibility.
 */

// Import from the central type definition
import { TrapAlert as CoreTrapAlert } from '@/types/tax/rothConversionTypes';

// Re-export with compatibility types
export interface TrapAlert {
  trapType: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  details?: string;
  description?: string;
  title?: string;
}

// Helper to convert between the two formats
export const convertToUITrapAlert = (coreAlert: CoreTrapAlert): TrapAlert => {
  let severity: 'critical' | 'warning' | 'info';
  
  // Map the severity
  switch (coreAlert.severity) {
    case 'high':
      severity = 'critical';
      break;
    case 'medium':
      severity = 'warning';
      break;
    case 'low':
    default:
      severity = 'info';
  }
  
  return {
    trapType: coreAlert.type,
    severity,
    message: coreAlert.message,
    details: coreAlert.message,
    description: coreAlert.message,
    title: coreAlert.message
  };
};

// Import the component to re-export as default
import TaxTrapAlertsComponent from './TaxTrapAlerts.tsx';

// Export the component as default
export default TaxTrapAlertsComponent;
