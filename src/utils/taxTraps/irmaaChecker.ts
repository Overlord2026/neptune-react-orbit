
import { TaxTrapWarning } from './types';

// IRMAA Thresholds
interface IRMAAThreshold {
  year: number;
  filing_status: string;
  magi_min: number;
  magi_max: number;
  monthly_surcharge_partB: number;
  monthly_surcharge_partD: number;
}

const IRMAA_THRESHOLDS: IRMAAThreshold[] = [
  // 2023 Single
  { year: 2023, filing_status: 'single', magi_min: 0, magi_max: 97000, monthly_surcharge_partB: 0, monthly_surcharge_partD: 0 },
  { year: 2023, filing_status: 'single', magi_min: 97000, magi_max: 123000, monthly_surcharge_partB: 65.90, monthly_surcharge_partD: 12.20 },
  { year: 2023, filing_status: 'single', magi_min: 123000, magi_max: 153000, monthly_surcharge_partB: 164.80, monthly_surcharge_partD: 31.50 },
  { year: 2023, filing_status: 'single', magi_min: 153000, magi_max: 183000, monthly_surcharge_partB: 263.70, monthly_surcharge_partD: 50.70 },
  { year: 2023, filing_status: 'single', magi_min: 183000, magi_max: 500000, monthly_surcharge_partB: 362.60, monthly_surcharge_partD: 70.00 },
  { year: 2023, filing_status: 'single', magi_min: 500000, magi_max: Infinity, monthly_surcharge_partB: 395.60, monthly_surcharge_partD: 76.40 },
  
  // 2023 Married
  { year: 2023, filing_status: 'married', magi_min: 0, magi_max: 194000, monthly_surcharge_partB: 0, monthly_surcharge_partD: 0 },
  { year: 2023, filing_status: 'married', magi_min: 194000, magi_max: 246000, monthly_surcharge_partB: 65.90, monthly_surcharge_partD: 12.20 },
  { year: 2023, filing_status: 'married', magi_min: 246000, magi_max: 306000, monthly_surcharge_partB: 164.80, monthly_surcharge_partD: 31.50 },
  { year: 2023, filing_status: 'married', magi_min: 306000, magi_max: 366000, monthly_surcharge_partB: 263.70, monthly_surcharge_partD: 50.70 },
  { year: 2023, filing_status: 'married', magi_min: 366000, magi_max: 750000, monthly_surcharge_partB: 362.60, monthly_surcharge_partD: 70.00 },
  { year: 2023, filing_status: 'married', magi_min: 750000, magi_max: Infinity, monthly_surcharge_partB: 395.60, monthly_surcharge_partD: 76.40 },
];

/**
 * Check for IRMAA surcharges based on MAGI
 */
export function checkIRMAASurcharges(
  year: number,
  filingStatus: string,
  magi: number
): { partB_surcharge: number; partD_surcharge: number } {
  // Find applicable thresholds for the year and filing status
  const thresholds = IRMAA_THRESHOLDS.filter(
    t => t.year === year && t.filing_status === filingStatus
  );
  
  if (thresholds.length === 0) {
    // Default to 2023 if year not found
    const latestThresholds = IRMAA_THRESHOLDS.filter(
      t => t.filing_status === filingStatus
    );
    
    // If we still have no thresholds, return zero surcharges
    if (latestThresholds.length === 0) {
      return { partB_surcharge: 0, partD_surcharge: 0 };
    }
  }
  
  // Find the applicable bracket
  const bracket = thresholds.find(t => magi >= t.magi_min && magi < t.magi_max);
  
  if (!bracket) {
    // If no bracket found, return zero surcharges
    return { partB_surcharge: 0, partD_surcharge: 0 };
  }
  
  return {
    partB_surcharge: bracket.monthly_surcharge_partB,
    partD_surcharge: bracket.monthly_surcharge_partD
  };
}

export function generateIRMAAWarning(
  irmaaResult: { partB_surcharge: number; partD_surcharge: number }
): TaxTrapWarning | null {
  const { partB_surcharge, partD_surcharge } = irmaaResult;
  
  if (partB_surcharge > 0 || partD_surcharge > 0) {
    const annual_impact = (partB_surcharge + partD_surcharge) * 12;
    
    return {
      type: 'irmaa',
      severity: 'warning',
      title: 'IRMAA Medicare Surcharge Alert',
      description: `Your income may trigger an IRMAA surcharge of $${partB_surcharge.toFixed(2)} per month for Medicare Part B and $${partD_surcharge.toFixed(2)} for Part D.`,
      financial_impact: annual_impact,
      icon: 'alertCircle'
    };
  }
  
  return null;
}
