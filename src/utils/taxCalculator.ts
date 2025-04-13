/**
 * Tax Calculation Utilities
 * 
 * This file contains functions for calculating tax scenarios based on user inputs.
 * It leverages the tax bracket data from taxBracketData.ts
 */

import { 
  FilingStatusType,
  getBrackets,
  STANDARD_DEDUCTION
} from './taxBracketData';
import {
  calculateTaxableIncome,
  calculateTotalTaxLiability
} from './taxUtils';
import { 
  checkTaxDataCurrency, 
  getFormattedUpdateDate, 
  markTaxDataAsCurrent, 
  TaxDataCacheInfo 
} from './dataFeedUtils';
import { 
  getTaxDataVersionForScenario,
  hasMidYearUpdates,
  getMidYearUpdateWarning
} from './taxDataVersioning';
import { MultiYearScenarioData, YearlyResult } from '../components/tax/roth-conversion/types/ScenarioTypes';

// Types
export type { FilingStatusType } from './taxBracketData';
export { STANDARD_DEDUCTION } from './taxBracketData';

import { type TrapAlert } from '@/types/taxTrapTypes';

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
  filing_status: FilingStatusType;
  scenarioDate?: string; // Added for tax data versioning
  
  // Spouse data for married filing scenarios
  spouseWages?: number;
  spouseInterest?: number;
  spouseDividends?: number;
  spouseCapitalGains?: number;
  spouseIraDistributions?: number;
  spouseRothConversion?: number;
  spouseSocialSecurity?: number;
  
  // Community property settings
  isInCommunityPropertyState?: boolean;
  splitCommunityIncome?: boolean;
}

export interface TaxResult {
  scenario_name: string;
  year: number;
  filing_status: FilingStatusType;
  total_income: number;
  agi: number;
  taxable_income: number;
  total_tax: number;
  ordinary_tax: number;
  capital_gains_tax: number;
  marginal_rate: number;
  marginal_capital_gains_rate: number;
  effective_rate: number;
  brackets_breakdown?: {
    ordinary: { bracket: number; amount: number; tax: number }[];
    capitalGains: { bracket: number; amount: number; tax: number }[];
  };
  updated_at: Date;
  tax_data_updated_at?: string; // When the tax data used was last updated
  tax_data_is_current?: boolean; // Whether the tax data is current
  tax_data_version?: string; // Version of tax data used for calculation
  tax_data_warning?: string; // Warning about tax data (e.g., mid-year update)
  safe_harbor?: SafeHarborResult;
  
  // MFS comparison data (if applicable)
  mfs_comparison?: {
    primary_tax: number;
    spouse_tax: number;
    combined_tax: number;
    difference: number; // Difference compared to MFJ
  };
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
 * Pre-check if tax data is current before calculation
 * Returns information about data currency and when it was last updated
 */
export function checkTaxDataBeforeCalculation(
  sessionId: string = "default",
  cacheTimeoutMinutes: number = 15
): TaxDataCacheInfo {
  return checkTaxDataCurrency(sessionId, cacheTimeoutMinutes);
}

/**
 * Mark the user's session tax data as current (after they choose to refresh)
 */
export function refreshTaxData(sessionId: string = "default"): void {
  markTaxDataAsCurrent(sessionId);
}

/**
 * Apply community property rules to income
 * Split income 50/50 between spouses if applicable
 */
function applyCommunityPropertyRules(input: TaxInput): TaxInput {
  if (!input.isInCommunityPropertyState || !input.splitCommunityIncome) {
    return input;
  }
  
  // Deep clone the input to avoid mutation
  const result = { ...input };
  
  // Income types typically considered community property and split 50/50
  // Wages are typically the most common community property
  const primaryWages = input.wages || 0;
  const spouseWages = input.spouseWages || 0;
  
  if (primaryWages > 0 || spouseWages > 0) {
    const totalWages = primaryWages + spouseWages;
    result.wages = totalWages / 2;
    result.spouseWages = totalWages / 2;
  }
  
  // Interest and dividends from community property are typically split
  const primaryInterest = input.interest || 0;
  const spouseInterest = input.spouseInterest || 0;
  
  if (primaryInterest > 0 || spouseInterest > 0) {
    const totalInterest = primaryInterest + spouseInterest;
    result.interest = totalInterest / 2;
    result.spouseInterest = totalInterest / 2;
  }
  
  const primaryDividends = input.dividends || 0;
  const spouseDividends = input.spouseDividends || 0;
  
  if (primaryDividends > 0 || spouseDividends > 0) {
    const totalDividends = primaryDividends + spouseDividends;
    result.dividends = totalDividends / 2;
    result.spouseDividends = totalDividends / 2;
  }
  
  // Note: IRA distributions and capital gains may have special rules
  // For simplicity, we'll leave them as-is, as they often relate to
  // separate property or have special considerations
  
  return result;
}

/**
 * Calculate tax scenario based on inputs
 * Includes data currency information in the result
 */
export function calculateTaxScenario(
  input: TaxInput, 
  scenario_name: string, 
  sessionId: string = "default"
): TaxResult {
  // Check tax data currency for this session
  const taxDataInfo = checkTaxDataCurrency(sessionId);
  
  // Check for appropriate tax data version based on year and scenario date
  const taxDataVersion = getTaxDataVersionForScenario(input.year, input.scenarioDate);
  
  // Check if this tax year has mid-year updates that might affect calculation
  const taxDataWarning = hasMidYearUpdates(input.year) ? getMidYearUpdateWarning(input.year) : undefined;

  // Apply community property rules if applicable
  if (input.isInCommunityPropertyState && input.splitCommunityIncome) {
    input = applyCommunityPropertyRules(input);
  }
  
  // Calculate total income
  let total_income = 
    input.wages + 
    input.interest + 
    input.dividends + 
    input.capital_gains + 
    input.ira_distributions + 
    input.roth_conversion + 
    (input.social_security * 0.85); // 85% of Social Security is typically taxable
    
  // Add spouse income for MFJ filing status
  if (input.filing_status === "married" && 
      (input.spouseWages || 
       input.spouseInterest || 
       input.spouseDividends || 
       input.spouseCapitalGains || 
       input.spouseIraDistributions || 
       input.spouseRothConversion || 
       input.spouseSocialSecurity)) {
    
    total_income += 
      (input.spouseWages || 0) + 
      (input.spouseInterest || 0) + 
      (input.spouseDividends || 0) + 
      (input.spouseCapitalGains || 0) + 
      (input.spouseIraDistributions || 0) + 
      (input.spouseRothConversion || 0) + 
      ((input.spouseSocialSecurity || 0) * 0.85);
  }

  // AGI (Adjusted Gross Income) - simplification for this scenario
  // In real life, there would be above-the-line deductions
  const agi = total_income;
  
  // Split income into ordinary income and capital gains
  let ordinary_income = 
    input.wages + 
    input.interest + 
    input.dividends + 
    input.ira_distributions + 
    input.roth_conversion + 
    (input.social_security * 0.85);
    
  // Add spouse's ordinary income for MFJ
  if (input.filing_status === "married") {
    ordinary_income +=
      (input.spouseWages || 0) + 
      (input.spouseInterest || 0) + 
      (input.spouseDividends || 0) + 
      (input.spouseIraDistributions || 0) + 
      (input.spouseRothConversion || 0) + 
      ((input.spouseSocialSecurity || 0) * 0.85);
  }
  
  // For simplicity, assuming capital gains are all long-term
  let capital_gains = input.capital_gains;
  
  // Add spouse's capital gains for MFJ
  if (input.filing_status === "married") {
    capital_gains += (input.spouseCapitalGains || 0);
  }
  
  // Calculate tax using our utility function that properly handles ordinary income and capital gains
  const taxResults = calculateTotalTaxLiability(
    ordinary_income,
    capital_gains,
    input.year,
    input.filing_status,
    input.isItemizedDeduction,
    input.itemizedDeductionAmount
  );
  
  // Calculate taxable income using the utility function
  const taxable_income = calculateTaxableIncome(
    agi,
    input.year,
    input.filing_status,
    input.isItemizedDeduction,
    input.itemizedDeductionAmount
  );
  
  // Calculate MFS comparison if requested and filing status is MFJ
  let mfs_comparison;
  if (input.filing_status === "married" &&
      (input.spouseWages !== undefined || 
       input.spouseInterest !== undefined || 
       input.spouseDividends !== undefined || 
       input.spouseCapitalGains !== undefined || 
       input.spouseIraDistributions !== undefined || 
       input.spouseRothConversion !== undefined || 
       input.spouseSocialSecurity !== undefined)) {
    
    // Create inputs for primary taxpayer and spouse
    const primaryInput: TaxInput = {
      year: input.year,
      wages: input.wages || 0,
      interest: input.interest || 0,
      dividends: input.dividends || 0,
      capital_gains: input.capital_gains || 0,
      ira_distributions: input.ira_distributions || 0,
      roth_conversion: input.roth_conversion || 0,
      social_security: input.social_security || 0,
      isItemizedDeduction: input.isItemizedDeduction,
      itemizedDeductionAmount: input.itemizedDeductionAmount ? input.itemizedDeductionAmount / 2 : undefined,
      filing_status: "married_separate",
      scenarioDate: input.scenarioDate
    };
    
    const spouseInput: TaxInput = {
      year: input.year,
      wages: input.spouseWages || 0,
      interest: input.spouseInterest || 0,
      dividends: input.spouseDividends || 0,
      capital_gains: input.spouseCapitalGains || 0,
      ira_distributions: input.spouseIraDistributions || 0,
      roth_conversion: input.spouseRothConversion || 0,
      social_security: input.spouseSocialSecurity || 0,
      isItemizedDeduction: input.isItemizedDeduction,
      itemizedDeductionAmount: input.itemizedDeductionAmount ? input.itemizedDeductionAmount / 2 : undefined,
      filing_status: "married_separate",
      scenarioDate: input.scenarioDate
    };
    
    // Calculate taxes for primary taxpayer and spouse as MFS
    const primaryTaxResult = calculateTaxBasic(primaryInput);
    const spouseTaxResult = calculateTaxBasic(spouseInput);
    
    // Combined MFS taxes
    const combined_tax = primaryTaxResult.total_tax + spouseTaxResult.total_tax;
    
    // Difference between MFJ and MFS
    const difference = combined_tax - taxResults.totalTax;
    
    mfs_comparison = {
      primary_tax: primaryTaxResult.total_tax,
      spouse_tax: spouseTaxResult.total_tax,
      combined_tax,
      difference
    };
  }
  
  // Return result with enhanced data including tax data currency and version information
  return {
    scenario_name,
    year: input.year,
    filing_status: input.filing_status,
    total_income,
    agi,
    taxable_income,
    total_tax: taxResults.totalTax,
    ordinary_tax: taxResults.ordinaryTax,
    capital_gains_tax: taxResults.capitalGainsTax,
    marginal_rate: taxResults.marginalOrdinaryRate,
    marginal_capital_gains_rate: taxResults.marginalCapitalGainsRate,
    effective_rate: taxResults.effectiveRate,
    brackets_breakdown: taxResults.bracketsBreakdown,
    updated_at: new Date(),
    tax_data_updated_at: taxDataInfo.dataUpdatedAt,
    tax_data_is_current: taxDataInfo.isCurrent,
    tax_data_version: taxDataVersion?.version,
    tax_data_warning: taxDataWarning,
    mfs_comparison
  };
}

/**
 * Simplified version of calculateTaxScenario to use for internal calculations
 * like MFJ vs MFS comparisons
 */
function calculateTaxBasic(input: TaxInput): {
  total_tax: number;
  ordinary_tax: number;
  capital_gains_tax: number;
} {
  // Calculate total income
  const total_income = 
    input.wages + 
    input.interest + 
    input.dividends + 
    input.capital_gains + 
    input.ira_distributions + 
    input.roth_conversion + 
    (input.social_security * 0.85);
    
  // AGI
  const agi = total_income;
  
  // Split income types
  const ordinary_income = 
    input.wages + 
    input.interest + 
    input.dividends + 
    input.ira_distributions + 
    input.roth_conversion + 
    (input.social_security * 0.85);
    
  const capital_gains = input.capital_gains;
  
  // Calculate tax
  const taxResults = calculateTotalTaxLiability(
    ordinary_income,
    capital_gains,
    input.year,
    input.filing_status,
    input.isItemizedDeduction,
    input.itemizedDeductionAmount
  );
  
  return {
    total_tax: taxResults.totalTax,
    ordinary_tax: taxResults.ordinaryTax,
    capital_gains_tax: taxResults.capitalGainsTax
  };
}

/**
 * Calculate safe harbor requirements to avoid underpayment penalties
 */
export function calculateSafeHarbor(input: SafeHarborInput): SafeHarborResult {
  // Calculate total projected payments for the year
  const total_projected_payments = input.current_withholding + input.estimated_remaining_withholding;
  
  // Calculate safe harbor minimum based on IRS rules:
  // - 90% of current year's tax, or
  // - 100% of prior year's tax (or 110% if high income)
  const current_year_minimum = input.current_year_tax * 0.9;
  const prior_year_minimum = input.prior_year_tax * (input.high_income ? 1.1 : 1.0);
  
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
  scenario_name: string,
  sessionId: string = "default"
): TaxResult {
  // First calculate the basic tax scenario with tax data currency check
  const basicResult = calculateTaxScenario(taxInput, scenario_name, sessionId);
  
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

// Legacy support functions to maintain compatibility with existing code
// These should be updated over time to use the new data structure directly

// Tax brackets accessor for backward compatibility
function getBracketsLegacy(year: number, filing_status: FilingStatusType) {
  // Map to legacy format
  const TAX_BRACKETS = {
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

  return TAX_BRACKETS[year as keyof typeof TAX_BRACKETS]?.[filing_status] || TAX_BRACKETS[2023][filing_status];
}

/**
 * Calculate RMD amount based on IRA balance and age
 * Uses IRS Uniform Lifetime Table
 */
export const calculateRMD = (balance: number, age: number): number => {
  // IRS Uniform Lifetime Table (simplified version)
  const lifeExpectancyTable: Record<number, number> = {
    73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0, 79: 21.1,
    80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0, 86: 15.2,
    87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8, 93: 10.1,
    94: 9.5, 95: 8.9, 96: 8.4, 97: 7.8, 98: 7.3, 99: 6.8, 100: 6.4,
    // Add more ages as needed
  };
  
  // If age not found in table or below RMD age, return 0
  if (!lifeExpectancyTable[age]) {
    return 0;
  }
  
  // Calculate RMD: account balance divided by life expectancy factor
  return balance / lifeExpectancyTable[age];
};

/**
 * Get maximum conversion amount based on bracket fill strategy
 */
export const getMaxConversionAmount = (
  strategy: 'fixed' | 'bracket_12' | 'bracket_12_22',
  income: number,
  year: number,
  filingStatus: FilingStatusType,
  fixedAmount?: number
): number => {
  // If fixed strategy, return the fixed amount
  if (strategy === 'fixed' && fixedAmount !== undefined) {
    return fixedAmount;
  }
  
  // Get bracket information
  const brackets = getBrackets(year, filingStatus, "ordinary");
  
  // Find 12% and 22% brackets
  const bracket12 = brackets.find(b => Math.round(b.rate * 100) === 12);
  const bracket22 = brackets.find(b => Math.round(b.rate * 100) === 22);
  
  if (!bracket12) {
    return 0; // Safety check
  }
  
  // Calculate available space in 12% bracket
  let availableSpace = bracket12.bracket_max - income;
  
  // If we want to go up to 22% bracket and it exists
  if (strategy === 'bracket_12_22' && bracket22) {
    availableSpace = bracket22.bracket_max - income;
  }
  
  // Make sure we don't go negative
  return Math.max(0, availableSpace);
};

/**
 * Calculate multi-year Roth conversion scenario
 */
export const calculateMultiYearScenario = async (
  scenarioData: MultiYearScenarioData
): Promise<YearlyResult[]> => {
  const results: YearlyResult[] = [];
  
  // Initial account balances
  let traditionalIRABalance = scenarioData.traditionalIRAStartBalance;
  let rothIRABalance = scenarioData.rothIRAStartBalance;
  let cumulativeTaxPaid = 0;
  let cumulativeTaxSaved = 0;
  
  // Spouse account balances (if applicable)
  let spouseTraditionalIRABalance = scenarioData.spouseTraditionalIRAStartBalance || 0;
  let spouseRothIRABalance = scenarioData.spouseRothIRAStartBalance || 0;
  
  // Traditional-only scenario (for comparison)
  let traditionalScenarioBalance = traditionalIRABalance + rothIRABalance;
  if (scenarioData.includeSpouse) {
    traditionalScenarioBalance += (spouseTraditionalIRABalance + spouseRothIRABalance);
  }

  // Track if break-even has occurred
  let breakEvenOccurred = false;
  
  // Process each year
  for (let i = 0; i < scenarioData.numYears; i++) {
    const currentYear = scenarioData.startYear + i;
    const currentAge = scenarioData.startAge + i;
    const spouseAge = scenarioData.spouseAge ? scenarioData.spouseAge + i : undefined;
    
    // Calculate projected income for this year with growth
    const baseIncome = scenarioData.baseAnnualIncome * 
      Math.pow(1 + scenarioData.incomeGrowthRate, i);
    
    // Calculate spouse income if applicable
    let spouseBaseIncome = 0;
    if (scenarioData.includeSpouse && scenarioData.spouseBaseAnnualIncome) {
      spouseBaseIncome = scenarioData.spouseBaseAnnualIncome *
        Math.pow(1 + scenarioData.incomeGrowthRate, i);
    }
    
    // Calculate RMD if applicable
    let rmdAmount = 0;
    if (scenarioData.includeRMDs && currentAge >= scenarioData.rmdStartAge) {
      rmdAmount = calculateRMD(traditionalIRABalance, currentAge);
    }
    
    // Calculate spouse RMD if applicable
    let spouseRmdAmount = 0;
    if (scenarioData.includeSpouse && scenarioData.includeRMDs && 
        spouseAge && spouseAge >= (scenarioData.spouseRmdStartAge || scenarioData.rmdStartAge)) {
      spouseRmdAmount = calculateRMD(spouseTraditionalIRABalance, spouseAge);
    }
    
    // Total income before conversion
    const totalPreConversionIncome = baseIncome + spouseBaseIncome + rmdAmount + spouseRmdAmount;
    
    // Determine conversion amount based on strategy
    let conversionAmount = 0;
    let spouseConversionAmount = 0;
    
    if (scenarioData.combinedIRAApproach && scenarioData.includeSpouse) {
      //
