
import React from "react";
import { useEquityForm } from "../../context/EquityFormContext";
import { InfoTooltip } from "../InfoTooltip";
import { MetricCard } from "./MetricCard";

export const ExerciseStrategySummary: React.FC<{ spreadPerShare: number }> = ({ spreadPerShare }) => {
  const { formState } = useEquityForm();
  
  const hasEquity = formState.equityType === "NSO" || formState.equityType === "ISO";
  const isDisqualifyingDisposition = formState.equityType === "ISO" && formState.isDisqualifyingDisposition;
  
  if (!hasEquity) return null;
  
  const tooltipContent = formState.equityType === "NSO"
    ? "NSO exercises create immediate taxable income equal to the spread between FMV and strike price"
    : isDisqualifyingDisposition
    ? "A disqualifying disposition of ISOs creates ordinary income like an NSO"
    : "ISO exercises don't create regular taxable income, but may trigger AMT";
  
  return (
    <MetricCard
      title="Exercise Strategy"
      tooltipContent={<p className="max-w-xs">{tooltipContent}</p>}
      value={
        formState.exerciseStrategy === "full" ? "Exercise all vested options" :
        formState.exerciseStrategy === "partial" ? `Exercise ${formState.partialShares} shares` :
        `Split across ${formState.splitYears} years`
      }
      subtitle={
        <>
          <div className="text-xs text-muted-foreground">
            Spread per share: ${spreadPerShare.toFixed(2)}
          </div>
          {isDisqualifyingDisposition && (
            <div className="text-xs text-amber-400 mt-1">
              Disqualifying disposition: Treated as ordinary income
            </div>
          )}
        </>
      }
    />
  );
};
