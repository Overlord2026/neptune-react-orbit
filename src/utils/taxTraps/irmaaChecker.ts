import { TaxTrapWarning } from './types';

// IRMAA Income Threshold Brackets for 2023
// Note: These brackets change yearly with inflation adjustments
interface IrmaaThreshold {
  year: number;
  filing_status: string;
  tier: number;
  income_min: number;
  income_max: number;
  partB_surcharge: number;
  partD_surcharge: number;
}

const IRMAA_THRESHOLDS: IrmaaThreshold[] = [
  // 2023 Single/Separate
  { year: 2023, filing_status: 'single', tier: 1, income_min: 0, income_max: 97000, partB_surcharge: 0, partD_surcharge: 0 },
  { year: 2023, filing_status: 'single', tier: 2, income_min: 97000, income_max: 123000, partB_surcharge: 65.90, partD_surcharge: 12.20 },
  { year: 2023, filing_status: 'single', tier: 3, income_min: 123000, income_max: 153000, partB_surcharge: 164.80, partD_surcharge: 31.50 },
  { year: 2023, filing_status: 'single', tier: 4, income_min: 153000, income_max: 183000, partB_surcharge: 263.70, partD_surcharge: 50.70 },
  { year: 2023, filing_status: 'single', tier: 5, income_min: 183000, income_max: 500000, partB_surcharge: 362.60, partD_surcharge: 70.00 },
  { year: 2023, filing_status: 'single', tier: 6, income_min: 500000, income_max: Infinity, partB_surcharge: 395.60, partD_surcharge: 76.40 },
  
  // 2023 Joint
  { year: 2023, filing_status: 'joint', tier: 1, income_min: 0, income_max: 194000, partB_surcharge: 0, partD_surcharge: 0 },
  { year: 2023, filing_status: 'joint', tier: 2, income_min: 194000, income_max: 246000, partB_surcharge: 65.90, partD_surcharge: 12.20 },
  { year: 2023, filing_status: 'joint', tier: 3, income_min: 246000, income_max: 306000, partB_surcharge: 164.80, partD_surcharge: 31.50 },
  { year: 2023, filing_status: 'joint', tier: 4, income_min: 306000, income_max: 366000, partB_surcharge: 263.70, partD_surcharge: 50.70 },
  { year: 2023, filing_status: 'joint', tier: 5, income_min: 366000, income_max: 750000, partB_surcharge: 362.60, partD_surcharge: 70.00 },
  { year: 2023, filing_status: 'joint', tier: 6, income_min: 750000, income_max: Infinity, partB_surcharge: 395.60, partD_surcharge: 76.40 }
];

/**
 * Calculate IRMAA surcharges based on income
 */
export function calculateIrmaaSurcharges(
  income: number,
  filingStatus: string = 'single',
  year: number = 2023
): { partB_surcharge: number; partD_surcharge: number; annual_impact: number } {
  // First normalize filing status
  const normalizedStatus = filingStatus === 'married' || filingStatus === 'married_joint' ? 'joint' : 'single';
  
  // Find applicable threshold
  const thresholds = IRMAA_THRESHOLDS.filter(
    t => t.year === year && t.filing_status === normalizedStatus
  );
  
  if (thresholds.length === 0) {
    // Default to no surcharge if no data found
    return { partB_surcharge: 0, partD_surcharge: 0, annual_impact: 0 };
  }
  
  // Find applicable tier
  const applicableTier = thresholds.find(
    t => income >= t.income_min && income < t.income_max
  ) || thresholds[thresholds.length - 1]; // Default to highest tier if above all thresholds
  
  const { partB_surcharge, partD_surcharge } = applicableTier;
  const annual_impact = (partB_surcharge + partD_surcharge) * 12;
  
  return { partB_surcharge, partD_surcharge, annual_impact };
}

/**
 * Generate IRMAA warning if applicable
 */
export function generateIrmaaWarning(
  income: number,
  filingStatus: string,
  year: number = 2023
): TaxTrapWarning | null {
  const { partB_surcharge, partD_surcharge, annual_impact } = calculateIrmaaSurcharges(
    income,
    filingStatus,
    year
  );

  if (annual_impact > 0) {
    // Determine proximity to next threshold
    const normalizedStatus = filingStatus === 'married' || filingStatus === 'married_joint' ? 'joint' : 'single';
    const thresholds = IRMAA_THRESHOLDS.filter(t => t.filing_status === normalizedStatus);
    
    // Find current tier
    const currentTierIndex = thresholds.findIndex(t => income >= t.income_min && income < t.income_max);
    
    // Determine severity based on surcharge amount
    const severityLevel = annual_impact > 3000 ? 'high' : 'medium';
    
    return {
      trapType: 'irmaa',
      message: `Your income triggers Medicare IRMAA surcharges of $${annual_impact.toFixed(2)} annually ($${(partB_surcharge + partD_surcharge).toFixed(2)}/month).`,
      severity: severityLevel,
      title: 'Medicare IRMAA Surcharge',
      description: `Your income triggers Medicare IRMAA surcharges of $${annual_impact.toFixed(2)} annually ($${(partB_surcharge + partD_surcharge).toFixed(2)}/month).`,
      financial_impact: annual_impact,
      icon: 'alertCircle'
    };
  }

  return null;
}
