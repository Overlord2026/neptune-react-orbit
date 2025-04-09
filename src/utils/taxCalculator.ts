// Tax brackets for different years and filing statuses
export const TAX_BRACKETS = {
  2021: {
    'single': [
      { min: 0, max: 9950, rate: 0.10 },
      { min: 9950, max: 40525, rate: 0.12 },
      { min: 40525, max: 86375, rate: 0.22 },
      { min: 86375, max: 164925, rate: 0.24 },
      { min: 164925, max: 209425, rate: 0.32 },
      { min: 209425, max: 523600, rate: 0.35 },
      { min: 523600, max: Infinity, rate: 0.37 },
    ],
    'married': [
      { min: 0, max: 19900, rate: 0.10 },
      { min: 19900, max: 81050, rate: 0.12 },
      { min: 81050, max: 172750, rate: 0.22 },
      { min: 172750, max: 329850, rate: 0.24 },
      { min: 329850, max: 418850, rate: 0.32 },
      { min: 418850, max: 628300, rate: 0.35 },
      { min: 628300, max: Infinity, rate: 0.37 },
    ],
    'head_of_household': [
      { min: 0, max: 14200, rate: 0.10 },
      { min: 14200, max: 54200, rate: 0.12 },
      { min: 54200, max: 86350, rate: 0.22 },
      { min: 86350, max: 164900, rate: 0.24 },
      { min: 164900, max: 209400, rate: 0.32 },
      { min: 209400, max: 523600, rate: 0.35 },
      { min: 523600, max: Infinity, rate: 0.37 },
    ],
  },
  2022: {
    'single': [
      { min: 0, max: 10275, rate: 0.10 },
      { min: 10275, max: 41775, rate: 0.12 },
      { min: 41775, max: 89075, rate: 0.22 },
      { min: 89075, max: 170050, rate: 0.24 },
      { min: 170050, max: 215950, rate: 0.32 },
      { min: 215950, max: 539900, rate: 0.35 },
      { min: 539900, max: Infinity, rate: 0.37 },
    ],
    'married': [
      { min: 0, max: 20550, rate: 0.10 },
      { min: 20550, max: 83550, rate: 0.12 },
      { min: 83550, max: 178150, rate: 0.22 },
      { min: 178150, max: 340100, rate: 0.24 },
      { min: 340100, max: 431900, rate: 0.32 },
      { min: 431900, max: 647850, rate: 0.35 },
      { min: 647850, max: Infinity, rate: 0.37 },
    ],
    'head_of_household': [
      { min: 0, max: 14650, rate: 0.10 },
      { min: 14650, max: 55900, rate: 0.12 },
      { min: 55900, max: 89050, rate: 0.22 },
      { min: 89050, max: 170050, rate: 0.24 },
      { min: 170050, max: 215950, rate: 0.32 },
      { min: 215950, max: 539900, rate: 0.35 },
      { min: 539900, max: Infinity, rate: 0.37 },
    ],
  },
  2023: {
    'single': [
      { min: 0, max: 11000, rate: 0.10 },
      { min: 11000, max: 44725, rate: 0.12 },
      { min: 44725, max: 95375, rate: 0.22 },
      { min: 95375, max: 182100, rate: 0.24 },
      { min: 182100, max: 231250, rate: 0.32 },
      { min: 231250, max: 578125, rate: 0.35 },
      { min: 578125, max: Infinity, rate: 0.37 },
    ],
    'married': [
      { min: 0, max: 22000, rate: 0.10 },
      { min: 22000, max: 89450, rate: 0.12 },
      { min: 89450, max: 190750, rate: 0.22 },
      { min: 190750, max: 364200, rate: 0.24 },
      { min: 364200, max: 462500, rate: 0.32 },
      { min: 462500, max: 693750, rate: 0.35 },
      { min: 693750, max: Infinity, rate: 0.37 },
    ],
    'head_of_household': [
      { min: 0, max: 15700, rate: 0.10 },
      { min: 15700, max: 59850, rate: 0.12 },
      { min: 59850, max: 95350, rate: 0.22 },
      { min: 95350, max: 182100, rate: 0.24 },
      { min: 182100, max: 231250, rate: 0.32 },
      { min: 231250, max: 578100, rate: 0.35 },
      { min: 578100, max: Infinity, rate: 0.37 },
    ],
  },
};

// Standard deduction amounts by year and filing status
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

// Types
export type FilingStatus = 'single' | 'married' | 'head_of_household';

export interface TaxInput {
  year: number;
  wages: number;
  interest: number;
  dividends: number;
  capital_gains: number;
  ira_distributions: number;
  roth_conversion: number;
  social_security: number;
  isItemizedDeduction: boolean;
  itemizedDeductionAmount?: number;
  filing_status: FilingStatus;
}

export interface TaxResult {
  scenario_name: string;
  year: number;
  total_income: number;
  agi: number;
  taxable_income: number;
  total_tax: number;
  marginal_rate: number;
  effective_rate: number;
  updated_at: Date;
  safe_harbor?: SafeHarborResult;
}

export interface SafeHarborInput {
  current_withholding: number;
  estimated_remaining_withholding: number;
  prior_year_tax: number;
  current_year_tax: number;
  high_income?: boolean; // For the 110% rule if AGI > $150,000
}

export interface SafeHarborResult {
  total_projected_payments: number;
  safe_harbor_minimum: number;
  meets_safe_harbor: boolean;
  shortfall: number;
  recommended_additional_withholding: number;
}

/**
 * Calculate tax scenario based on inputs
 */
export function calculateTaxScenario(input: TaxInput, scenario_name: string): TaxResult {
  // Calculate total income
  const total_income = 
    input.wages + 
    input.interest + 
    input.dividends + 
    input.capital_gains + 
    input.ira_distributions + 
    input.roth_conversion + 
    (input.social_security * 0.85); // 85% of Social Security is typically taxable

  // AGI (Adjusted Gross Income) - simplification for this scenario
  // In real life, there would be above-the-line deductions
  const agi = total_income;
  
  // Apply deductions
  let deductionAmount: number;
  if (input.isItemizedDeduction && input.itemizedDeductionAmount) {
    deductionAmount = input.itemizedDeductionAmount;
  } else {
    const standardDeductions = STANDARD_DEDUCTION[input.year as keyof typeof STANDARD_DEDUCTION] || STANDARD_DEDUCTION[2023];
    deductionAmount = standardDeductions[input.filing_status];
  }
  
  // Calculate taxable income
  const taxable_income = Math.max(0, agi - deductionAmount);
  
  // Get tax brackets
  const yearBrackets = TAX_BRACKETS[input.year as keyof typeof TAX_BRACKETS] || TAX_BRACKETS[2023];
  const brackets = yearBrackets[input.filing_status];
  
  // Calculate tax using bracket method
  let total_tax = 0;
  let lastBracketLimit = 0;
  let marginal_rate = 0;
  
  for (const bracket of brackets) {
    if (taxable_income > bracket.min) {
      const taxableInThisBracket = Math.min(taxable_income, bracket.max) - bracket.min;
      total_tax += taxableInThisBracket * bracket.rate;
      marginal_rate = bracket.rate;
      lastBracketLimit = bracket.max;
    }
  }
  
  // Calculate effective tax rate (as percentage)
  const effective_rate = taxable_income > 0 ? (total_tax / taxable_income) : 0;
  
  // Return result
  return {
    scenario_name,
    year: input.year,
    total_income,
    agi,
    taxable_income,
    total_tax,
    marginal_rate,
    effective_rate,
    updated_at: new Date(),
  };
}

/**
 * Calculate safe harbor requirements to avoid underpayment penalties
 */
export function calculateSafeHarbor(input: SafeHarborInput): SafeHarborResult {
  const { 
    current_withholding, 
    estimated_remaining_withholding, 
    prior_year_tax, 
    current_year_tax,
    high_income = false 
  } = input;

  // Calculate total projected payments for the year
  const total_projected_payments = current_withholding + estimated_remaining_withholding;
  
  // Calculate safe harbor minimum based on IRS rules:
  // - 90% of current year's tax, or
  // - 100% of prior year's tax (or 110% if high income)
  const current_year_minimum = current_year_tax * 0.9;
  const prior_year_minimum = prior_year_tax * (high_income ? 1.1 : 1.0);
  
  // Safe harbor is the lower of the two requirements
  const safe_harbor_minimum = Math.min(current_year_minimum, prior_year_minimum);
  
  // Check if current withholding meets safe harbor
  const meets_safe_harbor = total_projected_payments >= safe_harbor_minimum;
  
  // Calculate shortfall if any
  const shortfall = meets_safe_harbor ? 0 : (safe_harbor_minimum - total_projected_payments);
  
  // Recommended additional withholding (round up to nearest $100)
  const recommended_additional_withholding = shortfall > 0 
    ? Math.ceil(shortfall / 100) * 100 
    : 0;

  return {
    total_projected_payments,
    safe_harbor_minimum,
    meets_safe_harbor,
    shortfall,
    recommended_additional_withholding
  };
}

/**
 * Enhanced tax scenario calculation that includes safe harbor calculation
 */
export function calculateTaxScenarioWithSafeHarbor(
  taxInput: TaxInput, 
  safeHarborInput: SafeHarborInput, 
  scenario_name: string
): TaxResult {
  // First calculate the basic tax scenario
  const basicResult = calculateTaxScenario(taxInput, scenario_name);
  
  // Calculate safe harbor with the newly calculated tax amount
  const safeHarborResult = calculateSafeHarbor({
    ...safeHarborInput,
    current_year_tax: basicResult.total_tax
  });
  
  // Return the combined result
  return {
    ...basicResult,
    safe_harbor: safeHarborResult
  };
}

/**
 * Save tax scenario to database or state
 * This is a placeholder function and would be replaced with actual database operations
 */
export function saveScenario(scenario: TaxResult): Promise<TaxResult> {
  // This would be a database operation in a real application
  // For now, we'll just log to console and return the scenario
  console.log('Saving scenario:', scenario);
  
  // Simulate async operation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(scenario);
    }, 500);
  });
}

/**
 * Fetch saved scenarios
 * This is a placeholder function and would be replaced with actual database operations
 */
export function fetchScenarios(): Promise<TaxResult[]> {
  // This would be a database operation in a real application
  // For now, we'll just return a mock array
  
  // Simulate async operation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 500);
  });
}
