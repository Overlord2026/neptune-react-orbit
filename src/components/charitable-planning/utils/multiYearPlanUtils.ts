
import { CharitableScenario } from '../types/CharitableTypes';

/**
 * Generate a multi-year plan based on the scenario
 */
export const generateMultiYearPlan = (scenario: CharitableScenario, isIntegrated: boolean) => {
  if (!isIntegrated) return [];
  
  const currentYear = new Date().getFullYear();
  const standardDeduction = 12950; // Simplified for demo
  let years = [];
  
  for (let i = 0; i < 5; i++) {
    const year = currentYear + i;
    let contribution = scenario.annualGiving.amount;
    let itemizedTotal = contribution;
    let additionalNotes = [];
    
    // If bunching strategy is selected, adjust contribution based on the cycle
    if (scenario.dafStrategy.useDaf && scenario.dafStrategy.approach === "bunching") {
      const cyclePosition = i % scenario.dafStrategy.bunchingYears;
      contribution = cyclePosition === 0 ? (scenario.dafStrategy.bunchingAmount || contribution * scenario.dafStrategy.bunchingYears) : 0;
    }
    
    // If variable giving is selected and we have data for this year, use that instead
    if (scenario.annualGiving.type === "variable" && scenario.annualGiving.yearlyAmounts) {
      const yearlyAmount = scenario.annualGiving.yearlyAmounts.find(y => y.year === year);
      if (yearlyAmount) {
        contribution = yearlyAmount.amount;
      }
    }
    
    // Add CRT deduction in first year (if applicable)
    let crtDeduction = 0;
    if (scenario.crt?.useCrt && i === 0) {
      // Approximate CRT deduction calculation (simplified)
      const fundingAmount = scenario.crt.fundingAmount;
      const payoutRate = scenario.crt.payoutRate / 100;
      
      // Very simplified deduction estimation
      // In reality, this would use IRS discount rates and term calculations
      const deductionFactor = scenario.crt.type === "CRAT" ? 0.4 : 0.45; // Simplified approximation
      crtDeduction = fundingAmount * deductionFactor;
      
      itemizedTotal += crtDeduction;
      additionalNotes.push(`CRT Established: $${fundingAmount.toLocaleString()} funding`);
      additionalNotes.push(`CRT Tax Deduction: $${crtDeduction.toLocaleString()}`);
    }
    
    // Add CRT income in all years (if applicable)
    let crtIncome = 0;
    if (scenario.crt?.useCrt && i > 0) {
      crtIncome = scenario.crt.fundingAmount * (scenario.crt.payoutRate / 100);
      additionalNotes.push(`CRT Annual Income: $${crtIncome.toLocaleString()}`);
    }
    
    // Add QCD amount for eligible years
    if (scenario.qcd.useQcd && scenario.age + i >= 70.5) {
      additionalNotes.push(`QCD from IRA: $${scenario.qcd.amount.toLocaleString()}`);
    }
    
    // Calculate itemized deduction total (simplified)
    const otherItemizedDeductions = 5000; // Placeholder for other deductions
    itemizedTotal += otherItemizedDeductions;
    
    // Determine if itemizing makes sense for this year
    const isItemizing = itemizedTotal > standardDeduction;
    
    // Calculate tax savings (simplified)
    const marginalRate = 0.24; // Example rate
    const taxSavings = isItemizing ? (itemizedTotal - standardDeduction) * marginalRate : 0;
    
    years.push({
      year,
      contribution,
      isItemizing,
      standardDeduction,
      itemizedTotal,
      taxSavings,
      additionalNotes
    });
  }
  
  return years;
};
