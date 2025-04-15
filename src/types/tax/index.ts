
/**
 * Central export file for all tax-related types
 */

// Use explicit named exports instead of star exports
export type { EquityType, EquityScenario, EquityCompEvent } from './equityTypes';
export type { FilingStatusType, LegacyFilingStatusType, W2Form, TaxReturnData } from './filingTypes';
export type { TaxInput, TaxResult, TaxScenario } from './taxCalculationTypes';
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
