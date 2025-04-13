
export interface MultiYearScenarioData {
  startAge: number;
  startYear: number;
  numYears: number;
  filingStatus: 'single' | 'married' | 'head_of_household' | 'married_separate';
  traditionalIRAStartBalance: number;
  rothIRAStartBalance: number;
  expectedAnnualReturn: number;
  baseAnnualIncome: number;
  incomeGrowthRate: number;
  conversionStrategy: 'fixed' | 'bracket_12' | 'bracket_22';
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
  
  // IRA approach
  combinedIRAApproach?: boolean;
  
  // Community property
  isInCommunityPropertyState?: boolean;
  splitCommunityIncome?: boolean;
  
  // Compare MFJ vs MFS
  compareMfjVsMfs?: boolean;
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
  cumulativeTaxPaid: number;
  cumulativeTaxSaved: number;
  breakEvenYear?: boolean;
  warnings: {
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
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
}

export type RuleWarning = {
  id: string;
  title: string;
  description: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
};
