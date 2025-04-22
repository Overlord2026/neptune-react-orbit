
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
    user: userId,
    user_id: userId,
    action: 'MANUAL_OVERRIDE',
    details: {
      reason,
      ...details
    },
    type: 'USER_ACTION',
    data_feed_id: dataFeedId // Changed from target_id to data_feed_id to match type
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
    user: userId,
    user_id: userId,
    action: success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILURE',
    details: {
      ipAddress,
      success
    },
    type: 'SECURITY_EVENT',
    data_feed_id: userId // Changed from target_id to data_feed_id
  };
  
  // In a real implementation, this would save to a database
  console.log('Login attempt recorded:', entry);
  
  return entry;
}
