
/**
 * Types for Roth conversion calculations
 */
import { FilingStatusType } from './filingTypes';

export interface RothConversionInput {
  year: number;
  filing_status: FilingStatusType;
  age: number;
  current_income: number;
  traditional_ira_balance: number;
  conversion_amount: number;
  anticipated_return_rate: number;
  investment_timeframe: number;
  effective_tax_rate: number;
  current_marginal_rate: number;
  anticipated_retirement_tax_rate: number;
  has_nondeductible_contributions: boolean;
  nondeductible_basis?: number;
}

export interface RothConversionScenario {
  id: string;
  name: string;
  description?: string;
  input: RothConversionInput;
  result: {
    tax_now: number;
    tax_savings_later: number;
    net_benefit: number;
    break_even_years: number;
    roth_value_at_retirement: number;
    traditional_value_at_retirement: number;
    traditional_tax_at_retirement: number;
  };
}

export interface YearlyConversionSummary {
  year: number;
  income_before_conversion: number;
  conversion_amount: number;
  income_after_conversion: number;
  tax_without_conversion: number;
  tax_with_conversion: number;
  additional_tax: number;
  marginal_rate_before: number;
  marginal_rate_after: number;
  bracket_impact: boolean;
  effective_rate_on_conversion: number;
}

export interface MultiYearScenarioData {
  filingStatus: FilingStatusType;
  baseIncome: number;
  iraBalance: number;
  includeSpouse?: boolean;
  spouseAge?: number;
  spouseIraBalance?: number;
  isInCommunityPropertyState?: boolean;
  splitCommunityIncome?: boolean;
  residentState?: string;
  includeStateTax?: boolean;
  stateRelocationYear?: number;
  futureResidentState?: string;
  startYear?: number;
}

export interface YearlyResult {
  year: number;
  income: number;
  tax: number;
  marginalRate: number;
  effectiveRate: number;
  conversions: {
    amount: number;
    tax: number;
    effectiveRate: number;
  }[];
}

export interface CharitableContribution {
  amount: number;
  isQcd: boolean;
  isBunching: boolean;
  years?: number[];
}

export interface TrapAlert {
  type: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  impactAmount?: number;
}

export interface ConversionStrategyType {
  id: string;
  name: string;
  description: string;
  isRecommended: boolean;
}

export interface TrapAvoidance {
  trapType: string;
  originalImpact: number;
  avoidedAmount: number;
  strategyUsed: string;
}
