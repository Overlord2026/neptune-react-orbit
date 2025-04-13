
import React from "react";
import { useEquityForm } from "../context/EquityFormContext";
import { Card, CardContent } from "@/components/ui/card";

export const TaxResultsSummary: React.FC = () => {
  const { formState, calculateAmtImpact, calculateDeferralBenefit } = useEquityForm();
  const currentYear = new Date().getFullYear();
  
  // Calculate tax impact based on form data
  const calculateTaxImpact = () => {
    let totalTaxableIncome = 0;
    let amtImpact = 0;
    let deferralBenefit = 0;
    
    // If user has stock options
    if (formState.equityType === "NSO" || formState.equityType === "ISO") {
      const spreadPerShare = formState.fairMarketValue - formState.strikePrice;
      let exercisedShares = 0;
      
      if (formState.exerciseStrategy === "full") {
        exercisedShares = formState.vestedShares;
      } else if (formState.exerciseStrategy === "partial") {
        exercisedShares = formState.partialShares;
      } else if (formState.exerciseStrategy === "split") {
        exercisedShares = Math.floor(formState.vestedShares / formState.splitYears);
      }
      
      const incomeFromExercise = spreadPerShare * exercisedShares;
      
      if (formState.equityType === "NSO") {
        // NSOs generate immediate ordinary income
        totalTaxableIncome += incomeFromExercise;
      } else if (formState.equityType === "ISO") {
        // ISOs have AMT implications
        amtImpact = calculateAmtImpact();
      }
    }
    
    // If user has deferred comp
    if (formState.hasDeferredComp) {
      totalTaxableIncome += (formState.bonusAmount - formState.deferralAmount);
      deferralBenefit = calculateDeferralBenefit();
    }
    
    // Simple estimated tax calculation (very simplified for demo purposes)
    const estimatedTaxRate = 0.35;
    const estimatedTax = totalTaxableIncome * estimatedTaxRate;
    
    return {
      totalTaxableIncome,
      estimatedTax,
      amtImpact,
      deferralBenefit
    };
  };
  
  const taxImpact = calculateTaxImpact();
  
  const hasEquity = formState.equityType === "NSO" || formState.equityType === "ISO";
  const hasDeferred = formState.hasDeferredComp && formState.deferralAmount > 0;
  
  return (
    <div className="mb-6">
      <Card className="bg-gradient-to-br from-[#1D2433] to-[#1A1F2C] border-[#2A2F3C]">
        <CardContent className="pt-6 pb-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">Tax Impact Summary</h3>
              <p className="text-sm text-muted-foreground">
                Based on your inputs, here's a summary of the potential tax implications.
              </p>
            </div>
            
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
                      ? `Defer to ${currentYear + 1}` 
                      : `Stagger over ${formState.deferralYears} years`}
                  </p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hasEquity && (formState.equityType === "NSO" || formState.equityType === "ISO") && (
                <div className="p-4 bg-[#20273B] rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Exercise Strategy</div>
                  <div className="font-medium">
                    {formState.exerciseStrategy === "full" && "Exercise all vested options"}
                    {formState.exerciseStrategy === "partial" && `Exercise ${formState.partialShares} shares`}
                    {formState.exerciseStrategy === "split" && `Split across ${formState.splitYears} years`}
                  </div>
                </div>
              )}
              
              {hasDeferred && (
                <div className="p-4 bg-[#20273B] rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Deferred Amount</div>
                  <div className="font-medium">${formState.deferralAmount.toLocaleString()}</div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {taxImpact.totalTaxableIncome > 0 && (
                <div className="p-4 bg-[#20273B] rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Taxable Income</div>
                  <div className="font-medium">${taxImpact.totalTaxableIncome.toLocaleString()}</div>
                </div>
              )}
              
              {taxImpact.estimatedTax > 0 && (
                <div className="p-4 bg-[#20273B] rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Est. Tax Impact</div>
                  <div className="font-medium">${taxImpact.estimatedTax.toLocaleString()}</div>
                </div>
              )}
              
              {formState.equityType === "ISO" && taxImpact.amtImpact > 0 && (
                <div className="p-4 bg-[#20273B] rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Potential AMT</div>
                  <div className="font-medium">${taxImpact.amtImpact.toLocaleString()}</div>
                </div>
              )}
              
              {hasDeferred && taxImpact.deferralBenefit > 0 && (
                <div className="p-4 bg-[#20273B] rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Est. Tax Savings</div>
                  <div className="font-medium text-green-500">${taxImpact.deferralBenefit.toLocaleString()}</div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
