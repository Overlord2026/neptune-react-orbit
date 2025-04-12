
import { type TrapAlert } from '@/components/tax/TaxTrapAlerts';

// Re-export the TrapAlert type for use in other files
export type { TrapAlert };

// Define additional types for tax trap functionality
export interface TaxTrapSummary {
  alerts: TrapAlert[];
  totalFinancialImpact: number;
}

export interface TaxBracketThreshold {
  rate: number;
  threshold: number;
  maxIncome: number;
}
