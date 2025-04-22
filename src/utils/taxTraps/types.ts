
export interface TaxTrapWarning {
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  trapType: string;
  details?: string; // Added optional details
  title?: string;   // Added optional title
  description?: string; // Added optional description
  financial_impact?: number;
}
