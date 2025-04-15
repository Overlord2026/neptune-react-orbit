
/**
 * Re-export unified tax scenario types from central location
 */
import { 
  EquityFormState, 
  YearlyTaxImpact, 
  EquityCompEvent, 
  DeferralEvent, 
  TaxImpactResult,
  EquityScenario 
} from '../../types/tax/equityTypes';
import { 
  TaxInput, 
  TaxResult, 
  TaxScenario 
} from '../../types/tax/taxCalculationTypes';

export type { 
  EquityFormState, 
  YearlyTaxImpact, 
  EquityCompEvent, 
  DeferralEvent, 
  TaxImpactResult,
  EquityScenario,
  TaxInput, 
  TaxResult, 
  TaxScenario 
};
