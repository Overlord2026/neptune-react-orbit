
import React from "react";
import { useEquityForm } from "../context/EquityFormContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, InfoIcon, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TaxResultsSummary } from "../components/TaxResultsSummary";
import { EquityPlanningTable } from "../components/EquityPlanningTable";
import { EquityComparisonChart } from "../components/EquityComparisonChart";
import { TaxSummaryCard } from "../components/tax-summary/TaxSummaryCard";
import { BracketChangeVisualizer } from "../components/tax-summary/BracketChangeVisualizer";
import { EquityStrategySummary } from "../components/EquityStrategySummary";

interface TaxOutputStepProps {
  onPrevious: () => void;
}

export const TaxOutputStep: React.FC<TaxOutputStepProps> = ({ onPrevious }) => {
  const { formState, calculateAmtImpact, calculateDeferralBenefit } = useEquityForm();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate API call or calculation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <RefreshCw className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Calculating tax implications...</p>
      </div>
    );
  }

  const hasEquity = formState.equityType === "NSO" || formState.equityType === "ISO";
  const hasDeferred = formState.hasDeferredComp;
  const amtImpact = calculateAmtImpact();
  const deferralBenefit = calculateDeferralBenefit();
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-6">
      {/* New Tax Summary Card with Year-by-Year breakdown */}
      <TaxSummaryCard />
      
      {/* Grid with strategy summary and bracket visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EquityStrategySummary />
        <BracketChangeVisualizer />
      </div>
      
      {/* Enhanced chart with better visualization */}
      {(hasEquity || hasDeferred) && formState.planningApproach === "multi-year" && (
        <Card className="bg-[#1D2433] border-[#2A2F3C]">
          <CardHeader>
            <CardTitle>Multi-Year Tax Visualization</CardTitle>
            <CardDescription>
              Comparing your tax impact across {currentYear} and {currentYear + 1}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <EquityComparisonChart />
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hasEquity && (
          <Card className="bg-[#1D2433] border-[#2A2F3C]">
            <CardHeader>
              <CardTitle className="flex items-center">
                Equity Exercise Impact
                {formState.equityType === "ISO" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          ISO exercises may be subject to AMT. Consult with a tax professional for a complete calculation.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </CardTitle>
              <CardDescription>
                {formState.equityType === "NSO" 
                  ? "NSO exercises are taxed as ordinary income upon exercise."
                  : "ISO exercises may trigger Alternative Minimum Tax (AMT)."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EquityPlanningTable />
              
              {formState.equityType === "ISO" && amtImpact > 0 && (
                <div className="mt-4">
                  <Card className="bg-amber-900/20 border-amber-500">
                    <CardHeader className="py-4">
                      <CardTitle className="text-amber-500 text-sm">AMT Consideration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Estimated AMT impact: <span className="font-semibold">${amtImpact.toLocaleString()}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        This is a simplified calculation. Actual AMT depends on your total income, 
                        exemptions, and other factors. Consult with a tax professional.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {hasDeferred && (
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
                      : `Stagger across ${formState.deferralYears} years`}
                  </p>
                </div>
                
                {formState.deferralStrategy === "multi-year" && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Optimized for lower income years</p>
                    {formState.sabbaticalYear > currentYear && (
                      <p className="text-xs">Sabbatical year: {formState.sabbaticalYear}</p>
                    )}
                    {formState.retirementYear > currentYear && (
                      <p className="text-xs">Retirement year: {formState.retirementYear}</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="bg-blue-900/20 border-blue-700">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start space-x-4">
            <div className="rounded-full bg-blue-500/20 p-2">
              <InfoIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-blue-500">Important Disclaimer</p>
              <p className="text-sm text-muted-foreground">
                This analysis provides general guidance but is not a substitute for personalized 
                professional advice. Tax laws can be complex, especially for equity compensation 
                and AMT calculations. We recommend consulting with a qualified tax professional 
                to validate these strategies for your specific situation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-4">
        <Button onClick={onPrevious} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <Button className="bg-primary">
          Save This Analysis
        </Button>
      </div>
    </div>
  );
};
