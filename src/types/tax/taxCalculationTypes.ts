
/**
 * Unified type definitions for tax calculations
 */
import { FilingStatusType } from "./filingTypes";
import { StateCode } from "../../utils/stateTaxData";

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
  
  // Added missing spouse fields
  spouseInterest?: number;
  spouseDividends?: number;
  spouseCapitalGains?: number;
  spouseSocialSecurity?: number;
  
  // Added state tax fields
  includeStateTax?: boolean;
  residentState?: StateCode;
  
  // Added community property fields
  isInCommunityPropertyState?: boolean;
  splitCommunityIncome?: boolean;
  
  // Date for historical tax data version selection
  scenarioDate?: Date;
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
  state_code?: StateCode;
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
  tax_data_updated_at?: Date;
  safe_harbor?: any;
  tax_data_warning?: string;
  updated_at?: Date;
}

export interface TaxScenario extends TaxResult {
  id: string;
  name: string;
  description?: string;
  is_baseline: boolean;
  result: TaxResult;
}
