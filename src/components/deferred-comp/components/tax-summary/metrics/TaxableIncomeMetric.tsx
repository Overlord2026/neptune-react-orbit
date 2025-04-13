
import React from "react";
import { MetricCard } from "../MetricCard";
import { formatCurrency } from "../../../utils/formatUtils";

interface TaxableIncomeMetricProps {
  year: number;
  ordinaryIncome: number;
  incomeBracket?: string;
  nextBracket?: string;
  distanceToNextBracket?: number;
}

export const TaxableIncomeMetric: React.FC<TaxableIncomeMetricProps> = ({
  year,
  ordinaryIncome,
  incomeBracket,
  nextBracket,
  distanceToNextBracket
}) => {
  return (
    <MetricCard
      title={`${year} Taxable`}
      value={formatCurrency(ordinaryIncome)}
      subtitle={
        incomeBracket && (
          <div className="text-xs">
            Tax bracket: <span className="font-medium">{incomeBracket}</span>
            {distanceToNextBracket && distanceToNextBracket > 0 && (
              <span className="text-xs text-muted-foreground"> 
                {" "}({formatCurrency(distanceToNextBracket)} to {nextBracket})
              </span>
            )}
          </div>
        )
      }
    />
  );
};
