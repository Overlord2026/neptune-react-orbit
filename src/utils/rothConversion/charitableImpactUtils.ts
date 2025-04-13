
/**
 * Charitable Impact Utilities
 * 
 * Re-exports from modular charitable impact calculation files
 */

import { calculateCharitableImpact as calculateImpact } from './charitable/impactOrchestrator';

// Re-export the main function with its original name
export const calculateCharitableImpact = calculateImpact;
