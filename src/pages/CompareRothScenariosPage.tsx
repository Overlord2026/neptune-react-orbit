
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { TaxResult } from '@/utils/taxCalculator';

// Imported components
import ScenarioComparisonTable from '@/components/tax/ScenarioComparisonTable';
import ScenarioComparisonChart from '@/components/tax/ScenarioComparisonChart';
import ScenarioObservations from '@/components/tax/ScenarioObservations';
import ScenarioActionButtons from '@/components/tax/ScenarioActionButtons';
import TaxTrapChecker from '@/components/tax/TaxTrapChecker';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Button } from '@/components/ui/button';
import { ChevronDown, Shield } from 'lucide-react';

// Mock data for initial render (will be replaced with actual data)
const initialScenarios: TaxResult[] = [
  {
    scenario_name: "2021 Scenario",
    year: 2021,
    total_income: 80000,
    agi: 80000,
    taxable_income: 67450,
    total_tax: 7672,
    marginal_rate: 0.12,
    effective_rate: 0.114,
    updated_at: new Date()
  },
  {
    scenario_name: "2022 Scenario",
    year: 2022,
    total_income: 83000,
    agi: 83000,
    taxable_income: 70050,
    total_tax: 8022,
    marginal_rate: 0.12,
    effective_rate: 0.115,
    updated_at: new Date()
  },
  {
    scenario_name: "2023 Scenario",
    year: 2023,
    total_income: 136000,
    agi: 136000,
    taxable_income: 108300,
    total_tax: 15922,
    marginal_rate: 0.22,
    effective_rate: 0.147,
    updated_at: new Date()
  }
];

const CompareRothScenariosPage: React.FC = () => {
  const [scenarios, setScenarios] = useState<TaxResult[]>(initialScenarios);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedScenario, setSelectedScenario] = useState<TaxResult | null>(null);
  const [isCheckingTaxTraps, setIsCheckingTaxTraps] = useState(false);
  const [isTrapCollapsibleOpen, setIsTrapCollapsibleOpen] = useState(false);

  useEffect(() => {
    // In a real implementation, this would fetch data from an API or database
    // For now, we're using the mock data
    const fetchScenarios = async () => {
      try {
        // Simulating API call
        setTimeout(() => {
          setScenarios(initialScenarios);
          // Set the most recent scenario as selected by default
          const mostRecent = [...initialScenarios].sort((a, b) => 
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          )[0];
          setSelectedScenario(mostRecent);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching scenarios:', error);
        setIsLoading(false);
      }
    };

    fetchScenarios();
  }, []);

  const handleCheckTaxTraps = () => {
    setIsCheckingTaxTraps(true);
    setIsTrapCollapsibleOpen(true);
    // After checking tax traps (would be async in real implementation)
    setTimeout(() => setIsCheckingTaxTraps(false), 1000);
  };

  // Prepare chart data
  const chartData = scenarios.map(scenario => ({
    name: `${scenario.year}`,
    totalTax: scenario.total_tax,
    effectiveRate: Number((scenario.effective_rate * 100).toFixed(1)),
    scenario: scenario.scenario_name
  }));

  const formatCurrency = (value: number | string) => {
    if (typeof value === 'string') value = parseFloat(value);
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row items-center justify-between pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight neptune-gold">
            Compare Roth Scenarios
          </h1>
          <p className="text-muted-foreground">
            Compare how different tax years and Roth conversion strategies affect your overall tax situation.
          </p>
        </div>
        <Link to="/tax-planning/roth-analysis" className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Roth Analysis
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <Card className="bg-card border-primary/20">
            <CardHeader>
              <CardTitle className="neptune-gold">Scenario Comparison</CardTitle>
              <CardDescription>
                Compare key tax metrics across your different scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScenarioComparisonTable 
                scenarios={scenarios} 
                formatCurrency={formatCurrency}
                formatPercent={formatPercent}
              />
            </CardContent>
          </Card>

          {selectedScenario && (
            <Collapsible
              open={isTrapCollapsibleOpen}
              onOpenChange={setIsTrapCollapsibleOpen}
              className="w-full"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  Potential Tax Traps and Surcharges
                </h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-0 w-9 h-9">
                    <ChevronDown className={`h-4 w-4 transition-transform ${isTrapCollapsibleOpen ? "transform rotate-180" : ""}`} />
                    <span className="sr-only">Toggle tax trap details</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent className="mt-2">
                <Card className="bg-amber-50/30 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/40">
                  <CardContent className="pt-4">
                    <TaxTrapChecker
                      scenarioId={selectedScenario.scenario_name}
                      scenarioData={{
                        year: selectedScenario.year,
                        filing_status: 'single', // This would come from actual data in real implementation
                        agi: selectedScenario.agi,
                        magi: selectedScenario.agi, // Simplified for now
                        total_income: selectedScenario.total_income,
                        taxable_income: selectedScenario.taxable_income,
                        capital_gains_long: 2500, // Mock data
                        capital_gains_short: 0, // Mock data
                        social_security_amount: 0, // Mock data
                        household_size: 1, // Mock data
                        medicare_enrollment: true, // Mock data
                        aca_enrollment: false, // Mock data
                      }}
                    />
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 bg-card border-primary/20">
              <CardHeader>
                <CardTitle className="neptune-gold">Tax Comparison Chart</CardTitle>
                <CardDescription>
                  Visual comparison of total tax and effective tax rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScenarioComparisonChart chartData={chartData} />
              </CardContent>
            </Card>

            <Card className="bg-card border-primary/20">
              <CardHeader>
                <CardTitle className="neptune-gold">Observations</CardTitle>
                <CardDescription>
                  Analysis of scenario differences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScenarioObservations scenarios={scenarios} />
              </CardContent>
            </Card>
          </div>

          <ScenarioActionButtons 
            onCheckTaxTraps={handleCheckTaxTraps}
            isTrapCheckLoading={isCheckingTaxTraps}
          />
          
          {/* Disclaimer and Data Privacy Section */}
          <Card className="bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 mt-8">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="min-w-[24px] mt-0.5">
                    <Shield className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-slate-800 dark:text-slate-200 mb-1">Disclaimer</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      All calculations presented here are estimates based on the information you've provided and current IRS guidelines. 
                      Real outcomes may differ based on changing tax laws, state-specific rules, and individual circumstances. 
                      For detailed advice tailored to your situation, consult a licensed tax professional or financial advisor.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="min-w-[24px] mt-0.5">
                    <Shield className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-slate-800 dark:text-slate-200 mb-1">Data Privacy</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      This application stores your scenario data securely, but we recommend you do not input sensitive information 
                      beyond what is necessary for planning purposes.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default CompareRothScenariosPage;
