
/**
 * Defines the types of filing statuses used in tax calculations
 */
export type FilingStatusType = 
  'single' 
  | 'married_joint'
  | 'married_separate'
  | 'head_of_household'
  | 'qualifying_widow';

// Legacy filing status type for backward compatibility
export type LegacyFilingStatusType = 
  'single' 
  | 'married' 
  | 'married_separate' 
  | 'head_of_household' 
  | 'qualifying_widow';

/**
 * Converts legacy filing status to current standardized format
 */
export function convertLegacyFilingStatus(status: LegacyFilingStatusType): FilingStatusType {
  switch (status) {
    case 'married':
      return 'married_joint';
    case 'single':
    case 'married_separate':
    case 'head_of_household':
    case 'qualifying_widow':
      return status;
  }
}

// Optional: Describe valid filing steps
export const FILING_STEPS = [
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'personal', label: 'Personal Info' },
  { id: 'income', label: 'Income' },
  { id: 'deductions', label: 'Deductions' },
  { id: 'review', label: 'Review' },
  { id: 'file', label: 'File Return' },
  { id: 'confirmation', label: 'Confirmation' }
];

// Additional types can be added here as needed
export interface W2Form {
  // Define W2 form structure
}

export interface TaxReturnData {
  // Define tax return data structure
}

export interface Dependent {
  // Define dependent information structure
}

export interface ItemizedDeductions {
  // Define itemized deductions structure
}

export type FilingStep = typeof FILING_STEPS[number]['id'];
