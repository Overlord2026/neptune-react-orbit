
/**
 * Re-export unified tax types from central location
 */
import { 
  EquityFormState, 
  EquityCompEvent, 
  DeferralEvent, 
  YearlyTaxImpact, 
  TaxImpactResult 
} from '../../../../../types/tax/equityTypes';
import {
  TaxInput, 
  TaxResult, 
  TaxScenario 
} from '../../../../../types/tax/taxCalculationTypes';
import { FilingStatusType } from '../../../../../types/tax/filingTypes';

export type { 
  EquityFormState, 
  EquityCompEvent, 
  DeferralEvent, 
  YearlyTaxImpact, 
  TaxImpactResult,
  TaxInput, 
  TaxResult, 
  TaxScenario,
  FilingStatusType
};
