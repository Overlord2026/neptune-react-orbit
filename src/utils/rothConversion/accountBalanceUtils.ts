
/**
 * Account Balance Utilities
 * 
 * Functions for updating account balances in Roth conversion scenarios.
 */

import { MultiYearScenarioData } from '@/components/tax/roth-conversion/types/ScenarioTypes';

interface AccountBalanceInput {
  scenarioData: MultiYearScenarioData;
  traditionalIRABalance: number;
  rothIRABalance: number;
  spouseTraditionalIRABalance: number;
  spouseRothIRABalance: number;
  traditionalScenarioBalance: number;
  conversionAmount: number;
  rmdAmount: number;
  spouseConversionAmount: number;
  spouseRmdAmount: number;
}

interface AccountBalanceOutput {
  traditionalIRABalance: number;
  rothIRABalance: number;
  spouseTraditionalIRABalance: number;
  spouseRothIRABalance: number;
  traditionalScenarioBalance: number;
}

export function updateAccountBalances({
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
}: AccountBalanceInput): AccountBalanceOutput {
  // Traditional IRA: remove conversion and RMD, then grow remainder
  let updatedTraditionalIRABalance = traditionalIRABalance;
  updatedTraditionalIRABalance -= conversionAmount;
  updatedTraditionalIRABalance -= rmdAmount;
  updatedTraditionalIRABalance *= (1 + scenarioData.expectedAnnualReturn);
  
  // Spouse Traditional IRA: remove conversion and RMD, then grow remainder
  let updatedSpouseTraditionalIRABalance = spouseTraditionalIRABalance;
  if (scenarioData.includeSpouse) {
    updatedSpouseTraditionalIRABalance -= spouseConversionAmount;
    updatedSpouseTraditionalIRABalance -= spouseRmdAmount;
    updatedSpouseTraditionalIRABalance *= (1 + scenarioData.expectedAnnualReturn);
  }
  
  // Roth IRA: add conversion and grow
  let updatedRothIRABalance = rothIRABalance;
  updatedRothIRABalance += conversionAmount;
  updatedRothIRABalance *= (1 + scenarioData.expectedAnnualReturn);
  
  // Spouse Roth IRA: add conversion and grow
  let updatedSpouseRothIRABalance = spouseRothIRABalance;
  if (scenarioData.includeSpouse) {
    updatedSpouseRothIRABalance += spouseConversionAmount;
    updatedSpouseRothIRABalance *= (1 + scenarioData.expectedAnnualReturn);
  }
  
  // For comparison: traditional-only scenario
  // We assume RMDs are taken but no conversions, and all accounts grow at same rate
  let updatedTraditionalScenarioBalance = traditionalScenarioBalance;
  updatedTraditionalScenarioBalance -= (rmdAmount + (scenarioData.includeSpouse ? spouseRmdAmount : 0));
  updatedTraditionalScenarioBalance *= (1 + scenarioData.expectedAnnualReturn);
  
  return {
    traditionalIRABalance: updatedTraditionalIRABalance,
    rothIRABalance: updatedRothIRABalance,
    spouseTraditionalIRABalance: updatedSpouseTraditionalIRABalance,
    spouseRothIRABalance: updatedSpouseRothIRABalance,
    traditionalScenarioBalance: updatedTraditionalScenarioBalance
  };
}
