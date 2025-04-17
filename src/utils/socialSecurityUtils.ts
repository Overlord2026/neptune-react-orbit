
/**
 * Social Security Tax Calculation Utilities
 */

export interface SocialSecurityTaxResult {
  taxable_percentage: number;
  additional_taxable_amount: number;
  tax_impact: number;
}

/**
 * Calculate the taxability of Social Security benefits
 */
export function calculateSocialSecurityTaxability(
  agi: number, 
  socialSecurityAmount: number, 
  filingStatus: string
): SocialSecurityTaxResult {
  // Base amounts for determining taxability of Social Security benefits
  const baseAmount = filingStatus === 'married_joint' ? 32000 : 25000;
  const secondThreshold = filingStatus === 'married_joint' ? 44000 : 34000;
  
  // Calculate combined income (AGI + tax-exempt interest + 1/2 of SS benefits)
  // Here we simplify by assuming no tax-exempt interest
  const combinedIncome = agi + (socialSecurityAmount * 0.5);
  
  let taxablePercentage = 0;
  let additionalTaxableAmount = 0;
  
  // Determine the taxable percentage based on thresholds
  if (combinedIncome <= baseAmount) {
    // Below base amount - no SS benefits are taxable
    taxablePercentage = 0;
    additionalTaxableAmount = 0;
  } else if (combinedIncome <= secondThreshold) {
    // Between base and second threshold - up to 50% taxable
    const excessAmount = combinedIncome - baseAmount;
    const halfBenefits = socialSecurityAmount * 0.5;
    additionalTaxableAmount = Math.min(excessAmount, halfBenefits);
    taxablePercentage = (additionalTaxableAmount / socialSecurityAmount) * 100;
  } else {
    // Above second threshold - up to 85% taxable
    const baseExcess = Math.min(combinedIncome - baseAmount, socialSecurityAmount * 0.5);
    const secondExcess = (combinedIncome - secondThreshold) * 0.85;
    additionalTaxableAmount = Math.min(baseExcess + secondExcess, socialSecurityAmount * 0.85);
    taxablePercentage = (additionalTaxableAmount / socialSecurityAmount) * 100;
  }
  
  // Estimate the tax impact using a simple average tax rate
  // In reality, this would depend on the marginal rate
  const estimatedTaxRate = 0.22; // Simplified assumption
  const taxImpact = additionalTaxableAmount * estimatedTaxRate;
  
  return {
    taxable_percentage: taxablePercentage,
    additional_taxable_amount: additionalTaxableAmount,
    tax_impact: taxImpact
  };
}
