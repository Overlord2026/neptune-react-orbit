
/**
 * Type definitions for tax filing status
 */

// Standard filing status types as used throughout the application
export type FilingStatusType = 'single' | 'married_joint' | 'married_separate' | 'head_of_household' | 'qualifying_widow';

// Filing status map for UI labels
export const filingStatusLabels: Record<FilingStatusType, string> = {
  'single': 'Single',
  'married_joint': 'Married Filing Jointly',
  'married_separate': 'Married Filing Separately',
  'head_of_household': 'Head of Household',
  'qualifying_widow': 'Qualifying Widow(er)'
};

// Filing status options for dropdowns
export const filingStatusOptions = [
  { value: 'single', label: 'Single' },
  { value: 'married_joint', label: 'Married Filing Jointly' },
  { value: 'married_separate', label: 'Married Filing Separately' },
  { value: 'head_of_household', label: 'Head of Household' },
  { value: 'qualifying_widow', label: 'Qualifying Widow(er)' }
];
