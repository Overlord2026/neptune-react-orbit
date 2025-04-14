
import { TaxResult } from '../taxCalculatorTypes';
import { EquityScenario } from './types';

/**
 * Fetch saved scenarios
 * This is a placeholder function and would be replaced with actual database operations
 */
export function fetchScenarios(): Promise<(TaxResult | EquityScenario)[]> {
  // Get from localStorage for demo purposes
  const storedScenarios = localStorage.getItem('taxScenarios');
  const scenarios = storedScenarios ? JSON.parse(storedScenarios) : [];
  
  // Simulate async operation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(scenarios);
    }, 500);
  });
}

/**
 * Fetch only equity scenarios
 */
export function fetchEquityScenarios(): Promise<EquityScenario[]> {
  return fetchScenarios()
    .then(scenarios => scenarios.filter(
      scenario => 'type' in scenario && scenario.type === 'equity-compensation'
    ) as EquityScenario[]);
}
