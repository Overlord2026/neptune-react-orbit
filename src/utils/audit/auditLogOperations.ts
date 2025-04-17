// Create this file if it doesn't exist
import { AuditLogType } from './types';

// Define the AuditLogEntry type if missing
export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  details: any;
  type: AuditLogType;
}

/**
 * Log tax scenario changes
 */
export function logTaxScenarioUpdate(scenarioId: string, changes: any, userId: string) {
  const logEntry: AuditLogEntry = {
    id: generateId(),
    timestamp: new Date(),
    user: userId,
    action: 'TAX_SCENARIO_UPDATE',
    details: {
      scenarioId,
      changes
    },
    type: 'TAX_CALCULATION'
  };
  
  saveLogEntry(logEntry);
  return logEntry;
}

/**
 * Log tax data updates
 */
export function logTaxDataUpdate(year: number, version: string, userId: string) {
  const logEntry: AuditLogEntry = {
    id: generateId(),
    timestamp: new Date(),
    user: userId,
    action: 'TAX_DATA_UPDATE',
    details: {
      year,
      version
    },
    type: 'DATA_UPDATE'
  };
  
  saveLogEntry(logEntry);
  return logEntry;
}

// Helper functions
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

function saveLogEntry(entry: AuditLogEntry) {
  // In a real implementation, this would save to a database or storage
  console.log('Audit log entry saved:', entry);
}
