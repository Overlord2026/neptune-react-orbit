
import { DataFeed, DataFeedLog, TaxDataCacheInfo } from './types';

// Sample data feeds for demo purposes
export const dataFeeds: DataFeed[] = [
  {
    id: "irs-updates",
    name: "IRS Tax Code Updates",
    description: "Updates to federal tax brackets, deductions, credits, and forms",
    update_frequency: "yearly",
    last_update: "2024-02-15T09:30:00Z",
    status: "active",
    source: "irs.gov",
    data_type: "tax_rates",
    api_endpoint: "https://api.example.com/irs-tax-updates",
    refresh_frequency: "daily"
  },
  {
    id: "state-tax-rates",
    name: "State Tax Rate Updates",
    description: "Updates to state income tax rates and brackets",
    update_frequency: "yearly",
    last_update: "2024-01-30T14:45:00Z",
    status: "active",
    source: "various-state-websites",
    data_type: "tax_rates",
    api_endpoint: "https://api.example.com/state-tax-rates",
    refresh_frequency: "weekly"
  },
  {
    id: "retirement-limits",
    name: "Retirement Contribution Limits",
    description: "Updates to IRA, 401k, and other retirement account contribution limits",
    update_frequency: "yearly",
    last_update: "2024-03-01T11:15:00Z",
    status: "active",
    source: "irs.gov",
    data_type: "financial",
    api_endpoint: "https://api.example.com/retirement-limits",
    refresh_frequency: "monthly"
  },
  {
    id: "inflation-adjustments",
    name: "Inflation Adjusted Amounts",
    description: "Updates to inflation adjusted tax provisions",
    update_frequency: "yearly",
    last_update: "2024-02-28T10:00:00Z",
    status: "error",
    source: "treasury.gov",
    data_type: "economic",
    api_endpoint: "https://api.example.com/inflation-adjustments",
    error_message: "API returned 500 error code",
    refresh_frequency: "monthly"
  },
  {
    id: "tax-form-updates",
    name: "Tax Form Updates",
    description: "Updates to tax form formats and requirements",
    update_frequency: "quarterly",
    last_update: "2024-03-15T16:20:00Z",
    status: "active",
    source: "irs.gov",
    data_type: "regulatory",
    api_endpoint: "https://api.example.com/tax-form-updates",
    refresh_frequency: "weekly"
  }
];

// Sample logs for data feeds
export const dataFeedLogs: DataFeedLog[] = [
  {
    id: "log-001",
    feed_id: "irs-updates",
    timestamp: "2024-02-15T09:30:00Z",
    status: "success",
    message: "Successfully fetched tax code updates",
    details: "Updated 15 tax brackets and 5 deduction amounts"
  },
  {
    id: "log-002",
    feed_id: "state-tax-rates",
    timestamp: "2024-01-30T14:45:00Z",
    status: "success",
    message: "Successfully fetched state tax rate updates",
    details: "Updated tax rates for 12 states"
  },
  {
    id: "log-003",
    feed_id: "inflation-adjustments",
    timestamp: "2024-02-28T10:00:00Z",
    status: "error",
    message: "Failed to fetch inflation adjusted amounts",
    error_message: "API returned 500 error code"
  }
];

// Cache info for user sessions
export const taxDataCache: Record<string, TaxDataCacheInfo> = {
  "default": {
    lastChecked: "2024-03-20T08:00:00Z",
    dataUpdatedAt: "2024-02-15T09:30:00Z",
    isCurrent: true
  }
};
