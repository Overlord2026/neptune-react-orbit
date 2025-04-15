
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
  residentState: undefined,
  employer: "",
  
  // Equity details
  sharePrice: 0,
  grantPrice: 0,
  numShares: 0,
  vestedShares: 0,
  partialShares: 0,
  shareCount: 0,
  fairMarketValue: 0,
  strikePrice: 0,
  isDisqualifyingDisposition: false,
  holdingPeriod: undefined,
  
  // Strategy options
  deferralAmount: 0,
  deferralStrategy: "next-year",
  deferralYears: 2,
  exerciseStrategy: "full",
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
