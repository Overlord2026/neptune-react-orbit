
// Define the types used in the data feed system

export interface DataFeed {
  id: string;
  name: string;
  description: string;
  update_frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'manual';
  last_update: string;
  next_update?: string;
  status: 'active' | 'inactive' | 'error';
  source: string;
  data_type: 'tax_rates' | 'financial' | 'economic' | 'regulatory' | 'other';
}

export interface DataFeedLog {
  id: string;
  feed_id: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

export interface TaxDataCacheInfo {
  lastChecked: string;
  dataUpdatedAt: string;
  isCurrent: boolean;
}
