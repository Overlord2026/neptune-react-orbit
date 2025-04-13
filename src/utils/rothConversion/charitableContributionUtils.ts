import { CharitableContribution, MultiYearScenarioData } from '@/components/tax/roth-conversion/types/ScenarioTypes';

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
  if (scenarioData.dafBunching?.enabled) {
    const startYear = scenarioData.startYear;
    const yearIndex = currentYear - startYear;
    const cyclePosition = yearIndex % (scenarioData.dafBunching.bunchingYears || 1);
    
    // If we're at the start of a bunching cycle, use bunching amount
    if (cyclePosition === 0) {
      return { 
        amount: scenarioData.dafBunching.bunchingAmount,
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
