
/**
 * State tax calculation utilities
 */
import { StateCode, STATE_TAX_RATES } from '@/utils/stateTaxData';
import { MultiYearScenarioData } from '@/types/tax/rothConversionTypes';

/**
 * Calculate state tax based on input parameters
 */
export const calculateStateTax = (
  taxableIncome: number,
  year: number,
  scenarioData: MultiYearScenarioData
): number => {
  // If state tax is not included, return 0
  if (!scenarioData.includeStateTax) {
    return 0;
  }

  // Get the applicable state for this tax year
  let stateCode = determineStateForYear(year, scenarioData);
  
  // Get state tax rate
  let stateTaxRate = getStateTaxRate(stateCode, scenarioData);
  
  // Calculate state tax (simplified calculation)
  return taxableIncome * stateTaxRate;
};

/**
 * Determine which state applies for a given year based on relocation data
 */
function determineStateForYear(year: number, scenarioData: MultiYearScenarioData): StateCode | undefined {
  // Check if there's relocation data
  if (scenarioData.stateRelocationYear && year >= scenarioData.stateRelocationYear) {
    // After relocation year, use future state
    return scenarioData.futureResidentState;
  } else {
    // Before relocation year, use current state
    return scenarioData.residentState;
  }
}

/**
 * Get state tax rate for a specific state
 */
function getStateTaxRate(stateCode: StateCode | undefined, scenarioData: MultiYearScenarioData): number {
  if (!stateCode) return 0;
  
  // Look up the tax rate from our data
  const stateTaxInfo = STATE_TAX_RATES[stateCode];
  
  // Return the rate or a default if not found
  return stateTaxInfo?.effective_rate || scenarioData.stateIncomeTax || 0;
}
