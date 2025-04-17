
import { TrapAlert } from '@/types/tax/rothConversionTypes';
import { TrapAvoidance } from '@/types/tax/rothConversionTypes';
import { TaxTrapInput } from '@/utils/taxTraps';

// Define a common structure to work with both types of TaxTrapResult
interface TaxTrapResultCommon {
  warnings: any[];
  irmaa_data?: {
    partB_surcharge: number;
    partD_surcharge: number;
    annual_impact: number;
  };
  social_security_data?: {
    taxable_percentage: number;
    tax_increase: number;
  };
  capital_gains_data?: {
    current_rate: number;
    potential_rate: number;
    tax_increase: number;
  };
  aca_data?: {
    current_fpl_percentage: number;
    subsidy_impact: number;
  };
}

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
  // Use optional chaining for these properties since they're now optional
  const threshold = trap.threshold || 0;
  const impact = trap.impact || 0;

  switch (trap.trapType) {
    case 'irmaa':
      return {
        type: 'irmaa_reduction',
        name: 'IRMAA Threshold Reduction',
        description: `Reduce your Roth conversion amount by $${(income + conversionAmount - threshold).toLocaleString()} to stay below the ${year} IRMAA threshold.`,
        savings: impact
      };
      
    case 'social_security':
      return {
        type: 'ss_taxation',
        name: 'Social Security Tax Reduction',
        description: 'Consider spreading your Roth conversion across multiple years to minimize Social Security benefit taxation.',
        savings: impact
      };
      
    case 'aca_subsidy':
      return {
        type: 'aca_subsidy_preserve',
        name: 'ACA Subsidy Preservation',
        description: 'Reduce your Roth conversion to preserve ACA premium tax credits.',
        savings: impact
      };
      
    default:
      return null;
  }
}
