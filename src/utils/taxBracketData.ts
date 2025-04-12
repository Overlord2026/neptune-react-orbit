/**
 * Tax Bracket Data Utility
 * 
 * This file contains structured tax bracket data that can be used across the application.
 * It's designed to mimic a database structure for easy conversion to a real database in the future.
 */

// Using 'export type' to properly export types when isolatedModules is enabled
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
  
  // 2025 Tax Brackets (Projected/Estimated)
  // Single
  brackets.push(
    { id: generateBracketId(2025, "single", 0, "ordinary"), tax_year: 2025, filing_status: "single", bracket_min: 0, bracket_max: 12000, rate: 0.10, bracket_type: "ordinary" },
    { id: generateBracketId(2025, "single", 12000, "ordinary"), tax_year: 2025, filing_status: "single", bracket_min: 12000, bracket_max: 47000, rate: 0.12, bracket_type: "ordinary" },
    { id: generateBracketId(2025, "single", 47000, "ordinary"), tax_year: 2025, filing_status: "single", bracket_min: 47000, bracket_max: 95000, rate: 0.22, bracket_type: "ordinary" },
    { id: generateBracketId(2025, "single", 95000, "ordinary"), tax_year: 2025, filing_status: "single", bracket_min: 95000, bracket_max: 182000, rate: 0.24, bracket_type: "ordinary" },
    { id: generateBracketId(2025, "single", 182000, "ordinary"), tax_year: 2025, filing_status: "single", bracket_min: 182000, bracket_max: 231250, rate: 0.32, bracket_type: "ordinary" },
    { id: generateBracketId(2025, "single", 231250, "ordinary"), tax_year: 2025, filing_status: "single", bracket_min: 231250, bracket_max: 578125, rate: 0.35, bracket_type: "ordinary" },
    { id: generateBracketId(2025, "single", 578125, "ordinary"), tax_year: 2025, filing_status: "single", bracket_min: 578125, bracket_max: Infinity, rate: 0.37, bracket_type: "ordinary" }
  );
  
  // Married Filing Jointly
  brackets.push(
    { id: generateBracketId(2025, "married", 0, "ordinary"), tax_year: 2025, filing_status: "married", bracket_min: 0, bracket_max: 24000, rate: 0.10, bracket_type: "ordinary" },
    { id: generateBracketId(2025, "married", 24000, "ordinary"), tax_year: 2025, filing_status: "married", bracket_min: 24000, bracket_max: 94000, rate: 0.12, bracket_type: "ordinary" },
    { id: generateBracketId(2025, "married", 94000, "ordinary"), tax_year: 2025, filing_status: "married", bracket_min: 94000, bracket_max: 190000, rate: 0.22, bracket_type: "ordinary" },
    { id: generateBracketId(2025, "married", 190000, "ordinary"), tax_year: 2025, filing_status: "married", bracket_min: 190000, bracket_max: 364000, rate: 0.24, bracket_type: "ordinary" },
    { id: generateBracketId(2025, "married", 364000, "ordinary"), tax_year: 2025, filing_status: "married", bracket_min: 364000, bracket_max: 462500, rate: 0.32, bracket_type: "ordinary" },
    { id: generateBracketId(2025, "married", 462500, "ordinary"), tax_year: 2025, filing_status: "married", bracket_min: 462500, bracket_max: 693750, rate: 0.35, bracket_type: "ordinary" },
    { id: generateBracketId(2025, "married", 693750, "ordinary"), tax_year: 2025, filing_status: "married", bracket_min: 693750, bracket_max: Infinity, rate: 0.37, bracket_type: "ordinary" }
  );
  
  // Head of Household
  brackets.push(
    { id: generateBracketId(2025, "head_of_household", 0, "ordinary"), tax_year: 2025, filing_status: "head_of_household", bracket_min: 0, bracket_max: 16000, rate: 0.10, bracket_type: "ordinary" },
    { id: generateBracketId(2025, "head_of_household", 16000, "ordinary"), tax_year: 2025, filing_status: "head_of_household", bracket_min: 16000, bracket_max: 62000, rate: 0.12, bracket_type: "ordinary" },
    { id: generateBracketId(2025, "head_of_household", 62000, "ordinary"), tax_year: 2025, filing_status: "head_of_household", bracket_min: 62000, bracket_max: 95350, rate: 0.22, bracket_type: "ordinary" },
    { id: generateBracketId(2025, "head_of_household", 95350, "ordinary"), tax_year: 2025, filing_status: "head_of_household", bracket_min: 95350, bracket_max: 182100, rate: 0.24, bracket_type: "ordinary" },
    { id: generateBracketId(2025, "head_of_household", 182100, "ordinary"), tax_year: 2025, filing_status: "head_of_household", bracket_min: 182100, bracket_max: 231250, rate: 0.32, bracket_type: "ordinary" },
    { id: generateBracketId(2025, "head_of_household", 231250, "ordinary"), tax_year: 2025, filing_status: "head_of_household", bracket_min: 231250, bracket_max: 578100, rate: 0.35, bracket_type: "ordinary" },
    { id: generateBracketId(2025, "head_of_household", 578100, "ordinary"), tax_year: 2025, filing_status: "head_of_household", bracket_min: 578100, bracket_max: Infinity, rate: 0.37, bracket_type: "ordinary" }
  );
  
  // 2023 Tax Brackets - Keeping these for historical reference
  // ... keep existing code (2023, 2022, 2021 brackets)
  
  return brackets;
};

/**
 * Long-Term Capital Gains Tax Brackets
 */
const generateLTCGBrackets = (): TaxBracket[] => {
  const brackets: TaxBracket[] = [];
  
  // 2025 LTCG Brackets (Projected/Estimated)
  // Single
  brackets.push(
    { id: generateBracketId(2025, "single", 0, "ltcg"), tax_year: 2025, filing_status: "single", bracket_min: 0, bracket_max: 47000, rate: 0.00, bracket_type: "ltcg" },
    { id: generateBracketId(2025, "single", 47000, "ltcg"), tax_year: 2025, filing_status: "single", bracket_min: 47000, bracket_max: 518000, rate: 0.15, bracket_type: "ltcg" },
    { id: generateBracketId(2025, "single", 518000, "ltcg"), tax_year: 2025, filing_status: "single", bracket_min: 518000, bracket_max: Infinity, rate: 0.20, bracket_type: "ltcg" }
  );
  
  // Married Filing Jointly
  brackets.push(
    { id: generateBracketId(2025, "married", 0, "ltcg"), tax_year: 2025, filing_status: "married", bracket_min: 0, bracket_max: 94000, rate: 0.00, bracket_type: "ltcg" },
    { id: generateBracketId(2025, "married", 94000, "ltcg"), tax_year: 2025, filing_status: "married", bracket_min: 94000, bracket_max: 583000, rate: 0.15, bracket_type: "ltcg" },
    { id: generateBracketId(2025, "married", 583000, "ltcg"), tax_year: 2025, filing_status: "married", bracket_min: 583000, bracket_max: Infinity, rate: 0.20, bracket_type: "ltcg" }
  );
  
  // Head of Household
  brackets.push(
    { id: generateBracketId(2025, "head_of_household", 0, "ltcg"), tax_year: 2025, filing_status: "head_of_household", bracket_min: 0, bracket_max: 62000, rate: 0.00, bracket_type: "ltcg" },
    { id: generateBracketId(2025, "head_of_household", 62000, "ltcg"), tax_year: 2025, filing_status: "head_of_household", bracket_min: 62000, bracket_max: 550000, rate: 0.15, bracket_type: "ltcg" },
    { id: generateBracketId(2025, "head_of_household", 550000, "ltcg"), tax_year: 2025, filing_status: "head_of_household", bracket_min: 550000, bracket_max: Infinity, rate: 0.20, bracket_type: "ltcg" }
  );
  
  // 2023 LTCG Brackets - Keeping these for historical reference
  // ... keep existing code (2023, 2022, 2021 brackets)
  
  return brackets;
};

// Generate all brackets
export const TAX_BRACKETS_DATA: TaxBracket[] = [
  ...generateOrdinaryIncomeBrackets(),
  ...generateLTCGBrackets()
];

// Standard Deduction Data - 2025 values (projected/estimated)
export const STANDARD_DEDUCTION = {
  single: 14200,
  marriedFilingJointly: 28400,
  headOfHousehold: 21250
};

// Legacy standard deduction data structure (for backwards compatibility)
export const STANDARD_DEDUCTION_BY_YEAR = {
  2025: {
    single: 14200,
    married: 28400,
    head_of_household: 21250
  },
  // ... keep existing code (2023, 2022, 2021 standard deductions)
};

/**
 * Get tax brackets for a specific year, filing status, and type
 */
export const getBrackets = (
  year: number,
  filingStatus: FilingStatusType,
  type: BracketType
): TaxBracket[] => {
  return TAX_BRACKETS_DATA.filter(
    bracket => 
      bracket.tax_year === year && 
      bracket.filing_status === filingStatus &&
      bracket.bracket_type === type
  ).sort((a, b) => a.bracket_min - b.bracket_min);
};

/**
 * Calculate tax on a given income using the appropriate brackets
 */
export const calculateTax = (
  income: number,
  year: number,
  filingStatus: FilingStatusType,
  type: BracketType = "ordinary"
): number => {
  let tax = 0;
  let remainingIncome = income;
  
  // Get applicable brackets
  const brackets = getBrackets(year, filingStatus, type);
  
  // Calculate tax bracket by bracket
  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    const nextBracketMin = i < brackets.length - 1 ? brackets[i + 1].bracket_min : Infinity;
    
    // Calculate taxable amount in this bracket
    const taxableInBracket = Math.min(
      remainingIncome,
      nextBracketMin - bracket.bracket_min
    );
    
    // If no more income to tax, exit loop
    if (taxableInBracket <= 0) break;
    
    // Add tax for this bracket
    tax += taxableInBracket * bracket.rate;
    
    // Reduce remaining income
    remainingIncome -= taxableInBracket;
  }
  
  return tax;
};

/**
 * Calculate effective tax rate
 * 
 * This function calculates the effective tax rate based on taxable income and total tax
 */
export const calculateEffectiveRate = (
  taxableIncome: number,
  totalTax: number
): number => {
  // Avoid division by zero
  if (taxableIncome <= 0) return 0;
  
  return totalTax / taxableIncome;
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format percentage for display
 */
export const formatPercent = (decimal: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(decimal);
};

// Example of additional export we might need in the future
export const somethingElse = "This is an example extra export";
