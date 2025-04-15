// Import the standardized type from the central location
import { ConversionStrategyType } from '../types/tax/rothConversionTypes';

// Re-export it
export { ConversionStrategyType };

// Helper functions
export const getConversionStrategyLabel = (strategy: ConversionStrategyType): string => {
  switch (strategy) {
    case 'fixed':
      return 'Fixed Amount';
    case 'bracket_12':
      return 'Fill 12% Bracket';
    case 'bracket_22':
      return 'Fill 22% Bracket';
    case 'bracket_12_22':
      return 'Fill 12% + 22% Brackets';
    default:
      return 'Custom Strategy';
  }
};

// Calculate conversion amount based on strategy
export const calculateConversionAmount = (
  strategy: ConversionStrategyType,
  fixedAmount: number,
  baseIncome: number,
  filingStatus: string,
  year: number
): number => {
  // Get tax bracket thresholds for the year
  const brackets = getTaxBracketThresholds(year);
  
  // If brackets aren't available or strategy is fixed, return fixed amount
  if (!brackets || strategy === 'fixed') {
    return fixedAmount;
  }
  
  // Get the appropriate threshold based on filing status
  const statusKey = getFilingStatusKey(filingStatus);
  
  // Calculate conversion amount based on strategy
  switch (strategy) {
    case 'bracket_12':
      return calculateFillBracket(brackets, '12%', statusKey, baseIncome);
    case 'bracket_22':
      return calculateFillBracket(brackets, '22%', statusKey, baseIncome);
    case 'bracket_12_22':
      return calculateFillBracket(brackets, '22%', statusKey, baseIncome);
    default:
      return fixedAmount;
  }
};

// Helper function to get filing status key for bracket lookup
const getFilingStatusKey = (filingStatus: string): string => {
  switch (filingStatus) {
    case 'single':
      return 'single';
    case 'married':
    case 'married_joint':
      return 'married';
    case 'married_separate':
      return 'marriedSeparate';
    case 'head_of_household':
      return 'headOfHousehold';
    default:
      return 'single';
  }
};

// Helper function to calculate amount needed to fill a tax bracket
const calculateFillBracket = (
  brackets: any,
  targetBracket: string,
  statusKey: string,
  baseIncome: number
): number => {
  // Find the target bracket
  const bracket = brackets.find((b: any) => b.label === targetBracket);
  if (!bracket) return 0;
  
  // Get the threshold for the filing status
  const threshold = bracket[`${statusKey}Threshold`];
  
  // Calculate how much more income can fit in this bracket
  const remainingInBracket = Math.max(0, threshold - baseIncome);
  
  return remainingInBracket;
};

// Get tax bracket thresholds for a specific year
const getTaxBracketThresholds = (year: number): any[] => {
  // This would typically come from a data source or API
  // For now, using simplified 2023 brackets
  return [
    {
      label: '10%',
      rate: 0.10,
      singleThreshold: 11000,
      marriedThreshold: 22000,
      headOfHouseholdThreshold: 15700,
      marriedSeparateThreshold: 11000
    },
    {
      label: '12%',
      rate: 0.12,
      singleThreshold: 44725,
      marriedThreshold: 89450,
      headOfHouseholdThreshold: 59850,
      marriedSeparateThreshold: 44725
    },
    {
      label: '22%',
      rate: 0.22,
      singleThreshold: 95375,
      marriedThreshold: 190750,
      headOfHouseholdThreshold: 95350,
      marriedSeparateThreshold: 95375
    },
    {
      label: '24%',
      rate: 0.24,
      singleThreshold: 182100,
      marriedThreshold: 364200,
      headOfHouseholdThreshold: 182100,
      marriedSeparateThreshold: 182100
    },
    {
      label: '32%',
      rate: 0.32,
      singleThreshold: 231250,
      marriedThreshold: 462500,
      headOfHouseholdThreshold: 231250,
      marriedSeparateThreshold: 231250
    },
    {
      label: '35%',
      rate: 0.35,
      singleThreshold: 578125,
      marriedThreshold: 693750,
      headOfHouseholdThreshold: 578100,
      marriedSeparateThreshold: 346875
    },
    {
      label: '37%',
      rate: 0.37,
      singleThreshold: Infinity,
      marriedThreshold: Infinity,
      headOfHouseholdThreshold: Infinity,
      marriedSeparateThreshold: Infinity
    }
  ];
};

// Get the maximum recommended conversion amount
export const getMaxRecommendedConversion = (
  traditionalIRABalance: number,
  filingStatus: string,
  baseIncome: number,
  year: number
): number => {
  // Get tax bracket thresholds
  const brackets = getTaxBracketThresholds(year);
  if (!brackets) return traditionalIRABalance;
  
  // Get the appropriate threshold based on filing status
  const statusKey = getFilingStatusKey(filingStatus);
  
  // Find the 24% bracket threshold
  const bracket24 = brackets.find((b: any) => b.label === '24%');
  if (!bracket24) return traditionalIRABalance;
  
  // Calculate how much more income can fit in the 22% bracket
  const threshold = bracket24[`${statusKey}Threshold`];
  const remainingIn22Bracket = Math.max(0, threshold - baseIncome);
  
  // Return the smaller of the remaining bracket room or the IRA balance
  return Math.min(remainingIn22Bracket, traditionalIRABalance);
};

// Estimate tax impact of a conversion
export const estimateConversionTaxImpact = (
  conversionAmount: number,
  baseIncome: number,
  filingStatus: string,
  year: number
): { 
  taxWithoutConversion: number;
  taxWithConversion: number;
  taxIncrease: number;
  marginalRate: number;
  effectiveRateOnConversion: number;
} => {
  // This is a simplified calculation - in a real app, you'd use a more sophisticated tax calculator
  const estimatedTaxRate = 0.24; // Simplified 24% marginal rate
  const taxWithoutConversion = baseIncome * 0.15; // Simplified calculation
  const taxWithConversion = taxWithoutConversion + (conversionAmount * estimatedTaxRate);
  const taxIncrease = taxWithConversion - taxWithoutConversion;
  
  return {
    taxWithoutConversion,
    taxWithConversion,
    taxIncrease,
    marginalRate: estimatedTaxRate,
    effectiveRateOnConversion: conversionAmount > 0 ? taxIncrease / conversionAmount : 0
  };
};
