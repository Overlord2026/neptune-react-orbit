
/**
 * Single Year Calculation Utilities
 * 
 * Functions for calculating a single year within a multi-year Roth conversion scenario.
 */

import { MultiYearScenarioData } from '@/components/tax/roth-conversion/types/ScenarioTypes';
import { TaxInput, calculateTaxScenario } from '../taxCalculator';
import { calculateRMD } from '../rmdCalculationUtils';
import { determineConversionAmounts } from './conversionUtils';
import { 
  getCharitableContributionForYear, 
  calculateCharitableImpact, 
  calculateCharitableOpportunity 
} from './charitableUtils';
import { TaxTrapInput, checkTaxTraps } from '@/utils/taxTraps';

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
  
  // Get charitable contribution for this year
  const charitableContribution = getCharitableContributionForYear(
    scenarioData, 
    currentYear, 
    currentAge
  );
  
  // Calculate any reduction to RMD amount if using QCD
  let adjustedRmdAmount = rmdAmount;
  if (charitableContribution.useQcd && currentAge >= 70.5) {
    // QCD can reduce or eliminate RMD up to the contribution amount
    adjustedRmdAmount = Math.max(0, rmdAmount - charitableContribution.amount);
  }
  
  // Total income before conversion (using adjusted RMD if applicable)
  const totalPreConversionIncome = baseIncome + spouseBaseIncome + adjustedRmdAmount + spouseRmdAmount;
  
  // Determine conversion amounts
  const { conversionAmount, spouseConversionAmount } = determineConversionAmounts({
    scenarioData,
    totalPreConversionIncome,
    currentYear,
    baseIncome,
    rmdAmount: adjustedRmdAmount, // Use the adjusted RMD amount
    spouseBaseIncome,
    spouseRmdAmount,
    traditionalIRABalance,
    spouseTraditionalIRABalance
  });
  
  // Calculate total AGI before any charitable impacts
  const baseAGI = totalPreConversionIncome + conversionAmount + (spouseConversionAmount || 0);
  
  // Create input for tax trap checking BEFORE charitable contributions
  const beforeCharitableTraps = checkTaxTraps({
    scenario_id: `year_${currentYear}_before`,
    year: currentYear,
    filing_status: scenarioData.filingStatus,
    agi: baseAGI,
    total_income: baseAGI,
    taxable_income: baseAGI - getStandardDeduction(scenarioData.filingStatus, currentYear),
    capital_gains_long: 0, // Simplified for this example
    capital_gains_short: 0,
    social_security_amount: 0, // Simplified
    household_size: scenarioData.filingStatus === 'married' ? 2 : 1,
    medicare_enrollment: currentAge >= 65,
    aca_enrollment: false
  });
  
  // Collect warnings from trap detection
  const warnings = beforeCharitableTraps.warnings.map(warning => ({
    type: warning.type,
    message: warning.description,
    severity: warning.severity === 'alert' ? 'high' as const : 
             warning.severity === 'warning' ? 'medium' as const : 'low' as const,
    trapType: warning.type
  }));
  
  let charitableImpact = {
    standardDeduction: 0,
    itemizedDeduction: 0,
    isItemizing: false,
    taxSavings: 0
  };
  
  // Calculate tax on this year's income and conversion
  const yearTaxInput: TaxInput = {
    year: currentYear,
    wages: baseIncome,
    interest: 0,
    dividends: 0,
    capital_gains: 0,
    ira_distributions: adjustedRmdAmount, // Use adjusted RMD amount
    roth_conversion: conversionAmount,
    social_security: 0,
    isItemizedDeduction: false, // Will be determined based on charitable contribution
    filing_status: scenarioData.filingStatus,
    
    // Add spouse info if applicable
    spouseWages: scenarioData.includeSpouse ? spouseBaseIncome : undefined,
    spouseIraDistributions: scenarioData.includeSpouse ? spouseRmdAmount : undefined,
    spouseRothConversion: scenarioData.includeSpouse ? spouseConversionAmount : undefined,
    
    // Community property settings
    isInCommunityPropertyState: scenarioData.isInCommunityPropertyState,
    splitCommunityIncome: scenarioData.splitCommunityIncome,
  };
  
  // If charitable planning is enabled, adjust the tax input
  if (scenarioData.useCharitablePlanning && charitableContribution.amount > 0) {
    // Calculate charitable impact on taxes with trap detection
    charitableImpact = calculateCharitableImpact(
      charitableContribution.amount,
      charitableContribution.useQcd,
      charitableContribution.isBunching,
      scenarioData.filingStatus,
      currentYear,
      0.24, // Estimate marginal rate for initial calculation
      rmdAmount,
      baseAGI,
      beforeCharitableTraps
    );
    
    // Update tax input with itemized deduction info
    if (charitableImpact.isItemizing) {
      yearTaxInput.isItemizedDeduction = true;
      yearTaxInput.itemizedDeductionAmount = charitableImpact.itemizedDeduction;
    }
  }
  
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

  // Calculate charitable impact with the actual marginal rate from tax result
  if (scenarioData.useCharitablePlanning && charitableContribution.amount > 0) {
    charitableImpact = calculateCharitableImpact(
      charitableContribution.amount,
      charitableContribution.useQcd,
      charitableContribution.isBunching,
      scenarioData.filingStatus,
      currentYear,
      taxResult.marginal_rate, // Use actual marginal rate
      rmdAmount,
      baseAGI,
      beforeCharitableTraps
    );
    
    // Check for additional charitable opportunities
    const opportunity = calculateCharitableOpportunity(
      beforeCharitableTraps,
      scenarioData.filingStatus,
      currentAge,
      baseAGI,
      currentYear
    );
    
    if (opportunity) {
      warnings.push({
        type: 'charitable_opportunity',
        message: opportunity.description,
        severity: opportunity.severity,
        trapType: 'charitable_opportunity'
      });
    }
  }
  
  return {
    baseIncome,
    spouseBaseIncome,
    rmdAmount,
    spouseRmdAmount,
    totalPreConversionIncome,
    conversionAmount,
    spouseConversionAmount,
    taxResult,
    noConversionTaxResult,
    charitableContribution: scenarioData.useCharitablePlanning ? {
      ...charitableContribution,
      ...charitableImpact
    } : undefined,
    warnings
  };
}

// Get the standard deduction (already defined in charitableUtils.ts, imported here for direct use)
import { getStandardDeduction } from './charitableUtils';
