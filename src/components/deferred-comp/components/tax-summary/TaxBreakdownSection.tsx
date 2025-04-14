
import React from 'react';
import { YearlyTaxImpact } from '../../types';
import { YearlyTaxMetrics } from './YearlyTaxMetrics';
import { StateCode } from '@/utils/stateTaxData';
import { formatCurrency } from '@/utils/formatUtils';

interface StateTaxInfo {
  stateCode?: StateCode;
  stateTax: number;
  federalTax: number;
}

interface TaxBreakdownSectionProps {
  hasEquity: boolean;
  hasDeferred: boolean;
  triggersAmt: boolean;
  yearlyData?: YearlyTaxImpact;
  activeYear: "current" | "next";
  spreadPerShare: number;
  nextYearIncome: number;
  hasStateTax?: boolean;
  stateTaxInfo?: StateTaxInfo;
}

export const TaxBreakdownSection: React.FC<TaxBreakdownSectionProps> = ({
  hasEquity,
  hasDeferred,
  triggersAmt,
  yearlyData,
  activeYear,
  spreadPerShare,
  nextYearIncome,
  hasStateTax,
  stateTaxInfo
}) => {
  if (!yearlyData) {
    return <div className="text-muted-foreground">No tax data available for this year.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-300 mb-2">Tax Breakdown</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <YearlyTaxMetrics
            yearlyData={yearlyData}
            activeYear={activeYear}
            hasEquity={hasEquity}
            hasDeferred={hasDeferred}
            triggersAmt={triggersAmt}
            spreadPerShare={spreadPerShare}
            nextYearIncome={nextYearIncome}
          />
        </div>
      </div>

      {/* Add State Tax Information if applicable */}
      {hasStateTax && stateTaxInfo && (
        <div className="bg-primary/10 p-4 rounded-md border border-primary/20">
          <h4 className="font-medium text-gray-200 mb-2">
            State Tax Impact ({stateTaxInfo.stateCode})
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Federal Tax:</div>
            <div className="text-right font-medium">{formatCurrency(stateTaxInfo.federalTax)}</div>
            
            <div>State Tax:</div>
            <div className="text-right font-medium">{formatCurrency(stateTaxInfo.stateTax)}</div>
            
            <div className="font-medium">Total Tax:</div>
            <div className="text-right font-medium">{formatCurrency(stateTaxInfo.federalTax + stateTaxInfo.stateTax)}</div>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-400">
        Note: Tax calculations are estimates based on provided information and may not include all applicable deductions, credits, or special circumstances. Please consult a tax professional for advice specific to your situation.
      </div>
    </div>
  );
};
