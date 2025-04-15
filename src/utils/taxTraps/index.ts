
import { TaxTrapInput, TaxTrapResult, TaxTrapWarning } from './types';

/**
 * Check for tax traps in a scenario
 */
export function checkTaxTraps(input: TaxTrapInput): TaxTrapResult {
  const warnings: TaxTrapWarning[] = [];
  let irmaa_data;
  let social_security_data;
  let capital_gains_data;
  let aca_data;

  // Check for IRMAA
  if (input.medicare_enrollment && input.magi) {
    const irmaaThreshold = input.filing_status === 'single' ? 97000 : 194000;
    if (input.magi > irmaaThreshold) {
      const surchargePartB = input.magi > 500000 ? 395.60 : 
                          input.magi > 330000 ? 297.90 :
                          input.magi > 222000 ? 178.70 :
                          input.magi > 194000 ? 59.40 : 0;
                      
      const surchargePartD = input.magi > 500000 ? 80.30 : 
                          input.magi > 330000 ? 59.80 :
                          input.magi > 222000 ? 38.80 :
                          input.magi > 194000 ? 12.90 : 0;
      
      const annualImpact = (surchargePartB + surchargePartD) * 12;
      
      warnings.push({
        type: 'irmaa',
        severity: 'warning',
        title: 'Medicare IRMAA Surcharge Triggered',
        description: `Your MAGI of $${input.magi.toLocaleString()} exceeds the IRMAA threshold, triggering additional Medicare premium costs.`,
        financial_impact: annualImpact,
        icon: 'alertCircle'
      });
      
      irmaa_data = {
        partB_surcharge: surchargePartB,
        partD_surcharge: surchargePartD,
        annual_impact: annualImpact
      };
    }
  }

  // Check for Social Security taxation
  if (input.social_security_amount > 0) {
    const combinedIncome = input.magi ? 
      input.magi + (input.social_security_amount * 0.5) :
      input.agi + (input.social_security_amount * 0.5);
    
    let taxablePercentage = 0;
    const threshold1 = input.filing_status === 'single' ? 25000 : 32000;
    const threshold2 = input.filing_status === 'single' ? 34000 : 44000;
    
    if (combinedIncome > threshold2) {
      taxablePercentage = 85;
    } else if (combinedIncome > threshold1) {
      taxablePercentage = 50;
    }
    
    if (taxablePercentage > 0) {
      const taxableSSAmount = input.social_security_amount * (taxablePercentage / 100);
      const approxTaxRate = input.filing_status === 'single' ? 0.22 : 0.15;
      const taxImpact = taxableSSAmount * approxTaxRate;
      
      warnings.push({
        type: 'social_security',
        severity: taxablePercentage === 85 ? 'warning' : 'info',
        title: `${taxablePercentage}% of Social Security Taxable`,
        description: `Based on your combined income, ${taxablePercentage}% of your Social Security benefits are subject to income tax.`,
        financial_impact: taxImpact,
        icon: 'info'
      });
      
      social_security_data = {
        taxable_percentage: taxablePercentage,
        tax_increase: Math.round(taxImpact)
      };
    }
  }

  // Check for capital gains bracket jump
  if (input.capital_gains_long > 5000) {
    const incomeBeforeCG = input.taxable_income - input.capital_gains_long;
    const threshold = input.filing_status === 'single' ? 44625 : 89250; // 0% to 15% threshold
    
    if (incomeBeforeCG < threshold && (incomeBeforeCG + input.capital_gains_long) > threshold) {
      const amountInHigherBracket = (incomeBeforeCG + input.capital_gains_long) - threshold;
      const taxIncrease = amountInHigherBracket * 0.15;
      
      warnings.push({
        type: 'capital_gains',
        severity: 'alert',
        title: 'Capital Gains Rate Increase',
        description: `Your capital gains crossed from the 0% to 15% tax bracket, causing a significant tax increase.`,
        financial_impact: taxIncrease,
        icon: 'alertTriangle'
      });
      
      capital_gains_data = {
        current_rate: 15,
        potential_rate: 0,
        tax_increase: Math.round(taxIncrease)
      };
    }
  }

  // Check for ACA subsidy cliff
  if (input.aca_enrollment) {
    const fplAmount = 13590 + ((input.household_size - 1) * 4720); // Approximate 2023 FPL
    const fplPercentage = (input.magi || input.agi) / fplAmount * 100;
    
    if (fplPercentage > 395 && fplPercentage < 410) {
      const subsidyLoss = input.household_size * 4000; // Rough estimate
      
      warnings.push({
        type: 'aca',
        severity: 'alert',
        title: 'ACA Subsidy Cliff Risk',
        description: `Your income is close to 400% of the Federal Poverty Level, risking loss of ACA premium subsidies.`,
        financial_impact: subsidyLoss,
        icon: 'alertTriangle'
      });
      
      aca_data = {
        current_fpl_percentage: Math.round(fplPercentage),
        subsidy_impact: subsidyLoss
      };
    }
  }

  // Opportunity for charitable contributions
  if (input.taxable_income > 150000) {
    warnings.push({
      type: 'charitable_opportunity',
      severity: 'info',
      title: 'Charitable Giving Opportunity',
      description: `Your high income level provides tax-saving opportunities through strategic charitable contributions.`,
      financial_impact: Math.round(input.taxable_income * 0.02), // Rough estimate of potential savings
      icon: 'info'
    });
  }

  return {
    scenario_id: input.scenario_id,
    warnings,
    irmaa_data,
    social_security_data,
    capital_gains_data,
    aca_data
  };
}

export * from './types';
