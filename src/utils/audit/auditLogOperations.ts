
// Create this file if it doesn't exist
import { AuditLogType } from './types';
import { v4 as uuid } from 'uuid';

// Define the AuditLogEntry type if missing
export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  details: any;
  type: AuditLogType;
  reason?: string;
  user_id?: string;
}

/**
 * Records a manual override in the audit log
 */
export function recordManualOverride(
  userId: string,
  targetId: string,
  details: any,
  reason: string
): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: uuid(),
    timestamp: new Date(),
    user: userId,
    user_id: userId,
    action: 'manual_override',
    details,
    type: 'SECURITY_EVENT',
    reason
  };
  
  saveLogEntry(entry);
  return entry;
}

/**
 * Records a login attempt in the audit log
 */
export function recordLoginAttempt(
  userId: string,
  success: boolean,
  ipAddress: string
): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: uuid(),
    timestamp: new Date(),
    user: userId,
    user_id: userId,
    action: success ? 'login_success' : 'login_failure',
    details: {
      ipAddress,
      success
    },
    type: 'SECURITY_EVENT'
  };
  
  saveLogEntry(entry);
  return entry;
}

/**
 * Records data access in the audit log
 */
export function recordDataAccess(
  userId: string,
  dataType: string,
  dataId: string
): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: uuid(),
    timestamp: new Date(),
    user: userId,
    user_id: userId,
    action: 'data_access',
    details: {
      dataType,
      dataId
    },
    type: 'USER_ACTION'
  };
  
  saveLogEntry(entry);
  return entry;
}

/**
 * Records settings change in the audit log
 */
export function recordSettingsChange(
  userId: string,
  settingName: string,
  oldValue: any,
  newValue: any
): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: uuid(),
    timestamp: new Date(),
    user: userId,
    user_id: userId,
    action: 'settings_change',
    details: {
      settingName,
      oldValue,
      newValue
    },
    type: 'USER_ACTION'
  };
  
  saveLogEntry(entry);
  return entry;
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
