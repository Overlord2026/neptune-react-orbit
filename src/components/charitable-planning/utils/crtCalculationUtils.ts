
/**
 * CRT Calculation Utilities
 * 
 * These calculations are approximations based on general IRS guidelines.
 * Actual values depend on IRS Section 7520 rates at time of funding,
 * which fluctuate monthly, and require full actuarial calculations.
 */

interface CrtCalculationParams {
  type: "CRAT" | "CRUT";
  fundingAmount: number;
  payoutRate: number;
  trustTerm: number | "lifetime";
  beneficiaryAge: number;
  spouseBeneficiary: boolean;
  spouseAge?: number;
}

interface CrtCalculationResult {
  immediateDeduction: number;
  annualPayout: number;
  estateTaxSavings: number;
  totalBeneficiaryValue: number;
  totalCharitableValue: number;
}

// Current IRS Section 7520 rate (example - this changes monthly)
// In a real application, this would be fetched from an API
const CURRENT_IRS_SECTION_7520_RATE = 4.4; // Example rate

// Simplified remainder factors based on age
// In real life, these would be based on IRS actuarial tables and 7520 rate
const getRemainderFactor = (
  age: number, 
  trustTerm: number | "lifetime", 
  isCrut: boolean,
  payoutRate: number
): number => {
  // For a term of years
  if (trustTerm !== "lifetime") {
    // Simple approximation based on term and payout rate
    const baseDeductionFactor = isCrut ? 0.5 : 0.55;
    const adjustedFactor = baseDeductionFactor - (payoutRate * 0.03);
    return Math.max(0.1, Math.min(adjustedFactor, 0.9));
  }

  // For lifetime calculations, factor increases with age
  // These are very simplified approximations
  if (age < 50) return isCrut ? 0.25 : 0.2;
  if (age < 60) return isCrut ? 0.35 : 0.3;
  if (age < 70) return isCrut ? 0.45 : 0.4;
  if (age < 80) return isCrut ? 0.55 : 0.5;
  return isCrut ? 0.65 : 0.6;
};

// For two lives, we need to adjust the remainder factor
const getAdjustedRemainderFactor = (
  primaryAge: number,
  spouseAge: number,
  trustTerm: number | "lifetime",
  isCrut: boolean,
  payoutRate: number
): number => {
  if (trustTerm !== "lifetime") {
    // For term of years, having two lives doesn't change much
    return getRemainderFactor(primaryAge, trustTerm, isCrut, payoutRate);
  }
  
  // For lifetime, two lives reduces the factor (since payments continue longer)
  const singleLifeFactor = getRemainderFactor(primaryAge, trustTerm, isCrut, payoutRate);
  const youngerAge = Math.min(primaryAge, spouseAge);
  
  // Reduce factor based on younger age
  const reductionFactor = youngerAge < 60 ? 0.15 : youngerAge < 70 ? 0.1 : 0.05;
  return Math.max(0.1, singleLifeFactor - reductionFactor);
};

// Calculate approximate estate tax savings
// Assumes 40% estate tax rate, which only applies to estates over exemption amount
const calculateEstateTaxSavings = (
  fundingAmount: number, 
  estateIsSubjectToTax: boolean = false
): number => {
  if (!estateIsSubjectToTax) return 0;
  return fundingAmount * 0.4; // 40% estate tax rate
};

export const calculateCrtBenefits = (params: CrtCalculationParams): CrtCalculationResult => {
  const { 
    type, 
    fundingAmount, 
    payoutRate, 
    trustTerm, 
    beneficiaryAge,
    spouseBeneficiary,
    spouseAge
  } = params;

  const isCrut = type === "CRUT";
  
  // Calculate annual payout based on CRT type
  const annualPayout = fundingAmount * (payoutRate / 100);
  
  // Calculate remainder factor (portion going to charity)
  let remainderFactor: number;
  
  if (spouseBeneficiary && spouseAge) {
    // Two life calculation
    remainderFactor = getAdjustedRemainderFactor(
      beneficiaryAge, 
      spouseAge, 
      trustTerm, 
      isCrut,
      payoutRate / 100
    );
  } else {
    // Single life calculation
    remainderFactor = getRemainderFactor(
      beneficiaryAge, 
      trustTerm, 
      isCrut,
      payoutRate / 100
    );
  }
  
  // Calculate immediate tax deduction
  const immediateDeduction = fundingAmount * remainderFactor;
  
  // Estimate estate tax savings
  const estateTaxSavings = calculateEstateTaxSavings(fundingAmount);
  
  // Calculate approximate values for beneficiary and charity
  const totalCharitableValue = immediateDeduction;
  const totalBeneficiaryValue = fundingAmount - immediateDeduction;
  
  return {
    immediateDeduction,
    annualPayout,
    estateTaxSavings,
    totalBeneficiaryValue,
    totalCharitableValue
  };
};
