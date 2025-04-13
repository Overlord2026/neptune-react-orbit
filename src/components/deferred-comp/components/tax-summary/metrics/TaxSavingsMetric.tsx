
import React from "react";
import { MetricCard } from "../MetricCard";
import { formatCurrency } from "../../../utils/formatUtils";

interface TaxSavingsMetricProps {
  taxSavings: number;
}

export const TaxSavingsMetric: React.FC<TaxSavingsMetricProps> = ({
  taxSavings
}) => {
  return (
    <MetricCard
      title="Est. Tax Savings"
      tooltipContent={<p className="max-w-xs">
        Estimated tax savings assumes you'll be in a lower tax bracket 
        when deferred amounts are paid out.
      </p>}
      value={<span className="text-green-500">{formatCurrency(taxSavings)}</span>}
    />
  );
};
