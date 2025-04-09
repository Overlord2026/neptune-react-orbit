
import { TaxResult } from './taxCalculator';

// Types for trap detection
export interface TaxTrapInput {
  scenario_id: string;
  year: number;
  filing_status: 'single' | 'married' | 'married_separate' | 'head_of_household';
  agi: number;
  magi?: number; // Modified AGI (includes tax-exempt interest, etc.)
  total_income: number;
  taxable_income: number;
  capital_gains_long: number;
  capital_gains_short: number;
  social_security_amount: number;
  household_size: number;
  medicare_enrollment: boolean;
  aca_enrollment: boolean;
  state_of_residence?: string;
}

export interface TaxTrapWarning {
  type: 'irmaa' | 'capital_gains' | 'social_security' | 'aca';
  severity: 'info' | 'warning' | 'alert';
  title: string;
  description: string;
  financial_impact: number; // Estimated dollar impact
  icon?: 'info' | 'alertCircle' | 'alertTriangle' | 'help';
}

export interface TaxTrapResult {
  scenario_id: string;
  warnings: TaxTrapWarning[];
  irmaa_data?: {
    partB_surcharge: number;
    partD_surcharge: number;
    annual_impact: number;
  };
  capital_gains_data?: {
    current_rate: number;
    potential_rate: number;
    tax_increase: number;
  };
  social_security_data?: {
    taxable_percentage: number;
    tax_increase: number;
  };
  aca_data?: {
    current_fpl_percentage: number;
    subsidy_impact: number;
  };
}

// Mock data structures (would be replaced by database queries)
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

// Capital Gains Thresholds
interface CapitalGainsThreshold {
  year: number;
  filing_status: string;
  bracket_rate: number;
  bracket_min: number;
  bracket_max: number;
}

const CAPITAL_GAINS_THRESHOLDS: CapitalGainsThreshold[] = [
  // 2023 Single
  { year: 2023, filing_status: 'single', bracket_rate: 0, bracket_min: 0, bracket_max: 44625 },
  { year: 2023, filing_status: 'single', bracket_rate: 15, bracket_min: 44625, bracket_max: 492300 },
  { year: 2023, filing_status: 'single', bracket_rate: 20, bracket_min: 492300, bracket_max: Infinity },
  
  // 2023 Married
  { year: 2023, filing_status: 'married', bracket_rate: 0, bracket_min: 0, bracket_max: 89250 },
  { year: 2023, filing_status: 'married', bracket_rate: 15, bracket_min: 89250, bracket_max: 553850 },
  { year: 2023, filing_status: 'married', bracket_rate: 20, bracket_min: 553850, bracket_max: Infinity },
  
  // 2023 Head of Household
  { year: 2023, filing_status: 'head_of_household', bracket_rate: 0, bracket_min: 0, bracket_max: 59750 },
  { year: 2023, filing_status: 'head_of_household', bracket_rate: 15, bracket_min: 59750, bracket_max: 523050 },
  { year: 2023, filing_status: 'head_of_household', bracket_rate: 20, bracket_min: 523050, bracket_max: Infinity },
];

// Social Security Taxation Thresholds
interface SocialSecurityThreshold {
  filing_status: string;
  threshold1: number; // 50% taxable threshold
  threshold2: number; // 85% taxable threshold
  notes: string;
}

const SOCIAL_SECURITY_THRESHOLDS: SocialSecurityThreshold[] = [
  { 
    filing_status: 'single', 
    threshold1: 25000, 
    threshold2: 34000, 
    notes: 'Income between threshold1 and threshold2 makes up to 50% of benefits taxable. Above threshold2, up to 85% may be taxable.'
  },
  { 
    filing_status: 'married', 
    threshold1: 32000, 
    threshold2: 44000, 
    notes: 'Income between threshold1 and threshold2 makes up to 50% of benefits taxable. Above threshold2, up to 85% may be taxable.'
  },
  { 
    filing_status: 'married_separate', 
    threshold1: 0, 
    threshold2: 0, 
    notes: 'Up to 85% of benefits may be taxable regardless of income.'
  },
  { 
    filing_status: 'head_of_household', 
    threshold1: 25000, 
    threshold2: 34000, 
    notes: 'Uses same thresholds as single filers.'
  }
];

// ACA Subsidy Thresholds
interface ACASubsidyThreshold {
  year: number;
  household_size: number;
  fpl_min: number; // % of FPL
  fpl_max: number; // % of FPL
  premium_cap_percent: number;
  fpl_amount: number; // Base Federal Poverty Level for this household size
}

const ACA_SUBSIDY_THRESHOLDS: ACASubsidyThreshold[] = [
  // 2023 - Household Size 1
  { year: 2023, household_size: 1, fpl_min: 0, fpl_max: 150, premium_cap_percent: 0, fpl_amount: 13590 },
  { year: 2023, household_size: 1, fpl_min: 150, fpl_max: 200, premium_cap_percent: 2, fpl_amount: 13590 },
  { year: 2023, household_size: 1, fpl_min: 200, fpl_max: 250, premium_cap_percent: 4, fpl_amount: 13590 },
  { year: 2023, household_size: 1, fpl_min: 250, fpl_max: 300, premium_cap_percent: 6, fpl_amount: 13590 },
  { year: 2023, household_size: 1, fpl_min: 300, fpl_max: 400, premium_cap_percent: 8.5, fpl_amount: 13590 },
  { year: 2023, household_size: 1, fpl_min: 400, fpl_max: Infinity, premium_cap_percent: Infinity, fpl_amount: 13590 },
  
  // 2023 - Household Size 2
  { year: 2023, household_size: 2, fpl_min: 0, fpl_max: 150, premium_cap_percent: 0, fpl_amount: 18310 },
  { year: 2023, household_size: 2, fpl_min: 150, fpl_max: 200, premium_cap_percent: 2, fpl_amount: 18310 },
  { year: 2023, household_size: 2, fpl_min: 200, fpl_max: 250, premium_cap_percent: 4, fpl_amount: 18310 },
  { year: 2023, household_size: 2, fpl_min: 250, fpl_max: 300, premium_cap_percent: 6, fpl_amount: 18310 },
  { year: 2023, household_size: 2, fpl_min: 300, fpl_max: 400, premium_cap_percent: 8.5, fpl_amount: 18310 },
  { year: 2023, household_size: 2, fpl_min: 400, fpl_max: Infinity, premium_cap_percent: Infinity, fpl_amount: 18310 },
  
  // 2023 - Household Size 4 (simplified)
  { year: 2023, household_size: 4, fpl_min: 0, fpl_max: 150, premium_cap_percent: 0, fpl_amount: 27750 },
  { year: 2023, household_size: 4, fpl_min: 150, fpl_max: 200, premium_cap_percent: 2, fpl_amount: 27750 },
  { year: 2023, household_size: 4, fpl_min: 200, fpl_max: 250, premium_cap_percent: 4, fpl_amount: 27750 },
  { year: 2023, household_size: 4, fpl_min: 250, fpl_max: 300, premium_cap_percent: 6, fpl_amount: 27750 },
  { year: 2023, household_size: 4, fpl_min: 300, fpl_max: 400, premium_cap_percent: 8.5, fpl_amount: 27750 },
  { year: 2023, household_size: 4, fpl_min: 400, fpl_max: Infinity, premium_cap_percent: Infinity, fpl_amount: 27750 },
];

/**
 * Calculate the taxable portion of Social Security benefits based on income thresholds
 */
export function calculateTaxableSocialSecurity(
  socialSecurityAmount: number, 
  otherIncome: number, 
  filingStatus: string
): number {
  // Find applicable threshold
  const threshold = SOCIAL_SECURITY_THRESHOLDS.find(t => t.filing_status === filingStatus) || 
    SOCIAL_SECURITY_THRESHOLDS[0]; // Default to single if not found
  
  // Calculate provisional income (other income + 50% of social security)
  const provisionalIncome = otherIncome + (socialSecurityAmount * 0.5);
  
  // Calculate taxable amount
  if (provisionalIncome <= threshold.threshold1) {
    // Below first threshold - none taxable
    return 0;
  } else if (provisionalIncome <= threshold.threshold2) {
    // Between thresholds - up to 50% taxable
    const taxableAmount = Math.min(
      socialSecurityAmount * 0.5,
      (provisionalIncome - threshold.threshold1) * 0.5
    );
    return Math.max(0, taxableAmount);
  } else {
    // Above second threshold - up to 85% taxable
    const baseAmount = Math.min(
      socialSecurityAmount * 0.5,
      (threshold.threshold2 - threshold.threshold1) * 0.5
    );
    const additionalAmount = Math.min(
      socialSecurityAmount * 0.85 - baseAmount,
      (provisionalIncome - threshold.threshold2) * 0.85
    );
    return Math.max(0, baseAmount + additionalAmount);
  }
}

/**
 * Check for IRMAA surcharges based on MAGI
 */
function checkIRMAASurcharges(
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

/**
 * Check for capital gains rate changes
 */
function checkCapitalGainsRate(
  year: number,
  filingStatus: string,
  taxableIncome: number
): { current_rate: number; threshold_to_next_bracket: number | null } {
  // Find applicable thresholds for the year and filing status
  const thresholds = CAPITAL_GAINS_THRESHOLDS.filter(
    t => t.year === year && t.filing_status === filingStatus
  );
  
  if (thresholds.length === 0) {
    // Default to 15% if no data found
    return { current_rate: 15, threshold_to_next_bracket: null };
  }
  
  // Find the current bracket
  const currentBracket = thresholds.find(
    t => taxableIncome >= t.bracket_min && taxableIncome < t.bracket_max
  );
  
  if (!currentBracket) {
    // Default to highest bracket if income exceeds all brackets
    const highestBracket = thresholds.reduce(
      (prev, current) => (current.bracket_max > prev.bracket_max ? current : prev), 
      thresholds[0]
    );
    return { current_rate: highestBracket.bracket_rate, threshold_to_next_bracket: null };
  }
  
  // Find the next bracket threshold
  const nextBracket = thresholds.find(t => t.bracket_min > currentBracket.bracket_max);
  const threshold_to_next_bracket = nextBracket ? nextBracket.bracket_min : null;
  
  return {
    current_rate: currentBracket.bracket_rate,
    threshold_to_next_bracket
  };
}

/**
 * Check for ACA subsidy impacts
 */
function checkACASubsidyImpact(
  year: number,
  householdSize: number,
  magi: number
): { fpl_percentage: number; premium_cap_percent: number; subsidy_impact: number } {
  // Find applicable thresholds for the year and household size
  let thresholds = ACA_SUBSIDY_THRESHOLDS.filter(
    t => t.year === year && t.household_size === householdSize
  );
  
  if (thresholds.length === 0) {
    // Try to find thresholds for the closest household size
    const allSizes = [...new Set(ACA_SUBSIDY_THRESHOLDS.map(t => t.household_size))];
    const closestSize = allSizes.reduce((prev, curr) => 
      Math.abs(curr - householdSize) < Math.abs(prev - householdSize) ? curr : prev
    );
    
    thresholds = ACA_SUBSIDY_THRESHOLDS.filter(
      t => t.year === year && t.household_size === closestSize
    );
    
    if (thresholds.length === 0) {
      // Default to no subsidy if no data found
      return { fpl_percentage: 0, premium_cap_percent: Infinity, subsidy_impact: 0 };
    }
  }
  
  // Get FPL amount for this household size
  const fplAmount = thresholds[0].fpl_amount;
  
  // Calculate FPL percentage
  const fpl_percentage = (magi / fplAmount) * 100;
  
  // Find the applicable bracket
  const bracket = thresholds.find(
    t => fpl_percentage >= t.fpl_min && fpl_percentage < t.fpl_max
  );
  
  if (!bracket) {
    // Default to no subsidy if no bracket found
    return { fpl_percentage, premium_cap_percent: Infinity, subsidy_impact: 0 };
  }
  
  // Find the next bracket for potential impact
  const currentIndex = thresholds.indexOf(bracket);
  const nextBracket = currentIndex < thresholds.length - 1 ? thresholds[currentIndex + 1] : null;
  
  // Calculate estimated subsidy impact (simplified)
  // Assume average marketplace premium of $500/month per person
  const avgMonthlyPremium = 500 * householdSize;
  let subsidy_impact = 0;
  
  if (nextBracket && fpl_percentage + 10 >= nextBracket.fpl_min) {
    // If close to next bracket, calculate potential impact
    const currentMaxContribution = (bracket.premium_cap_percent / 100) * magi / 12;
    const nextMaxContribution = (nextBracket.premium_cap_percent / 100) * magi / 12;
    
    // The impact is the difference in monthly contribution, annualized
    subsidy_impact = Math.max(0, (nextMaxContribution - currentMaxContribution) * 12);
    
    // Special case for the subsidy cliff
    if (nextBracket.premium_cap_percent === Infinity) {
      subsidy_impact = Math.max(0, (avgMonthlyPremium - currentMaxContribution) * 12);
    }
  }
  
  return {
    fpl_percentage,
    premium_cap_percent: bracket.premium_cap_percent,
    subsidy_impact
  };
}

/**
 * Main function to check various tax traps
 */
export function checkTaxTraps(input: TaxTrapInput): TaxTrapResult {
  const warnings: TaxTrapWarning[] = [];
  const result: TaxTrapResult = {
    scenario_id: input.scenario_id,
    warnings: [],
  };
  
  // Use MAGI if provided, otherwise use AGI
  const magi = input.magi || input.agi;
  
  // 1. Check IRMAA (Medicare) surcharges
  if (input.medicare_enrollment) {
    const irmaaResult = checkIRMAASurcharges(
      input.year, 
      input.filing_status,
      magi
    );
    
    if (irmaaResult.partB_surcharge > 0 || irmaaResult.partD_surcharge > 0) {
      const annual_impact = (irmaaResult.partB_surcharge + irmaaResult.partD_surcharge) * 12;
      
      result.irmaa_data = {
        partB_surcharge: irmaaResult.partB_surcharge,
        partD_surcharge: irmaaResult.partD_surcharge,
        annual_impact
      };
      
      warnings.push({
        type: 'irmaa',
        severity: 'warning',
        title: 'IRMAA Medicare Surcharge Alert',
        description: `Your income may trigger an IRMAA surcharge of $${irmaaResult.partB_surcharge.toFixed(2)} per month for Medicare Part B and $${irmaaResult.partD_surcharge.toFixed(2)} for Part D.`,
        financial_impact: annual_impact,
        icon: 'alertCircle'
      });
    }
  }
  
  // 2. Check capital gains tax rate changes
  if (input.capital_gains_long > 0) {
    const cgResult = checkCapitalGainsRate(
      input.year,
      input.filing_status,
      input.taxable_income
    );
    
    // Calculate what happens if additional income pushes them into higher bracket
    if (cgResult.threshold_to_next_bracket) {
      const distance_to_next_bracket = cgResult.threshold_to_next_bracket - input.taxable_income;
      
      if (distance_to_next_bracket < 25000) {
        // If within $25k of next bracket, warn about potential impact
        const next_rate = cgResult.current_rate === 0 ? 15 : 20;
        const rate_increase = next_rate - cgResult.current_rate;
        const tax_increase = (input.capital_gains_long * rate_increase) / 100;
        
        result.capital_gains_data = {
          current_rate: cgResult.current_rate,
          potential_rate: next_rate,
          tax_increase
        };
        
        warnings.push({
          type: 'capital_gains',
          severity: 'warning',
          title: 'Capital Gains Tax Bracket Change',
          description: `You are $${distance_to_next_bracket.toFixed(0)} away from moving from ${cgResult.current_rate}% to ${next_rate}% long-term capital gains rate.`,
          financial_impact: tax_increase,
          icon: 'alertTriangle'
        });
      }
    }
  }
  
  // 3. Check Social Security taxation
  if (input.social_security_amount > 0) {
    const otherIncome = input.total_income - input.social_security_amount;
    const taxableSS = calculateTaxableSocialSecurity(
      input.social_security_amount,
      otherIncome,
      input.filing_status
    );
    
    const taxablePercentage = (taxableSS / input.social_security_amount) * 100;
    const thresholds = SOCIAL_SECURITY_THRESHOLDS.find(t => t.filing_status === input.filing_status) || 
      SOCIAL_SECURITY_THRESHOLDS[0];
    
    // Estimate the tax impact using marginal rate (simplified approach)
    const marginalRate = 0.22; // Assume 22% marginal rate - could be refined
    const tax_increase = taxableSS * marginalRate;
    
    result.social_security_data = {
      taxable_percentage: taxablePercentage,
      tax_increase
    };
    
    if (taxablePercentage > 50) {
      warnings.push({
        type: 'social_security',
        severity: taxablePercentage > 80 ? 'alert' : 'warning',
        title: 'Social Security Tax Impact',
        description: `${Math.round(taxablePercentage)}% of your Social Security benefits may be taxable.`,
        financial_impact: tax_increase,
        icon: 'alertTriangle'
      });
    }
  }
  
  // 4. Check ACA subsidy impacts
  if (input.aca_enrollment) {
    const acaResult = checkACASubsidyImpact(
      input.year,
      input.household_size,
      magi
    );
    
    result.aca_data = {
      current_fpl_percentage: acaResult.fpl_percentage,
      subsidy_impact: acaResult.subsidy_impact
    };
    
    if (acaResult.subsidy_impact > 1000) {
      warnings.push({
        type: 'aca',
        severity: acaResult.subsidy_impact > 5000 ? 'alert' : 'warning',
        title: 'ACA Subsidy Reduction Risk',
        description: `You may lose up to $${acaResult.subsidy_impact.toFixed(0)} in annual health insurance premium assistance.`,
        financial_impact: acaResult.subsidy_impact,
        icon: 'alertCircle'
      });
    }
  }
  
  // Sort warnings by financial impact (highest first)
  result.warnings = warnings.sort((a, b) => b.financial_impact - a.financial_impact);
  
  return result;
}

/**
 * Save tax trap results to database (placeholder function)
 */
export function saveTaxTrapResults(results: TaxTrapResult): Promise<void> {
  // This would be a database operation in a real application
  console.log('Tax trap results saved:', results);
  
  // Simulate async operation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
}
