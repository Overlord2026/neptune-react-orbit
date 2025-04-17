
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
  financial_impact?: {
    amount: number;
    description: string;
  };
}

export interface TaxTrapResult {
  warnings: TaxTrapWarning[];
  scenario_id?: string;
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
