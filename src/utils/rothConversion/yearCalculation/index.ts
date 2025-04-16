
/**
 * Year Calculation Utilities
 * 
 * Re-exports year calculation utilities from their modular files.
 */

// Re-export primary function
export { processSingleYearCalculation } from '../yearCalculation';

// Income calculation modules
export { calculateYearlyIncome } from './income/incomeCalculation';
export { processTaxableIncome } from './income/taxableIncomeProcessor';

// Charitable modules
export { calculateCharitableEffect } from './charitable/charitableProcessor';

// Tax modules
export { prepareTaxInput } from './tax/taxInputPreparation';
export { calculateStateTax } from './tax/stateTaxUtils';
export { checkForTaxTraps } from './tax/taxTrapUtils';
export { processTaxResults } from './tax/taxResultProcessor';

// Add the applyStateTaxInfo function from stateTaxUtils
export { applyStateTaxInfo } from './tax/stateTaxUtils';

