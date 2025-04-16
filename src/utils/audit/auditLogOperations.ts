
import { toast } from "sonner";
import { createAuditLog, getAuditLogById } from './auditLogCrud';
import { getCurrentUserId } from './authUtils';
import { getTaxDataVersionsForYear } from '@/utils/taxDataVersioning';

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
