
/**
 * Re-export all types from EquityTypes
 */

// Import types from EquityTypes.ts
import { 
  YearlyTaxImpact as EquityTypesYearlyTaxImpact,
  EquityType, 
  EquityFormState as EquityTypesFormState, 
  EquityCompEvent as EquityTypesCompEvent, 
  DeferralEvent as EquityTypesDeferralEvent 
} from './EquityTypes';

// Re-export the expanded types
export type { EquityType };

// Merge the two versions of EquityFormState with the expanded type
export interface EquityFormState extends EquityTypesFormState {
  equityType: EquityType;
  // Modify the deferral strategy to include all possible values
  deferralStrategy: "next-year" | "staggered" | "multi-year";
}

// Merge the two versions of EquityCompEvent
export interface EquityCompEvent extends EquityTypesCompEvent {
  // Add missing properties from original types.ts
  incomeRecognized: number;
  taxRate: number;
  taxesPaid: number;
}

// Merge the two versions of DeferralEvent
export interface DeferralEvent extends EquityTypesDeferralEvent {
  year: number;
  amountDeferred: number;
  taxRate: number;
  taxesSaved: number;
}

// Merge the two versions of YearlyTaxImpact
export interface YearlyTaxImpact extends EquityTypesYearlyTaxImpact {
  // Add additional properties needed by components
  taxSavings: number;
  taxWithoutStrategy: number;
  incomeBracket: string;
  nextBracket: string;
  distanceToNextBracket: number;
}
