
export interface RothConversionInput {
  traditionalIRABalance: number;
  rothIRABalance: number;
  age: number;
  taxableIncome: number;
  filingStatus: string;
  years: number;
  conversionAmount: number;
  conversionStrategy: ConversionStrategyType;
  inflationRate?: number;
  investmentReturn?: number;
  rmdStartAge?: number;
  includeSpouse?: boolean;
  spouseAge?: number;
  spouseTraditionalIRABalance?: number;
  spouseRothIRABalance?: number;
  stateIncomeTax?: number;
}

export type ConversionStrategyType = 'fixed' | 'bracket-fill' | 'progressive' | 'custom' | 'bracket_12' | 'bracket_22' | 'bracket_12_22';

export interface RothConversionScenario {
  id: string;
  name: string;
  conversionInput: RothConversionInput;
  yearlyResults: YearlyResult[];
  createdAt: string;
  updatedAt: string;
}

export interface YearlyResult {
  year: number;
  age: number;
  spouseAge?: number;
  traditionalIRABalance: number;
  rothIRABalance: number;
  spouseTraditionalIRABalance?: number;
  spouseRothIRABalance?: number;
  conversionAmount: number;
  spouseConversionAmount?: number;
  rmdAmount: number;
  spouseRmdAmount?: number;
  taxableIncome: number;
  marginalRate: number;
  effectiveRate: number;
  totalTax: number;
  warnings: TrapAlert[];
  charitableContribution?: CharitableContribution;
  traditionalScenarioBalance: number;
  cumulativeTaxPaid?: number;
  cumulativeTaxSaved?: number;
  rothScenarioBalance?: number;
  breakEvenYear?: boolean;
  mfsComparison?: {
    mfjTotalTax: number;
    spouse1Tax: number;
    spouse2Tax: number;
    combinedMfsTax: number;
    taxDifference: number;
  };
}

export interface YearlyConversionSummary {
  year: number;
  age: number;
  conversions: number;
  totalTaxes: number;
  iraBalance: number;
  rothBalance: number;
  totalBalance: number;
}

export interface MultiYearScenarioData {
  // Basic information
  startAge: number;
  startYear?: number;
  numYears?: number;
  traditionalIRABalance: number;
  traditionalIRAStartBalance?: number;
  rothIRABalance: number;
  rothIRAStartBalance?: number;
  yearsToProject?: number;
  inflationRate: number;
  investmentReturn: number;
  expectedAnnualReturn?: number;
  
  // Conversion strategy
  conversionStrategy: ConversionStrategyType;
  maxAnnualConversion?: number;
  fixedConversionAmount?: number;
  
  // Income information
  initialTaxableIncome?: number;
  baseAnnualIncome?: number;
  incomeGrowthRate?: number;
  
  // Filing status
  filingStatus: string;
  stateIncomeTax: number;
  taxInflationAdjustment?: boolean;
  
  // Spouse information
  includeSpouse: boolean;
  spouseAge: number;
  spouseTraditionalIRABalance: number;
  spouseRothIRABalance: number;
  spouseTraditionalIRAStartBalance?: number;
  spouseRothIRAStartBalance?: number;
  spouseBaseAnnualIncome?: number;
  spouseFirstName?: string;
  spouseLastName?: string;
  
  // Filing options
  compareMfjVsMfs?: boolean;
  isInCommunityPropertyState?: boolean;
  splitCommunityIncome?: boolean;
  combinedIRAApproach?: boolean;
  
  // RMD information
  includeRMDs?: boolean;
  rmdStartAge: number;
  spouseRmdStartAge: number;
  
  // Charitable giving
  includeCharitableGiving?: boolean;
  charitableStrategy?: string;
  charitableAmount?: number;
  charitableFrequency?: string;
  useCharitablePlanning?: boolean;
  
  // Beneficiary information
  includeBeneficiary?: boolean;
  beneficiaryAge?: number;
  beneficiaryIncomeTaxRate?: number;
  assumedDeathYear?: number;
  spouseAssumedDeathYear?: number;
  
  // Medicare/IRMAA
  includeIrmaa?: boolean;
  
  // Tax trap avoidance
  trapAvoidanceStrategies?: TrapAvoidance[];
}

export interface CharitableContribution {
  year?: number;
  amount: number;
  strategy?: string;
  taxSavings?: number;
  isQcd?: boolean;
  isBunching?: boolean;
  useQcd?: boolean;
  years?: number[];
}

export interface TrapAlert {
  type: string;
  message: string;
  trapType?: string;
  severity: 'low' | 'medium' | 'high';
}

export interface TrapAvoidance {
  trapType: string;
  enabled: boolean;
  strategy: string;
}
