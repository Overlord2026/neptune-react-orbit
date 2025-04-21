/**
 * Audit Log Types
 */

export type AuditLogType = 
  | 'USER_ACTION'
  | 'SYSTEM_EVENT'
  | 'TAX_CALCULATION'
  | 'DATA_UPDATE'
  | 'SECURITY_EVENT'
  | 'ERROR';

export interface AuditLogFilter {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  actionTypes?: AuditLogType[];
  limit?: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  details: any;
  type: AuditLogType;
  // Add missing properties referenced in AdminAuditLogPage
  user_id?: string;
  reason?: string;
  data_feed_id?: string;
  changes_made?: any;
  version_id?: string;
  affected_years?: string[];
}

export interface AuditLogOperationDetails {
  [key: string]: any;
  reason?: string;
}
