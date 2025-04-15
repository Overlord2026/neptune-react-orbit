
/**
 * Multi-Year Roth Conversion Scenario Calculation
 * 
 * Main function for calculating multi-year Roth conversion scenarios.
 */

import { MultiYearScenarioData, YearlyResult } from '@/components/tax/roth-conversion/types/ScenarioTypes';
import { TaxInput, calculateTaxScenario } from '../taxCalculator';
import { processSingleYearCalculation } from './yearCalculation';
import { updateAccountBalances } from './accountBalanceUtils';

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
    
    // Process single year calculation
    const yearResult = processSingleYearCalculation({
      scenarioData,
      currentYear,
      currentAge,
      spouseAge,
      traditionalIRABalance,
      spouseTraditionalIRABalance,
      i
    });
    
    const {
      baseIncome,
      spouseBaseIncome,
      rmdAmount,
      spouseRmdAmount,
      totalPreConversionIncome,
      conversionAmount,
      spouseConversionAmount,
      taxResult,
      noConversionTaxResult,
      warnings
    } = yearResult;

    // Calculate tax savings/cost
    const taxImpact = taxResult.total_tax - noConversionTaxResult.total_tax;
    cumulativeTaxPaid += taxImpact;
    
    // Update account balances
    const balanceUpdate = updateAccountBalances({
      scenarioData,
      traditionalIRABalance,
      rothIRABalance,
      spouseTraditionalIRABalance,
      spouseRothIRABalance,
      traditionalScenarioBalance,
      conversionAmount,
      rmdAmount,
      spouseConversionAmount,
      spouseRmdAmount
    });
    
    traditionalIRABalance = balanceUpdate.traditionalIRABalance;
    rothIRABalance = balanceUpdate.rothIRABalance;
    spouseTraditionalIRABalance = balanceUpdate.spouseTraditionalIRABalance;
    spouseRothIRABalance = balanceUpdate.spouseRothIRABalance;
    traditionalScenarioBalance = balanceUpdate.traditionalScenarioBalance;
    
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
          mfjTotalTax: taxResult.total_tax,
          spouse1Tax: mfsResult.primary_tax,
          spouse2Tax: mfsResult.spouse_tax,
          combinedMfsTax: mfsResult.combined_tax,
          taxDifference: mfsResult.difference
        };
      }
    }
    
    // Extract charitable contribution info from yearResult
    const charitableContribution = yearResult.charitableContribution || {
      amount: 0,
      useQcd: false,
      isBunching: false
    };
    
    // Get charitable impact info from yearResult
    const charitableImpact = yearResult.charitableImpact || {
      standardDeduction: 0,
      itemizedDeduction: 0,
      isItemizing: false,
      taxSavings: 0
    };
    
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
      effectiveRate: taxResult.effective_rate,
      warnings: warnings || [],
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
      mfsComparison,
      
      // Charitable contribution impact
      charitableContribution,
      charitableImpact
    });
  }
  
  return results;
};
