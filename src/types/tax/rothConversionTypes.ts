
/**
 * Unified type definitions for Roth conversions
 */
import { TaxResult } from "./taxCalculationTypes";
import { FilingStatusType } from "./filingTypes";
import { StateCode } from "../../utils/stateTaxData";

// Roth Conversion Scenario Input
export interface RothConversionInput {
  year: number;
  filing_status: FilingStatusType;
  base_income: number;
  rmd_amount: number;
  traditional_ira_balance: number;
  target_conversion_amount: number;
  target_tax_bracket: string;
  include_state_tax: boolean;
  resident_state?: StateCode;
  is_over_65: boolean;
  spouse_info?: {
    is_over_65: boolean;
    base_income: number;
    rmd_amount: number;
    traditional_ira_balance: number;
  };
  charitable_contributions?: number;
  strategy?: "fill_bracket" | "specific_amount" | "max_conversion";
}

// Roth Conversion Scenario
export interface RothConversionScenario extends TaxResult {
  id?: string;
  conversion_amount: number;
  ira_balance_before: number;
  ira_balance_after: number;
  rmd_amount: number;
  tax_increase: number;
  original_tax: number;
  tax_rate_on_conversion: number;
  marginal_bracket_before: string;
  marginal_bracket_after: string;
  include_state_tax: boolean;
  state_code?: StateCode;
  state_tax_on_conversion?: number;
  tax_strategies_used: string[];
  irmaa_impact?: boolean;
  tax_efficiency_score?: number;
  multi_year_projection?: YearlyConversionSummary[];
  scenario_name: string;
}

// Multi-Year Roth Conversion Summary
export interface YearlyConversionSummary {
  year: number;
  conversion_amount: number;
  tax_impact: number;
  balance_before: number;
  balance_after: number;
  rmd_amount: number;
  effective_tax_rate: number;
  bracket_before: string;
  bracket_after: string;
  irmaa_impact: boolean;
  state_tax?: number;
}
