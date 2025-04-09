
import React from "react";
import { TaxResult } from "@/utils/taxCalculator";
import ScenarioComparisonHeader from "@/components/tax/ScenarioComparisonHeader";
import ScenarioComparisonCards from "@/components/tax/ScenarioComparisonCards";
import ScenarioComparisonChart from "@/components/tax/ScenarioComparisonChart";
import ScenarioComparisonTable from "@/components/tax/ScenarioComparisonTable";
import BracketSummary from "@/components/tax/BracketSummary";
import { formatCurrency, formatPercent } from "@/utils/taxBracketData";

const CompareRothScenariosPage: React.FC = () => {
  // Sample data - would come from API or state in real app
  const scenario1: TaxResult = {
    scenario_name: "No Roth Conversion",
    year: 2023,
    total_income: 80000,
    agi: 75000,
    taxable_income: 62150,
    total_tax: 9122,
    ordinary_tax: 9122,
    capital_gains_tax: 0,
    marginal_rate: 0.22,
    marginal_capital_gains_rate: 0.15,
    effective_rate: 0.114,
    filing_status: "married", // Add filing_status to match TaxResult interface
    updated_at: new Date(),
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
    year: 2023,
    total_income: 90000,
    agi: 85000,
    taxable_income: 72150,
    total_tax: 11322,
    ordinary_tax: 11322,
    capital_gains_tax: 0,
    marginal_rate: 0.22,
    marginal_capital_gains_rate: 0.15,
    effective_rate: 0.126,
    filing_status: "married", // Add filing_status
    updated_at: new Date(),
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
    year: 2023,
    total_income: 100000,
    agi: 95000,
    taxable_income: 82150,
    total_tax: 13522,
    ordinary_tax: 13522,
    capital_gains_tax: 0,
    marginal_rate: 0.22,
    marginal_capital_gains_rate: 0.15,
    effective_rate: 0.135,
    filing_status: "married", // Add filing_status
    updated_at: new Date(),
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
  
  // Prepare chart data for the comparison chart
  const chartData = scenarios.map(scenario => ({
    name: scenario.scenario_name,
    totalTax: scenario.total_tax,
    effectiveRate: scenario.effective_rate * 100, // Convert to percentage for chart display
    scenario: scenario.scenario_name
  }));

  return (
    <div className="container mx-auto py-6 px-4">
      <ScenarioComparisonHeader 
        title="Roth Conversion Scenario Comparison"
        description="Compare different Roth conversion strategies and their tax implications" 
      />
      
      <div className="space-y-8 mt-8">
        <ScenarioComparisonCards scenarios={scenarios} chartData={chartData} />
        <ScenarioComparisonChart chartData={chartData} />
        
        {/* New Bracket Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scenarios.map((scenario, index) => (
            <BracketSummary 
              key={`bracket-summary-${index}`}
              scenario={scenario}
            />
          ))}
        </div>

        <ScenarioComparisonTable 
          scenarios={scenarios} 
          formatCurrency={formatCurrency} 
          formatPercent={formatPercent} 
        />
      </div>
    </div>
  );
};

export default CompareRothScenariosPage;
