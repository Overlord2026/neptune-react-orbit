
import React from "react";
import { useEquityForm } from "../context/EquityFormContext";
import { Card, CardContent } from "@/components/ui/card";

export const TaxResultsSummary: React.FC = () => {
  const { formState } = useEquityForm();
  const currentYear = new Date().getFullYear();
  
  // Calculate simple tax impact for display purposes
  const calculateTaxImpact = () => {
    let taxImpact = 0;
    
    // Very simplified tax calculations for demonstration
    if (formState.equityType === "NSO") {
      // NSO tax impact is (FMV - Strike) * Shares * Assumed Tax Rate
      const spread = formState.fairMarketValue - formState.strikePrice;
      const sharesExercised = formState.exerciseStrategy === "full" 
        ? formState.vestedShares 
        : formState.exerciseStrategy === "partial"
          ? formState.partialShares
          : Math.floor(formState.vestedShares / formState.splitYears);
          
      taxImpact = spread * sharesExercised * 0.37; // Assumed highest tax rate
    } 
    else if (formState.equityType === "ISO") {
      // ISO has no regular tax but might have AMT
      const spread = formState.fairMarketValue - formState.strikePrice;
      const sharesExercised = formState.exerciseStrategy === "full" 
        ? formState.vestedShares 
        : formState.exerciseStrategy === "partial"
          ? formState.partialShares
          : Math.floor(formState.vestedShares / formState.splitYears);
          
      // Very simplified AMT calculation
      if (spread * sharesExercised > 100000) {
        taxImpact = spread * sharesExercised * 0.26; // AMT rate for demo
      }
    }
    
    // Reduce by deferred comp tax benefit
    if (formState.hasDeferredComp) {
      const deferralTaxBenefit = formState.deferralAmount * 0.05; // Assumed tax rate diff
      taxImpact -= deferralTaxBenefit;
    }
    
    return Math.max(0, taxImpact);
  };
  
  const taxImpact = calculateTaxImpact();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-[#1D2433] border-[#2A2F3C]">
        <CardContent className="p-4">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-muted-foreground">
              {formState.planningApproach === "multi-year" ? "Year 1 Tax Impact" : "Estimated Tax Impact"}
            </p>
            <p className="text-2xl font-bold text-white">
              ${taxImpact.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-muted-foreground">
              For {currentYear} tax year
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1D2433] border-[#2A2F3C]">
        <CardContent className="p-4">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-muted-foreground">Strategy Type</p>
            <p className="text-lg font-bold text-white">
              {formState.equityType === "NSO" && "NSO Exercise"}
              {formState.equityType === "ISO" && "ISO Exercise"}
              {formState.equityType === "RSU" && "RSU Vesting"}
              {formState.equityType === "ESPP" && "ESPP Purchase"}
              {formState.equityType === "Other" && "Equity Analysis"}
              {formState.hasDeferredComp && formState.equityType && " + "}
              {formState.hasDeferredComp && "Deferred Comp"}
            </p>
            <p className="text-xs text-muted-foreground">
              {formState.planningApproach === "multi-year" 
                ? "Multi-year approach" 
                : "Single-year approach"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1D2433] border-[#2A2F3C]">
        <CardContent className="p-4">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-muted-foreground">
              {formState.equityType && "Equity Value"}
              {!formState.equityType && formState.hasDeferredComp && "Deferred Amount"}
              {formState.equityType && formState.hasDeferredComp && " + Deferred"}
            </p>
            <p className="text-2xl font-bold text-white">
              ${calculateTotalValue().toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-muted-foreground">Total value managed</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  function calculateTotalValue() {
    let totalValue = 0;
    
    // Calculate equity value
    if (formState.equityType === "NSO" || formState.equityType === "ISO") {
      totalValue += formState.vestedShares * formState.fairMarketValue;
    } else if (formState.equityType === "RSU" || formState.equityType === "ESPP") {
      totalValue += formState.shareCount * (formState.fairMarketValue || 100); // Default value if FMV not entered
    }
    
    // Add deferred comp value
    if (formState.hasDeferredComp) {
      totalValue += formState.deferralAmount;
    }
    
    return totalValue;
  }
};
