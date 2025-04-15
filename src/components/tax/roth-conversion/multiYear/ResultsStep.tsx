
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { MultiYearScenarioData, YearlyResult } from '@/types/tax/rothConversionTypes';
import { useMultiYear } from './context/MultiYearContext';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

// Create the RmdScheduleDisplay component
interface RmdScheduleDisplayProps {
  results: YearlyResult[];
  includeSpouse: boolean;
}

const RmdScheduleDisplay: React.FC<RmdScheduleDisplayProps> = ({ results, includeSpouse }) => {
  // Filter only years with RMDs
  const rmdYears = results.filter(result => 
    (result.rmdAmount && result.rmdAmount > 0) || 
    (includeSpouse && result.spouseRmdAmount && result.spouseRmdAmount > 0)
  );

  if (rmdYears.length === 0) {
    return <p className="text-muted-foreground">No RMDs in this scenario.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Year</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Your RMD</TableHead>
          {includeSpouse && <TableHead>Spouse RMD</TableHead>}
          <TableHead>Total RMD</TableHead>
          <TableHead>Tax Impact</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rmdYears.map(year => {
          const yourRmd = year.rmdAmount || 0;
          const spouseRmd = includeSpouse ? year.spouseRmdAmount || 0 : 0;
          const totalRmd = yourRmd + spouseRmd;
          // Estimate tax impact at marginal rate
          const taxImpact = totalRmd * (year.marginalRate || 0.22);
          
          return (
            <TableRow key={year.year}>
              <TableCell>{year.year}</TableCell>
              <TableCell>{year.age}</TableCell>
              <TableCell>${yourRmd.toLocaleString()}</TableCell>
              {includeSpouse && <TableCell>${spouseRmd.toLocaleString()}</TableCell>}
              <TableCell>${totalRmd.toLocaleString()}</TableCell>
              <TableCell>${taxImpact.toLocaleString()}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

// Update the interface to match the props passed from TabContentManager
interface ResultsStepProps {
  yearlyResults: YearlyResult[];
  scenarioData: MultiYearScenarioData;
  isCalculating: boolean;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ yearlyResults, scenarioData, isCalculating }) => {
  // Use the props directly instead of context
  const results = yearlyResults;

  const accountBalanceForYear = (result: YearlyResult, showSpouse: boolean) => {
    return showSpouse 
      ? (result.traditionalIraBalance || 0) + 
        (result.rothIraBalance || 0) +
        (result.spouseTraditionalIraBalance || 0) + 
        (result.spouseRothIraBalance || 0)
      : (result.traditionalIraBalance || 0) + (result.rothIraBalance || 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Multi-Year Scenario Results</CardTitle>
          <CardDescription>
            Here's a summary of your Roth conversion scenario over the next {scenarioData.numYears} years.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {results && results.length > 0 ? (
            <ScrollArea className="rounded-md border">
              <Table>
                <TableCaption>A comprehensive breakdown of your Roth conversion scenario.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Year</TableHead>
                    <TableHead>Age</TableHead>
                    {scenarioData.includeSpouse && <TableHead>Spouse Age</TableHead>}
                    <TableHead>Trad. IRA Balance</TableHead>
                    <TableHead>Roth IRA Balance</TableHead>
                    {scenarioData.includeSpouse && (
                      <>
                        <TableHead>Spouse Trad. IRA</TableHead>
                        <TableHead>Spouse Roth IRA</TableHead>
                      </>
                    )}
                    <TableHead>Conversion Amount</TableHead>
                    <TableHead>RMD Amount</TableHead>
                    <TableHead>Taxable Income</TableHead>
                    <TableHead>Total Tax</TableHead>
                    <TableHead>Marginal Rate</TableHead>
                    <TableHead>Effective Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.year}>
                      <TableCell className="font-medium">{result.year}</TableCell>
                      <TableCell>{result.age}</TableCell>
                      {scenarioData.includeSpouse && <TableCell>{result.spouseAge}</TableCell>}
                      <TableCell>${result.traditionalIraBalance?.toLocaleString()}</TableCell>
                      <TableCell>${result.rothIraBalance?.toLocaleString()}</TableCell>
                      {scenarioData.includeSpouse && (
                        <>
                          <TableCell>${result.spouseTraditionalIraBalance?.toLocaleString()}</TableCell>
                          <TableCell>${result.spouseRothIraBalance?.toLocaleString()}</TableCell>
                        </>
                      )}
                      <TableCell>${result.conversionAmount?.toLocaleString()}</TableCell>
                      <TableCell>${result.rmdAmount?.toLocaleString()}</TableCell>
                      <TableCell>${result.taxableIncome?.toLocaleString()}</TableCell>
                      <TableCell>${result.totalTax?.toLocaleString()}</TableCell>
                      <TableCell>{(result.marginalRate * 100)?.toFixed(1)}%</TableCell>
                      <TableCell>{(result.effectiveRate || 0 * 100)?.toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <div className="text-center text-muted-foreground">
              No results to display. Please calculate the scenario.
            </div>
          )}
        </CardContent>
      </Card>

      {/* RMD Schedule Display */}
      {scenarioData.includeRMDs && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Info className="h-5 w-5" />
              Required Minimum Distribution (RMD) Schedule
            </CardTitle>
            <CardDescription>
              Projected RMD amounts for both you and your spouse (if included) based on the scenario.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RmdScheduleDisplay results={results} includeSpouse={scenarioData.includeSpouse} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResultsStep;
