
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
  api_endpoint?: string;
  error_message?: string;
  refresh_frequency?: string;
}

export interface DataFeedLog {
  id: string;
  feed_id: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: string;
  success?: boolean;
  changes_count?: number;
  version_info?: string;
  error_message?: string;
}

export interface TaxDataCacheInfo {
  lastChecked: string;
  dataUpdatedAt: string;
  isCurrent: boolean;
}

export interface TaxBracketUpdate {
  type: 'tax_bracket';
  year: number;
  status: string;
  filingStatus: string;
  data: any;
  // For compatibility with existing code
  filing_status?: string;
  bracket_min?: number;
  bracket_type?: string;
  rate?: number;
}

export interface RetirementLimitUpdate {
  type: 'retirement_limits';
  year: number;
  data: any;
}

export interface TaxFormUpdate {
  type: 'tax_forms';
  year: number;
  data: any;
}

export interface StandardDeductionUpdate {
  type: 'standard_deduction';
  year: number;
  data: any;
  filing_status?: string; // For compatibility with existing code
  amount?: number; // For compatibility with existing code
}

export interface TaxAlert {
  id: string;
  user_id: string;
  title: string;
  message: string;
  link_to_learn_more?: string;
  created_at: string;
  read_at?: string;
  severity: 'major' | 'minor' | 'info';
  update_type: 'tax_bracket' | 'standard_deduction' | 'retirement_limits' | 'tax_forms' | 'other';
  year: number;
  dismissed: boolean;
}
