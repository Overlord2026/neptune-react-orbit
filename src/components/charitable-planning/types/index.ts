
/**
 * Charitable Planning Types
 */

export * from './CharitableTypes';

// Re-export MultiYearScenarioData and CharitableContribution from the central location for backward compatibility
export { 
  MultiYearScenarioData, 
  CharitableContribution 
} from '@/types/tax/rothConversionTypes';
