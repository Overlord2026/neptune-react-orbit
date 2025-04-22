
/**
 * TaxTrapWarning - unified warning type for all tax trap modules
 */
export interface TaxTrapWarning {
  id?: string;
  trapType: string;
  severity: 'low' | 'medium' | 'high';
  message?: string;
  title?: string;
  description?: string;
  details?: string;
  financial_impact?: number;
  icon?: string;
}

/**
 * TaxTrapResult - outcome of tax trap analysis
 */
export interface TaxTrapResult {
  scenario_id?: string;
  warnings: TaxTrapWarning[];
  irmaa_data?: {
    partB_surcharge: number;
    partD_surcharge: number;
    annual_impact: number;
  };
  capital_gains_data?: {
    current_rate: number;
    potential_rate: number;
    tax_increase: number;
  };
  social_security_data?: {
    taxable_percentage: number;
    tax_increase: number;
  };
  aca_data?: {
    current_fpl_percentage: number;
    subsidy_impact: number;
  };
}

/**
 * TaxTrapInput - required input for checking tax traps
 */
export interface TaxTrapInput {
  scenario_id: string;
  year: number;
  filing_status: 'single' | 'married' | 'married_separate' | 'head_of_household';
  agi: number;
  magi?: number;
  total_income: number;
  taxable_income: number;
  capital_gains_long: number;
  capital_gains_short: number;
  social_security_amount: number;
  household_size: number;
  medicare_enrollment: boolean;
  aca_enrollment: boolean;
  state_of_residence?: string;
}
