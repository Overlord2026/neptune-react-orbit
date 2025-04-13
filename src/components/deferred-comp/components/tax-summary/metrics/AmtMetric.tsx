
import React from "react";
import { MetricCard } from "../MetricCard";
import { formatCurrency } from "../../../utils/formatUtils";

interface AmtMetricProps {
  amtAdjustment: number;
  amtIncome: number;
}

export const AmtMetric: React.FC<AmtMetricProps> = ({
  amtAdjustment,
  amtIncome
}) => {
  return (
    <MetricCard
      title="Potential AMT"
      tooltipContent={<p className="max-w-xs">
        Alternative Minimum Tax (AMT) is calculated separately from regular tax. 
        You pay whichever is higher. ISO exercises often trigger AMT.
      </p>}
      value={formatCurrency(amtAdjustment)}
      subtitle={
        <div className="text-xs text-amber-400">
          AMT income: {formatCurrency(amtIncome)}
        </div>
      }
    />
  );
};
