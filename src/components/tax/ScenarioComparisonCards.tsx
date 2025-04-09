
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ScenarioComparisonChart from './ScenarioComparisonChart';
import ScenarioObservations from './ScenarioObservations';
import { TaxResult } from '@/utils/taxCalculator';

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
  return (
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
  );
};

export default ScenarioComparisonCards;
