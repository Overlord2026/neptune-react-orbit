
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

// Re-export the types from EquityTypes.ts
export { EquityType };

// Merge the two versions of EquityFormState
export interface EquityFormState extends EquityTypesFormState {
  // Add missing properties from original types.ts
  equityType: "NSO" | "ISO" | "NONE" | "RSU" | "ESPP" | "Other" | "";
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
  // Add missing properties from original types.ts
  year: number;
  amountDeferred: number;
  taxRate: number;
  taxesSaved: number;
}

// Merge the two versions of YearlyTaxImpact
export interface YearlyTaxImpact extends EquityTypesYearlyTaxImpact {
  // All properties are already covered
}
