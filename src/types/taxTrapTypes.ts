
/**
 * Tax Trap Types
 * 
 * Definitions for tax traps and related warnings
 */

export interface TaxTrapWarning {
  id?: string;
  trapType: string;
  message: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
  remediation?: string;
  threshold?: {
    value: number;
    units: string;
  };
  financial_impact?: number;
  type: string;
  title: string;
  description?: string;
  impact?: number;
  icon?: 'info' | 'alertCircle' | 'alertTriangle' | 'help';
  name?: string;
}

export interface TaxTrapResult {
  warnings: TaxTrapWarning[];
  scenario_id?: string;
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

export interface TrapAlert {
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  trapType: string;
  details: string;
}

export interface TrapAvoidance {
  type: string;
  message: string;
  action: string;
  impact: number;
}
