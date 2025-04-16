
/**
 * Core tax calculator types
 */

import { FilingStatusType } from '../types/tax/filingTypes';

/**
 * Input parameters for tax calculation
 */
export interface TaxInput {
  year: number;
  filingStatus: FilingStatusType;
  income: number;
  capitalGains?: number;
  adjustments?: number;
  deductions?: number;
  credits?: number;
  isItemizedDeduction?: boolean;
  itemizedDeductionAmount?: number;
  taxableIncome?: number;
  residentState?: string;
  includeStateTax?: boolean;
  isAMTApplicable?: boolean;
  directInputMode?: boolean; // Allows direct input of taxable income
}

/**
 * Tax bracket breakdown item
 */
export interface BracketItem {
  bracket: number;
  amount: number;
  tax: number;
}

/**
 * Tax calculation result
 */
export interface TaxResult {
  year: number;
  filing_status: FilingStatusType;
  total_income: number;
  taxable_income: number;
  ordinary_tax: number;
  capital_gains_tax: number;
  total_tax: number;
  marginal_rate: number;
  effective_rate: number;
  standard_deduction?: number;
  agi?: number;
  marginal_capital_gains_rate?: number;
  brackets_breakdown?: {
    ordinary: BracketItem[];
    capitalGains: BracketItem[];
  };
  tax_data_version?: string;
  federal_tax?: number;
  state_tax?: number;
  state_name?: string;
  state_code?: string;
  warnings?: string[];
  safe_harbor?: {
    required_payment: number;
    is_compliant: boolean;
    method_used: string;
  };
  scenario_name?: string;
  is_baseline?: boolean;
  created_at?: string;
  updated_at?: string;
  taxIncomeBreakdown?: {
    wages?: number;
    interest?: number;
    dividends?: number;
    business?: number;
    other?: number;
  };
}

/**
 * Tax data currency info
 */
export interface TaxDataCacheInfo {
  dataUpdatedAt: Date;
  isCurrent: boolean;
  sessionId: string;
}

/**
 * Tax scenario definition
 */
export interface TaxScenario {
  id: string;
  name: string;
  result: TaxResult;
  is_baseline: boolean;
}
