
/**
 * Unified type definitions for tax calculations
 */
import { FilingStatusType } from "./filingTypes";
import { StateCode } from "../../utils/stateTaxData";

// Unified TaxInput
export interface TaxInput {
  year: number;
  filing_status: FilingStatusType;
  wages: number;
  interest: number;
  dividends: number;
  capital_gains: number;
  ira_distributions: number;
  roth_conversion: number;
  social_security: number;
  
  // Spouse income (for MFJ)
  spouseWages?: number;
  spouseInterest?: number;
  spouseDividends?: number;
  spouseCapitalGains?: number;
  spouseIraDistributions?: number;
  spouseRothConversion?: number;
  spouseSocialSecurity?: number;
  
  // Deduction options
  isItemizedDeduction: boolean;
  itemizedDeductionAmount: number;
  
  // Community property state
  isInCommunityPropertyState?: boolean;
  splitCommunityIncome?: boolean;
  
  // Timestamp reference if needed
  scenarioDate?: Date;
  
  // State tax options
  includeStateTax?: boolean;
  residentState?: StateCode;
}

// Unified TaxResult
export interface TaxResult {
  scenario_name: string;
  year: number;
  filing_status: FilingStatusType;
  total_income: number;
  agi: number;
  taxable_income: number;
  total_tax: number;
  federal_tax?: number;
  state_tax?: number;
  state_code?: StateCode;
  ordinary_tax: number;
  capital_gains_tax: number;
  marginal_rate: number;
  marginal_capital_gains_rate: number;
  effective_rate: number;
  brackets_breakdown: {
    ordinary: { bracket: number; amount: number; tax: number }[];
    capitalGains: { bracket: number; amount: number; tax: number }[];
  };
  updated_at: Date;
  tax_data_updated_at: Date;
  tax_data_is_current: boolean;
  tax_data_version?: string;
  tax_data_warning?: string;
  mfs_comparison?: any;
  safe_harbor?: any;
}

export interface TaxDataCacheInfo {
  dataUpdatedAt: Date;
  isCurrent: boolean;
}

export interface YearConfiguration {
  year: number;
  baseIncome: number;
  spouseBaseIncome?: number;
}

export interface ConversionInput {
  scenarioData: any;
  totalPreConversionIncome: number;
  currentYear: number;
  baseIncome: number;
  rmdAmount: number;
  spouseBaseIncome?: number;
  spouseRmdAmount?: number;
  traditionalIRABalance?: number;
  spouseTraditionalIRABalance?: number;
}
