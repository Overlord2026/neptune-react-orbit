
/**
 * Unified type definitions for equity compensation
 */
import { StateCode } from "../../utils/stateTaxData";
import { TaxResult } from "./taxCalculationTypes";

// Unified Equity Type that covers all possible values
export type EquityType = "" | "NONE" | "NSO" | "ISO" | "RSU" | "ESPP" | "Other";

// Unified EquityFormState
export interface EquityFormState {
  // Basic Info
  equityType: EquityType;
  hasDeferredComp: boolean;
  employer: string;
  shareCount: number;
  bonusAmount: number;
  
  // Option Details
  strikePrice: number;
  fairMarketValue: number;
  vestedShares: number;
  unvestedShares: number;
  exerciseStrategy: "full" | "partial" | "split";
  partialShares: number;
  splitYears: number;
  
  // Deferral Strategy - unified to include all options
  deferralAmount: number;
  deferralStrategy: "next-year" | "multi-year" | "staggered";
  deferralYears: number;
  sabbaticalYear: number;
  retirementYear: number;
  
  // Planning Approach
  planningApproach: "single-year" | "multi-year";
  year1Exercise: number;
  year2Exercise: number;
  year1Deferral: number;
  year2Deferral: number;
  
  // ISO Specific
  holdingPeriod: "less-than-year" | "more-than-year" | "unknown";
  isDisqualifyingDisposition: boolean;
  
  // State tax properties
  includeStateTax?: boolean;
  residentState?: string;
  
  // IRMAA flag
  includeIrmaa?: boolean;
}

// Unified EquityCompEvent interface
export interface EquityCompEvent {
  year: number;
  type: EquityType;
  sharesExercised: number;
  spread: number;
  amtImpact: number;
  ordinaryIncome: number;
  isDisqualifyingDisposition?: boolean;
  // Add missing required fields
  incomeRecognized: number;
  taxRate: number;
  taxesPaid: number;
}

// Unified DeferralEvent interface
export interface DeferralEvent {
  fromYear: number;
  toYear: number;
  amount: number;
  year: number; // Added for compatibility
  amountDeferred: number; // Added for compatibility
  taxRate: number;
  taxesSaved: number;
  taxSavings?: number; // For backward compatibility
}

// Unified YearlyTaxImpact
export interface YearlyTaxImpact {
  year: number;
  ordinaryIncome: number;
  capitalGains: number;
  amtIncome: number;
  amtAdjustment: number;
  totalTax: number;
  taxWithoutStrategy: number;
  taxSavings: number;
  marginalRate: number;
  effectiveRate: number;
  taxableIncome: number;
  incomeBracket: string;
  nextBracket: string;
  distanceToNextBracket: number;
  irmaaImpact: boolean;
  equityIncome?: number;
  amtImpact?: number;
  stateTax?: number;
  federalTax?: number;
}

// Unified EquityScenario
export interface EquityScenario extends TaxResult {
  id?: string;
  type: string;
  formState?: EquityFormState;
  results?: YearlyTaxImpact[];
  amtImpact?: number;
  deferralBenefit?: number;
  scenario_name: string;
}

// Add TaxImpactResult type that was missing
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
