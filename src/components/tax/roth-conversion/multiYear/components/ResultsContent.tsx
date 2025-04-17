
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { YearlyResult, MultiYearScenarioData } from '@/types/tax/rothConversionTypes';
import ScenarioSummaryTable from './ScenarioSummaryTable';
import WarningsWrapper from './WarningsWrapper';
import RmdScheduleDisplay from './RmdScheduleDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface ResultsContentProps {
  yearlyResults: YearlyResult[];
  scenarioData: MultiYearScenarioData;
  hasCalculated: boolean;
}

const ResultsContent: React.FC<ResultsContentProps> = ({
  yearlyResults,
  scenarioData,
  hasCalculated
}) => {
  if (!hasCalculated) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Results Loading</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scenario Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ScenarioSummaryTable 
            yearlyResults={yearlyResults}
            hasCalculated={hasCalculated}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Warnings & Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <WarningsWrapper />
        </CardContent>
      </Card>

      {scenarioData.includeRMDs && (
        <Card>
          <CardHeader>
            <CardTitle>Required Minimum Distributions</CardTitle>
          </CardHeader>
          <CardContent>
            <RmdScheduleDisplay 
              results={yearlyResults} 
              includeSpouse={!!scenarioData.includeSpouse} 
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResultsContent;
