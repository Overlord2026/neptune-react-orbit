
/**
 * Re-export tax filing types from central location
 */
import { 
  FilingStatusType, 
  LegacyFilingStatusType, 
  W2Form, 
  TaxReturnData, 
  Dependent, 
  FilingStep, 
  ItemizedDeductions,
  convertLegacyFilingStatus,
  FILING_STEPS
} from '../../../types/tax/filingTypes';

export type {
  FilingStatusType,
  LegacyFilingStatusType,
  W2Form,
  TaxReturnData,
  Dependent,
  FilingStep,
  ItemizedDeductions
};

export { convertLegacyFilingStatus, FILING_STEPS };
