
import { AuditLogEntry, AuditLogType } from './types';

// Sample audit log entries for demonstration purposes
export const mockAuditLogEntries: AuditLogEntry[] = [
  {
    id: "audit-001",
    timestamp: new Date("2025-03-15T10:30:00Z"),
    user: "admin@example.com",
    action: "TAX_BRACKET_UPDATE",
    details: {
      year: 2025,
      brackets: [
        { min: 0, max: 10000, rate: 0.10 },
        { min: 10001, max: 40000, rate: 0.12 }
      ]
    },
    type: "DATA_UPDATE",
    user_id: "admin-001",
    reason: "Annual tax bracket update",
    data_feed_id: "feed-001",
    changes_made: { bracket_updates: 2 }
  },
  {
    id: "audit-002",
    timestamp: new Date("2025-03-14T14:15:00Z"),
    user: "user@example.com",
    action: "SCENARIO_CALCULATION",
    details: {
      scenario_id: "scenario-123",
      calculation_parameters: {
        income: 75000,
        filing_status: "single"
      }
    },
    type: "TAX_CALCULATION",
    user_id: "user-002"
  },
  {
    id: "audit-003",
    timestamp: new Date("2025-03-13T09:45:00Z"),
    user: "system",
    action: "DATA_FEED_IMPORT",
    details: {
      source: "irs.gov",
      files: ["2025_brackets.json", "2025_deductions.json"]
    },
    type: "SYSTEM_EVENT",
    data_feed_id: "feed-002"
  }
];

// Function to get mock audit logs with optional filters
export function getMockAuditLogs() {
  return mockAuditLogEntries;
}
