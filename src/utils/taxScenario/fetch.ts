
/**
 * Tax Scenario Fetch
 * 
 * Functions for fetching tax scenarios
 */
import { TaxScenario } from './types';
import { getSavedScenarios } from './storage';

/**
 * Fetch a specific tax scenario by ID
 */
export const fetchTaxScenario = async (scenarioId: string): Promise<TaxScenario | null> => {
  try {
    // Get all scenarios
    const scenarios = getSavedScenarios();
    
    // Find the requested scenario
    const scenario = scenarios.find(s => s.id === scenarioId);
    
    return scenario || null;
  } catch (error) {
    console.error("Error fetching tax scenario:", error);
    return null;
  }
};

/**
 * Fetch all saved tax scenarios
 */
export const fetchAllScenarios = async (): Promise<TaxScenario[]> => {
  try {
    return getSavedScenarios();
  } catch (error) {
    console.error("Error fetching all tax scenarios:", error);
    return [];
  }
};
