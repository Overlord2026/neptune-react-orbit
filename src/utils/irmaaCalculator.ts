
/**
 * IRMAA (Income-Related Monthly Adjustment Amount) Calculator
 * 
 * Calculates Medicare premium surcharges based on income thresholds
 */

export interface IrmaaResult {
  part_b_surcharge: number;
  part_d_surcharge: number;
  total_surcharge: number;
  tier: number;
}

/**
 * Calculate IRMAA surcharges based on income and filing status
 */
export function calculateIrmaaImpact(magi: number, filingStatus: string, year: number): IrmaaResult {
  // Default to 2023 if year not specified
  const calcYear = year || 2023;
  
  // Different thresholds based on filing status
  const isSingle = filingStatus === 'single' || filingStatus === 'head_of_household' || filingStatus === 'married_separate';
  
  // 2023 IRMAA thresholds
  const thresholds = isSingle ? 
    [97000, 123000, 153000, 183000, 500000] : 
    [194000, 246000, 306000, 366000, 750000];
    
  // 2023 IRMAA Part B surcharges (additional monthly amount)
  const partB_surcharges = [68.0, 170.10, 272.20, 374.20, 408.20];
  
  // 2023 IRMAA Part D surcharges (additional monthly amount)
  const partD_surcharges = [12.20, 31.50, 50.70, 70.00, 76.40];
  
  // Find the applicable tier
  let tier = 0;
  for (let i = 0; i < thresholds.length; i++) {
    if (magi > thresholds[i]) {
      tier = i + 1;
    }
  }
  
  // If no surcharge applies
  if (tier === 0) {
    return {
      part_b_surcharge: 0,
      part_d_surcharge: 0,
      total_surcharge: 0,
      tier: 0
    };
  }
  
  // Apply the surcharges
  const partB = partB_surcharges[tier - 1];
  const partD = partD_surcharges[tier - 1];
  
  return {
    part_b_surcharge: partB,
    part_d_surcharge: partD,
    total_surcharge: partB + partD,
    tier
  };
}
