
import { TaxReturnData } from '../types/TaxReturnTypes';

export const getInitialTaxData = (): TaxReturnData => ({
  // Eligibility
  hasOnlyW2Income: null,
  hasDependents: null,
  hasSelfEmploymentIncome: null,
  isEligible: true,
  
  // Personal Info
  firstName: '',
  lastName: '',
  ssn: '',
  filingStatus: '',
  dependents: [],
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
  },
  
  // Income
  w2Forms: [{ employer: '', wages: 0, federalWithholding: 0, stateWithholding: 0 }],
  interestIncome: 0,
  dividendIncome: 0,
  
  // Deductions
  useStandardDeduction: true,
  itemizedDeductions: {
    medicalExpenses: 0,
    stateTaxes: 0,
    propertyTaxes: 0,
    mortgageInterest: 0,
    charitableContributions: 0,
  },
  childTaxCredit: false,
  educationCredit: false,
  
  // Results
  calculatedRefund: 0,
  calculatedOwed: 0,
  
  // Filing
  bankInfo: {
    routingNumber: '',
    accountNumber: '',
    accountType: '',
  },
  
  // Confirmation
  referenceNumber: '',
  disclaimerAcknowledged: false,
});
