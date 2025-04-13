
import React from "react";
import { MetricCard } from "./MetricCard";
import { YearlyTaxImpact } from "../../types/EquityTypes"; // Corrected import path
import { formatCurrency } from "../../utils/formatUtils";
import { AlertCircle } from "lucide-react";

interface YearlyTaxMetricsProps {
  yearData: YearlyTaxImpact;
  triggersAmt: boolean;
  activeYear: "current" | "next";
}

export const YearlyTaxMetrics: React.FC<YearlyTaxMetricsProps> = ({ 
  yearData, 
  triggersAmt,
  activeYear
}) => {
  if (!yearData) return null;
  
  const currentYear = new Date().getFullYear();
  
  return (
    <>
      <MetricCard
        title={`${activeYear === "current" ? currentYear : currentYear + 1} Taxable`}
        value={formatCurrency(yearData.ordinaryIncome)}
        subtitle={
          yearData.incomeBracket && (
            <div className="text-xs">
              Tax bracket: <span className="font-medium">{yearData.incomeBracket}</span>
              {yearData.distanceToNextBracket > 0 && (
                <span className="text-xs text-muted-foreground"> 
                  {" "}({formatCurrency(yearData.distanceToNextBracket)} to {yearData.nextBracket})
                </span>
              )}
            </div>
          )
        }
      />
      
      <MetricCard
        title="Est. Tax Impact"
        value={formatCurrency(yearData.totalTax)}
        subtitle={
          yearData.taxSavings !== 0 && (
            <div className={`text-xs ${yearData.taxSavings > 0 ? 'text-green-400' : 'text-amber-400'}`}>
              {yearData.taxSavings > 0 ? 'Saving: ' : 'Additional: '}
              <span className="font-medium">{formatCurrency(Math.abs(yearData.taxSavings))}</span>
            </div>
          )
        }
      />
      
      {triggersAmt && activeYear === "current" && (
        <MetricCard
          title="Potential AMT"
          tooltipContent={<p className="max-w-xs">
            Alternative Minimum Tax (AMT) is calculated separately from regular tax. 
            You pay whichever is higher. ISO exercises often trigger AMT.
          </p>}
          value={formatCurrency(yearData.amtAdjustment)}
          subtitle={
            <div className="text-xs text-amber-400">
              AMT income: {formatCurrency(yearData.amtIncome)}
            </div>
          }
        />
      )}
      
      {yearData.taxSavings > 0 && (
        <MetricCard
          title="Est. Tax Savings"
          tooltipContent={<p className="max-w-xs">
            Estimated tax savings assumes you'll be in a lower tax bracket 
            when deferred amounts are paid out.
          </p>}
          value={<span className="text-green-500">{formatCurrency(yearData.taxSavings)}</span>}
        />
      )}
      
      {yearData.irmaaImpact && (
        <MetricCard
          title="IRMAA Alert"
          value={
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-amber-400 mr-1" />
              <span className="text-sm text-amber-400">Medicare Premium Impact</span>
            </div>
          }
          subtitle={<div className="text-xs text-amber-400">
            This income level may trigger higher Medicare premiums
          </div>}
          tooltipContent={<p className="max-w-xs">
            Income-Related Monthly Adjustment Amount (IRMAA) increases your Medicare premiums
            when your income exceeds certain thresholds.
          </p>}
        />
      )}
    </>
  );
};
