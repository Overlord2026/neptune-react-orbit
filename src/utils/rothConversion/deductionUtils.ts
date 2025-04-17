
export function getStandardDeduction(filingStatus: string, year: number): number {
  // 2023 standard deduction amounts
  const baseDeductions = {
    single: 13850,
    married_joint: 27700,
    married_separate: 13850,
    head_of_household: 20800
  };
  
  // Adjustments for inflation
  const inflationAdjustments = {
    2023: 1.0,
    2024: 1.051, // 5.1% adjustment for 2024
    2025: 1.1 // Estimated 10% cumulative adjustment by 2025
  };
  
  // Get the base deduction for the filing status
  const baseDeduction = baseDeductions[filingStatus as keyof typeof baseDeductions] || 
                      baseDeductions.single;
  
  // Apply inflation adjustment if we have it for the year, otherwise use most recent
  const adjustmentFactor = inflationAdjustments[year as keyof typeof inflationAdjustments] || 
                         inflationAdjustments[2023];
  
  // Return adjusted deduction amount
  return Math.round(baseDeduction * adjustmentFactor);
}
