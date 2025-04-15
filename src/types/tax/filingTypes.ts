
/**
 * Unified type definitions for tax filing
 */
import { StateCode } from "../../utils/stateTaxData";

// Unified filing status type
export type FilingStatusType = 'single' | 'married_joint' | 'married_separate' | 'head_of_household' | 'qualifying_widow';

// Alias to support older code still using 'married' instead of 'married_joint'
export type LegacyFilingStatusType = 'single' | 'married' | 'married_separate' | 'head_of_household';

// Unified W2Form
export interface W2Form {
  employerName: string;
  employerEIN: string;
  wages: number;
  federalWithholding: number;
  stateWithholding?: number;
  employer?: string; // Added for compatibility
}

// Unified Dependent
export interface Dependent {
  name: string;
  relationship: string;
  ssn: string;
  dateOfBirth: string;
}

// Filing steps type
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

// Unified ItemizedDeductions
export interface ItemizedDeductions {
  medicalExpenses: number;
  stateTaxes: number;
  propertyTaxes: number;
  mortgageInterest: number;
  charitableContributions: number;
  otherDeductions: number;
}

// Unified TaxReturnData
export interface TaxReturnData {
  // Personal Information
  firstName: string;
  lastName: string;
  ssn: string;
  dateOfBirth: string;
  occupation: string;
  filingStatus: FilingStatusType;
  
  // Contact Information
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string; // Unified to use zip (not zipCode)
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
  residentState?: StateCode | string;
  stateTax?: number;
  
  // Additional fields
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
