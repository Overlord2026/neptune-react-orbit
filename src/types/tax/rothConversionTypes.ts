
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

// Multi-Year Scenario Data
export interface MultiYearScenarioData {
  startYear: number;
  startAge: number;
  numYears: number;
  traditionalIRAStartBalance: number;
  rothIRAStartBalance: number;
  baseAnnualIncome: number;
  incomeGrowthRate: number;
  expectedAnnualReturn: number;
  filingStatus: FilingStatusType;
  conversionStrategy: ConversionStrategyType;
  fixedConversionAmount?: number;
  includeSpouse?: boolean;
  spouseAge?: number;
  spouseBaseAnnualIncome?: number;
  spouseTraditionalIRAStartBalance?: number;
  spouseRothIRAStartBalance?: number;
  includeRMDs?: boolean;
  rmdStartAge?: number;
  spouseRmdStartAge?: number;
  includeBeneficiary?: boolean;
  beneficiaryAge?: number;
  beneficiaryIncomeTaxRate?: number;
  assumedDeathYear?: number;
  spouseAssumedDeathYear?: number;
  compareMfjVsMfs?: boolean;
  isInCommunityPropertyState?: boolean;
  splitCommunityIncome?: boolean;
  useCharitablePlanning?: boolean;
  charitableContributions?: CharitableContribution[];
  dafBunching?: {
    enabled: boolean;
    bunchingYears: number;
    bunchingAmount: number;
  };
}

// Yearly Result for Multi-Year Scenarios
export interface YearlyResult {
  year: number;
  age: number;
  traditionalIRABalance: number;
  rothIRABalance: number;
  conversionAmount: number;
  rmdAmount: number;
  totalTax: number;
  marginalRate: number;
  effectiveRate: number;
  warnings: TrapAlert[];
  cumulativeTaxPaid: number;
  cumulativeTaxSaved: number;
  traditionalScenarioBalance: number;
  rothScenarioBalance: number;
  breakEvenYear?: boolean;
  spouseAge?: number;
  spouseTraditionalIRABalance?: number;
  spouseRothIRABalance?: number;
  spouseConversionAmount?: number;
  spouseRmdAmount?: number;
  mfsComparison?: {
    mfjTotalTax: number;
    spouse1Tax: number;
    spouse2Tax: number;
    combinedMfsTax: number;
    taxDifference: number;
  };
  charitableContribution?: {
    amount: number;
    useQcd: boolean;
    isBunching: boolean;
    standardDeduction: number;
    itemizedDeduction: number;
    isItemizing: boolean;
    taxSavings: number;
    trapAvoidance?: {
      title: string;
      description: string;
      savings: number;
    }[];
  };
  communityPropertySplit?: {
    originalPrimaryIncome: number;
    originalSpouseIncome: number;
    splitPrimaryIncome: number;
    splitSpouseIncome: number;
  };
}

// Charitable Contribution
export interface CharitableContribution {
  year: number;
  amount: number;
  useQcd: boolean;
  isBunching?: boolean;
}

// Tax trap alert type
export interface TrapAlert {
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  trapType: string;
}

// Conversion strategy type
export type ConversionStrategyType = 'fixed' | 'bracket_12' | 'bracket_22' | 'bracket_12_22';
