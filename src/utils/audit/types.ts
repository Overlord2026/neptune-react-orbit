
import { TaxDataVersion } from '@/utils/dataFeed/types';

export interface AuditLogEntry {
  id: string;
  action: 'auto_update' | 'manual_update' | 'manual_override' | 'rollback';
  user_id?: string;
  timestamp: string;
  data_feed_id: string;
  version_id?: string;
  changes_made: {
    added?: number;
    modified?: number;
    removed?: number;
    details?: any;
  };
  reason?: string;
  status: 'success' | 'error';
  affected_years?: number[];
  error_message?: string;
}

// Types for auth/permission functions
export interface AdminUser {
  id: string;
  roles: string[];
  permissions: string[];
}
