export interface EquityFormState {
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
}

export interface EquityCompEvent {
  year: number;
  sharesExercised: number;
  incomeRecognized: number;
  taxRate: number;
  taxesPaid: number;
}

export interface DeferralEvent {
  year: number;
  amountDeferred: number;
  taxRate: number;
  taxesSaved: number;
}

export interface YearlyTaxImpact {
  year: number;
  ordinaryIncome: number;
  capitalGains: number;
  totalTax: number;
  marginalRate: number;
  
  // Add state tax properties
  stateTax?: number;
  federalTax?: number;
}
