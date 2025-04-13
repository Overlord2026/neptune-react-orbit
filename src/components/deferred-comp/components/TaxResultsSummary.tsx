
import React from "react";
import { useEquityForm } from "../context/EquityFormContext";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

export const TaxResultsSummary: React.FC = () => {
  const { formState, calculateAmtImpact, calculateDeferralBenefit } = useEquityForm();
  const currentYear = new Date().getFullYear();
  
  // Calculate detailed tax impact based on form data
  const calculateTaxImpact = () => {
    let totalTaxableIncome = 0;
    let amtIncome = 0;
    let amtImpact = 0;
    let deferralBenefit = 0;
    let spreadPerShare = 0;
    let exercisedShares = 0;
    let incomeFromExercise = 0;
    let deferredIncome = 0;
    let nextYearIncome = 0;
    
    // If user has stock options
    if (formState.equityType === "NSO" || formState.equityType === "ISO") {
      spreadPerShare = formState.fairMarketValue - formState.strikePrice;
      
      if (formState.exerciseStrategy === "full") {
        exercisedShares = formState.vestedShares;
      } else if (formState.exerciseStrategy === "partial") {
        exercisedShares = formState.partialShares;
      } else if (formState.exerciseStrategy === "split") {
        exercisedShares = Math.floor(formState.vestedShares / formState.splitYears);
      }
      
      incomeFromExercise = spreadPerShare * exercisedShares;
      
      if (formState.equityType === "NSO") {
        // NSOs generate immediate ordinary income
        totalTaxableIncome += incomeFromExercise;
      } else if (formState.equityType === "ISO") {
        // ISOs have AMT implications instead of ordinary income
        amtIncome = incomeFromExercise;
        amtImpact = calculateAmtImpact();
      }
    }
    
    // If user has deferred comp
    if (formState.hasDeferredComp) {
      const totalBonus = formState.bonusAmount;
      deferredIncome = formState.deferralAmount;
      
      // Only non-deferred portion is taxed this year
      totalTaxableIncome += (totalBonus - deferredIncome);
      
      // Tax savings from deferral
      deferralBenefit = calculateDeferralBenefit();
      
      // Income added to next year
      if (formState.deferralStrategy === "next-year") {
        nextYearIncome = deferredIncome;
      } else {
        // If staggered, divide by years (simplified)
        nextYearIncome = deferredIncome / formState.deferralYears;
      }
    }
    
    // Simple estimated tax calculation (very simplified for demo purposes)
    const estimatedTaxRate = 0.35; // 35% effective tax rate for demo
    const estimatedTax = totalTaxableIncome * estimatedTaxRate;
    
    // Calculate bracket impact
    const bracketBefore = getTaxBracketRate(formState.bonusAmount - formState.deferralAmount);
    const bracketAfter = getTaxBracketRate(totalTaxableIncome);
    const bracketImpact = bracketBefore !== bracketAfter;
    
    return {
      totalTaxableIncome,
      estimatedTax,
      amtIncome,
      amtImpact,
      deferralBenefit,
      spreadPerShare,
      exercisedShares,
      incomeFromExercise,
      deferredIncome,
      nextYearIncome,
      bracketImpact,
      bracketBefore,
      bracketAfter
    };
  };
  
  // Simple function to estimate tax bracket based on income
  const getTaxBracketRate = (income: number): string => {
    if (income < 11000) return "10%";
    if (income < 44725) return "12%";
    if (income < 95375) return "22%";
    if (income < 182100) return "24%";
    if (income < 231250) return "32%";
    if (income < 578125) return "35%";
    return "37%";
  };
  
  const taxImpact = calculateTaxImpact();
  
  const hasEquity = formState.equityType === "NSO" || formState.equityType === "ISO";
  const hasDeferred = formState.hasDeferredComp && formState.deferralAmount > 0;
  const triggersAmt = formState.equityType === "ISO" && taxImpact.amtImpact > 0;
  const changesBracket = taxImpact.bracketImpact;
  
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
                  <div className="flex items-center">
                    <div className="text-sm text-muted-foreground mb-1">Exercise Strategy</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-3 w-3 ml-1 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            {formState.equityType === "NSO"
                              ? "NSO exercises create immediate taxable income equal to the spread between FMV and strike price"
                              : "ISO exercises don't create regular taxable income, but may trigger AMT"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="font-medium">
                    {formState.exerciseStrategy === "full" && "Exercise all vested options"}
                    {formState.exerciseStrategy === "partial" && `Exercise ${formState.partialShares} shares`}
                    {formState.exerciseStrategy === "split" && `Split across ${formState.splitYears} years`}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Spread per share: ${taxImpact.spreadPerShare.toFixed(2)}
                  </div>
                </div>
              )}
              
              {hasDeferred && (
                <div className="p-4 bg-[#20273B] rounded-md">
                  <div className="flex items-center">
                    <div className="text-sm text-muted-foreground mb-1">Deferred Amount</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-3 w-3 ml-1 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Deferring compensation shifts income recognition to future years
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="font-medium">${formState.deferralAmount.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    ${taxImpact.nextYearIncome.toLocaleString()} added to {currentYear + 1} income
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {taxImpact.totalTaxableIncome > 0 && (
                <div className="p-4 bg-[#20273B] rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Current Year Taxable</div>
                  <div className="font-medium">${taxImpact.totalTaxableIncome.toLocaleString()}</div>
                  {changesBracket && (
                    <div className="text-xs mt-1 text-yellow-400">
                      Bracket change: {taxImpact.bracketBefore} → {taxImpact.bracketAfter}
                    </div>
                  )}
                </div>
              )}
              
              {taxImpact.estimatedTax > 0 && (
                <div className="p-4 bg-[#20273B] rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Est. Tax Impact</div>
                  <div className="font-medium">${taxImpact.estimatedTax.toLocaleString()}</div>
                </div>
              )}
              
              {triggersAmt && (
                <div className="p-4 bg-[#20273B] rounded-md">
                  <div className="flex items-center">
                    <div className="text-sm text-muted-foreground mb-1">Potential AMT</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-3 w-3 ml-1 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Alternative Minimum Tax (AMT) is calculated separately from regular tax. 
                            You pay whichever is higher. ISO exercises often trigger AMT.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="font-medium">${taxImpact.amtImpact.toLocaleString()}</div>
                  <div className="text-xs text-amber-400 mt-1">
                    AMT income: ${taxImpact.amtIncome.toLocaleString()}
                  </div>
                </div>
              )}
              
              {hasDeferred && taxImpact.deferralBenefit > 0 && (
                <div className="p-4 bg-[#20273B] rounded-md">
                  <div className="flex items-center">
                    <div className="text-sm text-muted-foreground mb-1">Est. Tax Savings</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-3 w-3 ml-1 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Estimated tax savings assumes you'll be in a lower tax bracket 
                            when deferred amounts are paid out.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="font-medium text-green-500">${taxImpact.deferralBenefit.toLocaleString()}</div>
                </div>
              )}
            </div>
            
            {(formState.equityType === "ISO" || hasDeferred) && (
              <div className="mt-2 p-3 bg-blue-900/20 border border-blue-800/30 rounded-md">
                <div className="flex items-start space-x-3">
                  <InfoIcon className="h-4 w-4 flex-shrink-0 mt-0.5 text-blue-400" />
                  <div className="text-xs text-blue-300">
                    {formState.equityType === "ISO" && (
                      <>
                        <span className="font-medium">ISO AMT Consideration:</span> Exercising ISOs may trigger Alternative Minimum Tax. 
                        The actual AMT calculation is complex and depends on your full tax situation.
                        {' '}
                      </>
                    )}
                    {hasDeferred && (
                      <>
                        <span className="font-medium">Deferral Note:</span> Tax benefits from deferral depend on future tax rates 
                        and your income level when deferred amounts are received.
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
