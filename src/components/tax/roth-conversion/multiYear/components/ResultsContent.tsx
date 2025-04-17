
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MultiYearScenarioData, YearlyResult } from '@/types/tax/rothConversionTypes';
import ScenarioSummaryTable from './ScenarioSummaryTable';
import WarningsWrapper from './WarningsWrapper';
import CharitableContributionImpact from './CharitableContributionImpact';
import RmdScheduleDisplay from './RmdScheduleDisplay';
import { Separator } from '@/components/ui/separator';

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
  // Get the last year's results for charitable impact
  const lastYearResult = yearlyResults?.length > 0 ? 
    yearlyResults[yearlyResults.length - 1] : undefined;

  return (
    <div className="space-y-6">
      {/* Warnings Section */}
      <WarningsWrapper />
      
      {/* Main Results Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Multi-Year Scenario Results</CardTitle>
          <CardDescription>
            Here's a summary of your Roth conversion scenario over the next {scenarioData.numYears} years.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {yearlyResults && yearlyResults.length > 0 ? (
            <ScrollArea className="rounded-md border max-h-[600px]">
              <div className="w-full">
                <table className="w-full caption-bottom">
                  <thead className="sticky top-0 bg-background z-10">
                    <tr className="border-b">
                      <th className="p-3 text-left font-medium">Year</th>
                      <th className="p-3 text-left font-medium">Age</th>
                      {scenarioData.includeSpouse && <th className="p-3 text-left font-medium">Spouse Age</th>}
                      <th className="p-3 text-left font-medium">Trad. IRA Balance</th>
                      <th className="p-3 text-left font-medium">Roth IRA Balance</th>
                      {scenarioData.includeSpouse && (
                        <>
                          <th className="p-3 text-left font-medium">Spouse Trad. IRA</th>
                          <th className="p-3 text-left font-medium">Spouse Roth IRA</th>
                        </>
                      )}
                      <th className="p-3 text-left font-medium">Conversion</th>
                      <th className="p-3 text-left font-medium">RMD</th>
                      <th className="p-3 text-left font-medium">Taxable Income</th>
                      <th className="p-3 text-left font-medium">Tax</th>
                      <th className="p-3 text-left font-medium">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearlyResults.map((result) => (
                      <tr key={result.year} className="border-b">
                        <td className="p-3 font-medium">{result.year}</td>
                        <td className="p-3">{result.age}</td>
                        {scenarioData.includeSpouse && <td className="p-3">{result.spouseAge}</td>}
                        <td className="p-3">${result.traditionalIraBalance?.toLocaleString()}</td>
                        <td className="p-3">${result.rothIraBalance?.toLocaleString()}</td>
                        {scenarioData.includeSpouse && (
                          <>
                            <td className="p-3">${result.spouseTraditionalIraBalance?.toLocaleString()}</td>
                            <td className="p-3">${result.spouseRothIraBalance?.toLocaleString()}</td>
                          </>
                        )}
                        <td className="p-3">${result.conversionAmount?.toLocaleString()}</td>
                        <td className="p-3">${result.rmdAmount?.toLocaleString()}</td>
                        <td className="p-3">${result.taxableIncome?.toLocaleString()}</td>
                        <td className="p-3">${result.totalTax?.toLocaleString()}</td>
                        <td className="p-3">{(result.marginalRate * 100)?.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No results to display. Please calculate the scenario.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RMD Schedule - Show only if RMDs are included */}
        {scenarioData.includeRMDs && yearlyResults?.some(result => result.rmdAmount > 0) && (
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Required Minimum Distributions</CardTitle>
              <CardDescription>
                Projected RMDs based on your scenario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RmdScheduleDisplay results={yearlyResults} includeSpouse={!!scenarioData.includeSpouse} />
            </CardContent>
          </Card>
        )}
        
        {/* Scenario Summary Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Scenario Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ScenarioSummaryTable 
              yearlyResults={yearlyResults}
              hasCalculated={hasCalculated}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Charitable Impact - Show only if charitable planning is enabled */}
      {scenarioData.useCharitablePlanning && lastYearResult?.charitableContribution?.amount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Charitable Planning Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <CharitableContributionImpact charitableContribution={lastYearResult.charitableContribution} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResultsContent;
