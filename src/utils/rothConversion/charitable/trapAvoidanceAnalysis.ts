
import { TrapAlert, TrapAvoidance } from '@/types/tax/rothConversionTypes';
import { TaxTrapInput, TaxTrapResult } from '@/utils/taxTraps';

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

/**
 * Generate input for tax trap checking with adjusted values
 */
export function generateTrapCheckInput(
  baseInput: TaxTrapInput,
  adjustedAGI: number,
  isItemizing: boolean,
  itemizedDeduction: number,
  standardDeduction: number
): TaxTrapInput {
  // Calculate the taxable income based on deduction type
  const deduction = isItemizing ? itemizedDeduction : standardDeduction;
  const adjustedTaxableIncome = Math.max(0, adjustedAGI - deduction);
  
  return {
    ...baseInput,
    agi: adjustedAGI,
    magi: adjustedAGI, // Simplified MAGI equals AGI
    total_income: adjustedAGI,
    taxable_income: adjustedTaxableIncome
  };
}

/**
 * Analyze trap avoidance opportunities based on charitable contributions
 */
export function analyzeTrapAvoidance(
  originalTrapResults: TaxTrapResult,
  adjustedAGI: number,
  isItemizing: boolean,
  itemizedDeduction: number,
  standardDeduction: number,
  useQcd: boolean,
  charitableAmount: number
): TrapAvoidance[] {
  const trapAvoidances: TrapAvoidance[] = [];
  
  // Check for IRMAA avoidance
  if (originalTrapResults.irmaa_data && originalTrapResults.warnings.some(w => w.type === 'irmaa')) {
    const irmaaWarning = originalTrapResults.warnings.find(w => w.type === 'irmaa');
    if (irmaaWarning) {
      const annualImpact = originalTrapResults.irmaa_data.annual_impact;
      
      trapAvoidances.push({
        id: 'irmaa_avoidance',
        name: 'IRMAA Surcharge Avoidance',
        description: useQcd ? 
          'Using QCD reduced your income below the IRMAA threshold, eliminating Medicare premium surcharges.' :
          'Your charitable contribution helped reduce your income below the IRMAA threshold.',
        taxSavings: annualImpact
      });
    }
  }
  
  // Check for Social Security tax avoidance
  if (originalTrapResults.social_security_data && 
      originalTrapResults.warnings.some(w => w.type === 'social_security')) {
    const ssWarning = originalTrapResults.warnings.find(w => w.type === 'social_security');
    if (ssWarning) {
      trapAvoidances.push({
        id: 'ss_tax_reduction',
        name: 'Social Security Tax Reduction',
        description: useQcd ? 
          'Your QCD reduced the taxable portion of your Social Security benefits.' :
          'Your charitable contribution reduced the taxable portion of your Social Security benefits.',
        taxSavings: Math.round(originalTrapResults.social_security_data.tax_increase * 0.5)
      });
    }
  }
  
  // Check for ACA subsidy preservation
  if (originalTrapResults.aca_data && 
      originalTrapResults.warnings.some(w => w.type === 'aca')) {
    trapAvoidances.push({
      id: 'aca_subsidy_preservation',
      name: 'ACA Premium Subsidy Preservation',
      description: 'Your charitable contribution helped maintain eligibility for ACA premium tax credits.',
      taxSavings: originalTrapResults.aca_data.subsidy_impact
    });
  }
  
  // Check for additional tax benefits from itemizing
  if (isItemizing && itemizedDeduction > standardDeduction) {
    const additionalDeduction = itemizedDeduction - standardDeduction;
    const approxMarginalRate = 0.24; // Approximate marginal rate
    
    trapAvoidances.push({
      id: 'itemized_deduction_benefit',
      name: 'Itemized Deduction Benefit',
      description: `Charitable giving increased your total itemized deductions by $${additionalDeduction.toLocaleString()}.`,
      taxSavings: Math.round(additionalDeduction * approxMarginalRate)
    });
  }
  
  // Prioritize and return strategies
  return prioritizeAvoidanceStrategies(trapAvoidances);
}

