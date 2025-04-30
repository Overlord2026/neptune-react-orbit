
import { TaxReturnData } from '../types/TaxReturnTypes';

export const getInitialTaxData = (): TaxReturnData => {
  return {
    // Personal Information
    firstName: '',
    lastName: '',
    ssn: '',
    filingStatus: 'single',
    
    // Contact Information (now included in the interface)
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    
    // Dependents
    dependents: [],
    
    // Income
    w2Forms: [{
      employerName: '',
      employerEIN: '',
      wages: 0,
      federalWithholding: 0,
      stateWithholding: 0
    }],
    interestIncome: 0,
    dividendIncome: 0,
    investmentIncome: 0,
    socialSecurityBenefits: 0,
    
    // Health and Medicare
    isOver65: false,
    hasHealthInsurance: false,
    
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
    includeStateTax: false,
    residentState: '',
    
    // Eligibility questions
    hasOnlyW2Income: null,
    hasDependents: null,
    hasSelfEmploymentIncome: null,
    
    // Calculation results
    calculatedRefund: 0,
    calculatedOwed: 0,
    stateTax: 0
  };
};
