
import { toast } from "sonner";

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

// Mock data storage (in a real app, this would be a database)
const initialDataFeeds: DataFeed[] = [
  {
    id: "irs-updates",
    name: "IRS Tax Code Updates",
    api_endpoint: "https://api.irs.gov/tax-code/v1/updates",
    refresh_frequency: "weekly",
    last_update: "2025-04-05T10:30:00Z",
    status: "active",
    description: "Official updates to tax brackets, rates, and new form releases"
  },
  {
    id: "state-tax-rates",
    name: "State-Specific Tax Rates",
    api_endpoint: "https://api.taxdata.org/states/v2/rates",
    refresh_frequency: "monthly",
    last_update: "2025-03-15T14:22:00Z",
    status: "active",
    description: "State income tax rates, sales tax, and local tax information"
  },
  {
    id: "retirement-limits",
    name: "Retirement Account Limits",
    api_endpoint: "https://api.irs.gov/retirement/v1/limits",
    refresh_frequency: "monthly",
    last_update: "2025-02-28T09:15:00Z",
    status: "active",
    description: "IRA, 401(k), and other retirement account contribution limits"
  },
  {
    id: "inflation-data",
    name: "Inflation Updates",
    api_endpoint: "https://api.treasury.gov/inflation/v1/current",
    refresh_frequency: "daily",
    last_update: "2025-04-08T23:00:00Z",
    status: "warning",
    description: "Current inflation rates affecting tax brackets and deductions"
  },
  {
    id: "aca-subsidies",
    name: "ACA Subsidy Changes",
    api_endpoint: "https://api.healthcare.gov/subsidies/v2",
    refresh_frequency: "monthly",
    last_update: "2025-03-01T12:00:00Z",
    status: "error",
    description: "Updates to Affordable Care Act premium tax credit calculations"
  },
  {
    id: "social-security",
    name: "Social Security Thresholds",
    api_endpoint: "https://api.ssa.gov/thresholds/v1",
    refresh_frequency: "monthly",
    last_update: "2025-03-10T16:45:00Z",
    status: "active",
    description: "Social Security wage base limits and benefit threshold updates"
  }
];

// Initialize with mock data
let dataFeeds = [...initialDataFeeds];
let dataFeedLogs: DataFeedLog[] = [];

// Helper function to get a data feed by ID
export const getDataFeedById = (feedId: string): DataFeed | undefined => {
  return dataFeeds.find(feed => feed.id === feedId);
};

// Helper function to update a data feed
export const updateDataFeed = (feedId: string, updates: Partial<DataFeed>): DataFeed | null => {
  const index = dataFeeds.findIndex(feed => feed.id === feedId);
  if (index === -1) return null;
  
  dataFeeds[index] = { ...dataFeeds[index], ...updates };
  return dataFeeds[index];
};

// Helper function to create a log entry
export const createDataFeedLog = (log: Omit<DataFeedLog, 'id'>): DataFeedLog => {
  const newLog: DataFeedLog = {
    id: `log-${Date.now()}`,
    ...log,
  };
  dataFeedLogs.push(newLog);
  return newLog;
};

// Helper function to get logs for a specific feed
export const getDataFeedLogs = (feedId: string): DataFeedLog[] => {
  return dataFeedLogs.filter(log => log.feed_id === feedId);
};

// Export the dataFeeds array for use in components
export const getAllDataFeeds = (): DataFeed[] => {
  return dataFeeds;
};

// Export function to replace all data feeds (used in components)
export const setAllDataFeeds = (feeds: DataFeed[]): void => {
  dataFeeds = feeds;
};
