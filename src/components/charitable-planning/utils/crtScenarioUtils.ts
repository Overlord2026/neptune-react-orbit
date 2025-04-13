
/**
 * CRT Scenario Calculation Utilities
 * 
 * Advanced calculation utilities for Charitable Remainder Trusts (CRTs)
 * that provide detailed scenario projections with disclaimers.
 */

import { calculateCrtBenefits } from './crtCalculationUtils';

// Current default IRS Section 7520 rate (example - this changes monthly)
const DEFAULT_IRS_SECTION_7520_RATE = 4.4;

export interface CRTScenarioInput {
  trustType: "CRAT" | "CRUT";
  fundingAmount: number;
  payoutRate: number;
  term: number | "lifetime";
  beneficiaryAge: number;
  spouseBeneficiary?: boolean;
  spouseAge?: number;
  discountRate?: number; // Optional user-provided rate. If not provided, use default
  estateSubjectToTax?: boolean;
  estateTaxRate?: number;
  agiForLimits?: number;
}

export interface CRTScenarioOutput {
  deduction: number;
  deductionPercentage: number;
  annualIncome: number;
  estateReduction: number;
  remainderToCharity: number;
  disclaimers: string[];
}

// Calculate AGI limitations for charitable deductions
// Different limitations apply based on recipient organization type
// This is a simplified version - actual rules are more complex
const calculateAGILimitation = (
  deduction: number,
  agi: number | undefined,
  isCashDonation: boolean = false
): { limitedDeduction: number; disclaimer: string | null } => {
  if (!agi) {
    return { 
      limitedDeduction: deduction, 
      disclaimer: "AGI limitations not calculated (AGI not provided)"
    };
  }
  
  // Public charities typically have higher AGI limits than private foundations
  // Cash gifts to public charities: 60% of AGI
  // Appreciated property to public charities: 30% of AGI
  // Gifts to private foundations: 30% for cash, 20% for appreciated property
  
  // For simplicity, assume 30% AGI limit for CRTs
  const agiLimit = agi * 0.3;
  const limitedDeduction = Math.min(deduction, agiLimit);
  
  if (limitedDeduction < deduction) {
    return {
      limitedDeduction,
      disclaimer: `Deduction limited to $${limitedDeduction.toLocaleString()} based on 30% of AGI. Excess may be carried forward up to 5 years.`
    };
  }
  
  return { limitedDeduction, disclaimer: null };
};

/**
 * Calculates detailed CRT scenario projections with supporting disclaimers
 */
export function calculateCRTScenario(input: CRTScenarioInput): CRTScenarioOutput {
  const {
    trustType,
    fundingAmount,
    payoutRate,
    term,
    beneficiaryAge,
    spouseBeneficiary = false,
    spouseAge,
    discountRate,
    estateSubjectToTax = false,
    estateTaxRate = 0.40, // Default 40% federal estate tax rate
    agiForLimits
  } = input;
  
  // Set of disclaimers for the calculation
  const disclaimers: string[] = [
    "Approximate CRT calculations for demonstration; official calculations require specialized software or an actuarial approach.",
    `Calculations based on ${discountRate || DEFAULT_IRS_SECTION_7520_RATE}% discount rate. Actual rates set monthly by IRS.`
  ];
  
  // Use our existing calculation utility with the user's discount rate if provided
  const crtBenefits = calculateCrtBenefits({
    type: trustType,
    fundingAmount,
    payoutRate,
    trustTerm: term,
    beneficiaryAge,
    spouseBeneficiary,
    spouseAge
  });
  
  // Calculate the deduction with AGI limitations
  const { limitedDeduction, disclaimer } = calculateAGILimitation(
    crtBenefits.immediateDeduction, 
    agiForLimits
  );
  
  if (disclaimer) {
    disclaimers.push(disclaimer);
  }
  
  // Calculate estate tax reduction
  const estateReduction = estateSubjectToTax ? fundingAmount * estateTaxRate : 0;
  
  if (estateSubjectToTax) {
    disclaimers.push(
      `Estate tax savings assumes estate would be subject to federal estate tax and a ${estateTaxRate * 100}% marginal estate tax rate.`
    );
  }
  
  // Add disclaimers based on trust type
  if (trustType === "CRAT") {
    disclaimers.push(
      "CRAT provides fixed payments regardless of trust performance. In low-return environments, trust principal may be depleted faster than expected."
    );
  } else {
    disclaimers.push(
      "CRUT payments will vary annually with trust value, providing potential inflation protection but less payment certainty."
    );
  }
  
  // Return complete scenario calculation
  return {
    deduction: limitedDeduction,
    deductionPercentage: (limitedDeduction / fundingAmount) * 100,
    annualIncome: crtBenefits.annualPayout,
    estateReduction,
    remainderToCharity: crtBenefits.totalCharitableValue,
    disclaimers
  };
}
