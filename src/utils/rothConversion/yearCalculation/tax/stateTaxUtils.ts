
/**
 * State Tax Utilities
 * 
 * Functions for handling state tax logic in tax inputs.
 */

import { MultiYearScenarioData } from '@/components/tax/roth-conversion/types/ScenarioTypes';
import { TaxInput } from '../../../taxCalculator';
import { StateCode } from '@/utils/stateTaxData';

/**
 * Apply state tax information to tax input
 */
export function applyStateTaxInfo(
  taxInput: TaxInput,
  scenarioData: MultiYearScenarioData,
  currentYear: number
): void {
  if (scenarioData.includeStateTax && scenarioData.residentState) {
    taxInput.includeStateTax = true;
    
    // Safely handle state code assignment
    if (scenarioData.residentState !== "" && 
        scenarioData.residentState !== "NONE" && 
        scenarioData.residentState !== "OTHER") {
      taxInput.residentState = scenarioData.residentState as StateCode;
    }
    
    // Handle potential state relocation in multi-year scenarios
    if (scenarioData.stateRelocationYear && currentYear >= scenarioData.stateRelocationYear) {
      if (scenarioData.futureResidentState && 
          scenarioData.futureResidentState !== "" && 
          scenarioData.futureResidentState !== "NONE" && 
          scenarioData.futureResidentState !== "OTHER") {
        taxInput.residentState = scenarioData.futureResidentState as StateCode;
      }
    }
  }
}
