
/**
 * Tax bracket utility functions
 */

/**
 * Get tax bracket based on income
 */
export const getTaxBracketRate = (income: number): string => {
  if (income < 11000) return "10%";
  if (income < 44725) return "12%";
  if (income < 95375) return "22%";
  if (income < 182100) return "24%";
  if (income < 231250) return "32%";
  if (income < 578125) return "35%";
  return "37%";
};
