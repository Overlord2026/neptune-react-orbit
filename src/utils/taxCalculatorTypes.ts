
/**
 * Tax Calculator Types
 * 
 * Central location for tax-related type definitions
 */

import { FilingStatusType } from './taxBracketData';

export interface TaxInput {
  year: number;
  wages: number;
  interest: number;
  dividends: number;
  capital_gains: number;
  ira_distributions: number;
  roth_conversion: number;
  social_security: number;
  isItemizedDeduction: boolean;
  itemizedDeductionAmount?: number;
  filing_status: FilingStatusType;
  scenarioDate?: string; // Added for tax data versioning
  
  // Spouse data for married filing scenarios
  spouseWages?: number;
  spouseInterest?: number;
  spouseDividends?: number;
  spouseCapitalGains?: number;
  spouseIraDistributions?: number;
  spouseRothConversion?: number;
  spouseSocialSecurity?: number;
  
  // Community property settings
  isInCommunityPropertyState?: boolean;
  splitCommunityIncome?: boolean;
}

export interface TaxResult {
  scenario_name: string;
  year: number;
  filing_status: FilingStatusType;
  total_income: number;
  agi: number;
  taxable_income: number;
  total_tax: number;
  ordinary_tax: number;
  capital_gains_tax: number;
  marginal_rate: number;
  marginal_capital_gains_rate: number;
  effective_rate: number;
  brackets_breakdown?: {
    ordinary: { bracket: number; amount: number; tax: number }[];
    capitalGains: { bracket: number; amount: number; tax: number }[];
  };
  updated_at: Date;
  tax_data_updated_at?: string; // When the tax data used was last updated
  tax_data_is_current?: boolean; // Whether the tax data is current
  tax_data_version?: string; // Version of tax data used for calculation
  tax_data_warning?: string; // Warning about tax data (e.g., mid-year update)
  safe_harbor?: import('./safeHarborUtils').SafeHarborResult;
  
  // MFS comparison data (if applicable)
  mfs_comparison?: {
    primary_tax: number;
    spouse_tax: number;
    combined_tax: number;
    difference: number; // Difference compared to MFJ
  };
}

export interface TaxDataCacheInfo {
  isCurrent: boolean;
  dataUpdatedAt: string;
  lastChecked: string;
}
