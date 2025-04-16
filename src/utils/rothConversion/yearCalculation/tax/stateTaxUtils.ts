
import { calculateStateTax } from '@/utils/stateTax';
import { TaxInput } from '@/utils/taxCalculatorTypes';
import { MultiYearScenarioData } from '@/types/tax/rothConversionTypes';
import { StateCode } from '@/utils/stateTax'; // Updated import path

/**
 * Apply state tax information to a tax input based on multi-year scenario data
 */
export const applyStateTaxInfo = (
  taxInput: TaxInput, 
  scenarioData: MultiYearScenarioData
): TaxInput => {
  // Determine the state for the given year
  const stateCode = determineStateForYear(scenarioData);
  
  return {
    ...taxInput,
    includeStateTax: scenarioData.includeStateTax || false,
    residentState: stateCode
  };
};

/**
 * Determine which state applies for a given year based on relocation data
 */
function determineStateForYear(scenarioData: MultiYearScenarioData): StateCode | undefined {
  // Check if there's relocation data
  if (scenarioData.stateRelocationYear && scenarioData.stateRelocationYear <= new Date().getFullYear()) {
    // After relocation year, use future state
    return scenarioData.futureResidentState;
  } else {
    // Before relocation year, use current state
    return scenarioData.residentState;
  }
}

// Export calculateStateTax from stateTax module
export { calculateStateTax };
