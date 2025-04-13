
/**
 * Charitable Adjustments
 * 
 * Functions for adjusting RMDs and income based on charitable contributions.
 */

import { MultiYearScenarioData } from '@/components/tax/roth-conversion/types/ScenarioTypes';
import { getCharitableContributionForYear } from '../charitableContributionUtils';
import { calculateCharitableOpportunity } from '../charitableOpportunityUtils';
import { TaxTrapResult } from '@/utils/taxTraps';

/**
 * Get charitable contribution and adjust RMD if using QCD
 */
export function processCharitableContribution(
  scenarioData: MultiYearScenarioData,
  currentYear: number,
  currentAge: number,
  rmdAmount: number
) {
  // Get charitable contribution for this year
  const charitableContribution = getCharitableContributionForYear(
    scenarioData, 
    currentYear, 
    currentAge
  );
  
  // Calculate any reduction to RMD amount if using QCD
  let adjustedRmdAmount = rmdAmount;
  if (charitableContribution.useQcd && currentAge >= 70.5) {
    // QCD can reduce or eliminate RMD up to the contribution amount
    adjustedRmdAmount = Math.max(0, rmdAmount - charitableContribution.amount);
  }

  return { charitableContribution, adjustedRmdAmount };
}

/**
 * Check for charitable opportunities based on tax traps
 */
export function checkForCharitableOpportunities(
  beforeCharitableTraps: TaxTrapResult,
  filingStatus: string,
  currentAge: number,
  baseAGI: number,
  currentYear: number
) {
  const opportunity = calculateCharitableOpportunity(
    beforeCharitableTraps,
    filingStatus,
    currentAge,
    baseAGI,
    currentYear
  );

  if (opportunity) {
    return {
      type: 'charitable_opportunity',
      message: opportunity.description,
      severity: opportunity.severity,
      trapType: 'charitable_opportunity'
    };
  }

  return null;
}
