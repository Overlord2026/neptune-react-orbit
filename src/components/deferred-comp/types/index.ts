
/**
 * Re-export all types from EquityTypes
 */

export type { 
  YearlyTaxImpact,
  EquityType, 
  EquityFormState, 
  EquityCompEvent, 
  DeferralEvent 
} from './EquityTypes';

/**
 * Merging types from the original types.ts file to ensure compatibility
 */
export interface EquityFormState {
  // Basic Info
  equityType: "NSO" | "ISO" | "NONE";
  vestedShares: number;
  fairMarketValue: number;
  strikePrice: number;
  exerciseStrategy: "full" | "partial" | "split";
  partialShares: number;
  splitYears: number;
  isDisqualifyingDisposition: boolean;
  hasDeferredComp: boolean;
  bonusAmount: number;
  deferralAmount: number;
  deferralStrategy: "next-year" | "staggered";
  deferralYears: number;
  planningApproach: "single-year" | "multi-year";
  includeIrmaa: boolean;
  
  // Add state tax properties
  includeStateTax?: boolean;
  residentState?: string;
  
  // Additional properties from EquityTypes
  employer: string;
  shareCount: number;
  unvestedShares: number;
  sabbaticalYear: number;
  retirementYear: number;
  year1Exercise: number;
  year2Exercise: number;
  year1Deferral: number;
  year2Deferral: number;
  holdingPeriod: "less-than-year" | "more-than-year" | "unknown";
}

export interface EquityCompEvent {
  year: number;
  sharesExercised: number;
  incomeRecognized: number;
  taxRate: number;
  taxesPaid: number;
  
  // Additional properties from EquityTypes.EquityCompEvent
  type: "NSO" | "ISO" | "RSU" | "ESPP" | "Other";
  spread: number;
  amtImpact: number;
  ordinaryIncome: number;
  isDisqualifyingDisposition?: boolean;
}

export interface DeferralEvent {
  // From types.ts
  year: number;
  amountDeferred: number;
  taxRate: number;
  taxesSaved: number;
  
  // From EquityTypes.DeferralEvent
  fromYear: number;
  toYear: number;
  amount: number;
  taxSavings: number;
}

export interface YearlyTaxImpact {
  year: number;
  ordinaryIncome: number;
  capitalGains: number;
  totalTax: number;
  marginalRate: number;
  effectiveRate: number;
  equityIncome?: number;
  taxableIncome: number;
  amtImpact?: number;
  stateTax?: number;
  federalTax?: number;
  
  // Additional properties from EquityTypes.YearlyTaxImpact
  amtIncome: number;
  amtAdjustment: number;
  taxWithoutStrategy: number;
  taxSavings: number;
  incomeBracket: string;
  nextBracket: string;
  distanceToNextBracket: number;
  irmaaImpact: boolean;
}
