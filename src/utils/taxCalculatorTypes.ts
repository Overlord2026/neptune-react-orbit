
import { FilingStatusType } from './taxBracketData';
import { StateCode } from './stateTaxData';

export interface TaxInput {
  year: number;
  wages: number;
  interest: number;
  dividends: number;
  capital_gains: number;
  ira_distributions: number;
  roth_conversion: number;
  social_security: number;
  filing_status: FilingStatusType;
  isItemizedDeduction?: boolean;
  itemizedDeductionAmount?: number;
  scenarioDate?: Date;
  
  // Spouse income fields
  spouseWages?: number;
  spouseInterest?: number;
  spouseDividends?: number;
  spouseCapitalGains?: number;
  spouseIraDistributions?: number;
  spouseRothConversion?: number;
  spouseSocialSecurity?: number;
  
  // Community property related fields
  isInCommunityPropertyState?: boolean;
  splitCommunityIncome?: boolean;
  
  // State tax related fields
  includeStateTax?: boolean;
  residentState?: StateCode;
}

export interface TaxDataCacheInfo {
  isCurrent: boolean;
  dataUpdatedAt: Date;
  sessionId: string;
}

export interface TaxResult {
  scenario_name: string;
  year: number;
  filing_status: FilingStatusType;
  total_income: number;
  agi: number;
  taxable_income: number;
  federal_tax: number;
  state_tax: number;
  state_code?: StateCode;
  total_tax: number;
  ordinary_tax: number;
  capital_gains_tax: number;
  marginal_rate: number;
  marginal_capital_gains_rate: number;
  effective_rate: number;
  brackets_breakdown?: Record<string, number>;
  updated_at: Date;
  tax_data_updated_at?: Date;
  tax_data_is_current?: boolean;
  tax_data_version?: string;
  tax_data_warning?: string;
  mfs_comparison?: {
    primary_tax: number;
    spouse_tax: number;
    combined_tax: number;
    difference?: number;
  };
  safe_harbor?: {
    required_payment: number;
    is_compliant: boolean;
    method_used: string;
  };
  standard_deduction?: number;
  brackets?: any;
}

export interface TaxScenario extends TaxResult {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  inputs: TaxInput;
  is_favorite: boolean;
  tags?: string[];
}
