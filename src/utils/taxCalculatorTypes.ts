
/**
 * Tax Calculator Type Definitions
 */

import { FilingStatusType } from '@/types/tax/filingTypes';

export interface TaxInput {
  year: number;
  filingStatus?: FilingStatusType;
  filing_status?: FilingStatusType; // For backward compatibility
  income?: number;
  wages?: number;
  interest?: number;
  dividends?: number;
  capitalGains?: number;
  capital_gains?: number; // For backward compatibility
  ira_distributions?: number;
  roth_conversion?: number;
  social_security?: number;
  adjustments?: number;
  deductions?: number;
  credits?: number;
  isItemizedDeduction?: boolean;
  itemizedDeductionAmount?: number;
  residentState?: string;
  includeStateTax?: boolean;
}

export interface TaxResult {
  scenario_name: string;
  year: number;
  filing_status: FilingStatusType;
  total_income: number;
  agi: number;
  taxable_income: number;
  total_tax: number;
  ordinary_tax: number;
  capital_gains_tax: number;
  marginal_rate: number;
  marginal_capital_gains_rate: number;
  effective_rate: number;
  updated_at: string;
  federal_tax: number;
  state_tax: number;
  state_code?: string;
  tax_data_updated_at: string; // Add this field to match the object in taxScenarioCalculator.ts
  tax_data_is_current: boolean; // Add this field to match the object in taxScenarioCalculator.ts
  safe_harbor?: {
    required_payment: number;
    is_compliant: boolean;
    method_used: string;
  }
}

export interface TaxDataCacheInfo {
  dataUpdatedAt: Date;
  isCurrent: boolean;
  sessionId: string;
}

export interface BracketItem {
  bracket: number; // The tax rate as a percentage (e.g., 10 for 10%)
  amount: number; // The amount of income in this bracket
  tax: number; // The tax amount for this bracket
}
