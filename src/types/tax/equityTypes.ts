
/**
 * Equity types for tax calculations
 */

import { FilingStatusType } from './filingTypes';

// Equity types
export type EquityType = "NSO" | "ISO" | "RSU" | "ESPP";

// Form state for equity compensation
export interface EquityFormState {
  // Basic information
  bonusAmount: number;
  equityType: EquityType | "none";
  hasDeferredComp: boolean;
  includeStateTax: boolean;
  residentState?: string;
  employer?: string;
  
  // Equity details
  sharePrice: number;
  grantPrice: number;
  numShares: number;
  vestedShares: number;
  partialShares: number;
  shareCount?: number;
  fairMarketValue: number;
  strikePrice: number;
  isDisqualifyingDisposition: boolean;
  holdingPeriod?: number;
  
  // Strategy options
  deferralAmount: number;
  deferralStrategy: "next-year" | "multi-year";
  deferralYears?: number;
  exerciseStrategy: "full" | "partial" | "split";
  splitYears?: number;
  splitRatio?: number;
  planningApproach: "single-year" | "multi-year";
  
  // Additional planning options
  sabbaticalYear?: number;
  retirementYear?: number;
  
  // Multi-year specific fields
  year1Exercise?: number;
  year2Exercise?: number;
  year1Deferral?: number;
  year2Deferral?: number;
}

// Equity scenario
export interface EquityScenario {
  id: string;
  name: string;
  formState: EquityFormState;
  result: TaxImpactResult;
  scenario_name?: string;
  type?: string;
  year?: number;
  filing_status?: FilingStatusType;
  total_income?: number;
  agi?: number;
  taxable_income?: number;
  total_tax?: number;
  ordinary_tax?: number;
  capital_gains_tax?: number;
  marginal_rate?: number;
  marginal_capital_gains_rate?: number;
  effective_rate?: number;
  federal_tax?: number;
  standard_deduction?: number;
  brackets?: any[];
  amtImpact?: number;
  deferralBenefit?: number;
  results?: YearlyTaxImpact[];
  tax_data_is_current?: boolean;
}

// Equity compensation event
export interface EquityCompEvent {
  year: number;
  sharesExercised: number;
  income: number;
  tax: number;
  type?: string;
  isDisqualifyingDisposition?: boolean;
  spread?: number;
  ordinaryIncome?: number;
}

// Deferral event
export interface DeferralEvent {
  year: number;
  amount: number;
  taxSavings?: number;
  fromYear?: number;
  toYear?: number;
  event?: string;
}

// Yearly tax impact
export interface YearlyTaxImpact {
  year: number;
  ordinaryIncome: number;
  capitalGains: number;
  amtIncome?: number;
  amtAdjustment?: number;
  amtImpact?: number;
  taxableIncome: number;
  marginalRate: number;
  effectiveRate: number;
  totalTax: number;
  taxWithoutStrategy?: number;
  taxSavings?: number;
  incomeBracket?: string;
  nextBracket?: string;
  distanceToNextBracket?: number;
  irmaaImpact?: boolean;
  federalTax?: number;
  stateTax?: number;
  equityIncome?: number;
}

// Tax impact result
export interface TaxImpactResult {
  totalTaxableIncome: number;
  estimatedTax: number;
  amtIncome: number;
  amtImpact: number;
  deferralBenefit: number;
  spreadPerShare: number;
  exercisedShares: number;
  incomeFromExercise: number;
  deferredIncome: number;
  nextYearIncome: number;
  bracketImpact: boolean;
  bracketBefore: string;
  bracketAfter: string;
  multiYearImpact: YearlyTaxImpact[];
  equityEvents: EquityCompEvent[];
  deferralEvents: DeferralEvent[];
  federal_tax?: number;
  state_tax?: number;
  updated_at?: Date;
  standard_deduction?: number;
  brackets?: any[];
}
