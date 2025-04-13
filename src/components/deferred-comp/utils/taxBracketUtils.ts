
/**
 * Tax bracket utilities for equity compensation calculations
 */

// Get current tax bracket based on income
export const getTaxBracket = (income: number): string => {
  if (income < 11000) return "10%";
  if (income < 44725) return "12%";
  if (income < 95375) return "22%";
  if (income < 182100) return "24%";
  if (income < 231250) return "32%";
  if (income < 578125) return "35%";
  return "37%";
};

// Get tax bracket rate (as a number) based on income
export const getTaxBracketRate = (income: number): number => {
  if (income < 11000) return 0.10;
  if (income < 44725) return 0.12;
  if (income < 95375) return 0.22;
  if (income < 182100) return 0.24;
  if (income < 231250) return 0.32;
  if (income < 578125) return 0.35;
  return 0.37;
};

// Get marginal tax rate for a given income
export const getMarginalRate = (income: number): number => {
  if (income < 11000) return 0.10;
  if (income < 44725) return 0.12;
  if (income < 95375) return 0.22;
  if (income < 182100) return 0.24;
  if (income < 231250) return 0.32;
  if (income < 578125) return 0.35;
  return 0.37;
};

// Get next bracket threshold
export const getNextBracket = (income: number): { rate: string, threshold: number, distance: number } => {
  if (income < 11000) return { rate: "12%", threshold: 11000, distance: 11000 - income };
  if (income < 44725) return { rate: "22%", threshold: 44725, distance: 44725 - income };
  if (income < 95375) return { rate: "24%", threshold: 95375, distance: 95375 - income };
  if (income < 182100) return { rate: "32%", threshold: 182100, distance: 182100 - income };
  if (income < 231250) return { rate: "35%", threshold: 231250, distance: 231250 - income };
  if (income < 578125) return { rate: "37%", threshold: 578125, distance: 578125 - income };
  return { rate: "Top bracket", threshold: 0, distance: 0 }; // Already in top bracket
};

// Get distance to next tax bracket
export const getDistanceToNextBracket = (income: number): { nextThreshold: number; distance: number } => {
  const nextBracket = getNextBracket(income);
  return {
    nextThreshold: nextBracket.threshold,
    distance: nextBracket.distance
  };
};

// Check if income would trigger IRMAA surcharges (simplified)
export const checkIrmaaImpact = (income: number): boolean => {
  // Simple IRMAA thresholds for single filers (2024)
  const irmaaThreshold = 97000; // Simplified first threshold
  return income > irmaaThreshold;
};
