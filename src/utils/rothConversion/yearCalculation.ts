
/**
 * Single Year Calculation Utilities
 * 
 * Functions for calculating a single year within a multi-year Roth conversion scenario.
 */

import { MultiYearScenarioData } from '@/components/tax/roth-conversion/types/ScenarioTypes';
import { TaxInput, calculateTaxScenario } from '../taxCalculator';
import { calculateRMD } from '../rmdCalculationUtils';
import { determineConversionAmounts } from './conversionUtils';

interface YearCalculationInput {
  scenarioData: MultiYearScenarioData;
  currentYear: number;
  currentAge: number;
  spouseAge?: number;
  traditionalIRABalance: number;
  spouseTraditionalIRABalance: number;
  i: number; // Year index
}

export function processSingleYearCalculation({
  scenarioData,
  currentYear,
  currentAge,
  spouseAge,
  traditionalIRABalance,
  spouseTraditionalIRABalance,
  i
}: YearCalculationInput) {
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
  
  // Determine conversion amounts
  const { conversionAmount, spouseConversionAmount } = determineConversionAmounts({
    scenarioData,
    totalPreConversionIncome,
    currentYear,
    baseIncome,
    rmdAmount,
    spouseBaseIncome,
    spouseRmdAmount,
    traditionalIRABalance,
    spouseTraditionalIRABalance
  });
  
  // Calculate tax on this year's income and conversion
  const yearTaxInput: TaxInput = {
    year: currentYear,
    wages: baseIncome,
    interest: 0,
    dividends: 0,
    capital_gains: 0,
    ira_distributions: rmdAmount,
    roth_conversion: conversionAmount,
    social_security: 0,
    isItemizedDeduction: false,
    filing_status: scenarioData.filingStatus,
    
    // Add spouse info if applicable
    spouseWages: scenarioData.includeSpouse ? spouseBaseIncome : undefined,
    spouseIraDistributions: scenarioData.includeSpouse ? spouseRmdAmount : undefined,
    spouseRothConversion: scenarioData.includeSpouse ? spouseConversionAmount : undefined,
    
    // Community property settings
    isInCommunityPropertyState: scenarioData.isInCommunityPropertyState,
    splitCommunityIncome: scenarioData.splitCommunityIncome,
  };
  
  // Calculate tax on this scenario
  const taxResult = calculateTaxScenario(
    yearTaxInput, 
    `Year ${currentYear} Roth Conversion`,
    "multi_year_analysis"
  );
  
  // Calculate tax on the same scenario without conversion
  const noConversionInput = { ...yearTaxInput, roth_conversion: 0, spouseRothConversion: 0 };
  const noConversionTaxResult = calculateTaxScenario(
    noConversionInput,
    `Year ${currentYear} No Conversion`,
    "multi_year_analysis"
  );

  return {
    baseIncome,
    spouseBaseIncome,
    rmdAmount,
    spouseRmdAmount,
    totalPreConversionIncome,
    conversionAmount,
    spouseConversionAmount,
    taxResult,
    noConversionTaxResult
  };
}
