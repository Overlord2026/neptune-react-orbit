
// Re-export everything from the types file
export * from './types';

// Export the checkTaxTraps function
export { checkTaxTraps } from '../taxTrapChecker';

// Re-export types from the global types to ensure consistency
export type { TaxTrapWarning, TaxTrapResult } from '@/types/taxTrapTypes';
