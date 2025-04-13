
// Define types for the Roth Conversion scenarios

export interface MultiYearScenarioData {
  startAge: number;
  startYear: number;
  numYears: number;
  filingStatus: 'single' | 'married' | 'married_separate' | 'head_of_household';
  
  traditionalIRAStartBalance: number;
  rothIRAStartBalance: number;
  expectedAnnualReturn: number;
  
  baseAnnualIncome: number;
  incomeGrowthRate: number;
  
  conversionStrategy: 'fixed' | 'bracket_12' | 'bracket_12_22';
  fixedConversionAmount?: number;
  
  includeRMDs: boolean;
  rmdStartAge: number;
  
  includeBeneficiary: boolean;
  assumedDeathYear?: number;
  beneficiaryAge: number;
  beneficiaryIncomeTaxRate: number;
  
  taxInflationAdjustment: boolean;
  
  // Spouse/Partner related data
  includeSpouse: boolean;
  spouseFirstName?: string;
  spouseLastName?: string;
  spouseAge?: number;
  spouseTraditionalIRAStartBalance?: number;
  spouseRothIRAStartBalance?: number;
  spouseBaseAnnualIncome?: number;
  spouseRmdStartAge?: number;
  spouseAssumedDeathYear?: number;
  
  // Combined vs. Separate handling
  combinedIRAApproach: boolean;
  
  // Community Property State
  isInCommunityPropertyState: boolean;
  splitCommunityIncome: boolean;
  
  // Compare MFJ vs MFS
  compareMfjVsMfs: boolean;
}

export interface YearlyResult {
  year: number;
  age: number;
  traditionalIRABalance: number;
  rothIRABalance: number;
  conversionAmount: number;
  rmdAmount: number;
  totalTax: number;
  marginalRate: number;
  warnings: any[];
  cumulativeTaxPaid: number;
  cumulativeTaxSaved: number;
  traditionalScenarioBalance: number;
  rothScenarioBalance: number;
  breakEvenYear: boolean;
  
  // Spouse related results (if applicable)
  spouseAge?: number;
  spouseTraditionalIRABalance?: number;
  spouseRothIRABalance?: number;
  spouseConversionAmount?: number;
  spouseRmdAmount?: number;
  
  // MFS comparison results (if applicable)
  mfsComparison?: {
    totalTax: number;
    savings: number;
  };
}
