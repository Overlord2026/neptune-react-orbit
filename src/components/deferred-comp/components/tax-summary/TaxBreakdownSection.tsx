
import React from "react";
import { EquityTypeSummary } from "./EquityTypeSummary";
import { ExerciseStrategySummary } from "./ExerciseStrategySummary";
import { DeferredAmountSummary } from "./DeferredAmountSummary";
import { YearlyTaxMetrics } from "./YearlyTaxMetrics";
import { YearlyTaxImpact } from "../../types";

interface TaxBreakdownSectionProps {
  hasEquity: boolean;
  hasDeferred: boolean;
  triggersAmt: boolean;
  yearlyData?: YearlyTaxImpact;
  activeYear: "current" | "next";
  spreadPerShare: number;
  nextYearIncome: number;
}

export const TaxBreakdownSection: React.FC<TaxBreakdownSectionProps> = ({
  hasEquity,
  hasDeferred,
  triggersAmt,
  yearlyData,
  activeYear,
  spreadPerShare,
  nextYearIncome
}) => {
  return (
    <>
      <EquityTypeSummary />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hasEquity && <ExerciseStrategySummary spreadPerShare={spreadPerShare} />}
        {hasDeferred && <DeferredAmountSummary nextYearIncome={nextYearIncome} />}
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {yearlyData && (
          <YearlyTaxMetrics 
            yearData={yearlyData}
            triggersAmt={triggersAmt}
            activeYear={activeYear}
          />
        )}
      </div>
    </>
  );
};
