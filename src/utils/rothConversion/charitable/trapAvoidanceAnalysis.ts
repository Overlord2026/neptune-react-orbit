
import { TrapAlert, TrapAvoidance } from '@/types/tax/rothConversionTypes';

/**
 * Generate trap avoidance strategies based on detected tax traps
 */
export function generateTrapAvoidanceStrategies(
  traps: TrapAlert[],
  income: number,
  conversionAmount: number,
  year: number
): TrapAvoidance[] {
  const strategies: TrapAvoidance[] = [];

  // Process each trap and determine avoidance strategies
  for (const trap of traps) {
    const strategy = createAvoidanceStrategy(trap, income, conversionAmount, year);
    if (strategy) {
      strategies.push(strategy);
    }
  }

  return strategies;
}

/**
 * Create a specific avoidance strategy for a detected tax trap
 */
function createAvoidanceStrategy(
  trap: TrapAlert,
  income: number,
  conversionAmount: number,
  year: number
): TrapAvoidance | null {
  switch (trap.id) {
    case 'irmaa':
      return {
        id: 'irmaa_reduction',
        name: 'IRMAA Threshold Reduction',
        description: `Reduce your Roth conversion amount by $${(income + conversionAmount - trap.threshold).toLocaleString()} to stay below the ${year} IRMAA threshold.`,
        taxSavings: trap.impact
      };
      
    case 'social_security':
      return {
        id: 'ss_taxation',
        name: 'Social Security Tax Reduction',
        description: 'Consider spreading your Roth conversion across multiple years to minimize Social Security benefit taxation.',
        taxSavings: trap.impact
      };
      
    case 'aca_subsidy':
      return {
        id: 'aca_subsidy_preserve',
        name: 'ACA Subsidy Preservation',
        description: 'Reduce your modified adjusted gross income to preserve ACA premium subsidies.',
        taxSavings: trap.impact
      };
      
    case 'tax_bracket_jump':
      const proposedReduction = (income + conversionAmount - trap.threshold + 1);
      return {
        id: 'bracket_preservation',
        name: 'Tax Bracket Preservation',
        description: `Reduce conversion by $${proposedReduction.toLocaleString()} to stay in your current tax bracket.`,
        taxSavings: trap.impact
      };
      
    default:
      return null;
  }
}

/**
 * Prioritize and filter avoidance strategies to present the most beneficial options
 */
export function prioritizeAvoidanceStrategies(strategies: TrapAvoidance[]): TrapAvoidance[] {
  // Sort by tax savings (highest first)
  return strategies
    .sort((a, b) => b.taxSavings - a.taxSavings)
    .map(strategy => ({
      ...strategy,
      taxSavings: Math.round(strategy.taxSavings)
    }));
}
