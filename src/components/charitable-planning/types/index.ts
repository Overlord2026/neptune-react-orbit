
/**
 * Re-export charitable planning types
 */

// Use 'export type' for re-exporting types when isolatedModules is enabled
export type {
  CharitableScenario,
  AnnualGiving,
  DafStrategy,
  QcdStrategy,
  CharitableRemainderTrust,
  YearlyPlanItem,
  MultiYearPlan,
  ResultsSummary
} from './CharitableTypes';

// Define missing types that were being re-exported
export interface CharitableInput {
  annualAmount: number;
  age: number;
  filingStatus: string;
  isItemizer: boolean;
}

export interface CharitableStrategy {
  type: string;
  name: string;
  description: string;
  isAvailable: boolean;
}

export interface CharitablePlanning {
  input: CharitableInput;
  strategies: CharitableStrategy[];
  selectedStrategy?: string;
}

export interface CharitablePlanningStep {
  id: string;
  title: string;
  description: string;
}

export interface DonationOption {
  id: string;
  name: string;
  description: string;
}

export type CrtType = "CRAT" | "CRUT";

export interface CrtInput {
  fundingAmount: number;
  payoutRate: number;
  trustTerm: number | "lifetime";
  beneficiaryAge: number;
  spouseBeneficiary: boolean;
  spouseAge?: number;
}

export interface CrtCalculationResult {
  charitableDeduction: number;
  annualPayout: number;
  remainderValue: number;
}

export interface QcdInput {
  amount: number;
  age: number;
  rmdAmount: number;
}

export interface QcdCalculationResult {
  taxSavings: number;
  irmaaImpact: boolean;
}

export interface DafInput {
  annualGiving: number;
  bunchingYears: number;
  bunchingAmount: number;
}

export interface DafCalculationResult {
  taxSavings: number;
  annualDeductions: { year: number; deduction: number }[];
}

export interface CharitablePlanningContext {
  state: CharitablePlanning;
  dispatch: (action: { type: CharitableActionType; payload?: any }) => void;
}

export type CharitableActionType = 
  | 'SET_ANNUAL_AMOUNT' 
  | 'SET_AGE' 
  | 'SET_FILING_STATUS'
  | 'SELECT_STRATEGY';

export interface CharitableState {
  input: CharitableInput;
  strategies: CharitableStrategy[];
  selectedStrategy?: string;
}

export type PlanningTimeframe = 'short-term' | 'medium-term' | 'long-term';
