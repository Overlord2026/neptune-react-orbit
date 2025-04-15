
/**
 * Tax Scenario Storage
 * 
 * Functions for saving and retrieving tax scenarios
 */

import { TaxScenario } from './types';

// Storage key for tax scenarios
const TAX_SCENARIO_STORAGE_KEY = 'tax_scenarios';

/**
 * Save a tax scenario to storage
 */
export const saveTaxScenario = (scenario: TaxScenario): TaxScenario => {
  try {
    // Get existing scenarios
    const scenarios = getSavedScenarios();
    
    // Create a new scenario or update existing one
    const updatedScenarios = [...scenarios];
    const existingIndex = scenarios.findIndex(s => s.id === scenario.id);
    
    if (existingIndex >= 0) {
      updatedScenarios[existingIndex] = scenario;
    } else {
      updatedScenarios.push(scenario);
    }
    
    // Save back to storage
    localStorage.setItem(TAX_SCENARIO_STORAGE_KEY, JSON.stringify(updatedScenarios));
    
    return scenario;
  } catch (error) {
    console.error("Error saving tax scenario:", error);
    return scenario;
  }
};

/**
 * Get all saved scenarios from storage
 */
export const getSavedScenarios = (): TaxScenario[] => {
  try {
    const storedScenarios = localStorage.getItem(TAX_SCENARIO_STORAGE_KEY);
    return storedScenarios ? JSON.parse(storedScenarios) : [];
  } catch (error) {
    console.error("Error retrieving tax scenarios:", error);
    return [];
  }
};

/**
 * Delete a scenario from storage
 */
export const deleteTaxScenario = (scenarioId: string): boolean => {
  try {
    // Get existing scenarios
    const scenarios = getSavedScenarios();
    
    // Filter out the scenario to delete
    const updatedScenarios = scenarios.filter(s => s.id !== scenarioId);
    
    // Save back to storage
    localStorage.setItem(TAX_SCENARIO_STORAGE_KEY, JSON.stringify(updatedScenarios));
    
    return true;
  } catch (error) {
    console.error("Error deleting tax scenario:", error);
    return false;
  }
};

/**
 * Update an existing tax scenario
 */
export const updateTaxScenario = (scenarioId: string, updates: Partial<TaxScenario>): TaxScenario | null => {
  try {
    // Get existing scenarios
    const scenarios = getSavedScenarios();
    
    // Find the scenario to update
    const existingIndex = scenarios.findIndex(s => s.id === scenarioId);
    
    if (existingIndex === -1) {
      return null;
    }
    
    // Update the scenario
    const updatedScenario = {
      ...scenarios[existingIndex],
      ...updates,
      updated_at: new Date()
    };
    
    // Replace in the array
    const updatedScenarios = [...scenarios];
    updatedScenarios[existingIndex] = updatedScenario;
    
    // Save back to storage
    localStorage.setItem(TAX_SCENARIO_STORAGE_KEY, JSON.stringify(updatedScenarios));
    
    return updatedScenario;
  } catch (error) {
    console.error("Error updating tax scenario:", error);
    return null;
  }
};
