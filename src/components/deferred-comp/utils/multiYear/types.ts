
/**
 * Types for multi-year calculation modules
 */
import { EquityFormState } from '../../types';

export interface YearConfiguration {
  year: number;
  baseIncome: number;
  spouseBaseIncome?: number;
}

export interface ConversionInput {
  scenarioData: EquityFormState;
  totalPreConversionIncome: number;
  currentYear: number;
  baseIncome: number;
  rmdAmount: number;
  spouseBaseIncome?: number;
  spouseRmdAmount?: number;
  traditionalIRABalance?: number;
  spouseTraditionalIRABalance?: number;
}
