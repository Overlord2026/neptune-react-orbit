
import { FilingStatusType } from './filingTypes';
import { StateCode } from '@/utils/stateTaxData';

export interface RothConversionInput {
  year: number;
  filing_status: FilingStatusType;
  total_income: number;
  ira_balance: number;
  roth_conversion_amount: number;
  tax_rate: number;
  current_age: number;
  retirement_age: number;
  investment_return: number;
}

export interface YearlyConversionSummary {
  year: number;
  age: number;
  traditional_ira_balance: number;
  roth_ira_balance: number;
  conversion_amount: number;
  tax_on_conversion: number;
  total_balance: number;
}

export interface RothConversionScenario {
  id: string;
  name: string;
  input: RothConversionInput;
  yearly_summary: YearlyConversionSummary[];
  total_taxes_paid: number;
  ending_traditional_balance: number;
  ending_roth_balance: number;
  ending_total_balance: number;
  created_at: Date;
  is_active: boolean;
}

export interface CharitableContribution {
  year: number;
  amount: number;
  type: string;
  taxDeduction: number;
  description?: string;
  isQcd?: boolean;
  isBunching?: boolean;
  recipient?: string;
}

export type ConversionStrategyType = 'fixed' | 'partial' | 'bracket_fill' | 'tax_efficient' | 'custom';

export interface TrapAlert {
  id: string;
  name: string;
  description: string;
  impact: number;
  year: number;
  threshold: number;
  amount: number;
  severity: 'low' | 'medium' | 'high';
  type?: string;
  message?: string;
}

export interface TrapAvoidance {
  id: string;
  name: string;
  description: string;
  taxSavings: number;
  type?: string;
}

export interface YearlyResult {
  year: number;
  age: number;
  spouseAge?: number;
  filingStatus: FilingStatusType;
  income: number;
  spouseIncome?: number;
  totalIncome: number;
  irmaaImpact: boolean;
  socialSecurityTax?: number;
  rmds?: number;
  spouseRmds?: number;
  conversionAmount: number;
  traditionalIraBalance: number;
  rothIraBalance: number;
  spouseTraditionalIraBalance?: number;
  spouseRothIraBalance?: number;
  totalTraditionalBalance: number;
  totalRothBalance: number;
  totalRetirementBalance: number;
  taxableIncome?: number;
  effectiveTaxRate?: number;
  taxWithoutConversion?: number;
  taxWithConversion?: number;
  taxOnConversion?: number;
  marginalRate?: number;
  stateTax?: number;
  federalTax?: number;
  totalTax?: number;
  brackets?: Array<{ min: number; max: number; rate: number; }>;
  rmdAmount?: number;
  spouseRmdAmount?: number;
  charitableContribution?: any;
  warnings?: any[];
  cumulativeTaxPaid?: number;
  cumulativeTaxSaved?: number;
  traditionalScenarioBalance?: number;
  rothScenarioBalance?: number;
  breakEvenYear?: boolean;
  mfsComparison?: any;
  spouseConversionAmount?: number;
  effectiveRate?: number;
}

export interface MultiYearScenarioData {
  startAge: number;
  startYear: number;  // Made non-optional since it's essential
  numYears: number;   // Made non-optional since it's essential
  traditionalIRABalance: number;
  traditionalIRAStartBalance: number;
  rothIRABalance: number;
  rothIRAStartBalance: number;
  inflationRate: number;
  investmentReturn: number;
  expectedAnnualReturn: number;
  filingStatus: FilingStatusType;
  stateIncomeTax: number;
  baseAnnualIncome: number;
  conversionStrategy: ConversionStrategyType;
  fixedConversionAmount: number;
  includeSpouse: boolean;
  spouseAge: number;
  spouseTraditionalIRABalance: number;
  spouseRothIRABalance: number;
  spouseTraditionalIRAStartBalance: number;
  spouseRothIRAStartBalance: number;
  spouseBaseAnnualIncome: number;
  rmdStartAge: number;
  spouseRmdStartAge: number;
  includeRMDs: boolean;
  includeIrmaa: boolean;
  
  isInCommunityPropertyState?: boolean;
  splitCommunityIncome?: boolean;
  assumedDeathYear?: number;
  spouseAssumedDeathYear?: number;
  isQcd?: boolean;
  useCharitablePlanning?: boolean;
  charitableContributions?: CharitableContribution[];
  includeStateTax?: boolean;
  residentState?: StateCode;
  futureResidentState?: StateCode;
  stateRelocationYear?: number;
  compareMfjVsMfs?: boolean; 
  beneficiaryAge?: number;
  beneficiaryIncomeTaxRate?: number;
  includeBeneficiary?: boolean;
  charitableAmount?: number;
  
  // Additional properties referenced in other files
  spouseFirstName?: string;
  spouseLastName?: string;
  combinedIRAApproach?: boolean;
  incomeGrowthRate?: number;
}
