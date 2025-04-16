import { CharitableContribution, MultiYearScenarioData } from '@/types/tax/rothConversionTypes';

// Define an interface for DAF bunching configuration
interface DAFBunchingConfig {
  enabled: boolean;
  bunchingYears: number;
  bunchingAmount: number;
}

/**
 * Get charitable contribution for a specific year
 */
export const getCharitableContributionForYear = (
  scenarioData: MultiYearScenarioData,
  currentYear: number,
  currentAge: number
): { amount: number; useQcd: boolean; isBunching: boolean } => {
  if (!scenarioData.useCharitablePlanning) {
    return { amount: 0, useQcd: false, isBunching: false };
  }

  // If we have a specific contribution for this year, use it
  if (scenarioData.charitableContributions && scenarioData.charitableContributions.length > 0) {
    const yearContribution = scenarioData.charitableContributions.find(c => c.year === currentYear);
    if (yearContribution) {
      return {
        amount: yearContribution.amount,
        useQcd: yearContribution.useQcd,
        isBunching: yearContribution.isBunching || false
      };
    }
  }

  // Otherwise, check if we should apply DAF bunching logic
  if (scenarioData.dafBunching && 
      typeof scenarioData.dafBunching === 'object' && 
      scenarioData.dafBunching.enabled) {
    
    const startYear = scenarioData.startYear;
    const yearIndex = currentYear - startYear;
    
    // Check if the dafBunching object has the bunchingYears property
    const bunchingYears = scenarioData.dafBunching && 
                         'bunchingYears' in scenarioData.dafBunching ? 
                         scenarioData.dafBunching.bunchingYears as number : 1;
    
    const cyclePosition = yearIndex % bunchingYears;
    
    // If we're at the start of a bunching cycle, use bunching amount
    if (cyclePosition === 0 && 
        scenarioData.dafBunching && 
        'bunchingAmount' in scenarioData.dafBunching) {
      
      return { 
        amount: (scenarioData.dafBunching.bunchingAmount as number) || 0,
        useQcd: false, // Bunching typically done with cash contributions
        isBunching: true
      };
    }
    // Otherwise, no contribution in non-bunching years
    return { amount: 0, useQcd: false, isBunching: false };
  }

  // Default case (no contribution)
  return { amount: 0, useQcd: false, isBunching: false };
};
