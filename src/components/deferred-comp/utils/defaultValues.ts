
import { EquityFormState } from "@/types/tax/equityTypes";

/**
 * Default values for EquityFormState
 */
export const defaultEquityFormState: EquityFormState = {
  // Basic information
  bonusAmount: 0,
  equityType: "none",
  hasDeferredComp: false,
  includeStateTax: false,
  residentState: "",
  employer: "",
  
  // Equity details
  totalShares: 0,
  currentPrice: 0,
  grantPrice: 0,
  sharePrice: 0,
  numShares: 0,
  vestedShares: 0,
  partialShares: 0,
  shareCount: 0,
  fairMarketValue: 0,
  strikePrice: 0,
  isDisqualifyingDisposition: false,
  holdingPeriod: 0,
  
  // Strategy options
  exerciseStrategyType: "standard",
  exerciseStrategy: "full",
  exerciseAmount: 0,
  firstYearPercentage: 50,
  deferralAmount: 0,
  deferralPercentage: 0,
  deferralStrategy: "next-year",
  deferralYears: 2,
  splitYears: 2,
  splitRatio: 50,
  planningApproach: "single-year",
  
  // Additional planning options
  sabbaticalYear: undefined,
  retirementYear: undefined,
  
  // Multi-year specific fields
  year1Exercise: 0,
  year2Exercise: 0,
  year1Deferral: 0,
  year2Deferral: 0
};

/**
 * Get a fresh copy of the default form state
 */
export function getDefaultFormState(): EquityFormState {
  return { ...defaultEquityFormState };
}

// Alias for defaultFormState to maintain backward compatibility
export const defaultFormState = defaultEquityFormState;
