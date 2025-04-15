
import React from "react";
import { useEquityForm } from "../../context/EquityFormContext";

export const EquityTypeSummary: React.FC = () => {
  const { formState } = useEquityForm();
  
  const hasEquity = formState.equityType === "NSO" || formState.equityType === "ISO";
  const hasDeferred = formState.hasDeferredComp && formState.deferralAmount > 0;
  
  if (!hasEquity && !hasDeferred) return null;
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {hasEquity && (
        <div>
          <p className="text-sm text-muted-foreground">Selected Equity Type</p>
          <p className="text-lg font-medium">
            {formState.equityType === "NSO" ? "Nonqualified Stock Options" : 
             formState.equityType === "ISO" ? "Incentive Stock Options" :
             formState.equityType === "RSU" ? "Restricted Stock Units" :
             formState.equityType === "ESPP" ? "Employee Stock Purchase Plan" : 
             formState.equityType}
          </p>
        </div>
      )}
      
      {hasDeferred && (
        <div>
          <p className="text-sm text-muted-foreground">Deferral Strategy</p>
          <p className="text-lg font-medium">
            {formState.deferralStrategy === "next-year" 
              ? `Defer to ${new Date().getFullYear() + 1}` 
              : `Stagger over ${formState.deferralYears || 2} years`}
          </p>
        </div>
      )}
    </div>
  );
};
