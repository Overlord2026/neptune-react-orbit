
/**
 * Re-export unified types for multi-year calculation modules
 */
import { TaxInput, TaxResult, TaxScenario } from '../../../../types/tax/taxCalculationTypes';
import { 
  EquityFormState, 
  EquityCompEvent, 
  DeferralEvent, 
  YearlyTaxImpact, 
  TaxImpactResult,
  EquityScenario
} from '../../../../types/tax/equityTypes';
import { FilingStatusType } from '../../../../types/tax/filingTypes';

// Re-export types
export type { 
  TaxInput, 
  TaxResult, 
  TaxScenario,
  EquityFormState, 
  EquityCompEvent, 
  DeferralEvent, 
  YearlyTaxImpact, 
  TaxImpactResult,
  EquityScenario,
  FilingStatusType
};
