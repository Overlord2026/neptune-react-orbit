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
}

export interface YearlyResult {
  year: number;
  income?: number;
  taxableIncome?: number;
  conversionAmount?: number;
  federalTax?: number;
  stateTax?: number;
  totalTax?: number;
  warnings?: TrapAlert[];
  mfsComparison?: any;
}

export type ConversionStrategyType = 'bracketed' | 'fixed' | 'dynamic';
export type CharitableContribution = {
  year: number;
  amount: number;
};
