
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

export type ConversionStrategyType = 'fixed' | 'bracket-fill' | 'progressive' | 'custom';

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
  startAge: number;
  traditionalIRABalance: number;
  rothIRABalance: number;
  yearsToProject: number;
  inflationRate: number;
  investmentReturn: number;
  conversionStrategy: ConversionStrategyType;
  maxAnnualConversion: number;
  initialTaxableIncome: number;
  filingStatus: string;
  stateIncomeTax: number;
  includeSpouse: boolean;
  spouseAge: number;
  spouseTraditionalIRABalance: number;
  spouseRothIRABalance: number;
  includeRMDs: boolean;
  rmdStartAge: number;
  spouseRmdStartAge: number;
  includeCharitableGiving: boolean;
  charitableStrategy: string;
  charitableAmount: number;
  charitableFrequency: string;
  includeBeneficiary: boolean;
  beneficiaryAge: number;
  beneficiaryIncomeTaxRate: number;
  trapAvoidanceStrategies: TrapAvoidance[];
}

export interface CharitableContribution {
  year: number;
  amount: number;
  strategy: string;
  taxSavings: number;
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
