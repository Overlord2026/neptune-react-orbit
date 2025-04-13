
/**
 * Multi-Year Scenario Calculation Utilities
 * 
 * Functions for calculating multi-year Roth conversion scenarios.
 */

import { MultiYearScenarioData, YearlyResult } from '../components/tax/roth-conversion/types/ScenarioTypes';
import { TaxInput, calculateTaxScenario } from './taxCalculator';
import { calculateRMD } from './rmdCalculationUtils';
import { getMaxConversionAmount } from './conversionStrategyUtils';

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
      // Combined approach for both IRAs
      const totalMaxConversion = getMaxConversionAmount(
        scenarioData.conversionStrategy,
        totalPreConversionIncome,
        currentYear,
        scenarioData.filingStatus,
        scenarioData.fixedConversionAmount
      );
      
      // Split the conversion between spouses based on their proportional IRA balances
      const totalTraditionalBalance = traditionalIRABalance + spouseTraditionalIRABalance;
      if (totalTraditionalBalance > 0) {
        conversionAmount = Math.min(
          traditionalIRABalance,
          totalMaxConversion * (traditionalIRABalance / totalTraditionalBalance)
        );
        
        spouseConversionAmount = Math.min(
          spouseTraditionalIRABalance,
          totalMaxConversion * (spouseTraditionalIRABalance / totalTraditionalBalance)
        );
      }
    } else {
      // Separate approach for each IRA
      conversionAmount = Math.min(
        traditionalIRABalance,
        getMaxConversionAmount(
          scenarioData.conversionStrategy,
          baseIncome + rmdAmount,
          currentYear,
          scenarioData.filingStatus,
          scenarioData.fixedConversionAmount
        )
      );
      
      if (scenarioData.includeSpouse) {
        spouseConversionAmount = Math.min(
          spouseTraditionalIRABalance,
          getMaxConversionAmount(
            scenarioData.conversionStrategy,
            spouseBaseIncome + spouseRmdAmount,
            currentYear,
            scenarioData.filingStatus === 'married_separate' ? 'single' : scenarioData.filingStatus,
            scenarioData.fixedConversionAmount
          )
        );
      }
    }
    
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
    
    // Calculate tax savings/cost
    const taxImpact = taxResult.total_tax - noConversionTaxResult.total_tax;
    cumulativeTaxPaid += taxImpact;
    
    // Update account balances
    // Traditional IRA: remove conversion and RMD, then grow remainder
    traditionalIRABalance -= conversionAmount;
    traditionalIRABalance -= rmdAmount;
    traditionalIRABalance *= (1 + scenarioData.expectedAnnualReturn);
    
    // Spouse Traditional IRA: remove conversion and RMD, then grow remainder
    if (scenarioData.includeSpouse) {
      spouseTraditionalIRABalance -= spouseConversionAmount;
      spouseTraditionalIRABalance -= spouseRmdAmount;
      spouseTraditionalIRABalance *= (1 + scenarioData.expectedAnnualReturn);
    }
    
    // Roth IRA: add conversion and grow
    rothIRABalance += conversionAmount;
    rothIRABalance *= (1 + scenarioData.expectedAnnualReturn);
    
    // Spouse Roth IRA: add conversion and grow
    if (scenarioData.includeSpouse) {
      spouseRothIRABalance += spouseConversionAmount;
      spouseRothIRABalance *= (1 + scenarioData.expectedAnnualReturn);
    }
    
    // For comparison: traditional-only scenario
    // We assume RMDs are taken but no conversions, and all accounts grow at same rate
    traditionalScenarioBalance -= (rmdAmount + (scenarioData.includeSpouse ? spouseRmdAmount : 0));
    traditionalScenarioBalance *= (1 + scenarioData.expectedAnnualReturn);
    
    // Calculate cumulative value difference (tax savings)
    const rothScenarioBalance = traditionalIRABalance + rothIRABalance + 
      (scenarioData.includeSpouse ? (spouseTraditionalIRABalance + spouseRothIRABalance) : 0);
    
    // Adjust for taxes paid for conversions
    const adjustedRothBalance = rothScenarioBalance - cumulativeTaxPaid;
    
    // Tax savings = difference between adjusted Roth scenario and traditional scenario
    cumulativeTaxSaved = adjustedRothBalance - traditionalScenarioBalance;
    
    // Check if this is the break-even year
    let breakEvenYear = false;
    if (!breakEvenOccurred && cumulativeTaxSaved >= 0) {
      breakEvenYear = true;
      breakEvenOccurred = true;
    }
    
    // Calculate MFS comparison if requested
    let mfsComparison;
    if (scenarioData.compareMfjVsMfs && scenarioData.filingStatus === 'married') {
      const mfsResult = taxResult.mfs_comparison;
      if (mfsResult) {
        mfsComparison = {
          totalTax: mfsResult.combined_tax,
          savings: mfsResult.combined_tax - taxResult.total_tax
        };
      }
    }
    
    // Add this year's results to the array
    results.push({
      year: currentYear,
      age: currentAge,
      traditionalIRABalance,
      rothIRABalance,
      conversionAmount,
      rmdAmount,
      totalTax: taxResult.total_tax,
      marginalRate: taxResult.marginal_rate,
      warnings: [], // Placeholder for any warnings
      cumulativeTaxPaid,
      cumulativeTaxSaved,
      traditionalScenarioBalance,
      rothScenarioBalance,
      breakEvenYear,
      
      // Spouse related results (if applicable)
      spouseAge,
      spouseTraditionalIRABalance: scenarioData.includeSpouse ? spouseTraditionalIRABalance : undefined,
      spouseRothIRABalance: scenarioData.includeSpouse ? spouseRothIRABalance : undefined,
      spouseConversionAmount: scenarioData.includeSpouse ? spouseConversionAmount : undefined,
      spouseRmdAmount: scenarioData.includeSpouse ? spouseRmdAmount : undefined,
      
      // MFS comparison results (if applicable)
      mfsComparison
    });
  }
  
  return results;
};
