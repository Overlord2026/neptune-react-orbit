/**
 * Types for equity compensation and deferral calculations
 */

export type EquityType = "NSO" | "ISO" | "RSU" | "ESPP" | "Other";

export interface EquityFormState {
  // Basic Info
  equityType: EquityType | "";
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
  
  // Deferral Strategy
  deferralAmount: number;
  deferralStrategy: "next-year" | "multi-year";
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

export interface YearlyTaxImpact {
  year: number;
  ordinaryIncome: number;
  amtIncome: number;
  amtAdjustment: number;
  totalTax: number;
  taxWithoutStrategy: number;
  taxSavings: number;
  marginalRate: number;
  incomeBracket: string;
  nextBracket: string;
  distanceToNextBracket: number;
  irmaaImpact: boolean;
  
  // Required fields to fix TypeScript errors
  capitalGains: number;
  effectiveRate: number;
  taxableIncome: number;
  equityIncome?: number;
  amtImpact?: number;
  stateTax?: number;
  federalTax?: number;
}

export interface EquityCompEvent {
  year: number;
  type: EquityType;
  sharesExercised: number;
  spread: number;
  amtImpact: number;
  ordinaryIncome: number;
  isDisqualifyingDisposition?: boolean;
}

export interface DeferralEvent {
  fromYear: number;
  toYear: number;
  amount: number;
  taxSavings?: number;
}
