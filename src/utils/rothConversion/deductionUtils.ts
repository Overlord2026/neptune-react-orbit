
/**
 * Calculate standard deduction based on filing status and tax year
 */
export const getStandardDeduction = (filingStatus: string, year: number): number => {
  // Basic standard deduction values - would ideally come from a tax data source
  // These are simplified examples based on 2023 values
  const baseValues: Record<string, number> = {
    'single': 13850,
    'married': 27700,
    'head_of_household': 20800,
    'married_separate': 13850
  };
  
  return baseValues[filingStatus as keyof typeof baseValues] || 12950;
};
