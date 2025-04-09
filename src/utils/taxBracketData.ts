
/**
 * Tax Bracket Data Utility
 * 
 * This file contains structured tax bracket data that can be used across the application.
 * It's designed to mimic a database structure for easy conversion to a real database in the future.
 */

export type FilingStatusType = "single" | "married" | "head_of_household";
export type BracketType = "ordinary" | "ltcg"; // ordinary income vs long-term capital gains

export interface TaxBracket {
  id: string; // Using string for UUID compatibility
  tax_year: number;
  filing_status: FilingStatusType;
  bracket_min: number;
  bracket_max: number;
  rate: number; // Decimal representation (e.g., 0.10 for 10%)
  bracket_type: BracketType;
}

/**
 * Function to generate a consistent ID based on bracket properties
 */
const generateBracketId = (
  year: number, 
  status: FilingStatusType, 
  min: number, 
  type: BracketType
): string => {
  return `${year}-${status}-${min}-${type}`;
};

/**
 * Ordinary Income Tax Brackets
 */
const generateOrdinaryIncomeBrackets = (): TaxBracket[] => {
  const brackets: TaxBracket[] = [];
  
  // 2023 Tax Brackets
  // Single
  brackets.push(
    { id: generateBracketId(2023, "single", 0, "ordinary"), tax_year: 2023, filing_status: "single", bracket_min: 0, bracket_max: 11000, rate: 0.10, bracket_type: "ordinary" },
    { id: generateBracketId(2023, "single", 11000, "ordinary"), tax_year: 2023, filing_status: "single", bracket_min: 11000, bracket_max: 44725, rate: 0.12, bracket_type: "ordinary" },
    { id: generateBracketId(2023, "single", 44725, "ordinary"), tax_year: 2023, filing_status: "single", bracket_min: 44725, bracket_max: 95375, rate: 0.22, bracket_type: "ordinary" },
    { id: generateBracketId(2023, "single", 95375, "ordinary"), tax_year: 2023, filing_status: "single", bracket_min: 95375, bracket_max: 182100, rate: 0.24, bracket_type: "ordinary" },
    { id: generateBracketId(2023, "single", 182100, "ordinary"), tax_year: 2023, filing_status: "single", bracket_min: 182100, bracket_max: 231250, rate: 0.32, bracket_type: "ordinary" },
    { id: generateBracketId(2023, "single", 231250, "ordinary"), tax_year: 2023, filing_status: "single", bracket_min: 231250, bracket_max: 578125, rate: 0.35, bracket_type: "ordinary" },
    { id: generateBracketId(2023, "single", 578125, "ordinary"), tax_year: 2023, filing_status: "single", bracket_min: 578125, bracket_max: Infinity, rate: 0.37, bracket_type: "ordinary" }
  );
  
  // Married Filing Jointly
  brackets.push(
    { id: generateBracketId(2023, "married", 0, "ordinary"), tax_year: 2023, filing_status: "married", bracket_min: 0, bracket_max: 22000, rate: 0.10, bracket_type: "ordinary" },
    { id: generateBracketId(2023, "married", 22000, "ordinary"), tax_year: 2023, filing_status: "married", bracket_min: 22000, bracket_max: 89450, rate: 0.12, bracket_type: "ordinary" },
    { id: generateBracketId(2023, "married", 89450, "ordinary"), tax_year: 2023, filing_status: "married", bracket_min: 89450, bracket_max: 190750, rate: 0.22, bracket_type: "ordinary" },
    { id: generateBracketId(2023, "married", 190750, "ordinary"), tax_year: 2023, filing_status: "married", bracket_min: 190750, bracket_max: 364200, rate: 0.24, bracket_type: "ordinary" },
    { id: generateBracketId(2023, "married", 364200, "ordinary"), tax_year: 2023, filing_status: "married", bracket_min: 364200, bracket_max: 462500, rate: 0.32, bracket_type: "ordinary" },
    { id: generateBracketId(2023, "married", 462500, "ordinary"), tax_year: 2023, filing_status: "married", bracket_min: 462500, bracket_max: 693750, rate: 0.35, bracket_type: "ordinary" },
    { id: generateBracketId(2023, "married", 693750, "ordinary"), tax_year: 2023, filing_status: "married", bracket_min: 693750, bracket_max: Infinity, rate: 0.37, bracket_type: "ordinary" }
  );
  
  // Head of Household
  brackets.push(
    { id: generateBracketId(2023, "head_of_household", 0, "ordinary"), tax_year: 2023, filing_status: "head_of_household", bracket_min: 0, bracket_max: 15700, rate: 0.10, bracket_type: "ordinary" },
    { id: generateBracketId(2023, "head_of_household", 15700, "ordinary"), tax_year: 2023, filing_status: "head_of_household", bracket_min: 15700, bracket_max: 59850, rate: 0.12, bracket_type: "ordinary" },
    { id: generateBracketId(2023, "head_of_household", 59850, "ordinary"), tax_year: 2023, filing_status: "head_of_household", bracket_min: 59850, bracket_max: 95350, rate: 0.22, bracket_type: "ordinary" },
    { id: generateBracketId(2023, "head_of_household", 95350, "ordinary"), tax_year: 2023, filing_status: "head_of_household", bracket_min: 95350, bracket_max: 182100, rate: 0.24, bracket_type: "ordinary" },
    { id: generateBracketId(2023, "head_of_household", 182100, "ordinary"), tax_year: 2023, filing_status: "head_of_household", bracket_min: 182100, bracket_max: 231250, rate: 0.32, bracket_type: "ordinary" },
    { id: generateBracketId(2023, "head_of_household", 231250, "ordinary"), tax_year: 2023, filing_status: "head_of_household", bracket_min: 231250, bracket_max: 578100, rate: 0.35, bracket_type: "ordinary" },
    { id: generateBracketId(2023, "head_of_household", 578100, "ordinary"), tax_year: 2023, filing_status: "head_of_household", bracket_min: 578100, bracket_max: Infinity, rate: 0.37, bracket_type: "ordinary" }
  );
  
  // 2022 Tax Brackets
  // Single
  brackets.push(
    { id: generateBracketId(2022, "single", 0, "ordinary"), tax_year: 2022, filing_status: "single", bracket_min: 0, bracket_max: 10275, rate: 0.10, bracket_type: "ordinary" },
    { id: generateBracketId(2022, "single", 10275, "ordinary"), tax_year: 2022, filing_status: "single", bracket_min: 10275, bracket_max: 41775, rate: 0.12, bracket_type: "ordinary" },
    { id: generateBracketId(2022, "single", 41775, "ordinary"), tax_year: 2022, filing_status: "single", bracket_min: 41775, bracket_max: 89075, rate: 0.22, bracket_type: "ordinary" },
    { id: generateBracketId(2022, "single", 89075, "ordinary"), tax_year: 2022, filing_status: "single", bracket_min: 89075, bracket_max: 170050, rate: 0.24, bracket_type: "ordinary" },
    { id: generateBracketId(2022, "single", 170050, "ordinary"), tax_year: 2022, filing_status: "single", bracket_min: 170050, bracket_max: 215950, rate: 0.32, bracket_type: "ordinary" },
    { id: generateBracketId(2022, "single", 215950, "ordinary"), tax_year: 2022, filing_status: "single", bracket_min: 215950, bracket_max: 539900, rate: 0.35, bracket_type: "ordinary" },
    { id: generateBracketId(2022, "single", 539900, "ordinary"), tax_year: 2022, filing_status: "single", bracket_min: 539900, bracket_max: Infinity, rate: 0.37, bracket_type: "ordinary" }
  );
  
  // Married Filing Jointly
  brackets.push(
    { id: generateBracketId(2022, "married", 0, "ordinary"), tax_year: 2022, filing_status: "married", bracket_min: 0, bracket_max: 20550, rate: 0.10, bracket_type: "ordinary" },
    { id: generateBracketId(2022, "married", 20550, "ordinary"), tax_year: 2022, filing_status: "married", bracket_min: 20550, bracket_max: 83550, rate: 0.12, bracket_type: "ordinary" },
    { id: generateBracketId(2022, "married", 83550, "ordinary"), tax_year: 2022, filing_status: "married", bracket_min: 83550, bracket_max: 178150, rate: 0.22, bracket_type: "ordinary" },
    { id: generateBracketId(2022, "married", 178150, "ordinary"), tax_year: 2022, filing_status: "married", bracket_min: 178150, bracket_max: 340100, rate: 0.24, bracket_type: "ordinary" },
    { id: generateBracketId(2022, "married", 340100, "ordinary"), tax_year: 2022, filing_status: "married", bracket_min: 340100, bracket_max: 431900, rate: 0.32, bracket_type: "ordinary" },
    { id: generateBracketId(2022, "married", 431900, "ordinary"), tax_year: 2022, filing_status: "married", bracket_min: 431900, bracket_max: 647850, rate: 0.35, bracket_type: "ordinary" },
    { id: generateBracketId(2022, "married", 647850, "ordinary"), tax_year: 2022, filing_status: "married", bracket_min: 647850, bracket_max: Infinity, rate: 0.37, bracket_type: "ordinary" }
  );
  
  // Head of Household
  brackets.push(
    { id: generateBracketId(2022, "head_of_household", 0, "ordinary"), tax_year: 2022, filing_status: "head_of_household", bracket_min: 0, bracket_max: 14650, rate: 0.10, bracket_type: "ordinary" },
    { id: generateBracketId(2022, "head_of_household", 14650, "ordinary"), tax_year: 2022, filing_status: "head_of_household", bracket_min: 14650, bracket_max: 55900, rate: 0.12, bracket_type: "ordinary" },
    { id: generateBracketId(2022, "head_of_household", 55900, "ordinary"), tax_year: 2022, filing_status: "head_of_household", bracket_min: 55900, bracket_max: 89050, rate: 0.22, bracket_type: "ordinary" },
    { id: generateBracketId(2022, "head_of_household", 89050, "ordinary"), tax_year: 2022, filing_status: "head_of_household", bracket_min: 89050, bracket_max: 170050, rate: 0.24, bracket_type: "ordinary" },
    { id: generateBracketId(2022, "head_of_household", 170050, "ordinary"), tax_year: 2022, filing_status: "head_of_household", bracket_min: 170050, bracket_max: 215950, rate: 0.32, bracket_type: "ordinary" },
    { id: generateBracketId(2022, "head_of_household", 215950, "ordinary"), tax_year: 2022, filing_status: "head_of_household", bracket_min: 215950, bracket_max: 539900, rate: 0.35, bracket_type: "ordinary" },
    { id: generateBracketId(2022, "head_of_household", 539900, "ordinary"), tax_year: 2022, filing_status: "head_of_household", bracket_min: 539900, bracket_max: Infinity, rate: 0.37, bracket_type: "ordinary" }
  );
  
  // 2021 Tax Brackets
  // Single
  brackets.push(
    { id: generateBracketId(2021, "single", 0, "ordinary"), tax_year: 2021, filing_status: "single", bracket_min: 0, bracket_max: 9950, rate: 0.10, bracket_type: "ordinary" },
    { id: generateBracketId(2021, "single", 9950, "ordinary"), tax_year: 2021, filing_status: "single", bracket_min: 9950, bracket_max: 40525, rate: 0.12, bracket_type: "ordinary" },
    { id: generateBracketId(2021, "single", 40525, "ordinary"), tax_year: 2021, filing_status: "single", bracket_min: 40525, bracket_max: 86375, rate: 0.22, bracket_type: "ordinary" },
    { id: generateBracketId(2021, "single", 86375, "ordinary"), tax_year: 2021, filing_status: "single", bracket_min: 86375, bracket_max: 164925, rate: 0.24, bracket_type: "ordinary" },
    { id: generateBracketId(2021, "single", 164925, "ordinary"), tax_year: 2021, filing_status: "single", bracket_min: 164925, bracket_max: 209425, rate: 0.32, bracket_type: "ordinary" },
    { id: generateBracketId(2021, "single", 209425, "ordinary"), tax_year: 2021, filing_status: "single", bracket_min: 209425, bracket_max: 523600, rate: 0.35, bracket_type: "ordinary" },
    { id: generateBracketId(2021, "single", 523600, "ordinary"), tax_year: 2021, filing_status: "single", bracket_min: 523600, bracket_max: Infinity, rate: 0.37, bracket_type: "ordinary" }
  );
  
  // Married Filing Jointly
  brackets.push(
    { id: generateBracketId(2021, "married", 0, "ordinary"), tax_year: 2021, filing_status: "married", bracket_min: 0, bracket_max: 19900, rate: 0.10, bracket_type: "ordinary" },
    { id: generateBracketId(2021, "married", 19900, "ordinary"), tax_year: 2021, filing_status: "married", bracket_min: 19900, bracket_max: 81050, rate: 0.12, bracket_type: "ordinary" },
    { id: generateBracketId(2021, "married", 81050, "ordinary"), tax_year: 2021, filing_status: "married", bracket_min: 81050, bracket_max: 172750, rate: 0.22, bracket_type: "ordinary" },
    { id: generateBracketId(2021, "married", 172750, "ordinary"), tax_year: 2021, filing_status: "married", bracket_min: 172750, bracket_max: 329850, rate: 0.24, bracket_type: "ordinary" },
    { id: generateBracketId(2021, "married", 329850, "ordinary"), tax_year: 2021, filing_status: "married", bracket_min: 329850, bracket_max: 418850, rate: 0.32, bracket_type: "ordinary" },
    { id: generateBracketId(2021, "married", 418850, "ordinary"), tax_year: 2021, filing_status: "married", bracket_min: 418850, bracket_max: 628300, rate: 0.35, bracket_type: "ordinary" },
    { id: generateBracketId(2021, "married", 628300, "ordinary"), tax_year: 2021, filing_status: "married", bracket_min: 628300, bracket_max: Infinity, rate: 0.37, bracket_type: "ordinary" }
  );
  
  // Head of Household
  brackets.push(
    { id: generateBracketId(2021, "head_of_household", 0, "ordinary"), tax_year: 2021, filing_status: "head_of_household", bracket_min: 0, bracket_max: 14200, rate: 0.10, bracket_type: "ordinary" },
    { id: generateBracketId(2021, "head_of_household", 14200, "ordinary"), tax_year: 2021, filing_status: "head_of_household", bracket_min: 14200, bracket_max: 54200, rate: 0.12, bracket_type: "ordinary" },
    { id: generateBracketId(2021, "head_of_household", 54200, "ordinary"), tax_year: 2021, filing_status: "head_of_household", bracket_min: 54200, bracket_max: 86350, rate: 0.22, bracket_type: "ordinary" },
    { id: generateBracketId(2021, "head_of_household", 86350, "ordinary"), tax_year: 2021, filing_status: "head_of_household", bracket_min: 86350, bracket_max: 164900, rate: 0.24, bracket_type: "ordinary" },
    { id: generateBracketId(2021, "head_of_household", 164900, "ordinary"), tax_year: 2021, filing_status: "head_of_household", bracket_min: 164900, bracket_max: 209400, rate: 0.32, bracket_type: "ordinary" },
    { id: generateBracketId(2021, "head_of_household", 209400, "ordinary"), tax_year: 2021, filing_status: "head_of_household", bracket_min: 209400, bracket_max: 523600, rate: 0.35, bracket_type: "ordinary" },
    { id: generateBracketId(2021, "head_of_household", 523600, "ordinary"), tax_year: 2021, filing_status: "head_of_household", bracket_min: 523600, bracket_max: Infinity, rate: 0.37, bracket_type: "ordinary" }
  );
  
  return brackets;
};

/**
 * Long-Term Capital Gains Tax Brackets
 */
const generateLTCGBrackets = (): TaxBracket[] => {
  const brackets: TaxBracket[] = [];
  
  // 2023 LTCG Brackets
  // Single
  brackets.push(
    { id: generateBracketId(2023, "single", 0, "ltcg"), tax_year: 2023, filing_status: "single", bracket_min: 0, bracket_max: 44625, rate: 0.00, bracket_type: "ltcg" },
    { id: generateBracketId(2023, "single", 44625, "ltcg"), tax_year: 2023, filing_status: "single", bracket_min: 44625, bracket_max: 492300, rate: 0.15, bracket_type: "ltcg" },
    { id: generateBracketId(2023, "single", 492300, "ltcg"), tax_year: 2023, filing_status: "single", bracket_min: 492300, bracket_max: Infinity, rate: 0.20, bracket_type: "ltcg" }
  );
  
  // Married Filing Jointly
  brackets.push(
    { id: generateBracketId(2023, "married", 0, "ltcg"), tax_year: 2023, filing_status: "married", bracket_min: 0, bracket_max: 89250, rate: 0.00, bracket_type: "ltcg" },
    { id: generateBracketId(2023, "married", 89250, "ltcg"), tax_year: 2023, filing_status: "married", bracket_min: 89250, bracket_max: 553850, rate: 0.15, bracket_type: "ltcg" },
    { id: generateBracketId(2023, "married", 553850, "ltcg"), tax_year: 2023, filing_status: "married", bracket_min: 553850, bracket_max: Infinity, rate: 0.20, bracket_type: "ltcg" }
  );
  
  // Head of Household
  brackets.push(
    { id: generateBracketId(2023, "head_of_household", 0, "ltcg"), tax_year: 2023, filing_status: "head_of_household", bracket_min: 0, bracket_max: 59750, rate: 0.00, bracket_type: "ltcg" },
    { id: generateBracketId(2023, "head_of_household", 59750, "ltcg"), tax_year: 2023, filing_status: "head_of_household", bracket_min: 59750, bracket_max: 523050, rate: 0.15, bracket_type: "ltcg" },
    { id: generateBracketId(2023, "head_of_household", 523050, "ltcg"), tax_year: 2023, filing_status: "head_of_household", bracket_min: 523050, bracket_max: Infinity, rate: 0.20, bracket_type: "ltcg" }
  );
  
  // 2022 LTCG Brackets
  // Single
  brackets.push(
    { id: generateBracketId(2022, "single", 0, "ltcg"), tax_year: 2022, filing_status: "single", bracket_min: 0, bracket_max: 41675, rate: 0.00, bracket_type: "ltcg" },
    { id: generateBracketId(2022, "single", 41675, "ltcg"), tax_year: 2022, filing_status: "single", bracket_min: 41675, bracket_max: 459750, rate: 0.15, bracket_type: "ltcg" },
    { id: generateBracketId(2022, "single", 459750, "ltcg"), tax_year: 2022, filing_status: "single", bracket_min: 459750, bracket_max: Infinity, rate: 0.20, bracket_type: "ltcg" }
  );
  
  // Married Filing Jointly
  brackets.push(
    { id: generateBracketId(2022, "married", 0, "ltcg"), tax_year: 2022, filing_status: "married", bracket_min: 0, bracket_max: 83350, rate: 0.00, bracket_type: "ltcg" },
    { id: generateBracketId(2022, "married", 83350, "ltcg"), tax_year: 2022, filing_status: "married", bracket_min: 83350, bracket_max: 517200, rate: 0.15, bracket_type: "ltcg" },
    { id: generateBracketId(2022, "married", 517200, "ltcg"), tax_year: 2022, filing_status: "married", bracket_min: 517200, bracket_max: Infinity, rate: 0.20, bracket_type: "ltcg" }
  );
  
  // Head of Household
  brackets.push(
    { id: generateBracketId(2022, "head_of_household", 0, "ltcg"), tax_year: 2022, filing_status: "head_of_household", bracket_min: 0, bracket_max: 55800, rate: 0.00, bracket_type: "ltcg" },
    { id: generateBracketId(2022, "head_of_household", 55800, "ltcg"), tax_year: 2022, filing_status: "head_of_household", bracket_min: 55800, bracket_max: 488500, rate: 0.15, bracket_type: "ltcg" },
    { id: generateBracketId(2022, "head_of_household", 488500, "ltcg"), tax_year: 2022, filing_status: "head_of_household", bracket_min: 488500, bracket_max: Infinity, rate: 0.20, bracket_type: "ltcg" }
  );
  
  // 2021 LTCG Brackets
  // Single
  brackets.push(
    { id: generateBracketId(2021, "single", 0, "ltcg"), tax_year: 2021, filing_status: "single", bracket_min: 0, bracket_max: 40400, rate: 0.00, bracket_type: "ltcg" },
    { id: generateBracketId(2021, "single", 40400, "ltcg"), tax_year: 2021, filing_status: "single", bracket_min: 40400, bracket_max: 445850, rate: 0.15, bracket_type: "ltcg" },
    { id: generateBracketId(2021, "single", 445850, "ltcg"), tax_year: 2021, filing_status: "single", bracket_min: 445850, bracket_max: Infinity, rate: 0.20, bracket_type: "ltcg" }
  );
  
  // Married Filing Jointly
  brackets.push(
    { id: generateBracketId(2021, "married", 0, "ltcg"), tax_year: 2021, filing_status: "married", bracket_min: 0, bracket_max: 80800, rate: 0.00, bracket_type: "ltcg" },
    { id: generateBracketId(2021, "married", 80800, "ltcg"), tax_year: 2021, filing_status: "married", bracket_min: 80800, bracket_max: 501600, rate: 0.15, bracket_type: "ltcg" },
    { id: generateBracketId(2021, "married", 501600, "ltcg"), tax_year: 2021, filing_status: "married", bracket_min: 501600, bracket_max: Infinity, rate: 0.20, bracket_type: "ltcg" }
  );
  
  // Head of Household
  brackets.push(
    { id: generateBracketId(2021, "head_of_household", 0, "ltcg"), tax_year: 2021, filing_status: "head_of_household", bracket_min: 0, bracket_max: 54100, rate: 0.00, bracket_type: "ltcg" },
    { id: generateBracketId(2021, "head_of_household", 54100, "ltcg"), tax_year: 2021, filing_status: "head_of_household", bracket_min: 54100, bracket_max: 473750, rate: 0.15, bracket_type: "ltcg" },
    { id: generateBracketId(2021, "head_of_household", 473750, "ltcg"), tax_year: 2021, filing_status: "head_of_household", bracket_min: 473750, bracket_max: Infinity, rate: 0.20, bracket_type: "ltcg" }
  );
  
  return brackets;
};

// Combine all bracket data
export const TAX_BRACKETS_DATA: TaxBracket[] = [
  ...generateOrdinaryIncomeBrackets(),
  ...generateLTCGBrackets()
];

/**
 * Standard deduction amounts by year and filing status
 */
export const STANDARD_DEDUCTION = {
  2021: {
    'single': 12550,
    'married': 25100,
    'head_of_household': 18800,
  },
  2022: {
    'single': 12950,
    'married': 25900,
    'head_of_household': 19400,
  },
  2023: {
    'single': 13850,
    'married': 27700,
    'head_of_household': 20800,
  },
};

/**
 * Utility functions for working with tax bracket data
 */

/**
 * Get tax brackets for a specific year, filing status, and bracket type
 */
export const getBrackets = (
  year: number, 
  filingStatus: FilingStatusType, 
  bracketType: BracketType = "ordinary"
): TaxBracket[] => {
  return TAX_BRACKETS_DATA.filter(
    bracket => 
      bracket.tax_year === year && 
      bracket.filing_status === filingStatus &&
      bracket.bracket_type === bracketType
  ).sort((a, b) => a.bracket_min - b.bracket_min);
};

/**
 * Find the marginal tax bracket for a given income
 */
export const getMarginalBracket = (
  income: number,
  year: number,
  filingStatus: FilingStatusType,
  bracketType: BracketType = "ordinary"
): TaxBracket | undefined => {
  const brackets = getBrackets(year, filingStatus, bracketType);
  
  // Find the applicable bracket
  return brackets.find(
    bracket => income >= bracket.bracket_min && income <= bracket.bracket_max
  );
};

/**
 * Calculate tax owed based on income, year, filing status, and bracket type
 */
export const calculateTax = (
  income: number,
  year: number,
  filingStatus: FilingStatusType,
  bracketType: BracketType = "ordinary"
): number => {
  const brackets = getBrackets(year, filingStatus, bracketType);
  let tax = 0;
  let remainingIncome = income;
  
  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;
    
    const taxableAmountInBracket = Math.min(
      remainingIncome,
      bracket.bracket_max - bracket.bracket_min
    );
    
    tax += taxableAmountInBracket * bracket.rate;
    remainingIncome -= taxableAmountInBracket;
  }
  
  return tax;
};

/**
 * Calculate effective tax rate
 */
export const calculateEffectiveRate = (
  income: number,
  tax: number
): number => {
  return income > 0 ? tax / income : 0;
};

/**
 * Format currency values for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format percentage values for display
 */
export const formatPercent = (rate: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rate);
};
