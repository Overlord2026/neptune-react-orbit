
/**
 * State Tax Utilities
 * 
 * Functions for applying state tax information to tax input and processing.
 */

import { MultiYearScenarioData } from '@/types/tax/rothConversionTypes';
import { TaxInput } from '@/types/tax/taxCalculationTypes';

/**
 * Apply state tax information to tax input
 */
export function applyStateTaxInfo(
  taxInput: TaxInput, 
  scenarioData: MultiYearScenarioData
): TaxInput {
  // Clone the input to avoid mutating the original
  const updatedInput = { ...taxInput };
  
  // Apply state tax settings if state tax should be included
  if (scenarioData.includeStateTax && scenarioData.residentState) {
    updatedInput.includeStateTax = true;
    updatedInput.residentState = scenarioData.residentState;
    
    // Handle state relocation if applicable
    if (scenarioData.stateRelocationYear && 
        scenarioData.futureResidentState && 
        taxInput.year >= scenarioData.stateRelocationYear) {
      updatedInput.residentState = scenarioData.futureResidentState;
    }
  } else {
    // Explicitly disable state tax if not included
    updatedInput.includeStateTax = false;
    updatedInput.residentState = undefined;
  }
  
  return updatedInput;
}
