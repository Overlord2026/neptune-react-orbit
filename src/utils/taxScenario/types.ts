
import { TaxResult } from '../taxCalculatorTypes';
import { YearlyTaxImpact } from '../../components/deferred-comp/types/EquityTypes';

/**
 * Type definitions for tax scenarios
 */

// Define interface for equity scenario data
export interface EquityScenario extends TaxResult {
  type: string;
  formState?: any;
  results?: YearlyTaxImpact[];
  amtImpact?: number;
  deferralBenefit?: number;
  scenario_name: string;
  
  // Required properties that must be defined (not optional)
  brackets_breakdown: {
    ordinary: { bracket: number; amount: number; tax: number }[];
    capitalGains: { bracket: number; amount: number; tax: number }[];
  };
  tax_data_updated_at: Date;
  tax_data_is_current: boolean;
  tax_data_version?: string;
}
