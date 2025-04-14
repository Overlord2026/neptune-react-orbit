
/**
 * Type definitions for tax calculation module
 */
import { EquityFormState, YearlyTaxImpact, EquityCompEvent, DeferralEvent } from "../../../types";

export interface TaxImpactResult {
  totalTaxableIncome: number;
  estimatedTax: number;
  amtIncome: number;
  amtImpact: number;
  deferralBenefit: number;
  spreadPerShare: number;
  exercisedShares: number;
  incomeFromExercise: number;
  deferredIncome: number;
  nextYearIncome: number;
  bracketImpact: boolean;
  bracketBefore: string;
  bracketAfter: string;
  multiYearImpact: YearlyTaxImpact[];
  equityEvents: EquityCompEvent[];
  deferralEvents: DeferralEvent[];
}

// Add the required properties to ensure compatibility with TaxOutputStep.tsx
export interface EquityScenario {
  scenario_name: string;
  type: string;
  formState?: EquityFormState;
  results?: YearlyTaxImpact[];
  amtImpact?: number;
  deferralBenefit?: number;
  
  // Required properties that must be defined (not optional)
  brackets_breakdown: {
    ordinary: { bracket: number; amount: number; tax: number }[];
    capitalGains: { bracket: number; amount: number; tax: number }[];
  };
  tax_data_updated_at: Date;
  tax_data_is_current: boolean;
  tax_data_version?: string;
  
  // Additional fields needed
  year: number;
  filing_status: string;
  total_income: number;
  agi: number;
  taxable_income: number;
  total_tax: number;
  ordinary_tax: number;
  capital_gains_tax: number;
  marginal_rate: number;
  marginal_capital_gains_rate: number;
  effective_rate: number;
  updated_at: Date;
}
