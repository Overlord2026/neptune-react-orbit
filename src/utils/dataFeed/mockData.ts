
import { DataFeed, DataFeedLog } from './types';

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

// Session cache for tax data - stores when the user last checked for updates
let taxDataCache: Record<string, TaxDataCacheInfo> = {}; 

export { dataFeeds, dataFeedLogs, taxDataCache };
