
import React from 'react';
import { YearlyTaxImpact } from '../../types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Info } from "lucide-react";
import { YearlyTaxMetrics } from './YearlyTaxMetrics';

interface TaxBreakdownSectionProps {
  yearData: YearlyTaxImpact | undefined;
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

export const TaxBreakdownSection: React.FC<TaxBreakdownSectionProps> = ({
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
  if (!yearData) return null;

  const { ordinaryIncome, totalTax, marginalRate } = yearData;

  return (
    <div className="space-y-4 text-white">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">
            {activeYear === "current" ? "This Year's" : "Next Year's"} Income
          </h4>
          <p className="text-3xl font-bold">${ordinaryIncome.toLocaleString()}</p>
        </div>
        <Badge variant="secondary">
          {marginalRate.toFixed(0)}% Tax Bracket
        </Badge>
      </div>

      <Separator className="bg-zinc-700" />

      <YearlyTaxMetrics
        yearData={yearData}
        activeYear={activeYear}
        hasEquity={hasEquity}
        hasDeferred={hasDeferred}
        triggersAmt={triggersAmt}
        spreadPerShare={spreadPerShare}
        nextYearIncome={nextYearIncome}
        hasStateTax={hasStateTax}
        stateTaxInfo={stateTaxInfo}
      />
    </div>
  );
};
