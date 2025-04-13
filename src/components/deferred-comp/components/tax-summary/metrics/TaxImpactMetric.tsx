
import React from "react";
import { MetricCard } from "../MetricCard";
import { formatCurrency } from "../../../utils/formatUtils";

interface TaxImpactMetricProps {
  totalTax: number;
  taxSavings: number;
}

export const TaxImpactMetric: React.FC<TaxImpactMetricProps> = ({
  totalTax,
  taxSavings
}) => {
  return (
    <MetricCard
      title="Est. Tax Impact"
      value={formatCurrency(totalTax)}
      subtitle={
        taxSavings !== 0 && (
          <div className={`text-xs ${taxSavings > 0 ? 'text-green-400' : 'text-amber-400'}`}>
            {taxSavings > 0 ? 'Saving: ' : 'Additional: '}
            <span className="font-medium">{formatCurrency(Math.abs(taxSavings))}</span>
          </div>
        )
      }
    />
  );
};
