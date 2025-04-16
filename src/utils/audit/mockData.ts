
import { AuditLogEntry } from './types';

// Mock database for audit logs (in a real app, this would be in a database)
export const auditLogs: AuditLogEntry[] = [
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
