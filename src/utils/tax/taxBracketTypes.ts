
/**
 * Tax Bracket Types and Standard Deduction Data
 */
import { FilingStatusType, LegacyFilingStatusType } from '@/types/tax/filingTypes';

// Export formatters for backward compatibility
export { formatCurrency, formatPercent } from '../formatUtils';
export type { FilingStatusType, LegacyFilingStatusType } from '@/types/tax/filingTypes';
export { convertLegacyFilingStatus } from '@/types/tax/filingTypes';

// Tax bracket types
export type BracketType = "ordinary" | "ltcg";

// Standard deduction values for 2023
export const STANDARD_DEDUCTION = {
  single: 13850,
  marriedFilingJointly: 27700,
  marriedFilingSeparately: 13850,
  headOfHousehold: 20800
};

// Standard deduction by year and filing status
export const STANDARD_DEDUCTION_BY_YEAR = {
  2022: {
    single: 12950,
    married_joint: 25900, 
    married_separate: 12950,
    head_of_household: 19400,
    qualifying_widow: 25900
  },
  2023: {
    single: 13850,
    married_joint: 27700,
    married_separate: 13850,
    head_of_household: 20800,
    qualifying_widow: 27700
  },
  2024: {
    single: 14600,
    married_joint: 29200,
    married_separate: 14600,
    head_of_household: 21900,
    qualifying_widow: 29200
  }
};

// Helper function to convert modern filing status to legacy
export const convertFilingStatusToLegacy = (filingStatus: FilingStatusType): LegacyFilingStatusType => {
  if (filingStatus === 'married_joint') return 'married';
  return filingStatus as LegacyFilingStatusType;
};
