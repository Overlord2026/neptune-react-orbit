

// Shared types for tax trap detection

export interface TaxTrapInput {
  scenario_id: string;
  year: number;
  filing_status: 'single' | 'married' | 'married_separate' | 'head_of_household';
  agi: number;
  magi?: number; // Modified AGI (includes tax-exempt interest, etc.)
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

export interface TaxTrapWarning {
  type: 'irmaa' | 'capital_gains' | 'social_security' | 'aca' | 'charitable_opportunity' | string;
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  financial_impact: number; // Estimated dollar impact
  icon?: 'info' | 'alertCircle' | 'alertTriangle' | 'help';
  trapType?: string; // Added for compatibility with code using this property
  name?: string; // For compatibility with CharitableContributionImpact
}

export interface TaxTrapResult {
  scenario_id: string;
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
