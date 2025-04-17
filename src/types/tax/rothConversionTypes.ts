export interface MultiYearScenarioData {
  id?: string;
  name?: string;
  description?: string;
  startYear?: number;
  endYear?: number;
  conversionStrategy?: string;
  filingStatus?: string;
  traditionalIraBalance?: number;
  rothIraBalance?: number;
  income?: number;
  stateCode?: string;
  includeSpouse?: boolean;
  spouseAge?: number;
  userAge?: number;
  includeRMDs?: boolean;
  rmdStartAge?: number;
  includeCharitableContributions?: boolean;
  charitableContributionAmount?: number;
  beneficiaryAge?: number;
  includeBeneficiary?: boolean;

  baseAnnualIncome?: number;
  incomeGrowthRate?: number;
  startAge?: number;
  expectedAnnualReturn?: number;
  fixedConversionAmount?: number;

  spouseFirstName?: string;
  spouseLastName?: string;
  spouseBaseAnnualIncome?: number;
  spouseTraditionalIRAStartBalance?: number;
  spouseRothIRAStartBalance?: number;
  spouseRmdStartAge?: number;

  isInCommunityPropertyState?: boolean;
  splitCommunityIncome?: boolean;
  compareMfjVsMfs?: boolean;
  combinedIRAApproach?: boolean;

  beneficiaryIncomeTaxRate?: number;
  assumedDeathYear?: number;
  spouseAssumedDeathYear?: number;
  numYears?: number;

  useCharitablePlanning?: boolean;
  charitableAmount?: number;
  useQcd?: boolean;
  useCharitableBunching?: boolean;
  bunchingFrequency?: number;
  
  includeStateTax?: boolean;
  residentState?: string;
  stateRelocationYear?: number;
  futureResidentState?: string;
  
  traditionalIRAStartBalance?: number;
  rothIRAStartBalance?: number;
  investmentReturn?: number;
  inflationRate?: number;
  assumedGrowthRate?: number;
  includeIrmaa?: boolean;
}

export interface TrapAlert {
  year?: number;
  type: string;
  message: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
  trapType: string;
  title?: string;
  financial_impact?: number;
  remediation?: string;
  threshold?: number;
  impact?: number;
}

export interface TrapAvoidance {
  type: string;
  name: string;
  description: string;
  savings: number;
}

export interface YearlyResult {
  year: number;
  age?: number;
  income?: number;
  taxableIncome?: number;
  conversionAmount?: number;
  federalTax?: number;
  stateTax?: number;
  totalTax?: number;
  warnings?: TrapAlert[];
  mfsComparison?: any;
  
  rmdAmount?: number;
  spouseRmdAmount?: number;
  marginalRate?: number;
  traditionalIraBalance?: number;
  spouseTraditionalIraBalance?: number;
  rothIraBalance?: number;
  spouseRothIraBalance?: number;
  breakEvenYear?: boolean;
  
  spouseAge?: number;
  spouseConversionAmount?: number;
  filingStatus?: string;
  spouseIncome?: number;
  totalIncome?: number;
  irmaaImpact?: boolean;
  effectiveRate?: number;
  totalTraditionalBalance?: number;
  totalRothBalance?: number;
  totalRetirementBalance?: number;
  cumulativeTaxPaid?: number;
  cumulativeTaxSaved?: number;
  traditionalScenarioBalance?: number;
  rothScenarioBalance?: number;
  charitableContribution?: CharitableContributionImpact;
}

export type ConversionStrategyType = 'bracketed' | 'fixed' | 'dynamic';

export type CharitableContribution = {
  year: number;
  amount: number;
  useQcd?: boolean;
  isBunching?: boolean;
  type?: string;
  isQcd?: boolean;
  taxDeduction?: number;
  description?: string;
};

export interface CharitableContributionImpact {
  amount: number;
  useQcd?: boolean;
  isBunching?: boolean;
  standardDeduction?: number;
  itemizedDeduction?: number;
  isItemizing?: boolean;
  taxSavings?: number;
  trapAvoidance?: TrapAvoidance[];
}
