
export interface AnnualGiving {
  type: 'fixed' | 'variable';
  amount: number;  // Used when type is 'fixed'
  yearlyAmounts?: { year: number; amount: number }[];  // Used when type is 'variable'
}

export interface DafStrategy {
  useDaf: boolean;
  bunchingYears: number;
  approach: 'annual' | 'bunching';
  bunchingAmount?: number;
}

export interface QcdStrategy {
  useQcd: boolean;
  amount: number;
}

export interface CharitableRemainderTrust {
  useCrt: boolean;
  type: "CRAT" | "CRUT";
  fundingAmount: number;
  payoutRate: number;
  trustTerm: number | "lifetime";
  beneficiaryAge: number;
  spouseBeneficiary: boolean;
  spouseAge?: number;
}

export interface YearlyPlanItem {
  year: number;
  contribution: number;
  isItemizing: boolean;
  standardDeduction: number;
  itemizedTotal: number;
  taxSavings: number;
  additionalNotes?: string[];
}

export interface MultiYearPlan {
  isIntegrated: boolean;
  years: YearlyPlanItem[];
}

export interface ResultsSummary {
  taxableIncomeReduction: number;
  bracketSavings: number;
  irmaaSavings: number;
  crtDeduction?: number;
  crtAnnualPayout?: number;
  estateTaxSavings?: number;
}

export interface CharitableScenario {
  annualGiving: AnnualGiving;
  isItemizing: boolean;
  age: number;
  advancedStrategies: boolean;
  dafStrategy: DafStrategy;
  qcd: QcdStrategy;
  crt: CharitableRemainderTrust;
  multiYearPlan: MultiYearPlan;
  results: ResultsSummary;
}
