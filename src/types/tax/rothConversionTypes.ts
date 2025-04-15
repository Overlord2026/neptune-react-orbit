/**
 * Type definitions for Roth conversion calculations
 */

import { FilingStatusType } from "./filingTypes";

export interface RothConversionInput {
  traditionalIraBalance: number;
  rothIraBalance: number;
  conversionAmount: number;
  currentAge: number;
  currentIncome: number;
  fillingStatus: FilingStatusType;
  includeStateTax?: boolean;
  stateOfResidence?: string;
  charitableContributions?: number;
  spouseAge?: number;
  takeLifetimeRMDs?: boolean;
  projectedRateOfReturn?: number;
  rmdStartAge?: number;
  withdrawalRate?: number;
  inflationRate?: number;
  lifeExpectancy?: number;
  spouseLifeExpectancy?: number;
  medicareStatus?: 'enrolled' | 'not-enrolled';
}

// Updates to add clarity to conversion strategies
export type ConversionStrategyType = 'immediate' | 'multi-year' | 'partial-bracket-fill' | 'lifetime' | 'opportunistic';

// Define tax trap alert type 
export interface TrapAlert {
  type: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  threshold?: number;
  impact?: number;
}

// Define trap avoidance strategy
export interface TrapAvoidance {
  trapType: string;
  strategy: string;
  amountToAdjust?: number;
  suggestedAction?: string;
  impact?: number;
}

export interface RothConversionScenario {
  id: string;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
  input: RothConversionInput;
  results: {
    tax_impact: {
      conversion_tax: number;
      marginal_rate: number;
      effective_rate: number;
    };
    long_term_benefit: {
      tax_free_growth: number;
      estate_tax_savings?: number;
      lifetime_tax_savings?: number;
    };
    rmd_impact?: {
      rmd_reduction: number;
      annual_rmd_before: number;
      annual_rmd_after: number;
    };
  };
  // Estate planning related fields
  is_estate_optimized?: boolean;
  estate_value?: number;
  beneficiary_tax_savings?: number;
  bracket_bumping_events?: Array<{
    year: number;
    event: string;
    amount: number;
  }>;
  
  // Add charitable contribution related fields
  charitable_contributions?: CharitableContribution[];
  charitable_benefit?: number;
}

export interface CharitableContribution {
  year: number;
  amount: number;
  isBunching?: boolean;
  useQcd?: boolean; // Added for compatibility
}

export interface YearlyConversionSummary {
  year: number;
  conversionAmount: number;
  taxableIncome: number;
  taxDue: number;
  marginalRate: number;
  effectiveRate: number;
  rothBalanceEndOfYear: number;
  traditionalBalanceEndOfYear: number;
  cumulativeTaxPaid: number;
  rmdAmount?: number;
}

export interface MultiYearScenarioData {
  startYear: number; // Added
  numYears: number; // Added
  filingStatus: FilingStatusType;
  includeSpouse?: boolean;
  spouseFirstName?: string;
  spouseLastName?: string;
  spouseAge?: number;
  spouseRmdStartAge?: number;
  spouseBaseAnnualIncome?: number;
  spouseTraditionalIRAStartBalance?: number;
  spouseRothIRAStartBalance?: number;
  isInCommunityPropertyState?: boolean;
  splitCommunityIncome?: boolean;
  compareMfjVsMfs?: boolean;
  combinedIRAApproach?: boolean;
  spouseAssumedDeathYear?: number;
  // Added for BeneficiaryStep
  includeBeneficiary?: boolean;
  beneficiaryAge?: number;
  beneficiaryIncomeTaxRate?: number;
  assumedDeathYear?: number;
  // Added for charitable integration
  useCharitablePlanning?: boolean;
  charitableContributions?: CharitableContribution[];
  dafBunching?: {
    enabled: boolean;
    bunchingYears: number;
    bunchingAmount: number;
  };
}

export interface YearlyResult {
  year: number;
  age: number;
  rothConversion: number;
  rothBalance: number;
  traditionalBalance: number;
  rmdAmount: number;
  taxableIncome: number;
  taxPaid: number;
  marginalRate: number;
  effectiveTaxRate: number;
  nextBracketThreshold?: number;
  bracketFillingPercentage?: number;
  charitableContributions?: number;
  netInvestmentIncome?: number;
}
