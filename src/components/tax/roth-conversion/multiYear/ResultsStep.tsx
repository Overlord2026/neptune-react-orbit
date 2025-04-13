import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { Skeleton } from "@/components/ui/skeleton";
import { MultiYearScenarioData, YearlyResult } from '../types/ScenarioTypes';
import SpouseCalculationDisclaimer from './common/SpouseCalculationDisclaimer';

interface ResultsStepProps {
  yearlyResults: YearlyResult[];
  scenarioData: MultiYearScenarioData;
  isCalculating: boolean;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ 
  yearlyResults, 
  scenarioData,
  isCalculating
}) => {
  const [activeTab, setActiveTab] = React.useState('balances');
  
  // Format data for charts
  const balanceChartData = yearlyResults.map(result => ({
    year: result.year,
    age: result.age,
    traditional: result.traditionalIRABalance,
    roth: result.rothIRABalance,
    spouseTraditional: result.spouseTraditionalIRABalance,
    spouseRoth: result.spouseRothIRABalance,
    total: result.traditionalIRABalance + result.rothIRABalance + 
      (result.spouseTraditionalIRABalance || 0) + (result.spouseRothIRABalance || 0)
  }));
  
  const conversionChartData = yearlyResults.map(result => ({
    year: result.year,
    age: result.age,
    conversion: result.conversionAmount,
    spouseConversion: result.spouseConversionAmount || 0,
    totalConversion: result.conversionAmount + (result.spouseConversionAmount || 0),
    rmd: result.rmdAmount,
    spouseRmd: result.spouseRmdAmount || 0,
    totalRmd: result.rmdAmount + (result.spouseRmdAmount || 0)
  }));
  
  const taxChartData = yearlyResults.map(result => ({
    year: result.year,
    age: result.age,
    tax: result.totalTax,
    marginalRate: result.marginalRate * 100,
    effectiveRate: result.effectiveRate * 100
  }));
  
  const comparisonChartData = yearlyResults.map(result => ({
    year: result.year,
    age: result.age,
    rothStrategy: result.traditionalIRABalance + result.rothIRABalance + 
      (result.spouseTraditionalIRABalance || 0) + (result.spouseRothIRABalance || 0),
    traditionalOnly: result.traditionalScenarioBalance,
    difference: (result.traditionalIRABalance + result.rothIRABalance + 
      (result.spouseTraditionalIRABalance || 0) + (result.spouseRothIRABalance || 0)) - 
      result.traditionalScenarioBalance,
    breakEven: result.breakEvenYear
  }));
  
  // Find break-even point
  const breakEvenYear = yearlyResults.find(r => r.breakEvenYear)?.year;
  const breakEvenAge = yearlyResults.find(r => r.breakEvenYear)?.age;
  
  // Get final year results
  const finalYear = yearlyResults.length > 0 ? yearlyResults[yearlyResults.length - 1] : null;
  
  if (isCalculating) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Calculating Results</CardTitle>
            <CardDescription>Please wait while we process your scenario...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-[300px] w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (yearlyResults.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>No Results Available</CardTitle>
            <CardDescription>Please complete the previous steps and calculate your scenario.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Multi-Year Roth Conversion Results</CardTitle>
          <CardDescription>
            Analysis for {scenarioData.startYear} to {scenarioData.startYear + scenarioData.numYears - 1} 
            (Ages {scenarioData.startAge} to {scenarioData.startAge + scenarioData.numYears - 1})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="balances">Account Balances</TabsTrigger>
              <TabsTrigger value="conversions">Conversions & RMDs</TabsTrigger>
              <TabsTrigger value="taxes">Tax Impact</TabsTrigger>
              <TabsTrigger value="comparison">Strategy Comparison</TabsTrigger>
            </TabsList>
            
            <TabsContent value="balances" className="space-y-4">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={balanceChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Line type="monotone" dataKey="traditional" name="Traditional IRA" stroke="#8884d8" />
                    <Line type="monotone" dataKey="roth" name="Roth IRA" stroke="#82ca9d" />
                    {scenarioData.includeSpouse && (
                      <>
                        <Line type="monotone" dataKey="spouseTraditional" name="Spouse Traditional IRA" stroke="#8884d8" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="spouseRoth" name="Spouse Roth IRA" stroke="#82ca9d" strokeDasharray="5 5" />
                      </>
                    )}
                    <Line type="monotone" dataKey="total" name="Total Balance" stroke="#ff7300" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Final Account Balances (Year {finalYear?.year})</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Traditional IRA</TableCell>
                      <TableCell className="text-right">{formatCurrency(finalYear?.traditionalIRABalance || 0)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Roth IRA</TableCell>
                      <TableCell className="text-right">{formatCurrency(finalYear?.rothIRABalance || 0)}</TableCell>
                    </TableRow>
                    {scenarioData.includeSpouse && (
                      <>
                        <TableRow>
                          <TableCell>Spouse Traditional IRA</TableCell>
                          <TableCell className="text-right">{formatCurrency(finalYear?.spouseTraditionalIRABalance || 0)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Spouse Roth IRA</TableCell>
                          <TableCell className="text-right">{formatCurrency(finalYear?.spouseRothIRABalance || 0)}</TableCell>
                        </TableRow>
                      </>
                    )}
                    <TableRow className="font-medium">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency((finalYear?.traditionalIRABalance || 0) + 
                          (finalYear?.rothIRABalance || 0) + 
                          (finalYear?.spouseTraditionalIRABalance || 0) + 
                          (finalYear?.spouseRothIRABalance || 0))}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="conversions" className="space-y-4">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={conversionChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="conversion" name="Conversion Amount" fill="#8884d8" />
                    {scenarioData.includeSpouse && (
                      <Bar dataKey="spouseConversion" name="Spouse Conversion" fill="#82ca9d" />
                    )}
                    <Bar dataKey="rmd" name="RMD Amount" fill="#ff7300" />
                    {scenarioData.includeSpouse && (
                      <Bar dataKey="spouseRmd" name="Spouse RMD" fill="#ffc658" />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Conversion Strategy</h4>
                <p className="text-muted-foreground">
                  {scenarioData.conversionStrategy === 'bracket_12' && 'Filling up to the top of the 12% tax bracket each year'}
                  {scenarioData.conversionStrategy === 'bracket_22' && 'Filling up to the top of the 22% tax bracket each year'}
                  {scenarioData.conversionStrategy === 'fixed' && `Converting a fixed amount of ${formatCurrency(scenarioData.fixedConversionAmount || 0)} each year`}
                </p>
                
                <h4 className="font-medium mt-4 mb-2">Total Conversions</h4>
                <p>
                  Total amount converted: {formatCurrency(yearlyResults.reduce((sum, year) => 
                    sum + year.conversionAmount + (year.spouseConversionAmount || 0), 0))}
                </p>
                
                <h4 className="font-medium mt-4 mb-2">RMD Information</h4>
                <p>
                  RMDs begin at age {scenarioData.rmdStartAge}
                  {scenarioData.includeSpouse && ` for you and age ${scenarioData.spouseRmdStartAge} for your spouse`}
                </p>
                <p className="mt-2">
                  Total lifetime RMDs: {formatCurrency(yearlyResults.reduce((sum, year) => 
                    sum + year.rmdAmount + (year.spouseRmdAmount || 0), 0))}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="taxes" className="space-y-4">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={taxChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis yAxisId="left" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'tax') return formatCurrency(Number(value));
                        return `${value.toFixed(1)}%`;
                      }} 
                    />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="tax" name="Total Tax" stroke="#8884d8" />
                    <Line yAxisId="right" type="monotone" dataKey="marginalRate" name="Marginal Rate" stroke="#82ca9d" />
                    <Line yAxisId="right" type="monotone" dataKey="effectiveRate" name="Effective Rate" stroke="#ff7300" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Tax Impact</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Total Tax Paid on Conversions</TableCell>
                      <TableCell className="text-right">{formatCurrency(finalYear?.cumulativeTaxPaid || 0)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Average Annual Tax</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency((yearlyResults.reduce((sum, year) => sum + year.totalTax, 0)) / yearlyResults.length)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Highest Marginal Rate</TableCell>
                      <TableCell className="text-right">
                        {formatPercentage(Math.max(...yearlyResults.map(year => year.marginalRate)))}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Average Effective Rate</TableCell>
                      <TableCell className="text-right">
                        {formatPercentage(yearlyResults.reduce((sum, year) => sum + year.effectiveRate, 0) / yearlyResults.length)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                
                {scenarioData.compareMfjVsMfs && finalYear?.mfsComparison && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">MFJ vs MFS Comparison</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Filing Method</TableHead>
                          <TableHead className="text-right">Tax Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Married Filing Jointly</TableCell>
                          <TableCell className="text-right">{formatCurrency(finalYear.mfsComparison.mfjTotalTax)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Spouse 1 (MFS)</TableCell>
                          <TableCell className="text-right">{formatCurrency(finalYear.mfsComparison.spouse1Tax)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Spouse 2 (MFS)</TableCell>
                          <TableCell className="text-right">{formatCurrency(finalYear.mfsComparison.spouse2Tax)}</TableCell>
                        </TableRow>
                        <TableRow className="font-medium">
                          <TableCell>Combined MFS Total</TableCell>
                          <TableCell className="text-right">{formatCurrency(finalYear.mfsComparison.combinedMfsTax)}</TableCell>
                        </TableRow>
                        <TableRow className={finalYear.mfsComparison.taxDifference > 0 ? "text-red-500" : "text-green-500"}>
                          <TableCell>Difference (MFS - MFJ)</TableCell>
                          <TableCell className="text-right">{formatCurrency(finalYear.mfsComparison.taxDifference)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <p className="text-sm text-muted-foreground mt-2">
                      {finalYear.mfsComparison.taxDifference > 0 
                        ? "Filing jointly saves you money compared to filing separately." 
                        : "Filing separately may save you money compared to filing jointly."}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="comparison" className="space-y-4">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={comparisonChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Line type="monotone" dataKey="rothStrategy" name="Roth Conversion Strategy" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="traditionalOnly" name="Traditional Only" stroke="#8884d8" strokeWidth={2} />
                    {breakEvenYear && (
                      <Line 
                        type="monotone" 
                        dataKey="difference" 
                        name="Difference" 
                        stroke="#ff7300" 
                        strokeDasharray="5 5"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Strategy Comparison</h4>
                
                {breakEvenYear ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="font-medium text-green-700">Break-Even Point Reached</p>
                    <p className="text-green-600">
                      Your Roth conversion strategy breaks even in {breakEvenYear} (age {breakEvenAge}).
                      After this point, the Roth strategy provides greater after-tax value.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                    <p className="font-medium text-amber-700">No Break-Even Within Analysis Period</p>
                    <p className="text-amber-600">
                      Your Roth conversion strategy does not break even within the {scenarioData.numYears}-year analysis period.
                      Consider adjusting your strategy or extending the analysis timeframe.
                    </p>
                  </div>
                )}
                
                <Table className="mt-4">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Strategy</TableHead>
                      <TableHead className="text-right">Final Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Roth Conversion Strategy</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency((finalYear?.traditionalIRABalance || 0) + 
                          (finalYear?.rothIRABalance || 0) + 
                          (finalYear?.spouseTraditionalIRABalance || 0) + 
                          (finalYear?.spouseRothIRABalance || 0))}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Traditional Only</TableCell>
                      <TableCell className="text-right">{formatCurrency(finalYear?.traditionalScenarioBalance || 0)}</TableCell>
                    </TableRow>
                    <TableRow className={finalYear && finalYear.cumulativeTaxSaved > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                      <TableCell>Net Benefit of Roth Strategy</TableCell>
                      <TableCell className="text-right">{formatCurrency(finalYear?.cumulativeTaxSaved || 0)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                
                <p className="text-sm text-muted-foreground mt-4">
                  Note: This analysis accounts for taxes paid on conversions and assumes all assets grow at {formatPercentage(scenarioData.expectedAnnualReturn)}.
                  The Roth strategy's value increases over time due to tax-free growth and withdrawals.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Add the spouse calculation disclaimer if spouse is included */}
      {!isCalculating && scenarioData.includeSpouse && (
        <SpouseCalculationDisclaimer scenarioData={scenarioData} />
      )}
    </div>
  );
};

export default ResultsStep;
