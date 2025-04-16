
/**
 * Conversion Utilities
 * 
 * Functions for determining conversion amounts based on strategy.
 */

import { MultiYearScenarioData } from '@/types/tax/rothConversionTypes';
import { getMaxConversionAmount } from '../conversionStrategyUtils';

interface ConversionAmountInput {
  scenarioData: MultiYearScenarioData;
  totalPreConversionIncome: number;
  currentYear: number;
  baseIncome: number;
  rmdAmount: number;
  spouseBaseIncome: number;
  spouseRmdAmount: number;
  traditionalIRABalance: number;
  spouseTraditionalIRABalance: number;
}

interface ConversionAmountOutput {
  conversionAmount: number;
  spouseConversionAmount: number;
}

export function determineConversionAmounts({
  scenarioData,
  totalPreConversionIncome,
  currentYear,
  baseIncome,
  rmdAmount,
  spouseBaseIncome,
  spouseRmdAmount,
  traditionalIRABalance,
  spouseTraditionalIRABalance
}: ConversionAmountInput): ConversionAmountOutput {
  let conversionAmount = 0;
  let spouseConversionAmount = 0;
  
  if (scenarioData.combinedIRAApproach && scenarioData.includeSpouse) {
    // Combined approach for both IRAs
    const totalMaxConversion = getMaxConversionAmount(
      scenarioData.conversionStrategy,
      totalPreConversionIncome,
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
        scenarioData.fixedConversionAmount
      )
    );
    
    if (scenarioData.includeSpouse) {
      spouseConversionAmount = Math.min(
        spouseTraditionalIRABalance,
        getMaxConversionAmount(
          scenarioData.conversionStrategy,
          spouseBaseIncome + spouseRmdAmount,
          scenarioData.fixedConversionAmount
        )
      );
    }
  }
  
  return { conversionAmount, spouseConversionAmount };
}
