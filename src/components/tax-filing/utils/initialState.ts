
import { TaxReturnData } from '../types/TaxReturnTypes';

export const getInitialTaxData = (): TaxReturnData => {
  return {
    // Personal Information
    firstName: '',
    lastName: '',
    ssn: '',
    dateOfBirth: '',
    occupation: '',
    filingStatus: 'single',
    
    // Contact Information
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    },
    
    // Dependents
    dependents: [],
    
    // Income
    w2Forms: [{
      employerName: '',
      employerEIN: '',
      wages: 0,
      federalWithholding: 0
    }],
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
      otherDeductions: 0
    },
    
    // Credits
    childTaxCredit: false,
    educationCredit: false,
    
    // Refund information
    directDeposit: false,
    
    // State tax options
    includeStateTax: false
  };
};
