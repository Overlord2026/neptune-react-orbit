import { FilingStatusType } from './filingTypes';

/**
 * Types for Roth conversion calculations
 */
export interface MultiYearScenarioData {
  startYear: number;
  startAge: number;
  numYears: number;
  filingStatus: FilingStatusType;
  traditionalIRAStartBalance: number;
  rothIRAStartBalance: number;
  baseAnnualIncome: number;
  rmdStartAge: number;
  assumedGrowthRate: number;
  conversionStrategy?: string;
  maxBracket?: number;
  maxAnnualConversion?: number;
  charitableContributions?: boolean;
  charitableAmount?: number;
  useQcd?: boolean;
  useCharitableBunching?: boolean;
  bunchingFrequency?: number;
  includeSpouse?: boolean;
  spouseAge?: number;
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
  includeStateTax?: boolean;
  residentState?: string;
  stateRelocationYear?: number;
  futureResidentState?: string;
}

export interface CharitableContribution {
  amount: number;
  useQcd: boolean;
  isBunching: boolean;
  standardDeduction?: number;
  itemizedDeduction?: number;
  isItemizing?: boolean;
  taxSavings?: number;
  trapAvoidance?: { type: string; savings: number }[];
}

export interface YearlyResult {
  year: number;
  age: number;
  traditionaIraBalance?: number; // Include old property name for backward compatibility
  traditionalIraBalance: number;
  rothIraBalance: number;
  conversionAmount: number;
  rmdAmount: number;
  taxableIncome: number;
  totalTax: number;
  marginalRate: number;
  effectiveRate: number;
  warnings: { 
    type: string; 
    message: string; 
    severity: 'low' | 'medium' | 'high';
    trapType: string;
  }[];
  cumulativeTaxPaid: number;
  cumulativeTaxSaved: number;
  traditionalScenarioBalance: number;
  rothScenarioBalance: number;
  breakEvenYear: boolean;
  
  // Spouse related results (if applicable)
  spouseAge?: number;
  spouseTraditionalIraBalance?: number;
  spouseRothIraBalance?: number;
  spouseConversionAmount?: number;
  spouseRmdAmount?: number;
  
  // Filing info
  filingStatus: FilingStatusType;
  income: number;
  spouseIncome?: number;
  totalIncome: number;
  
  // MFS comparison results (if applicable)
  mfsComparison?: {
    mfjTotalTax: number;
    spouse1Tax: number;
    spouse2Tax: number;
    combinedMfsTax: number;
    taxDifference: number;
  };
  
  // State tax info
  stateCode?: string;
  stateTax?: number;
  
  // Other required properties
  irmaaImpact: boolean;
  totalTraditionalBalance: number;
  totalRothBalance: number;
  totalRetirementBalance: number;
  
  // Charitable contribution impact
  charitableContribution: CharitableContribution;
}
