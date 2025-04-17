
// Mock data for audit logs
export const mockAuditLogEntries = [
  {
    id: '1',
    timestamp: new Date('2023-03-15T10:30:00'),
    userId: 'admin-001',
    action: 'DATA_UPDATE',
    details: {
      tableName: 'tax_brackets',
      year: 2023,
      changes: 3
    }
  },
  {
    id: '2',
    timestamp: new Date('2023-03-14T16:45:23'),
    userId: 'user-123',
    action: 'MANUAL_OVERRIDE',
    details: {
      modified: 1,
      details: {
        fields: [{
          year: '2023',
          type: 'standard_deduction',
          field: 'married_joint',
          value: '27700'
        }]
      }
    },
    targetId: 'feed-001',
    reason: 'Correction based on IRS publication 501'
  }
];
