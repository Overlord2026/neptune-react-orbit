
import React from "react";
import { useEquityForm } from "../../context/EquityFormContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface DeferralImpactCardProps {
  currentYear: number;
}

export const DeferralImpactCard: React.FC<DeferralImpactCardProps> = ({ currentYear }) => {
  const { formState, calculateDeferralBenefit } = useEquityForm();
  const deferralBenefit = calculateDeferralBenefit();
  
  return (
    <Card className="bg-[#1D2433] border-[#2A2F3C]">
      <CardHeader>
        <CardTitle>Deferred Compensation Impact</CardTitle>
        <CardDescription>
          Deferring income can reduce your current year tax burden.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Deferral</p>
              <p className="text-lg font-semibold">${formState.deferralAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estimated Tax Benefit</p>
              <p className="text-lg font-semibold text-green-500">
                ${deferralBenefit.toLocaleString()}
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium">Deferral Strategy</p>
            <p className="text-sm">
              {formState.deferralStrategy === "next-year" 
                ? `Defer all to ${currentYear + 1}`
                : `Stagger across ${formState.deferralYears || 2} years`}
            </p>
          </div>
          
          {(formState.deferralStrategy === "multi-year" || formState.deferralStrategy === "staggered") && (
            <div className="mt-2">
              <p className="text-sm font-medium">Optimized for lower income years</p>
              {formState.sabbaticalYear && formState.sabbaticalYear > currentYear && (
                <p className="text-xs">Sabbatical year: {formState.sabbaticalYear}</p>
              )}
              {formState.retirementYear && formState.retirementYear > currentYear && (
                <p className="text-xs">Retirement year: {formState.retirementYear}</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
