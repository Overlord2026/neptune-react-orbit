
/**
 * Charitable Contribution Processor
 * 
 * Functions for processing charitable contribution effects on taxes
 */

import { MultiYearScenarioData } from '@/types/tax/rothConversionTypes';
import { calculateCharitableImpact } from '../../charitableImpactUtils';
import { calculateCharitableOpportunity } from '../../charitableOpportunityUtils';
import { TaxTrapResult } from '@/utils/taxTraps/types';

interface CharitableEffectParams {
  scenarioData: MultiYearScenarioData;
  currentYear: number;
  currentAge: number;
  baseAGI: number;
  charitableContribution: { 
    amount: number; 
    useQcd: boolean; 
    isBunching: boolean;
  };
  beforeCharitableTraps: TaxTrapResult;
  warnings: { 
    type: string; 
    message: string; 
    severity: 'low' | 'medium' | 'high';
    trapType: string;
  }[];
}

/**
 * Calculate the effect of charitable contributions on taxes
 */
export function calculateCharitableEffect({
  scenarioData,
  currentYear,
  currentAge,
  baseAGI,
  charitableContribution,
  beforeCharitableTraps,
  warnings
}: CharitableEffectParams) {
  // Initialize charitable impact object
  let charitableImpact = {
    standardDeduction: 0,
    itemizedDeduction: 0,
    isItemizing: false,
    taxSavings: 0
  };
  
  // Calculate charitable impact and opportunities
  let updatedWarnings = [...warnings];
  
  // Now using the correct property from our updated interface
  if (scenarioData.useCharitablePlanning && charitableContribution.amount > 0) {
    // Calculate initial impact with estimated marginal rate
    // Using a modified placeholder TaxTrapResult to avoid type mismatch
    const placeholderTrapResult = {
      scenario_id: `${currentYear}_charitable`,
      warnings: []
    };
    
    charitableImpact = calculateCharitableImpact(
      charitableContribution.amount,
      charitableContribution.useQcd,
      charitableContribution.isBunching,
      scenarioData.filingStatus,
      currentYear,
      0.24, // Estimate marginal rate for initial calculation
      charitableContribution.useQcd ? charitableContribution.amount : 0,
      baseAGI,
      placeholderTrapResult
    );
    
    // Check for additional charitable opportunities
    const opportunityWarning = checkForCharitableOpportunities(
      beforeCharitableTraps,
      scenarioData.filingStatus,
      currentAge,
      baseAGI,
      currentYear
    );
    
    if (opportunityWarning) {
      updatedWarnings.push(opportunityWarning);
    }
  }
  
  return { charitableImpact, updatedWarnings };
}

/**
 * Check for charitable opportunities based on tax traps
 */
function checkForCharitableOpportunities(
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
