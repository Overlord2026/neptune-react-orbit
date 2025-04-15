
/**
 * Unified type definitions for Roth conversion
 */

export type ConversionStrategyType =
  | "fixed"
  | "bracket_12"
  | "bracket_22"
  | "bracket_12_22";

export interface CharitableContribution {
  year?: number;
  amount: number;
  useQcd: boolean;
  isBunching?: boolean;
  standardDeduction: number;
  itemizedDeduction: number;
  isItemizing: boolean;
  taxSavings: number;
  qcdImpact?: number;
  trapAvoidance?: TrapAvoidance[];
}

export interface TrapAvoidance {
  type: string;
  title: string;
  description: string;
  savings: number;
}

export interface MultiYearScenarioData {
  startAge: number;
  startYear: number;
  numYears: number;
  filingStatus: 'single' | 'married_joint' | 'head_of_household' | 'married_separate';
  traditionalIRAStartBalance: number;
  rothIRAStartBalance: number;
  expectedAnnualReturn: number;
  baseAnnualIncome: number;
  incomeGrowthRate: number;
  conversionStrategy: ConversionStrategyType;
  fixedConversionAmount?: number;
  includeRMDs: boolean;
  rmdStartAge: number;
  includeBeneficiary: boolean;
  assumedDeathYear?: number;
  beneficiaryAge?: number;
  beneficiaryIncomeTaxRate?: number;
  taxInflationAdjustment: boolean;
  
  // Spouse-related fields
  includeSpouse?: boolean;
  spouseAge?: number;
  spouseTraditionalIRAStartBalance?: number;
  spouseRothIRAStartBalance?: number;
  spouseBaseAnnualIncome?: number;
  spouseRmdStartAge?: number;
  spouseFirstName?: string;
  spouseLastName?: string;
  spouseAssumedDeathYear?: number;
  
  // IRA approach
  combinedIRAApproach?: boolean;
  
  // Community property
  isInCommunityPropertyState?: boolean;
  splitCommunityIncome?: boolean;
  
  // Compare MFJ vs MFS
  compareMfjVsMfs?: boolean;
  
  // IRMAA surcharges
  includeIrmaa?: boolean;

  // Charitable contribution fields
  charitableContributions?: CharitableContribution[];
  useCharitablePlanning?: boolean;
  dafBunching?: {
    enabled: boolean;
    bunchingYears: number;
    bunchingAmount: number;
  };
  
  // Add state tax properties
  includeStateTax?: boolean;
  residentState?: string;
  stateRelocationYear?: number;
  futureResidentState?: string;
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
  totalTax: number;
  marginalRate: number;
  effectiveRate: number;
  traditionalScenarioBalance: number;
  rothScenarioBalance?: number;
  cumulativeTaxPaid: number;
  cumulativeTaxSaved: number;
  breakEvenYear?: boolean;
  warnings: {
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
    trapType?: string;
  }[];
  
  // MFS comparison data
  mfsComparison?: {
    mfjTotalTax: number;
    spouse1Tax: number;
    spouse2Tax: number;
    combinedMfsTax: number;
    taxDifference: number;
    mfjIrmaa?: number;
    spouse1Irmaa?: number;
    spouse2Irmaa?: number;
    combinedMfsIrmaa?: number;
  };
  
  // Community property split
  communityPropertySplit?: {
    originalPrimaryIncome: number;
    originalSpouseIncome: number;
    splitPrimaryIncome: number;
    splitSpouseIncome: number;
  };

  // Charitable contribution data
  charitableContribution?: CharitableContribution;
}

export interface TrapAlert {
  title: string;
  message: string;
  description?: string;
  type: string;
  severity: "info" | "warning" | "critical";
  trapType: string;
  details?: any;
}

export type RuleWarning = {
  id: string;
  title: string;
  description: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  trapType?: string;
};
