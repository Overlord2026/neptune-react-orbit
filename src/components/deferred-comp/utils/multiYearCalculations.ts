
/**
 * Multi-year tax impact calculations for equity compensation and deferrals
 * 
 * This file has been refactored into smaller modules. It now re-exports
 * functionality from the multiYear directory.
 */

// Re-export the main functions from the refactored modules
export { 
  calculateMultiYearImpact, 
  getEquityEvents 
} from './multiYear';

// Re-export getDeferralEvents for use elsewhere
export { getDeferralEvents } from './deferralCalculations';
