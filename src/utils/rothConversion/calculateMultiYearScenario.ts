/**
 * Multi-Year Roth Conversion Scenario Calculation
 * 
 * Main function for calculating multi-year Roth conversion scenarios.
 */

import { MultiYearScenarioData, YearlyResult, CharitableContribution } from '@/types/tax/rothConversionTypes';
import { TaxInput } from '@/types/tax/taxCalculationTypes';
import { calculateTaxScenario } from '../taxCalculator';
import { processSingleYearCalculation } from './yearCalculation';
import { updateAccountBalances } from './accountBalanceUtils';

/**
 * Calculate multi-year Roth conversion scenario
 */
export const calculateMultiYearScenario = async (
  scenarioData: MultiYearScenarioData
): Promise<YearlyResult[]> => {
  const results: YearlyResult[] = [];
  
  // Initial account balances - use both forms of the property names for compatibility
  let traditionalIraBalance = scenarioData.traditionalIRAStartBalance || scenarioData.traditionalIraBalance;
  let rothIraBalance = scenarioData.rothIRAStartBalance || scenarioData.rothIraBalance;
  let cumulativeTaxPaid = 0;
  let cumulativeTaxSaved = 0;
  
  // Spouse account balances (if applicable)
  let spouseTraditionalIraBalance = scenarioData.spouseTraditionalIRAStartBalance || 0;
  let spouseRothIraBalance = scenarioData.spouseRothIRAStartBalance || 0;
  
  // Traditional-only scenario (for comparison)
  let traditionalScenarioBalance = traditionalIraBalance + rothIraBalance;
  if (scenarioData.includeSpouse) {
    traditionalScenarioBalance += (spouseTraditionalIraBalance + spouseRothIraBalance);
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
      traditionalIRABalance: traditionalIraBalance,
      spouseTraditionalIRABalance: spouseTraditionalIraBalance,
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
      warnings,
      charitableContribution,
      charitableImpact
    } = yearResult;

    // Calculate tax savings/cost
    const taxImpact = taxResult.total_tax - noConversionTaxResult.total_tax;
    cumulativeTaxPaid += taxImpact;
    
    // Update account balances
    const balanceUpdate = updateAccountBalances({
      scenarioData,
      traditionalIRABalance: traditionalIraBalance,
      rothIRABalance: rothIraBalance,
      spouseTraditionalIRABalance: spouseTraditionalIraBalance,
      spouseRothIRABalance: spouseRothIraBalance,
      traditionalScenarioBalance,
      conversionAmount,
      rmdAmount,
      spouseConversionAmount,
      spouseRmdAmount
    });
    
    traditionalIraBalance = balanceUpdate.traditionalIRABalance;
    rothIraBalance = balanceUpdate.rothIRABalance;
    spouseTraditionalIraBalance = balanceUpdate.spouseTraditionalIRABalance;
    spouseRothIraBalance = balanceUpdate.spouseRothIRABalance;
    traditionalScenarioBalance = balanceUpdate.traditionalScenarioBalance;
    
    // Calculate cumulative value difference (tax savings)
    const rothScenarioBalance = traditionalIraBalance + rothIraBalance + 
      (scenarioData.includeSpouse ? (spouseTraditionalIraBalance + spouseRothIraBalance) : 0);
    
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
    if (scenarioData.compareMfjVsMfs && scenarioData.filingStatus === 'married_joint') {
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
    
    // Complete charitable contribution info from yearResult if available
    const completeCharitableContribution = {
      amount: charitableContribution?.amount || 0,
      useQcd: charitableContribution?.useQcd || false,
      isBunching: charitableContribution?.isBunching || false,
      standardDeduction: charitableImpact?.standardDeduction || 0,
      itemizedDeduction: charitableImpact?.itemizedDeduction || 0, 
      isItemizing: charitableImpact?.isItemizing || false,
      taxSavings: charitableImpact?.taxSavings || 0,
      trapAvoidance: []
    };
    
    // Add this year's results to the array
    results.push({
      year: currentYear,
      age: currentAge,
      traditionalIraBalance,
      rothIraBalance,
      conversionAmount,
      rmdAmount,
      taxableIncome: totalPreConversionIncome + conversionAmount + (spouseConversionAmount || 0),
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
      spouseTraditionalIraBalance: scenarioData.includeSpouse ? spouseTraditionalIraBalance : undefined,
      spouseRothIraBalance: scenarioData.includeSpouse ? spouseRothIraBalance : undefined,
      spouseConversionAmount: scenarioData.includeSpouse ? spouseConversionAmount : undefined,
      spouseRmdAmount: scenarioData.includeSpouse ? spouseRmdAmount : undefined,
      
      // MFS comparison results (if applicable)
      mfsComparison,
      
      // Charitable contribution impact
      charitableContribution: completeCharitableContribution,
      
      // Other required properties
      filingStatus: scenarioData.filingStatus,
      income: baseIncome,
      spouseIncome: spouseBaseIncome,
      totalIncome: totalPreConversionIncome,
      irmaaImpact: false,
      totalTraditionalBalance: traditionalIraBalance + (scenarioData.includeSpouse ? spouseTraditionalIraBalance : 0),
      totalRothBalance: rothIraBalance + (scenarioData.includeSpouse ? spouseRothIraBalance : 0),
      totalRetirementBalance: traditionalIraBalance + rothIraBalance + 
        (scenarioData.includeSpouse ? (spouseTraditionalIraBalance + spouseRothIraBalance) : 0)
    });
  }
  
  return results;
};
