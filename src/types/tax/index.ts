
/**
 * Central export file for all tax-related types
 */

// Use explicit named exports instead of star exports
export type { 
  EquityFormState, 
  EquityScenario, 
  EquityCompEvent, 
  DeferralEvent, 
  YearlyTaxImpact, 
  TaxImpactResult 
} from './equityTypes';

export type { 
  FilingStatusType, 
  LegacyFilingStatusType, 
  W2Form, 
  TaxReturnData, 
  Dependent, 
  FilingStep, 
  ItemizedDeductions 
} from './filingTypes';

export type { 
  TaxInput, 
  TaxResult, 
  TaxScenario 
} from './taxCalculationTypes';

export type { 
  RothConversionInput,
  RothConversionScenario, 
  YearlyConversionSummary,
  MultiYearScenarioData,
  YearlyResult,
  CharitableContribution,
  TrapAlert,
  ConversionStrategyType,
  TrapAvoidance
} from './rothConversionTypes';

// Export conversion function
export { convertLegacyFilingStatus } from './filingTypes';

// Export filing steps for navigation
export const FILING_STEPS = [
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'personal', label: 'Personal Info' },
  { id: 'income', label: 'Income' },
  { id: 'deductions', label: 'Deductions' },
  { id: 'review', label: 'Review' },
  { id: 'file', label: 'File Return' },
  { id: 'confirmation', label: 'Confirmation' }
];
