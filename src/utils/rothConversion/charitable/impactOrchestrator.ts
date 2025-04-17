
import { CharitableContribution, TrapAlert, TrapAvoidance } from '@/types/tax/rothConversionTypes';
import { generateTrapAvoidanceStrategies } from './trapAvoidanceAnalysis';
import { TaxTrapResult } from '@/utils/taxTraps/types';

/**
 * Orchestrates the calculation of charitable giving impact
 */
export function orchestrateCharitableImpact(
  charitableContribution: CharitableContribution,
  taxResult: any,
  trapResults: TaxTrapResult,
  year: number
) {
  // Extract traps from trap results
  const traps = trapResults.warnings?.map(warning => ({
    type: warning.type || 'unknown',
    message: warning.message || 'Unknown warning',
    details: warning.details || '',
    severity: warning.severity || 'medium',
    trapType: warning.type || 'unknown',
    impact: warning.financial_impact || 0
  })) as TrapAlert[];
  
  // Get income from tax result
  const income = taxResult.total_income || 0;
  const conversionAmount = taxResult.roth_conversion || 0;
  
  // Generate avoidance strategies
  const trapAvoidance = generateTrapAvoidanceStrategies(
    traps || [],
    income,
    conversionAmount,
    year
  );
  
  // Calculate tax savings based on marginal rate
  const taxSavings = charitableContribution.amount * (taxResult.marginal_rate || 0);
  
  return {
    trapAvoidance,
    taxSavings
  };
}
