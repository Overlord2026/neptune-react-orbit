
import React from "react";
import { YearlyTaxImpact } from "../../types/EquityTypes";
import { TaxableIncomeMetric } from "./metrics/TaxableIncomeMetric";
import { TaxImpactMetric } from "./metrics/TaxImpactMetric";
import { AmtMetric } from "./metrics/AmtMetric";
import { TaxSavingsMetric } from "./metrics/TaxSavingsMetric";
import { IrmaaAlertMetric } from "./metrics/IrmaaAlertMetric";

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
      <TaxableIncomeMetric 
        year={activeYear === "current" ? currentYear : currentYear + 1}
        ordinaryIncome={yearData.ordinaryIncome}
        incomeBracket={yearData.incomeBracket}
        nextBracket={yearData.nextBracket}
        distanceToNextBracket={yearData.distanceToNextBracket}
      />
      
      <TaxImpactMetric
        totalTax={yearData.totalTax}
        taxSavings={yearData.taxSavings}
      />
      
      {triggersAmt && activeYear === "current" && (
        <AmtMetric
          amtAdjustment={yearData.amtAdjustment}
          amtIncome={yearData.amtIncome}
        />
      )}
      
      {yearData.taxSavings > 0 && (
        <TaxSavingsMetric taxSavings={yearData.taxSavings} />
      )}
      
      {yearData.irmaaImpact && (
        <IrmaaAlertMetric />
      )}
    </>
  );
};
