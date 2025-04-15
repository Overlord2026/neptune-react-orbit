
/**
 * Type definitions for equity calculations
 */
import { TaxResult } from './taxCalculationTypes';

export type EquityType = 'NSO' | 'ISO' | 'RSU' | 'ESPP' | '';

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
  
  // Additional fields referenced in components
  exerciseStrategy?: 'full' | 'partial' | 'split';
  vestedShares?: number;
  partialShares?: number;
  strikePrice?: number;
  splitYears?: number;
  deferralStrategy?: 'next-year' | 'multi-year' | 'staggered';
  deferralYears?: number;
  
  // Additional fields referenced in context and steps
  employer?: string;
  shareCount?: number;
  sabbaticalYear?: number;
  retirementYear?: number;
  holdingPeriod?: 'unknown' | 'less-than-year' | 'more-than-year';
  
  // Multi-year approach fields
  year1Exercise?: number;
  year2Exercise?: number;
  year1Deferral?: number;
  year2Deferral?: number;
  
  // Optional fields with default values
  unvestedShares?: number;
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
  amtImpact?: number;
  incomeBracket?: string;
  nextBracket?: string;
  distanceToNextBracket?: number;
  stateTax?: number;
  federalTax?: number;
  equityIncome?: number;
}

// Equity compensation event
export interface EquityCompEvent {
  year: number;
  event: string;
  shares: number;
  income: number;
  tax: number;
  netProceeds: number;
  
  // Add missing fields referenced in components
  sharesExercised?: number;
  spread?: number;
}

// Deferral event
export interface DeferralEvent {
  year: number;
  event: string;
  amount: number;
  tax: number;
  netAmount: number;
  
  // Add additional fields referenced in components
  fromYear?: number;
  toYear?: number;
  taxSavings?: number;
  amountDeferred?: number;
  taxRate?: number;
  taxesSaved?: number;
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
  tax_data_is_current: boolean;
  year?: number;
  filing_status?: string;
}
