
// Define the tax return data type
export interface TaxReturnData {
  // Eligibility
  hasOnlyW2Income: boolean | null;
  hasDependents: boolean | null;
  hasSelfEmploymentIncome: boolean | null;
  isEligible: boolean;
  
  // Personal Info
  firstName: string;
  lastName: string;
  ssn: string;
  filingStatus: 'single' | 'married' | 'head_of_household' | '';
  dependents: { name: string; ssn: string; relationship: string }[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  
  // Income
  w2Forms: {
    employer: string;
    wages: number;
    federalWithholding: number;
    stateWithholding: number;
  }[];
  interestIncome: number;
  dividendIncome: number;
  
  // Deductions & Credits
  useStandardDeduction: boolean;
  itemizedDeductions: {
    medicalExpenses: number;
    stateTaxes: number;
    propertyTaxes: number;
    mortgageInterest: number;
    charitableContributions: number;
  };
  childTaxCredit: boolean;
  educationCredit: boolean;
  
  // Results
  calculatedRefund: number;
  calculatedOwed: number;
  
  // Filing
  bankInfo: {
    routingNumber: string;
    accountNumber: string;
    accountType: 'checking' | 'savings' | '';
  };
  
  // Confirmation
  referenceNumber: string;
  
  // Disclaimer
  disclaimerAcknowledged?: boolean;
  
  // Additional properties needed for tax trap checking
  investmentIncome?: number;
  socialSecurityBenefits?: number;
  isOver65?: boolean;
  hasHealthInsurance?: boolean;
}

// Define the steps of our filing flow
export const FILING_STEPS = [
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'personal', label: 'Personal Info' },
  { id: 'income', label: 'Income' },
  { id: 'deductions', label: 'Deductions' },
  { id: 'review', label: 'Review' },
  { id: 'file', label: 'E-File' },
  { id: 'confirmation', label: 'Confirmation' },
] as const;

export type FilingStep = typeof FILING_STEPS[number]['id'];
