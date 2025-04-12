
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ScenarioComparisonChart from './ScenarioComparisonChart';
import ScenarioObservations from './ScenarioObservations';
import { TaxResult } from '@/utils/taxCalculator';
import { isProjectedTaxYear } from '@/utils/taxYearUtils';

interface ScenarioComparisonCardsProps {
  scenarios: TaxResult[];
  chartData: Array<{
    name: string;
    totalTax: number;
    effectiveRate: number;
    scenario: string;
  }>;
}

const ScenarioComparisonCards: React.FC<ScenarioComparisonCardsProps> = ({ scenarios, chartData }) => {
  // Check if any scenarios use projected tax years
  const hasProjectedData = scenarios.some(scenario => {
    const year = parseInt(scenario.year.toString());
    return isProjectedTaxYear(year);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 bg-card border-primary/20">
        <CardHeader>
          <CardTitle className="neptune-gold">Tax Comparison Chart</CardTitle>
          <CardDescription>
            Visual comparison of total tax and effective tax rate
            {hasProjectedData && (
              <span className="block text-xs text-amber-500 mt-1">
                * Includes projected data for future tax years
              </span>
            )}
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
            {hasProjectedData && (
              <span className="block text-xs text-amber-500 mt-1">
                * Based on available tax data (including projections)
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScenarioObservations scenarios={scenarios} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ScenarioComparisonCards;
