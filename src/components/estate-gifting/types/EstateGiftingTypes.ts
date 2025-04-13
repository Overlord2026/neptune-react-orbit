
export type EstateGiftingData = {
  // Basic Information
  netWorth: number;
  estateExemption: number;
  aboveThreshold: boolean;
  
  // Gifting Strategy
  useAnnualGifts: boolean;
  numberOfDonees: number;
  lifetimeGiftsUsed: number;
  giftingStrategy: 'lump-sum' | 'annual';
  lumpSumAmount: number;
  
  // Inheritance Scenario
  yearOfPassing: number;
  growthRate: number;
  useTrustApproach: boolean;
  lifeCycleStage: 'young-adult' | 'mid-career' | 'pre-retirement' | 'retirement';
  trustType?: 'none' | 'revocable' | 'ilit' | 'grat' | 'slat' | 'dynasty';
  trustReductionFactor: number;
  
  // Calculations (will be computed)
  noGiftingTax: number;
  giftingTax: number;
  taxSavings: number;
  heirsBenefit: number;
  
  // Multi-year plan data
  multiYearPlanImported: boolean;
  finalMultiYearBalance?: number;
};
