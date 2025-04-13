
import React, { useState } from "react";
import { useEquityForm } from "../context/EquityFormContext";
import { Card, CardContent } from "@/components/ui/card";
import { YearSelector } from "./tax-summary/YearSelector";
import { TaxBreakdownSection } from "./tax-summary/TaxBreakdownSection";
import { WarningsSection } from "./tax-summary/WarningsSection";
import { calculateTaxImpact } from "./tax-summary/TaxCalculation";

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
  const taxImpact = calculateTaxImpact(
    formState, 
    calculateAmtImpact, 
    calculateMultiYearImpact, 
    getEquityEvents, 
    getDeferralEvents
  );
  
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
            
            <YearSelector
              activeYear={activeYear}
              setActiveYear={setActiveYear}
              currentYear={currentYear}
              showTabs={formState.planningApproach === "multi-year"}
            />
            
            <TaxBreakdownSection
              hasEquity={hasEquity}
              hasDeferred={hasDeferred}
              triggersAmt={triggersAmt}
              yearlyData={yearlyData}
              activeYear={activeYear}
              spreadPerShare={taxImpact.spreadPerShare}
              nextYearIncome={taxImpact.nextYearIncome}
            />
            
            <WarningsSection
              triggersAmt={triggersAmt}
              hasDeferred={hasDeferred}
              isDisqualifyingDisposition={isDisqualifyingDisposition}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
