import { TaxTrapInput, TaxTrapResult, TaxTrapWarning } from './taxTraps/types';

// Simulate checking for IRMAA thresholds
const checkIRMAAThresholds = (income: number, filingStatus: string): import('./taxTraps/types').TaxTrapWarning | null => {
  // IRMAA thresholds for 2023 (simplified)
  const singleThresholds = [97000, 123000, 153000, 183000, 500000];
  const marriedThresholds = [194000, 246000, 306000, 366000, 750000];
  
  const thresholds = filingStatus === 'single' ? singleThresholds : marriedThresholds;
  
  // Check which threshold the income exceeds
  if (income > thresholds[4]) {
    return {
      trapType: 'medicare',
      message: 'Your income places you in the highest IRMAA tier',
      severity: 'high',
      title: 'Medicare IRMAA Surcharge',
      details: `Income over ${thresholds[4].toLocaleString()} results in maximum IRMAA surcharges`,
      description: 'Consider strategies to reduce your MAGI to lower your Medicare premium surcharges',
      financial_impact: 642.30 * 12, // Monthly surcharge * 12
      icon: 'alertCircle'
    };
  } else if (income > thresholds[0]) {
    // Find which tier they're in (simplified)
    const surcharge = income > thresholds[3] ? 386.10 : 
                      income > thresholds[2] ? 257.30 : 
                      income > thresholds[1] ? 154.30 : 64.30;
                      
    return {
      trapType: 'medicare',
      message: 'Your income exceeds the base IRMAA threshold',
      severity: 'medium',
      title: 'Medicare IRMAA Surcharge',
      details: `Income over ${thresholds[0].toLocaleString()} triggers IRMAA surcharges`,
      description: 'Consider income management strategies to reduce or eliminate these surcharges',
      financial_impact: surcharge * 12, // Monthly surcharge * 12
      icon: 'alertCircle'
    };
  }
  
  return null;
};

// Simulate checking for capital gains rate thresholds
const checkCapitalGainsTrap = (income: number, capitalGains: number, filingStatus: string): import('./taxTraps/types').TaxTrapWarning | null => {
  // 2023 thresholds for 0%/15%/20% capital gains brackets (simplified)
  const zeroTo15Threshold = filingStatus === 'single' ? 44625 : 89250;
  const fifteenTo20Threshold = filingStatus === 'single' ? 492300 : 553850;
  
  if (income > fifteenTo20Threshold) {
    return {
      trapType: 'tax_bracket',
      message: 'Your income places you in the 20% capital gains bracket',
      severity: 'medium',
      title: 'Capital Gains Tax Impact',
      details: 'Income above threshold results in 20% long-term capital gains rate',
      description: 'Consider timing capital gains realizations in lower-income years',
      financial_impact: capitalGains * 0.05, // Estimated impact of 5% higher rate
      icon: 'alertTriangle'
    };
  } else if (income > zeroTo15Threshold && income < zeroTo15Threshold + 10000) {
    return {
      trapType: 'tax_bracket',
      message: 'Your income is near the 0% to 15% capital gains threshold',
      severity: 'low',
      title: 'Capital Gains Planning Opportunity',
      details: 'You may be able to realize gains at 0% rate with planning',
      description: 'Consider strategies to keep taxable income below the 0% capital gains threshold',
      financial_impact: capitalGains * 0.15, // Potential savings
      icon: 'info'
    };
  }
  
  return null;
};

// Main function to check for tax traps
export const checkTaxTraps = (input: import('./taxTraps/types').TaxTrapInput): import('./taxTraps/types').TaxTrapResult => {
  const warnings: import('./taxTraps/types').TaxTrapWarning[] = [];
  let irmaa_data, capital_gains_data, social_security_data, aca_data;
  
  // Check for IRMAA if on Medicare
  if (input.medicare_enrollment) {
    const irmaaWarning = checkIRMAAThresholds(input.magi || input.agi, input.filing_status);
    if (irmaaWarning) {
      warnings.push(irmaaWarning);
      irmaa_data = {
        partB_surcharge: input.magi! > 500000 ? 396.10 : 164.30,
        partD_surcharge: input.magi! > 500000 ? 76.40 : 12.90,
        annual_impact: irmaaWarning.financial_impact || 0
      };
    }
  }
  
  // Check for capital gains trap
  if (input.capital_gains_long > 0) {
    const capitalGainsWarning = checkCapitalGainsTrap(input.taxable_income, input.capital_gains_long, input.filing_status);
    if (capitalGainsWarning) {
      warnings.push(capitalGainsWarning);
      capital_gains_data = {
        current_rate: input.taxable_income > 492300 ? 0.20 : 0.15,
        potential_rate: input.taxable_income > 492300 ? 0.20 : 0.0,
        tax_increase: capitalGainsWarning.financial_impact || 0
      };
    }
  }
  
  // Add additional tax traps here (Social Security, ACA, etc)
  
  return {
    scenario_id: input.scenario_id,
    warnings,
    irmaa_data,
    capital_gains_data,
    social_security_data,
    aca_data
  };
};

// Directly export interfaces for type-safe imports elsewhere
export type { TaxTrapWarning, TaxTrapInput, TaxTrapResult } from './taxTraps/types';
