
/**
 * Re-export all multi-year calculation modules
 */

// Use explicit named exports instead of star exports
export { calculateMultiYearImpact } from './calculateMultiYearImpact';
export { getEquityEvents } from './equityEvents';

// Export named members from the modules
export { 
  calculateTaxForMultiYearEquity,
  applyTaxRatesForYear,
  determineDeferralTaxImpact
} from './taxCalculations';

export {
  integrateCharitableWithEquity,
  applyCharitableDeductions
} from './charitableIntegration';

// If any of these modules have default exports that need to be re-exported:
// export { default as TaxCalculations } from './taxCalculations';
// export { default as CharitableIntegration } from './charitableIntegration';
