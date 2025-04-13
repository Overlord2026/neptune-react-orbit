
import React from "react";
import { MetricCard } from "../MetricCard";
import { AlertCircle } from "lucide-react";

export const IrmaaAlertMetric: React.FC = () => {
  return (
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
  );
};
