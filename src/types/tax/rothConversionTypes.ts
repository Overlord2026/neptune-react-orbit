
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
  // Added properties for RMDCalculationStep
  includeRMDs?: boolean;
  // Added properties for BeneficiaryStep
  includeBeneficiary?: boolean;
  beneficiaryAge?: number;
  beneficiaryIncomeTaxRate?: number;
  assumedDeathYear?: number;
  spouseAssumedDeathYear?: number;
  // Added properties for other components
  traditionalIRABalance?: number; // For backward compatibility
  rothIRABalance?: number; // For backward compatibility
  expectedAnnualReturn?: number;
  incomeGrowthRate?: number;
  inflationRate?: number;
  investmentReturn?: number;
  includeIrmaa?: boolean;
  fixedConversionAmount?: number;
  // Added properties for charitable planning integration
  useCharitablePlanning?: boolean;
  dafBunching?: boolean;
  dafBunchingYears?: number;
}

export interface CharitableContribution {
  amount: number;
  useQcd: boolean;
  isBunching: boolean;
  standardDeduction?: number;
  itemizedDeduction?: number;
  isItemizing?: boolean;
  taxSavings?: number;
  trapAvoidance?: TrapAvoidance[];
  year?: number; // Added for charitable planning integration
  type?: string; // Added for charitable planning integration
  description?: string; // Added for compatibility
  isQcd?: boolean; // Added for compatibility
  taxDeduction?: number; // Added for compatibility
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
    mfjIrmaa?: number;
    spouse1Irmaa?: number;
    spouse2Irmaa?: number;
    combinedMfsIrmaa?: number;
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

// Add ConversionStrategyType for IncomeInformationCard
export type ConversionStrategyType = 'fixed' | 'bracket' | 'minimize' | 'maximize' | 'optimal';

// Add TrapAlert and TrapAvoidance types for compatibility with existing code
export interface TrapAlert {
  trapType: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  details: string;
  id?: string; // Added for compatibility
  threshold?: number; // Added for compatibility
  impact?: number; // Added for compatibility
}

export interface TrapAvoidance {
  type: string;
  savings: number;
  name?: string;
  description?: string;
  id?: string; // Added for compatibility
  taxSavings?: number; // Added for backward compatibility
}
