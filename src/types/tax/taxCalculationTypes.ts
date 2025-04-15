
/**
 * Unified type definitions for tax calculations
 */
import { FilingStatusType } from "./filingTypes";

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
  isItemizedDeduction: boolean;
  itemizedDeductionAmount: number;
  
  // Optional fields
  spouseWages?: number;
  spouseIraDistributions?: number;
  spouseRothConversion?: number;
  isInCommunityPropertyState?: boolean;
  splitCommunityIncome?: boolean;
}

export interface TaxResult {
  id?: string;
  scenario_name: string;
  analysis_type?: string;
  year: number;
  filing_status: FilingStatusType;
  agi: number;
  taxable_income: number;
  standard_deduction: number;
  total_tax: number;
  federal_tax: number;
  state_tax?: number;
  marginal_rate: number;
  effective_rate: number;
  marginal_capital_gains_rate?: number;
  brackets: {
    bracket: string;
    rate: number;
    amount: number;
  }[];
  capital_gains_brackets?: {
    bracket: string;
    rate: number;
    amount: number;
  }[];
  warnings?: {
    type: string;
    message: string;
    severity: string;
  }[];
  next_bracket?: {
    name: string;
    threshold: number;
    rate: number;
    amount_to_next: number;
  };
  mfs_comparison?: {
    primary_tax: number;
    spouse_tax: number;
    combined_tax: number;
    difference: number;
  };
  
  // Additional properties used in some components
  total_income?: number;
  ordinary_tax?: number;
  capital_gains_tax?: number;
  brackets_breakdown?: {
    ordinary: { bracket: number; amount: number; tax: number }[];
    capitalGains: { bracket: number; amount: number; tax: number }[];
  };
  tax_data_version?: string;
  tax_data_is_current?: boolean;
}

export interface TaxScenario extends TaxResult {
  id: string;
  name: string;
  description?: string;
  is_baseline: boolean;
  result: TaxResult;
}
