
import { AuditLogEntry } from './types';
import { auditLogs } from './mockData';

/**
 * Create a new audit log entry
 */
export const createAuditLog = (logEntry: Omit<AuditLogEntry, 'id'>): AuditLogEntry => {
  const id = `audit-${new Date().getTime()}-${Math.random().toString(36).substring(2, 9)}`;
  
  const newLogEntry: AuditLogEntry = {
    ...logEntry,
    id
  };
  
  auditLogs.push(newLogEntry);
  return newLogEntry;
};

/**
 * Get all audit logs with optional filtering
 */
export const getAuditLogs = (
  options?: {
    startDate?: string;
    endDate?: string;
    dataFeedId?: string;
    action?: string;
    userId?: string;
    limit?: number;
  }
): AuditLogEntry[] => {
  let filtered = [...auditLogs];
  
  if (options?.startDate) {
    const startTimestamp = new Date(options.startDate).getTime();
    filtered = filtered.filter(log => new Date(log.timestamp).getTime() >= startTimestamp);
  }
  
  if (options?.endDate) {
    const endTimestamp = new Date(options.endDate).getTime();
    filtered = filtered.filter(log => new Date(log.timestamp).getTime() <= endTimestamp);
  }
  
  if (options?.dataFeedId) {
    filtered = filtered.filter(log => log.data_feed_id === options.dataFeedId);
  }
  
  if (options?.action) {
    filtered = filtered.filter(log => log.action === options.action);
  }
  
  if (options?.userId) {
    filtered = filtered.filter(log => log.user_id === options.userId);
  }
  
  // Sort by timestamp descending (newest first)
  filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  // Apply limit if specified
  if (options?.limit && options.limit > 0) {
    filtered = filtered.slice(0, options.limit);
  }
  
  return filtered;
};

/**
 * Get a specific audit log by ID
 */
export const getAuditLogById = (id: string): AuditLogEntry | undefined => {
  return auditLogs.find(log => log.id === id);
};
