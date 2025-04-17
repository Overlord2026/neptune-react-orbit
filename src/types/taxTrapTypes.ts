
/**
 * Tax Trap Types
 * 
 * Definitions for tax traps and related warnings
 */

export interface TaxTrapWarning {
  id: string;
  trapType: string;
  message: string;
  details?: string;
  severity: 'low' | 'medium' | 'high';
  remediation?: string;
  threshold?: {
    value: number;
    units: string;
  };
  financial_impact?: number;
  type?: string;  // Added for compatibility
  title?: string;  // Added for compatibility
  description?: string;  // Added for compatibility
  impact?: number;  // Added for compatibility
}

export interface TaxTrapResult {
  warnings: TaxTrapWarning[];
  scenario_id?: string;  // Made optional for compatibility
  irmaa_data?: {
    partB_surcharge: number;
    partD_surcharge: number;
    annual_impact: number;
  };
  aca_data?: {
    current_fpl_percentage: number;
    subsidy_impact: number;
  };
  social_security_data?: {
    taxable_percentage: number;
    tax_increase: number;
  };
  capital_gains_data?: {
    current_rate: number;
    potential_rate: number;
    tax_increase: number;
  };
}

export interface TaxTrapThreshold {
  name: string;
  value: number;
  description: string;
  year: number;
  filingStatus: string;
}

export interface TaxTrapType {
  id: string;
  name: string;
  description: string;
  thresholds: TaxTrapThreshold[];
}
