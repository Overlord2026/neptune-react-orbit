
// Export everything from the types file using the now-updated interfaces
export * from './types';

// Export the checkTaxTraps function (which now directly uses the interface from './types')
export { checkTaxTraps } from '../taxTrapChecker';
