
import React from 'react';
import { YearlyTaxImpact } from '../../types';

interface YearlyTaxMetricsProps {
  yearData: YearlyTaxImpact;
  activeYear: "current" | "next";
  hasEquity: boolean;
  hasDeferred: boolean;
  triggersAmt: boolean;
  spreadPerShare: number;
  nextYearIncome: number;
  hasStateTax: boolean;
  stateTaxInfo?: {
    stateCode: string;
    stateTax: number;
    federalTax: number;
  };
}

export const YearlyTaxMetrics: React.FC<YearlyTaxMetricsProps> = ({
  yearData,
  activeYear,
  hasEquity,
  hasDeferred,
  triggersAmt,
  spreadPerShare,
  nextYearIncome,
  hasStateTax,
  stateTaxInfo
}) => {
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const formatPercent = (rate: number) => {
    return `${(rate * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <div className="text-gray-300">Ordinary Income:</div>
        <div className="text-right font-medium">{formatCurrency(yearData.ordinaryIncome)}</div>
        
        {hasEquity && (
          <>
            <div className="text-gray-300">
              {triggersAmt ? "AMT Income:" : "Exercise Income:"}
            </div>
            <div className="text-right font-medium">
              {formatCurrency(yearData.equityIncome || 0)}
            </div>
          </>
        )}
        
        {hasDeferred && activeYear === "next" && (
          <>
            <div className="text-gray-300">Deferred Income:</div>
            <div className="text-right font-medium">{formatCurrency(nextYearIncome)}</div>
          </>
        )}
        
        <div className="text-gray-300">Total Taxable Income:</div>
        <div className="text-right font-medium">{formatCurrency(yearData.ordinaryIncome)}</div>
        
        <div className="text-gray-300">Marginal Rate:</div>
        <div className="text-right font-medium">{formatPercent(yearData.marginalRate)}</div>
        
        <div className="text-gray-300">Effective Rate:</div>
        <div className="text-right font-medium">{formatPercent(yearData.effectiveRate)}</div>
        
        {hasStateTax && stateTaxInfo && (
          <>
            <div className="text-gray-300">Federal Tax:</div>
            <div className="text-right font-medium">{formatCurrency(stateTaxInfo.federalTax)}</div>
            
            <div className="text-gray-300">State Tax ({stateTaxInfo.stateCode}):</div>
            <div className="text-right font-medium">{formatCurrency(stateTaxInfo.stateTax)}</div>
          </>
        )}
        
        <div className="text-gray-300 font-medium">Total Tax:</div>
        <div className="text-right font-bold text-lg">{formatCurrency(yearData.totalTax)}</div>
      </div>
      
      {triggersAmt && (
        <div className="mt-2 pt-2 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-amber-300">AMT Impact:</span>
            <span className="text-amber-300 font-medium">{formatCurrency(yearData.amtImpact || 0)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
