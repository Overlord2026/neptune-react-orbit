
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Line, LineChart } from 'recharts';
import { AlertCircle, TrendingUp, DollarSign, Percent, FileText, Calculator, BarChart4, HeartHandshake } from 'lucide-react';
import { MultiYearScenarioData, YearlyResult } from '../types/ScenarioTypes';
import SpouseCalculationDisclaimer from './common/SpouseCalculationDisclaimer';
import CharitableContributionImpact from './components/CharitableContributionImpact';

interface ResultsStepProps {
  yearlyResults: YearlyResult[];
  scenarioData: MultiYearScenarioData;
  isCalculating: boolean;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ yearlyResults, scenarioData, isCalculating }) => {
  if (isCalculating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Calculating Results...</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please wait while we calculate your Roth conversion scenarios.</p>
        </CardContent>
      </Card>
    );
  }

  if (!yearlyResults || yearlyResults.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Results Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please calculate the scenarios to view the results.</p>
        </CardContent>
      </Card>
    );
  }

  const totalConversions = yearlyResults.reduce((sum, result) => sum + result.conversionAmount, 0);
  const totalTaxesPaid = yearlyResults.reduce((sum, result) => sum + result.totalTax, 0);
  const lastYearResult = yearlyResults[yearlyResults.length - 1];
  const finalBalance = lastYearResult ? lastYearResult.traditionalScenarioBalance : 0;

  const data = yearlyResults.map(result => ({
    year: result.year,
    traditionalIRABalance: result.traditionalIRABalance,
    rothIRABalance: result.rothIRABalance,
    totalTax: result.totalTax,
    conversionAmount: result.conversionAmount,
    rmdAmount: result.rmdAmount,
    charitableAmount: result.charitableContribution?.amount || 0
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border rounded-md shadow-md p-3">
          <p className="font-semibold">{`Year: ${label}`}</p>
          <p>{`IRA Balance: $${payload[0].value.toFixed(2)}`}</p>
          <p>{`Roth Balance: $${payload[1].value.toFixed(2)}`}</p>
          <p>{`Taxes Paid: $${payload[2].value.toFixed(2)}`}</p>
          <p>{`Conversion: $${payload[3].value.toFixed(2)}`}</p>
          <p>{`RMD Amount: $${payload[4].value.toFixed(2)}`}</p>
          {payload[5] && payload[5].value > 0 && (
            <p>{`Charitable: $${payload[5].value.toFixed(2)}`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // When rendering the chart data, make sure to convert values to numbers before using toFixed
  // For example, in the formatter function:
  const formatter = (value: any) => {
    if (typeof value === 'number') {
      return `$${value.toFixed(0)}`;
    }
    return value;
  };

  // Check if there are any charitable contributions
  const hasCharitableContributions = yearlyResults.some(
    result => result.charitableContribution && result.charitableContribution.amount > 0
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Multi-Year Roth Conversion Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center space-x-2"><TrendingUp className="h-4 w-4" />Overview</TabsTrigger>
              <TabsTrigger value="detailed" className="flex items-center space-x-2"><FileText className="h-4 w-4" />Detailed Results</TabsTrigger>
              <TabsTrigger value="charts" className="flex items-center space-x-2"><BarChart4 className="h-4 w-4" />Charts</TabsTrigger>
              {hasCharitableContributions && (
                <TabsTrigger value="charitable" className="flex items-center space-x-2">
                  <HeartHandshake className="h-4 w-4" />Charitable
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="flex items-center"><DollarSign className="mr-2 h-4 w-4" />Total Conversions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">${totalConversions.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="flex items-center"><Calculator className="mr-2 h-4 w-4" />Total Taxes Paid</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">${totalTaxesPaid.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="flex items-center"><BarChart4 className="mr-2 h-4 w-4" />Final Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">${finalBalance.toLocaleString()}</div>
                  </CardContent>
                </Card>
              </div>
              {lastYearResult.warnings && lastYearResult.warnings.length > 0 && (
                <div className="mt-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Important Considerations</AlertTitle>
                    <AlertDescription>
                      {lastYearResult.warnings.map((warning, index) => (
                        <div key={index}>
                          {warning.message}
                        </div>
                      ))}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </TabsContent>
            <TabsContent value="detailed" className="mt-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                      {scenarioData.includeSpouse && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spouse Age</th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IRA Balance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roth Balance</th>
                      {scenarioData.includeSpouse && (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spouse IRA Balance</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spouse Roth Balance</th>
                        </>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion</th>
                      {scenarioData.includeSpouse && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spouse Conversion</th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RMD</th>
                      {scenarioData.includeSpouse && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spouse RMD</th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Tax</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marginal Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Balance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
                    {yearlyResults.map((result) => (
                      <tr key={result.year}>
                        <td className="px-6 py-4 whitespace-nowrap">{result.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{result.age}</td>
                        {scenarioData.includeSpouse && (
                          <td className="px-6 py-4 whitespace-nowrap">{result.spouseAge}</td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">${result.traditionalIRABalance.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${result.rothIRABalance.toLocaleString()}</td>
                        {scenarioData.includeSpouse && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap">${result.spouseTraditionalIRABalance?.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">${result.spouseRothIRABalance?.toLocaleString()}</td>
                          </>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">${result.conversionAmount.toLocaleString()}</td>
                        {scenarioData.includeSpouse && (
                          <td className="px-6 py-4 whitespace-nowrap">${result.spouseConversionAmount?.toLocaleString()}</td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">${result.rmdAmount.toLocaleString()}</td>
                        {scenarioData.includeSpouse && (
                          <td className="px-6 py-4 whitespace-nowrap">${result.spouseRmdAmount?.toLocaleString()}</td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">${result.totalTax.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatPercent(result.marginalRate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatPercent(result.effectiveRate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${result.traditionalScenarioBalance.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="charts" className="mt-6">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={formatter} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="traditionalIRABalance" stroke="#8884d8" fill="#8884d8" name="IRA Balance" />
                  <Area type="monotone" dataKey="rothIRABalance" stroke="#82ca9d" fill="#82ca9d" name="Roth Balance" />
                  <Area type="monotone" dataKey="totalTax" stroke="#ffc658" fill="#ffc658" name="Taxes Paid" />
                  <Area type="monotone" dataKey="conversionAmount" stroke="#a45de2" fill="#a45de2" name="Conversion Amount" />
                  <Area type="monotone" dataKey="rmdAmount" stroke="#3498db" fill="#3498db" name="RMD Amount" />
                  <Area type="monotone" dataKey="charitableAmount" stroke="#e74c3c" fill="#e74c3c" name="Charitable" />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            {hasCharitableContributions && (
              <TabsContent value="charitable" className="mt-6">
                <CharitableContributionImpact yearlyResults={yearlyResults} />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Add the spouse calculation disclaimer if spouse is included */}
      {scenarioData.includeSpouse && (
        <SpouseCalculationDisclaimer scenarioData={scenarioData} />
      )}
    </div>
  );
};

export default ResultsStep;
