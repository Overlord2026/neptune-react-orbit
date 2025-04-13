
/**
 * Tax Data Utilities
 * 
 * Functions for managing tax data currency, versioning, and updates
 */

import { 
  checkTaxDataCurrency, 
  markTaxDataAsCurrent
} from './dataFeedUtils';

import { 
  getTaxDataVersionForScenario,
  hasMidYearUpdates,
  getMidYearUpdateWarning
} from './taxDataVersioning';

import { TaxDataCacheInfo } from './taxCalculatorTypes';
import { EquityScenario, fetchEquityScenarios } from './taxScenarioStorage';

/**
 * Pre-check if tax data is current before calculation
 * Returns information about data currency and when it was last updated
 */
export function checkTaxDataBeforeCalculation(
  sessionId: string = "default",
  cacheTimeoutMinutes: number = 15
): TaxDataCacheInfo {
  return checkTaxDataCurrency(sessionId, cacheTimeoutMinutes);
}

/**
 * Mark the user's session tax data as current (after they choose to refresh)
 */
export function refreshTaxData(sessionId: string = "default"): void {
  markTaxDataAsCurrent(sessionId);
}

/**
 * Get equity scenarios for integration with other tax planning tools
 */
export async function getEquityScenariosForTaxYear(taxYear: number): Promise<EquityScenario[]> {
  const scenarios = await fetchEquityScenarios();
  return scenarios.filter(scenario => {
    // Find scenarios relevant to the requested tax year
    if (scenario.results && Array.isArray(scenario.results)) {
      return scenario.results.some(result => result.year === taxYear);
    }
    return false;
  });
}

// Re-export for internal use
export { 
  getTaxDataVersionForScenario,
  hasMidYearUpdates,
  getMidYearUpdateWarning
};
