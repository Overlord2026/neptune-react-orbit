
import React, { useState } from "react";
import { useEquityForm } from "../context/EquityFormContext";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EquityTypeSummary } from "./tax-summary/EquityTypeSummary";
import { ExerciseStrategySummary } from "./tax-summary/ExerciseStrategySummary";
import { DeferredAmountSummary } from "./tax-summary/DeferredAmountSummary";
import { YearlyTaxMetrics } from "./tax-summary/YearlyTaxMetrics";
import { WarningBanner } from "./tax-summary/WarningBanner";
import { formatCurrency } from "../utils/formatUtils";

export const TaxResultsSummary: React.FC = () => {
  const { 
    formState, 
    calculateAmtImpact, 
    calculateDeferralBenefit,
    calculateMultiYearImpact,
    getEquityEvents,
    getDeferralEvents,
    checkIrmaaImpact
  } = useEquityForm();
  
  const [activeYear, setActiveYear] = useState<"current" | "next">("current");
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
      } else if (formState.equityType === "ISO" && !formState.isDisqualifyingDisposition) {
        // ISOs have AMT implications instead of ordinary income
        amtIncome = incomeFromExercise;
        amtImpact = calculateAmtImpact();
      } else if (formState.equityType === "ISO" && formState.isDisqualifyingDisposition) {
        // Disqualifying disposition of ISOs creates ordinary income
        totalTaxableIncome += incomeFromExercise;
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
        // If staggered, divide by years
        nextYearIncome = deferredIncome / formState.deferralYears;
      }
    }
    
    // Simple estimated tax calculation
    const estimatedTaxRate = 0.35; // 35% effective tax rate for demo
    const estimatedTax = totalTaxableIncome * estimatedTaxRate;
    
    // Calculate bracket impact
    const bracketBefore = getTaxBracketRate(formState.bonusAmount - formState.deferralAmount);
    const bracketAfter = getTaxBracketRate(totalTaxableIncome);
    const bracketImpact = bracketBefore !== bracketAfter;
    
    // Get multi-year impact data
    const multiYearImpact = calculateMultiYearImpact();
    const equityEvents = getEquityEvents();
    const deferralEvents = getDeferralEvents();
    
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
      bracketAfter,
      multiYearImpact,
      equityEvents,
      deferralEvents
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
  const triggersAmt = formState.equityType === "ISO" && taxImpact.amtImpact > 0 && !formState.isDisqualifyingDisposition;
  const isDisqualifyingDisposition = formState.equityType === "ISO" && formState.isDisqualifyingDisposition;
  
  // Get year-specific data based on active tab
  const yearlyData = taxImpact.multiYearImpact.find(
    impact => impact.year === (activeYear === "current" ? currentYear : currentYear + 1)
  );
  
  return (
    <div className="mb-6">
      <Card className="bg-gradient-to-br from-[#1D2433] to-[#1A1F2C] border-[#2A2F3C]">
        <CardContent className="pt-6 pb-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">
                Tax Impact Summary
              </h3>
              <p className="text-sm text-muted-foreground">
                Based on your inputs, here's a summary of the potential tax implications.
              </p>
            </div>
            
            {formState.planningApproach === "multi-year" && (
              <Tabs defaultValue="current" className="w-full" onValueChange={(val) => setActiveYear(val as "current" | "next")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="current">
                    {currentYear} Tax Impact
                  </TabsTrigger>
                  <TabsTrigger value="next">
                    {currentYear + 1} Tax Impact
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="current" className="pt-4"></TabsContent>
                <TabsContent value="next" className="pt-4"></TabsContent>
              </Tabs>
            )}
            
            <EquityTypeSummary />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hasEquity && <ExerciseStrategySummary spreadPerShare={taxImpact.spreadPerShare} />}
              {hasDeferred && <DeferredAmountSummary nextYearIncome={taxImpact.nextYearIncome} />}
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {yearlyData && (
                <YearlyTaxMetrics 
                  yearData={yearlyData}
                  triggersAmt={triggersAmt}
                  activeYear={activeYear}
                />
              )}
            </div>
            
            {(triggersAmt || hasDeferred) && (
              <WarningBanner variant="info">
                {triggersAmt && (
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
              </WarningBanner>
            )}
            
            {isDisqualifyingDisposition && (
              <WarningBanner variant="warning" title="Disqualifying Disposition: ">
                Selling ISO shares less than 1 year after exercise 
                or within 2 years of grant creates a disqualifying disposition, causing the spread to be taxed as ordinary income.
              </WarningBanner>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
