/**
 * Tax Scenario Storage
 * 
 * Functions for saving and retrieving tax scenarios
 */

import { TaxResult } from './taxCalculatorTypes';
import { YearlyTaxImpact } from '../components/deferred-comp/types/EquityTypes';

// Define interface for equity scenario data
export interface EquityScenario extends TaxResult {
  type: string;
  formState?: any;
  results?: YearlyTaxImpact[];
  amtImpact?: number;
  deferralBenefit?: number;
  scenario_name: string;  // Added to match TaxOutputStep usage
  id?: string;  // Optional ID to match usage in TaxOutputStep
}

/**
 * Save tax scenario to database or state
 * This is a placeholder function and would be replaced with actual database operations
 */
export function saveScenario(scenario: TaxResult | EquityScenario): Promise<TaxResult | EquityScenario> {
  // This would be a database operation in a real application
  // For now, we'll just log to console and return the scenario
  console.log('Saving scenario:', scenario);
  
  // Store in localStorage for demo purposes
  const existingScenarios = JSON.parse(localStorage.getItem('taxScenarios') || '[]');
  existingScenarios.push(scenario);
  localStorage.setItem('taxScenarios', JSON.stringify(existingScenarios));
  
  // Simulate async operation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(scenario);
    }, 500);
  });
}

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
