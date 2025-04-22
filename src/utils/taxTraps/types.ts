
/**
 * TaxTrapWarning - unified warning type for all tax trap modules
 */
export interface TaxTrapWarning {
  id?: string;                // If code references id
  trapType: string;           // See note: used instead of "type"
  severity: 'low' | 'medium' | 'high';
  message?: string;           // Used in some warnings
  title?: string;             // Used in some warnings
  description?: string;       // Used in some warnings
  details?: string;           // Used in some warnings
  financial_impact?: number;  // Dollars
  icon?: string;              // e.g., "alertTriangle", "info", etc
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
