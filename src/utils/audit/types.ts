
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
