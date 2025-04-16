
/**
 * State Tax Types
 * 
 * Type definitions for state tax calculations and data structures.
 */

export interface StateTaxBracket {
  min: number;
  max: number;
  rate: number; // Percentage (e.g., 5.0 means 5%)
}

export interface StateTaxData {
  name: string;
  type: 'graduated' | 'flat' | 'none';
  brackets?: StateTaxBracket[];
  flatRate?: number;
  specialNotes?: string;
}

export type StateCode = 
  | 'AL' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'GA' | 'HI' | 'ID' 
  | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME' | 'MD' | 'MA' | 'MI' 
  | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NJ' | 'NM' | 'NY' | 'NC' | 'ND' 
  | 'OH' | 'OK' | 'OR' | 'PA' | 'RI' | 'SC' | 'UT' | 'VT' | 'VA' | 'WV' 
  | 'WI' | 'DC' | 'NONE' | 'OTHER';
