
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

// Import from the types folder to avoid circular dependencies
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
