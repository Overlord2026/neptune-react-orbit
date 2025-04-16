import { AuditLogEntry } from './dataFeed/types';
import { toast } from "sonner";
import { getTaxDataVersionsForYear } from '@/utils/taxDataVersioning';

// Mock database for audit logs (in a real app, this would be in a database)
let auditLogs: AuditLogEntry[] = [
  {
    id: 'audit-2023-01',
    action: 'auto_update',
    timestamp: '2023-11-01T12:00:00Z',
    data_feed_id: 'irs-updates',
    version_id: 'v2023-01',
    changes_made: {
      added: 14,
      modified: 0,
      removed: 0,
      details: {
        tax_brackets: 8,
        standard_deductions: 6
      }
    },
    status: 'success',
    affected_years: [2024]
  },
  {
    id: 'audit-2023-02',
    action: 'manual_override',
    user_id: 'admin-user',
    timestamp: '2023-11-15T14:30:00Z',
    data_feed_id: 'irs-updates',
    version_id: 'v2023-02',
    changes_made: {
      added: 0,
      modified: 2,
      removed: 0,
      details: {
        tax_brackets: 2,
        descriptions: "Adjusted income brackets for 2024 head of household"
      }
    },
    reason: 'Correction after IRS announcement',
    status: 'success',
    affected_years: [2024]
  }
];

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

/**
 * Perform a rollback based on an audit log entry
 */
export const performRollback = async (
  auditLogId: string,
  userId: string,
  reason: string
): Promise<boolean> => {
  const logToRevert = getAuditLogById(auditLogId);
  
  if (!logToRevert) {
    console.error(`Audit log with ID ${auditLogId} not found`);
    toast.error("Failed to rollback: Audit log not found");
    return false;
  }
  
  try {
    // In a real application, this would restore data from a backup or previous version
    console.log(`Rolling back changes from audit log ${auditLogId}`);
    
    // Create a new audit log entry for the rollback
    createAuditLog({
      action: 'rollback',
      user_id: userId,
      timestamp: new Date().toISOString(),
      data_feed_id: logToRevert.data_feed_id,
      version_id: logToRevert.version_id,
      changes_made: {
        details: `Rolled back changes from audit log ${auditLogId}`
      },
      reason: reason,
      status: 'success',
      affected_years: logToRevert.affected_years
    });
    
    toast.success("Successfully rolled back changes");
    return true;
  } catch (error) {
    console.error("Rollback error:", error);
    
    // Log the failed rollback attempt
    createAuditLog({
      action: 'rollback',
      user_id: userId,
      timestamp: new Date().toISOString(),
      data_feed_id: logToRevert.data_feed_id,
      version_id: logToRevert.version_id,
      changes_made: {
        details: `Failed rollback attempt for audit log ${auditLogId}`
      },
      reason: reason,
      status: 'error',
      affected_years: logToRevert.affected_years,
      error_message: error instanceof Error ? error.message : "Unknown error"
    });
    
    toast.error(`Failed to rollback: ${error instanceof Error ? error.message : "Unknown error"}`);
    return false;
  }
};

/**
 * Record a manual override
 */
export const recordManualOverride = (
  userId: string,
  dataFeedId: string,
  changes: any,
  reason: string,
  affectedYears: number[]
): AuditLogEntry => {
  // Get the current version for the first affected year to associate with this change
  const versions = affectedYears.length > 0 ? getTaxDataVersionsForYear(affectedYears[0]) : [];
  const version = versions.length > 0 ? versions[0] : undefined;
  
  return createAuditLog({
    action: 'manual_override',
    user_id: userId,
    timestamp: new Date().toISOString(),
    data_feed_id: dataFeedId,
    version_id: version?.id,
    changes_made: {
      added: changes.added || 0,
      modified: changes.modified || 0,
      removed: changes.removed || 0,
      details: changes.details || {}
    },
    reason: reason,
    status: 'success',
    affected_years: affectedYears
  });
};

/**
 * Get the current user ID (mock function)
 * In a real application, this would come from an authentication system
 */
export const getCurrentUserId = (): string => {
  // Mock user ID for admin user
  return "admin-user";
};

/**
 * Check if a user has admin permissions (mock function)
 * In a real application, this would check against permissions in a database
 */
export const hasAdminPermission = (userId: string): boolean => {
  // Mock check - in a real app this would validate against roles
  return userId === "admin-user";
};
