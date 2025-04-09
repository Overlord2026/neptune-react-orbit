
// Types for data feeds
export interface DataFeed {
  id: string;
  name: string;
  api_endpoint: string;
  refresh_frequency: "daily" | "weekly" | "monthly";
  last_update: string;
  status: "active" | "warning" | "error";
  description: string;
  error_message?: string;
}

// Types for tax brackets
export interface TaxBracketUpdate {
  year: number;
  filing_status: string;
  bracket_min: number;
  bracket_max: number;
  rate: number;
  bracket_type: string;
}

// Types for retirement limits
export interface RetirementLimitUpdate {
  year: number;
  account_type: string;
  contribution_limit: number;
  catch_up_limit?: number;
}

// Types for tax forms
export interface TaxFormUpdate {
  form_name: string;
  year: number;
  description: string;
  changes?: string;
}

// Types for standard deduction
export interface StandardDeductionUpdate {
  year: number;
  filing_status: string;
  amount: number;
}

// Types for data feed logs
export interface DataFeedLog {
  id: string;
  feed_id: string;
  timestamp: string;
  success: boolean;
  changes_count: number;
  version_info?: string;
  error_message?: string;
}

// User session caching interface
export interface TaxDataCacheInfo {
  lastChecked: string;
  dataUpdatedAt: string;
  isCurrent: boolean;
}
