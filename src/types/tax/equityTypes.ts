
export interface EquityCompEvent {
  year: number;
  equityType: string;
  sharesExercised: number;
  cashRequired: number;
  taxableIncome: number;
  event: "exercise" | "sale" | "lapse";
}

export interface DeferralEvent {
  year: number;
  amount: number;
  taxSavings: number;
  bracketBefore?: string;
  bracketAfter?: string;
}

export interface YearlyTaxImpact {
  year: number;
  ordinaryIncome: number;
  totalTax: number;
  incomeBracket: string;
  taxWithoutStrategy: number;
  taxSavings: number;
  amtAdjustment: number;
  irmaaImpact: boolean;
  distanceToNextBracket: number;
  nextBracket: string;
  stateTax?: number;
  federalTax?: number;
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
  bracketBefore: string;
  bracketAfter: string;
  multiYearImpact: YearlyTaxImpact[];
  equityEvents: EquityCompEvent[];
  deferralEvents: DeferralEvent[];
}

export interface EquityFormState {
  equityType: "NSO" | "ISO" | "RSU" | "ESPP" | "none";
  totalShares: number;
  grantPrice: number;
  currentPrice: number;
  exerciseStrategyType: string;
  exerciseStrategy: "full" | "partial" | "split";
  exerciseAmount: number;
  splitYears: number;
  firstYearPercentage: number;
  holdingPeriod: number; 
  isDisqualifyingDisposition: boolean;
  hasDeferredComp: boolean;
  bonusAmount: number;
  deferralStrategy: "fixed" | "percentage" | "multi-year";
  deferralAmount: number;
  deferralPercentage: number;
  planningApproach: "single-year" | "multi-year";
  includeStateTax: boolean;
  residentState: string;
}
