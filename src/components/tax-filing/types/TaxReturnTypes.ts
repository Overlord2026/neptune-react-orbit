import { StateCode } from '@/utils/stateTaxData';

export interface W2Form {
  employerName: string;
  employerEIN: string;
  wages: number;
  federalWithholding: number;
  stateWithholding?: number;
  employer?: string; // Added employer property as optional for compatibility
}

export interface Dependent {
  name: string;
  relationship: string;
  ssn: string;
  dateOfBirth: string;
}

// Define filing steps type
export type FilingStep = 'eligibility' | 'personal' | 'income' | 'deductions' | 'review' | 'file' | 'confirmation';

// Define filing steps for navigation
export const FILING_STEPS = [
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'personal', label: 'Personal Info' },
  { id: 'income', label: 'Income' },
  { id: 'deductions', label: 'Deductions' },
  { id: 'review', label: 'Review' },
  { id: 'file', label: 'File Return' },
  { id: 'confirmation', label: 'Confirmation' }
];

export interface ItemizedDeductions {
  medicalExpenses: number;
  stateTaxes: number;
  propertyTaxes: number;
  mortgageInterest: number;
  charitableContributions: number;
  otherDeductions: number;
}

export interface TaxReturnData {
  // Personal Information
  firstName: string;
  lastName: string;
  ssn: string;
  dateOfBirth: string;
  occupation: string;
  filingStatus: 'single' | 'married_joint' | 'married_separate' | 'head_of_household' | 'qualifying_widow';
  
  // Contact Information
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  
  // Dependents
  dependents: Dependent[];
  
  // Income
  w2Forms: W2Form[];
  interestIncome: number;
  dividendIncome: number;
  
  // Deductions
  useStandardDeduction: boolean;
  itemizedDeductions: ItemizedDeductions;
  
  // Credits
  childTaxCredit: boolean;
  educationCredit: boolean;
  
  // Refund information
  directDeposit: boolean;
  bankRoutingNumber?: string;
  bankAccountNumber?: string;
  bankAccountType?: 'checking' | 'savings';
  
  // Result values (calculated)
  calculatedRefund?: number;
  calculatedOwed?: number;
  
  // State tax information
  includeStateTax?: boolean;
  residentState?: StateCode | string; // Allow empty string
  stateTax?: number;
  
  // Additional fields needed for components
  hasOnlyW2Income?: boolean | null;
  hasSelfEmploymentIncome?: boolean | null;
  hasDependents?: boolean | null;
  isOver65?: boolean;
  hasHealthInsurance?: boolean;
  investmentIncome?: number;
  socialSecurityBenefits?: number;
  disclaimerAcknowledged?: boolean;
  referenceNumber?: string;
  bankInfo?: any;
  isEligible?: boolean;
}
