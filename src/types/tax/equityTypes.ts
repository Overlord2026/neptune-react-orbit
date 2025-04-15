
export interface EquityCompEvent {
  year: number;
  equityType: string;
  sharesExercised: number;
  cashRequired: number;
  taxableIncome: number;
  event: "exercise" | "sale" | "lapse";
  type?: string;
  spread?: number;
  amtImpact?: number;
  ordinaryIncome?: number;
  isDisqualifyingDisposition?: boolean;
  incomeRecognized?: number;
  taxRate?: number;
  taxesPaid?: number;
  income?: number; // Added for compatibility
}

export interface DeferralEvent {
  year: number;
  amount: number;
  taxSavings: number;
  bracketBefore?: string;
  bracketAfter?: string;
  event?: string;
  tax?: number;
  netAmount?: number;
  fromYear?: number;
  toYear?: number;
  amountDeferred?: number;
  taxRate?: number;
  taxesSaved?: number;
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
  marginalRate?: number;
  effectiveRate?: number;
  equityIncome?: number;
  amtImpact?: number;
  amtIncome?: number;
  taxableIncome?: number;
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
  equityType: "NSO" | "ISO" | "RSU" | "ESPP" | "Other" | "none";
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
  deferralStrategy: "next-year" | "multi-year";
  deferralAmount: number;
  deferralPercentage: number;
  planningApproach: "single-year" | "multi-year";
  includeStateTax: boolean;
  residentState: string;
  
  // Additional properties needed by components
  vestedShares?: number;
  unvestedShares?: number;
  partialShares?: number;
  strikePrice?: number;
  fairMarketValue?: number;
  shareCount?: number;
  employer?: string;
  sharePrice?: number;
  numShares?: number;
  splitRatio?: number;
  sabbaticalYear?: number;
  retirementYear?: number;
  deferralYears?: number;
  year1Exercise?: number;
  year2Exercise?: number;
  year1Deferral?: number;
  year2Deferral?: number;
}

// Add the missing EquityScenario interface
export interface EquityScenario {
  id: string;
  name: string;
  formState: EquityFormState;
  result: TaxImpactResult;
  type: string;
  year: number;
  filing_status: string;
  total_income: number;
  agi: number;
  taxable_income: number;
  total_tax: number;
  ordinary_tax: number;
  capital_gains_tax: number;
  marginal_rate: number;
  marginal_capital_gains_rate: number;
  effective_rate: number;
  federal_tax: number;
  standard_deduction: number;
  brackets: any[];
  amtImpact: number;
  deferralBenefit: number;
  results: YearlyTaxImpact[];
  tax_data_is_current: boolean;
}
