
// This file is maintained for backward compatibility
// It simply re-exports from the new modular structure

import { 
  TaxTrapInput, 
  TaxTrapResult, 
  TaxTrapWarning, 
  checkTaxTraps,
  saveTaxTrapResults
} from './taxTraps';

export {
  checkTaxTraps,
  saveTaxTrapResults,
  type TaxTrapInput,
  type TaxTrapResult,
  type TaxTrapWarning
};

// Re-export individual functions for direct access if needed
export { calculateTaxableSocialSecurity } from './taxTraps/socialSecurityChecker';
export { checkIRMAASurcharges } from './taxTraps/irmaaChecker';
export { checkCapitalGainsRate } from './taxTraps/capitalGainsChecker';
export { checkACASubsidyImpact } from './taxTraps/acaChecker';
