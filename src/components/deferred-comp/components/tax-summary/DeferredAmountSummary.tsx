
import React from "react";
import { useEquityForm } from "../../context/EquityFormContext";
import { MetricCard } from "./MetricCard";

interface DeferredAmountSummaryProps {
  nextYearIncome: number;
}

export const DeferredAmountSummary: React.FC<DeferredAmountSummaryProps> = ({ nextYearIncome }) => {
  const { formState } = useEquityForm();
  const hasDeferred = formState.hasDeferredComp && formState.deferralAmount > 0;
  
  if (!hasDeferred) return null;
  
  return (
    <MetricCard
      title="Deferred Amount"
      tooltipContent={<p className="max-w-xs">Deferring compensation shifts income recognition to future years</p>}
      value={`$${formState.deferralAmount.toLocaleString()}`}
      subtitle={<div className="text-xs text-muted-foreground">
        ${nextYearIncome.toLocaleString()} added to {new Date().getFullYear() + 1} income
      </div>}
    />
  );
};
