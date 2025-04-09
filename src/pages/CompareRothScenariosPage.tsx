
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TaxResult } from '@/utils/taxCalculator';

// Imported components
import ScenarioComparisonTable from '@/components/tax/ScenarioComparisonTable';
import ScenarioActionButtons from '@/components/tax/ScenarioActionButtons';
import ScenarioComparisonHeader from '@/components/tax/ScenarioComparisonHeader';
import TaxTrapCollapsible from '@/components/tax/TaxTrapCollapsible';
import ScenarioLoadingSpinner from '@/components/tax/ScenarioLoadingSpinner';
import ScenarioComparisonCards from '@/components/tax/ScenarioComparisonCards';
import DisclaimerSection from '@/components/tax/DisclaimerSection';

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
      <ScenarioComparisonHeader 
        title="Compare Roth Scenarios"
        description="Compare how different tax years and Roth conversion strategies affect your overall tax situation."
      />

      {isLoading ? (
        <ScenarioLoadingSpinner />
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

          <TaxTrapCollapsible selectedScenario={selectedScenario} />

          <ScenarioComparisonCards 
            scenarios={scenarios}
            chartData={chartData}
          />

          <ScenarioActionButtons 
            onCheckTaxTraps={handleCheckTaxTraps}
            isTrapCheckLoading={isCheckingTaxTraps}
          />
          
          <DisclaimerSection />
        </>
      )}
    </div>
  );
};

export default CompareRothScenariosPage;
