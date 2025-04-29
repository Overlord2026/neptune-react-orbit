
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
  MultiYearScenarioData,
  YearlyResult,
  CharitableContribution,
  CharitableContributionImpact,
  ConversionStrategyType,
  TrapAlert,
  TrapAvoidance
} from './rothConversionTypes';

// Export conversion function
export { convertLegacyFilingStatus } from './filingTypes';

// Export filing steps for navigation
export { FILING_STEPS } from './filingTypes';
