
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
    
    // Calculate itemized deduction total (simplified)
    const otherItemizedDeductions = 5000; // Placeholder for other deductions
    const itemizedTotal = contribution + otherItemizedDeductions;
    
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
      taxSavings
    });
  }
  
  return years;
};
