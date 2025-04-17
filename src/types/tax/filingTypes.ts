
/**
 * Defines the comprehensive types of filing statuses used in tax calculations
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
  employerName: string;
  employerEIN: string;
  wages: number;
  federalWithholding: number;
  stateWithholding: number;
}

export interface TaxReturnData {
  firstName: string;
  lastName: string;
  ssn: string;
  filingStatus: FilingStatusType;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  dependents: Dependent[];
  w2Forms: W2Form[];
  interestIncome: number;
  dividendIncome: number;
  useStandardDeduction: boolean;
  itemizedDeductions: Record<string, number>;
  hasOnlyW2Income: boolean;
  hasDependents: boolean;
  hasSelfEmploymentIncome: boolean;
  childTaxCredit: boolean;
  educationCredit: boolean;
  calculatedRefund: number;
  calculatedOwed: number;
  referenceNumber: string;
  residentState: string;
  includeStateTax: boolean;
  bankInfo?: {
    accountType: 'checking' | 'savings';
    routingNumber: string;
    accountNumber: string;
  };
  // Additional fields for TaxTrapSection
  investmentIncome?: number;
  socialSecurityBenefits?: number;
  isOver65?: boolean;
  hasHealthInsurance?: boolean;
  isEligible?: boolean;
  disclaimerAcknowledged?: boolean;
  stateTax?: number;
  // Add email field used in initialState.ts
  email?: string;
  phone?: string;  // Also used in initialState.ts
}

export interface Dependent {
  name: string;
  ssn: string;
  relationship: string;
  dateOfBirth?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
}

export interface ItemizedDeductions {
  stateAndLocalTax: number;
  medicalExpenses: number;
  mortgageInterest: number;
  charitableDonations: number;
}

export type FilingStep = typeof FILING_STEPS[number]['id'];
