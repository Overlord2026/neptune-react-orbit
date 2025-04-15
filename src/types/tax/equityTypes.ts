
/**
 * Type definitions for equity calculations
 */
import { TaxResult } from './taxCalculationTypes';

export type EquityType = 'NSO' | 'ISO' | 'RSU';

// Form state for equity calculations
export interface EquityFormState {
  equityType?: EquityType;
  grantedShares?: number;
  exercisedShares?: number;
  grantPrice?: number;
  fairMarketValue?: number;
  isDisqualifyingDisposition?: boolean;
  hasDeferredComp?: boolean;
  bonusAmount?: number;
  deferralAmount?: number;
  deferralPeriod?: number;
  deferralGrowthRate?: number;
  planningApproach?: 'single-year' | 'multi-year';
  includeAMT?: boolean;
  baseIncome?: number;
  filingStatus?: 'single' | 'married_joint' | 'married_separate' | 'head_of_household';
  state?: string;
  includeStateTax?: boolean;
  residentState?: string;
  
  // Add missing fields referenced in components
  exerciseStrategy?: 'full' | 'partial' | 'split';
  vestedShares?: number;
  partialShares?: number;
  strikePrice?: number;
  splitYears?: number;
  deferralStrategy?: 'single-year' | 'multi-year';
}

// Yearly impact of tax events
export interface YearlyTaxImpact {
  year: number;
  ordinaryIncome: number;
  totalTax: number;
  marginalRate: number;
  effectiveRate: number;
  netCash: number;
  
  // Add missing fields referenced in components
  taxSavings?: number;
  taxWithoutStrategy?: number;
  irmaaImpact?: boolean;
  amtAdjustment?: number;
  incomeBracket?: string;
  nextBracket?: string;
  distanceToNextBracket?: number;
  stateTax?: number;
  federalTax?: number;
}

// Equity compensation event
export interface EquityCompEvent {
  year: number;
  event: string;
  shares: number;
  income: number;
  tax: number;
  netProceeds: number;
  
  // Add missing field referenced in components
  sharesExercised?: number;
}

// Deferral event
export interface DeferralEvent {
  year: number;
  event: string;
  amount: number;
  tax: number;
  netAmount: number;
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
}

// Equity scenario
export interface EquityScenario extends TaxResult {
  type: string;
  scenario_name: string;
  formState: EquityFormState;
  results: YearlyTaxImpact[];
  amtImpact: number;
  deferralBenefit: number;
  // Added missing fields that are referenced in the code
  standard_deduction: number;
  federal_tax: number;
  brackets: any[];
  updated_at: Date;
}
