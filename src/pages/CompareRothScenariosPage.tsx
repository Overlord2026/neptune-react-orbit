
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TaxResult } from "@/utils/taxCalculatorTypes";
import ScenarioComparisonHeader from "@/components/tax/ScenarioComparisonHeader";
import ScenarioComparisonCards from "@/components/tax/ScenarioComparisonCards";
import ScenarioComparisonChart from "@/components/tax/ScenarioComparisonChart";
import ScenarioComparisonTable from "@/components/tax/ScenarioComparisonTable";
import BracketSummary from "@/components/tax/BracketSummary";
import { formatCurrency, formatPercent } from "@/utils/taxBracketData";
import ShareFeature from "@/components/tax-planning/ShareFeature";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Lock } from "lucide-react";
import { toast } from "sonner";
import { FilingStatusType } from "@/types/tax/filingTypes";

const CompareRothScenariosPage: React.FC = () => {
  const navigate = useNavigate();
  const [isInTrial, setIsInTrial] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    checkAccess();
  }, []);
  
  const checkAccess = () => {
    const trialStatus = localStorage.getItem('is_in_trial') === 'true';
    setIsInTrial(trialStatus);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const scenario1: TaxResult = {
    scenario_name: "No Roth Conversion",
    year: 2025,
    total_income: 80000,
    agi: 75000,
    taxable_income: 62150,
    total_tax: 9122,
    ordinary_tax: 9122,
    capital_gains_tax: 0,
    marginal_rate: 0.22,
    marginal_capital_gains_rate: 0.15,
    effective_rate: 0.114,
    filing_status: "married" as FilingStatusType, // Fixed: changed from married_joint to married
    updated_at: new Date().toISOString(),
    // Remove tax_data_updated_at which doesn't exist in TaxResult
    tax_data_is_current: true,
    brackets_breakdown: {
      ordinary: [
        { bracket: 10, amount: 11000, tax: 1100 },
        { bracket: 12, amount: 33725, tax: 4047 },
        { bracket: 22, amount: 17425, tax: 3834 }
      ],
      capitalGains: []
    }
  };

  const scenario2: TaxResult = {
    scenario_name: "With $10k Roth Conversion",
    year: 2025,
    total_income: 90000,
    agi: 85000,
    taxable_income: 72150,
    total_tax: 11322,
    ordinary_tax: 11322,
    capital_gains_tax: 0,
    marginal_rate: 0.22,
    marginal_capital_gains_rate: 0.15,
    effective_rate: 0.126,
    filing_status: "married" as FilingStatusType, // Fixed: changed from married_joint to married
    updated_at: new Date().toISOString(),
    // Remove tax_data_updated_at which doesn't exist in TaxResult
    tax_data_is_current: true,
    brackets_breakdown: {
      ordinary: [
        { bracket: 10, amount: 11000, tax: 1100 },
        { bracket: 12, amount: 33725, tax: 4047 },
        { bracket: 22, amount: 27425, tax: 6034 }
      ],
      capitalGains: []
    }
  };

  const scenario3: TaxResult = {
    scenario_name: "With $20k Roth Conversion",
    year: 2025,
    total_income: 100000,
    agi: 95000,
    taxable_income: 82150,
    total_tax: 13522,
    ordinary_tax: 13522,
    capital_gains_tax: 0,
    marginal_rate: 0.22,
    marginal_capital_gains_rate: 0.15,
    effective_rate: 0.135,
    filing_status: "married" as FilingStatusType, // Fixed: changed from married_joint to married
    updated_at: new Date().toISOString(),
    // Remove tax_data_updated_at which doesn't exist in TaxResult
    tax_data_is_current: true,
    brackets_breakdown: {
      ordinary: [
        { bracket: 10, amount: 11000, tax: 1100 },
        { bracket: 12, amount: 33725, tax: 4047 },
        { bracket: 22, amount: 37425, tax: 8234 }
      ],
      capitalGains: []
    }
  };

  const scenarios = [scenario1, scenario2, scenario3];
  
  const chartData = scenarios.map(scenario => ({
    name: scenario.scenario_name,
    totalTax: scenario.total_tax,
    effectiveRate: scenario.effective_rate * 100,
    scenario: scenario.scenario_name
  }));

  const handleStartFreeTrial = () => {
    toast.success("Starting your free trial!", { 
      description: "Redirecting to trial activation..." 
    });
    navigate('/pricing');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-[#2A2F3C] rounded w-64 mb-8"></div>
          <div className="h-48 bg-[#2A2F3C] rounded w-full max-w-4xl mb-6"></div>
          <div className="h-24 bg-[#2A2F3C] rounded w-full max-w-4xl"></div>
        </div>
      </div>
    );
  }

  if (!isInTrial) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-[#9b87f5]/30 bg-[#1A1F2C]">
            <CardHeader className="text-center">
              <Lock className="mx-auto h-12 w-12 text-[#9b87f5] mb-4" />
              <CardTitle className="text-2xl">Premium Feature</CardTitle>
              <CardDescription className="text-base">
                Roth Conversion Scenarios is a premium feature available with our 90-day free trial.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-[#9b87f5]/10 border border-[#9b87f5]/30 rounded-md p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#9b87f5]" />
                  <h3 className="font-medium text-[#9b87f5]">FREE 90-DAY TRIAL</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Start your free trial today to gain access to all premium features including:
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-[#9b87f5] mr-2">•</span>
                    <span>Roth conversion analysis and scenario comparison</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#9b87f5] mr-2">•</span>
                    <span>Advanced tax strategies and tax-loss harvesting tools</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#9b87f5] mr-2">•</span>
                    <span>Social Security optimization calculator</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#9b87f5] mr-2">•</span>
                    <span>QuickBooks & Xero integration for seamless tax planning</span>
                  </li>
                </ul>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  No credit card required. Cancel anytime during the trial period.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button 
                className="w-full bg-[#9b87f5] hover:bg-[#8a76e4]" 
                onClick={() => {
                  toast.success("Starting your free trial!", { 
                    description: "Redirecting to trial activation..." 
                  });
                  navigate('/pricing');
                }}
              >
                Start 90-Day Free Trial
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/tax-planning">Return to Tax Planning Hub</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-start mb-6">
        <ScenarioComparisonHeader 
          title="Roth Conversion Scenario Comparison"
          description="Compare different Roth conversion strategies and their tax implications" 
        />
        <ShareFeature 
          title="Roth Conversion Comparison" 
          description="Compare different Roth conversion strategies and their tax implications"
          variant="button"
        />
      </div>
      
      <p className="text-xs text-gray-400 mb-4">
        Tax rates and thresholds for 2025 are projected/estimated and may change once official IRS figures are released. For the most accurate information, consult the latest IRS publications.
      </p>
      
      <div className="space-y-8 mt-8">
        <div className="relative">
          <ShareFeature title="Scenario Cards" position="top-right" />
          <ScenarioComparisonCards scenarios={scenarios} chartData={chartData} />
        </div>
        
        <div className="relative">
          <ShareFeature title="Tax Comparison Chart" position="top-right" />
          <ScenarioComparisonChart chartData={chartData} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scenarios.map((scenario, index) => (
            <div key={`bracket-summary-container-${index}`} className="relative">
              <ShareFeature title={`${scenario.scenario_name} Summary`} position="top-right" />
              <BracketSummary 
                key={`bracket-summary-${index}`}
                scenario={scenario}
              />
            </div>
          ))}
        </div>

        <div className="relative">
          <ShareFeature title="Detailed Comparison" position="top-right" />
          <ScenarioComparisonTable 
            scenarios={scenarios} 
            formatCurrency={formatCurrency} 
            formatPercent={formatPercent} 
          />
        </div>
      </div>
    </div>
  );
};

export default CompareRothScenariosPage;
