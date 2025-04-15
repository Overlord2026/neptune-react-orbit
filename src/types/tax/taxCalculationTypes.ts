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
  scenarioDate?: Date;
  isItemizedDeduction?: boolean;
  itemizedDeductionAmount?: number;
  spouseWages?: number;
  spouseInterest?: number;
  spouseDividends?: number;
  spouseCapitalGains?: number;
  spouseIraDistributions?: number;
  spouseRothConversion?: number;
  spouseSocialSecurity?: number;
  isInCommunityPropertyState?: boolean;
  splitCommunityIncome?: boolean;
  includeStateTax?: boolean;
  residentState?: string;
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
  updated_at: Date;
  federal_tax: number;
  state_tax?: number;
  state_code?: string;
  brackets_breakdown?: any[];
  tax_data_updated_at?: Date;
  tax_data_is_current?: boolean;
  tax_data_version?: string;
  tax_data_warning?: string;
  mfs_comparison?: any;
  safe_harbor?: any;
}

export interface TaxScenario extends TaxResult {
  id: string;
  name: string;
  description?: string;
  is_baseline: boolean;
  result: TaxResult;
}
