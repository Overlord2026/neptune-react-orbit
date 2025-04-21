
import { v4 as uuid } from 'uuid';
import { AuditLogEntry, AuditLogOperationDetails } from './types';
import { getAuditLogs } from './auditLogCrud';

/**
 * Records a manual override action in the audit log
 */
export function recordManualOverride(
  userId: string,
  dataFeedId: string,
  details: AuditLogOperationDetails,
  reason: string
): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: uuid(),
    timestamp: new Date().toISOString(),
    userId,
    action: 'MANUAL_OVERRIDE',
    targetId: dataFeedId,
    details: {
      reason,
      ...details
    }
  };
  
  // In a real implementation, this would save to a database
  console.log('Manual override recorded:', entry);
  
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
    timestamp: new Date().toISOString(),
    userId,
    action: success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILURE',
    targetId: userId,
    details: {
      ipAddress,
      success
    }
  };
  
  // In a real implementation, this would save to a database
  console.log('Login attempt recorded:', entry);
  
  return entry;
}
