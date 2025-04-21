
/**
 * Tax Calculator Type Definitions
 */

import { FilingStatusType } from '@/types/tax/filingTypes';

export interface TaxInput {
  year: number;
  filingStatus?: FilingStatusType;
  filing_status?: FilingStatusType;
  income?: number;
  wages?: number;
  interest?: number;
  dividends?: number;
  capitalGains?: number;
  capital_gains?: number;
  ira_distributions?: number;
  roth_conversion?: number;
  social_security?: number;
  adjustments?: number;
  deductions?: number;
  credits?: number;
  isItemizedDeduction?: boolean;
  itemizedDeductionAmount?: number;
  isInCommunityPropertyState?: boolean;
  splitCommunityIncome?: boolean;
  spouseWages?: number;
  spouseInterest?: number;
  spouseDividends?: number;
  spouseCapitalGains?: number;
  spouseIraDistributions?: number;
  spouseRothConversion?: number;
  spouseSocialSecurity?: number;
}

export interface BracketItem {
  bracket: number;
  amount: number;
  tax: number;
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
  updated_at: string;
  federal_tax: number;
  state_tax: number;
  state_code?: string;
  brackets_breakdown?: {
    ordinary: BracketItem[];
    capitalGains: BracketItem[];
  };
  tax_data_updated_at: string;
  tax_data_is_current: boolean;
  tax_data_version?: string;
  safe_harbor?: {
    required_payment: number;
    is_compliant: boolean;
    method_used: string;
  };
  mfs_comparison?: any;
  brackets?: any[];
  standard_deduction?: number;
}

export interface TaxDataCacheInfo {
  dataUpdatedAt: Date;
  isCurrent: boolean;
  sessionId: string;
}
