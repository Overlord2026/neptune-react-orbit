
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
    timestamp: new Date(),
    user_id: userId, // Fixed property name to match AuditLogEntry type
    action: 'MANUAL_OVERRIDE',
    target_id: dataFeedId, // Changed from targetId to target_id to match type
    details: {
      reason,
      ...details
    },
    type: 'USER_ACTION', // Added required type property
    user: userId // Added required user property
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
    timestamp: new Date(),
    user_id: userId, // Fixed property name to match AuditLogEntry type
    action: success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILURE',
    target_id: userId, // Changed from targetId to target_id to match type
    details: {
      ipAddress,
      success
    },
    type: 'SECURITY_EVENT', // Added required type property
    user: userId // Added required user property
  };
  
  // In a real implementation, this would save to a database
  console.log('Login attempt recorded:', entry);
  
  return entry;
}
