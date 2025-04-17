
/**
 * Audit Log Operations
 * 
 * Central export point for audit log functionality
 */

// Re-export types
export * from './types';

// Re-export CRUD operations
export * from './auditLogCrud';

// Re-export mock data
export * from './mockData';

// Export auth utilities
export * from './authUtils';

/**
 * Record a manual override in the system
 * @param userId The ID of the user performing the override
 * @param section The section being overridden
 * @param changes The changes being made
 * @param reason The reason for the override
 * @returns The created audit log entry
 */
export function recordManualOverride(userId: string, section: string, changes: any, reason: string) {
  // Generate a log entry for manual override
  const logEntry = {
    id: Math.random().toString(36).substring(2, 15),
    timestamp: new Date(),
    user: userId,
    action: 'MANUAL_OVERRIDE',
    details: {
      section,
      changes,
      reason
    },
    type: 'DATA_UPDATE' as const
  };
  
  console.log('Manual override recorded:', logEntry);
  
  // In a real implementation, this would save to a database
  return logEntry;
}

/**
 * Perform a rollback of a previous change
 * @param logEntryId The ID of the log entry to roll back
 * @param userId The ID of the user performing the rollback
 * @returns The created audit log entry for the rollback operation
 */
export function performRollback(logEntryId: string, userId: string) {
  // Generate a log entry for the rollback operation
  const logEntry = {
    id: Math.random().toString(36).substring(2, 15),
    timestamp: new Date(),
    user: userId,
    action: 'ROLLBACK',
    details: {
      original_log_id: logEntryId
    },
    type: 'SYSTEM_EVENT' as const
  };
  
  console.log('Rollback performed:', logEntry);
  
  // In a real implementation, this would revert changes and save to a database
  return logEntry;
}
