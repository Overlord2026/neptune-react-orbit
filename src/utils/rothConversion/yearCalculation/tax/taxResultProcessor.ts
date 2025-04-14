
/**
 * Tax Result Processor
 * 
 * Functions for processing tax results with different scenarios.
 */

import { TaxInput, calculateTaxScenario } from '../../../taxCalculator';
import { calculateCharitableImpact } from '../../charitableImpactUtils';

interface TaxResultsParams {
  yearTaxInput: TaxInput;
  charitableContribution: { 
    amount: number; 
    useQcd: boolean; 
    isBunching: boolean;
  };
  charitableImpact: {
    standardDeduction: number;
    itemizedDeduction: number;
    isItemizing: boolean;
    taxSavings: number;
  };
  scenarioName: string;
  updatedWarnings: { 
    type: string; 
    message: string; 
    severity: 'low' | 'medium' | 'high';
    trapType: string;
  }[];
  rmdAmount: number;
}

/**
 * Process tax calculation results for both conversion and no-conversion scenarios
 */
export function processTaxResults({
  yearTaxInput,
  charitableContribution,
  charitableImpact,
  scenarioName,
  updatedWarnings,
  rmdAmount
}: TaxResultsParams) {
  // Calculate tax on this scenario
  const taxResult = calculateTaxScenario(
    yearTaxInput, 
    scenarioName,
    "multi_year_analysis"
  );
  
  // Calculate tax on the same scenario without conversion
  const noConversionInput = { 
    ...yearTaxInput, 
    roth_conversion: 0, 
    spouseRothConversion: 0 
  };
  
  const noConversionTaxResult = calculateTaxScenario(
    noConversionInput,
    `${scenarioName} - No Conversion`,
    "multi_year_analysis"
  );

  // Recalculate charitable impact with the actual marginal rate from tax result
  let updatedCharitableImpact = charitableImpact;
  
  if (yearTaxInput.isItemizedDeduction && charitableContribution.amount > 0) {
    updatedCharitableImpact = calculateCharitableImpact(
      charitableContribution.amount,
      charitableContribution.useQcd,
      charitableContribution.isBunching,
      yearTaxInput.filing_status,
      yearTaxInput.year,
      taxResult.marginal_rate, // Use actual marginal rate
      rmdAmount,
      yearTaxInput.wages + (yearTaxInput.ira_distributions || 0) + (yearTaxInput.roth_conversion || 0),
      { warnings: [] } // Simplified for recalculation
    );
  }
  
  // Return processed results
  return {
    taxResult,
    noConversionTaxResult,
    charitableImpact: updatedCharitableImpact,
    warnings: updatedWarnings
  };
}
