
/**
 * Type definitions for tax filing status
 */

// Standard filing status types as used throughout the application
export type FilingStatusType = 'single' | 'married_joint' | 'married_separate' | 'head_of_household' | 'qualifying_widow';

// Legacy filing status type used in some older components
export type LegacyFilingStatusType = 'single' | 'married' | 'head_of_household' | 'married_separate';

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

// Function to convert legacy filing status to modern format
export const convertLegacyFilingStatus = (status: LegacyFilingStatusType): FilingStatusType => {
  if (status === 'married') return 'married_joint';
  return status as FilingStatusType;
};

// W2 Form type definition
export interface W2Form {
  employerName: string;
  employerEIN: string;
  wages: number;
  federalWithholding: number;
  stateWithholding: number;
}

// Dependent information type
export interface Dependent {
  name?: string;
  firstName?: string;
  lastName?: string;
  ssn: string;
  relationship: string;
  dateOfBirth?: string;
}

// Itemized deductions type
export interface ItemizedDeductions {
  medicalExpenses: number;
  stateTaxes: number;
  propertyTaxes: number;
  mortgageInterest: number;
  charitableContributions: number;
  [key: string]: number;
}

// Bank information for refund/payment
export interface BankInfo {
  routingNumber: string;
  accountNumber: string;
  accountType: 'checking' | 'savings';
}

// Tax return data type
export interface TaxReturnData {
  // Eligibility information
  hasOnlyW2Income: boolean | null;
  hasDependents: boolean | null;
  hasSelfEmploymentIncome: boolean | null;

  // Personal Information
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
  residentState?: string;
  includeStateTax?: boolean;
  
  // Contact Information
  email?: string;
  phone?: string;

  // Income Information
  w2Forms: W2Form[];
  interestIncome: number;
  dividendIncome: number;
  investmentIncome?: number;
  socialSecurityBenefits?: number;
  
  // Health and Medicare
  isOver65?: boolean;
  hasHealthInsurance?: boolean;

  // Deductions and Credits
  useStandardDeduction: boolean;
  itemizedDeductions: ItemizedDeductions;
  childTaxCredit: boolean;
  educationCredit: boolean;

  // Calculation Results
  calculatedRefund: number;
  calculatedOwed: number;
  stateTax: number;

  // Filing Information
  bankInfo?: BankInfo;
  referenceNumber?: string;
  directDeposit?: boolean;
  disclaimerAcknowledged?: boolean;
}

// Filing step type
export type FilingStep = 'eligibility' | 'personal' | 'income' | 'deductions' | 'review' | 'file' | 'confirmation';

// Filing steps for navigation
export const FILING_STEPS = [
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'personal', label: 'Personal Info' },
  { id: 'income', label: 'Income' },
  { id: 'deductions', label: 'Deductions' },
  { id: 'review', label: 'Review' },
  { id: 'file', label: 'File Return' },
  { id: 'confirmation', label: 'Confirmation' }
];
