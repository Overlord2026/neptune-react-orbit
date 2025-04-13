
/**
 * Default values for the equity form state
 */

import { EquityFormState } from '../types/EquityTypes';

export const defaultFormState: EquityFormState = {
  equityType: "",
  hasDeferredComp: false,
  employer: "",
  shareCount: 0,
  bonusAmount: 0,
  
  strikePrice: 0,
  fairMarketValue: 0,
  vestedShares: 0,
  unvestedShares: 0,
  exerciseStrategy: "full",
  partialShares: 0,
  splitYears: 2,
  
  deferralAmount: 0,
  deferralStrategy: "next-year",
  deferralYears: 2,
  sabbaticalYear: new Date().getFullYear() + 3,
  retirementYear: new Date().getFullYear() + 10,
  
  planningApproach: "single-year",
  year1Exercise: 0,
  year2Exercise: 0,
  year1Deferral: 0,
  year2Deferral: 0,
  
  // ISO Specific defaults
  holdingPeriod: "unknown",
  isDisqualifyingDisposition: false,
};
