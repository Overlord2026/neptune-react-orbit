// Add the following to your existing file or create if doesn't exist
export interface TrapAlert {
  year?: number;
  type: string;
  message: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
  trapType: string;
  title?: string;
  financial_impact?: number;
  remediation?: string;
}

// Make sure the YearlyResult interface includes warnings
export interface YearlyResult {
  year: number;
  income?: number;
  taxableIncome?: number;
  conversionAmount?: number;
  federalTax?: number;
  stateTax?: number;
  totalTax?: number;
  warnings?: TrapAlert[];
  // ... any other properties you need
}

// Define the MultiYearScenarioData interface
export interface MultiYearScenarioData {
  id?: string;
  name?: string;
  description?: string;
  startYear?: number;
  endYear?: number;
  conversionStrategy?: string;
  filingStatus?: string;
  traditionalIraBalance?: number;
  rothIraBalance?: number;
  income?: number;
  stateCode?: string;
  includeSpouse?: boolean;
  spouseAge?: number;
  userAge?: number;
  includeRMDs?: boolean;
  rmdStartAge?: number;
  includeCharitableContributions?: boolean;
  charitableContributionAmount?: number;
  beneficiaryAge?: number;
  includeBeneficiary?: boolean;
  // ... any other properties you need
}
