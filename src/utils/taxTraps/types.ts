
export interface TaxTrapWarning {
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  trapType: string;
  details?: string; // Added optional details
  title?: string;   // Added optional title
  description?: string; // Added optional description
  financial_impact?: number;
  icon?: 'info' | 'alertCircle' | 'alertTriangle' | 'help'; // Added icon for compatibility
}

// Re-adding the TaxTrapResult interface that was removed
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

// Adding the TaxTrapInput interface for completeness
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
