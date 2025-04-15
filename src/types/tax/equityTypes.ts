
/**
 * Types for equity calculations
 */
export interface EquityFormState {
  // Basic information
  bonusAmount: number;
  equityType: "none" | "NSO" | "ISO" | "RSU";
  hasDeferredComp: boolean;
  includeStateTax: boolean;
  residentState?: string;
  employer: string;
  
  // Equity details
  sharePrice: number;
  grantPrice: number;
  numShares: number;
  vestedShares: number;
  partialShares: number;
  shareCount: number;
  fairMarketValue: number;
  strikePrice: number;
  isDisqualifyingDisposition: boolean;
  holdingPeriod: number;
  
  // Strategy options
  deferralAmount: number;
  deferralStrategy: "next-year" | "multi-year" | "retirement";
  deferralYears: number;
  exerciseStrategy: "full" | "partial" | "staggered";
  splitYears: number;
  splitRatio: number;
  planningApproach: "single-year" | "multi-year";
  
  // Additional planning options
  sabbaticalYear?: number;
  retirementYear?: number;
  
  // Multi-year specific fields
  year1Exercise: number;
  year2Exercise: number;
  year1Deferral: number;
  year2Deferral: number;
}

export interface YearlyTaxImpact {
  year: number;
  income: number;
  tax: number;
  effectiveRate: number;
  marginalRate: number;
  stateTax?: number;
  federalTax?: number;
}

export interface EquityCompEvent {
  year: number;
  type: "exercise" | "vest" | "hold" | "sell";
  shareCount: number;
  sharePrice: number;
  strikePrice?: number;
  income: number;
  tax: number;
  equityType: "NSO" | "ISO" | "RSU";
  description: string;
  amtImpact?: number;
}

export interface DeferralEvent {
  year: number;
  type: "defer" | "receive";
  amount: number;
  description: string;
  tax?: number;
}

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
  bracketBefore: number;
  bracketAfter: number;
  multiYearImpact: YearlyTaxImpact[];
  equityEvents: EquityCompEvent[];
  deferralEvents: DeferralEvent[];
}
