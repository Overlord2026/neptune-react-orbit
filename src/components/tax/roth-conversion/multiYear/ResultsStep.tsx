
import React from 'react';
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { ChevronDown, ChevronUp, ChartLine, DollarSign, Database } from "lucide-react";
import { 
  Table,
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { MultiYearScenarioData, YearlyResult } from '../types/ScenarioTypes';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import FilingStatusComparison from './components/FilingStatusComparison';
import CommunityPropertyInfo from './components/CommunityPropertyInfo';
import RmdScheduleDisplay from './components/RmdScheduleDisplay';

// Format currency values
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

// Format percentage values
const formatPercent = (decimal: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(decimal);
};

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
  const [isDataTableOpen, setIsDataTableOpen] = React.useState(false);

  // Find the break-even year if any
  const breakEvenYear = yearlyResults.find(result => result.breakEvenYear)?.year;
  
  // Process data for display in charts
  const chartData = yearlyResults.map(result => ({
    year: result.year,
    traditionalIRABalance: result.traditionalIRABalance,
    rothIRABalance: result.rothIRABalance,
    spouseTraditionalIRABalance: result.spouseTraditionalIRABalance || 0,
    spouseRothIRABalance: result.spouseRothIRABalance || 0,
    conversionAmount: result.conversionAmount,
    spouseConversionAmount: result.spouseConversionAmount || 0,
    rmdAmount: result.rmdAmount,
    spouseRmdAmount: result.spouseRmdAmount || 0,
    totalTax: result.totalTax,
    traditionalScenarioBalance: result.traditionalScenarioBalance,
    combinedBalance: result.traditionalIRABalance + result.rothIRABalance,
    combinedSpouseBalance: (result.spouseTraditionalIRABalance || 0) + (result.spouseRothIRABalance || 0),
    cumulativeTaxPaid: result.cumulativeTaxPaid,
    cumulativeTaxSaved: result.cumulativeTaxSaved
  }));
  
  if (isCalculating) {
    return (
      <Card className="w-full h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Calculating multi-year scenario...</p>
        </div>
      </Card>
    );
  }
  
  if (yearlyResults.length === 0) {
    return (
      <Card className="w-full h-64 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">No results to display. Please calculate the scenario first.</p>
        </div>
      </Card>
    );
  }
  
  // Chart config for displaying results
  const chartConfig = {
    traditional: { label: "Traditional IRA", theme: { light: "#1e40af", dark: "#3b82f6" } },
    roth: { label: "Roth IRA", theme: { light: "#15803d", dark: "#22c55e" } },
    spouseTraditional: { label: "Spouse Traditional", theme: { light: "#4f46e5", dark: "#818cf8" } },
    spouseRoth: { label: "Spouse Roth", theme: { light: "#059669", dark: "#34d399" } },
    conversion: { label: "Conversion Amount", theme: { light: "#9333ea", dark: "#a855f7" } },
    spouseConversion: { label: "Spouse Conversion", theme: { light: "#7e22ce", dark: "#d8b4fe" } },
    rmd: { label: "RMD Amount", theme: { light: "#b91c1c", dark: "#ef4444" } },
    spouseRmd: { label: "Spouse RMD", theme: { light: "#9f1239", dark: "#fda4af" } },
    tax: { label: "Annual Tax", theme: { light: "#f59e0b", dark: "#fbbf24" } },
    traditionalOnly: { label: "Traditional Only", theme: { light: "#6b7280", dark: "#9ca3af" } },
    combined: { label: "Combined Balance", theme: { light: "#0369a1", dark: "#38bdf8" } },
    taxSaved: { label: "Tax Savings", theme: { light: "#15803d", dark: "#22c55e" } },
  };
  
  // Determine if we should show spouse data
  const showSpouseData = scenarioData.includeSpouse &&
    (yearlyResults.some(r => r.spouseTraditionalIRABalance || r.spouseRothIRABalance || r.spouseConversionAmount || r.spouseRmdAmount));
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Multi-Year Roth Conversion Results</CardTitle>
          <CardDescription>
            Analysis of your projected Roth conversion strategy over {scenarioData.numYears} years
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="balances" className="space-y-4">
            <TabsList>
              <TabsTrigger value="balances">Account Balances</TabsTrigger>
              <TabsTrigger value="conversions">Conversion Amounts</TabsTrigger>
              <TabsTrigger value="taxes">Tax Analysis</TabsTrigger>
              <TabsTrigger value="comparison">Strategy Comparison</TabsTrigger>
            </TabsList>
            
            <TabsContent value="balances">
              <Card className="border border-muted">
                <CardContent className="pt-6">
                  <div className="h-[350px]">
                    <ChartContainer config={chartConfig}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis 
                            dataKey="year" 
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            tickFormatter={(value) => `$${value.toLocaleString()}`}
                            width={80}
                          />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Legend />
                          {breakEvenYear && (
                            <ReferenceLine
                              x={breakEvenYear}
                              stroke="#f97316"
                              strokeDasharray="3 3"
                              label={{ value: 'Break-even', position: 'top' }}
                            />
                          )}
                          <Line
                            type="monotone"
                            name="traditional"
                            dataKey="traditionalIRABalance"
                            stroke="var(--color-traditional)"
                            strokeWidth={2}
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            name="roth"
                            dataKey="rothIRABalance"
                            stroke="var(--color-roth)"
                            strokeWidth={2}
                            dot={false}
                          />
                          {showSpouseData && (
                            <>
                              <Line
                                type="monotone"
                                name="spouseTraditional"
                                dataKey="spouseTraditionalIRABalance"
                                stroke="var(--color-spouseTraditional)"
                                strokeWidth={2}
                                dot={false}
                                strokeDasharray="5 5"
                              />
                              <Line
                                type="monotone"
                                name="spouseRoth"
                                dataKey="spouseRothIRABalance"
                                stroke="var(--color-spouseRoth)"
                                strokeWidth={2}
                                dot={false}
                                strokeDasharray="5 5"
                              />
                            </>
                          )}
                          <Line
                            type="monotone"
                            name="combined"
                            dataKey="combinedBalance"
                            stroke="var(--color-combined)"
                            strokeWidth={2}
                            dot={false}
                            strokeDasharray="3 3"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="conversions">
              <Card className="border border-muted">
                <CardContent className="pt-6">
                  <div className="h-[350px]">
                    <ChartContainer config={chartConfig}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis 
                            dataKey="year" 
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            tickFormatter={(value) => `$${value.toLocaleString()}`}
                            width={80}
                          />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line
                            type="monotone"
                            name="conversion"
                            dataKey="conversionAmount"
                            stroke="var(--color-conversion)"
                            strokeWidth={2}
                          />
                          {showSpouseData && (
                            <Line
                              type="monotone"
                              name="spouseConversion"
                              dataKey="spouseConversionAmount"
                              stroke="var(--color-spouseConversion)"
                              strokeWidth={2}
                              strokeDasharray="5 5"
                            />
                          )}
                          <Line
                            type="monotone"
                            name="rmd"
                            dataKey="rmdAmount"
                            stroke="var(--color-rmd)"
                            strokeWidth={2}
                          />
                          {showSpouseData && (
                            <Line
                              type="monotone"
                              name="spouseRmd"
                              dataKey="spouseRmdAmount"
                              stroke="var(--color-spouseRmd)"
                              strokeWidth={2}
                              strokeDasharray="5 5"
                            />
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="taxes">
              <Card className="border border-muted">
                <CardContent className="pt-6">
                  <div className="h-[350px]">
                    <ChartContainer config={chartConfig}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis 
                            dataKey="year" 
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            tickFormatter={(value) => `$${value.toLocaleString()}`}
                            width={80}
                          />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line
                            type="monotone"
                            name="tax"
                            dataKey="totalTax"
                            stroke="var(--color-tax)"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            name="taxSaved"
                            dataKey="cumulativeTaxSaved"
                            stroke="var(--color-taxSaved)"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="comparison">
              <Card className="border border-muted">
                <CardContent className="pt-6">
                  <div className="h-[350px]">
                    <ChartContainer config={chartConfig}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis 
                            dataKey="year" 
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            tickFormatter={(value) => `$${value.toLocaleString()}`}
                            width={80}
                          />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Legend />
                          {breakEvenYear && (
                            <ReferenceLine
                              x={breakEvenYear}
                              stroke="#f97316"
                              strokeDasharray="3 3"
                              label={{ value: 'Break-even', position: 'top' }}
                            />
                          )}
                          <Line
                            type="monotone"
                            name="traditionalOnly"
                            dataKey="traditionalScenarioBalance"
                            stroke="var(--color-traditionalOnly)"
                            strokeWidth={2}
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            name="combined"
                            dataKey="combinedBalance"
                            stroke="var(--color-combined)"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Filing Status Comparison - new component */}
      {scenarioData.compareMfjVsMfs && scenarioData.filingStatus === 'married' && (
        <FilingStatusComparison 
          yearlyResults={yearlyResults} 
          showMfsComparison={scenarioData.compareMfjVsMfs} 
        />
      )}
      
      {/* Community Property Info - new component */}
      <CommunityPropertyInfo 
        scenarioData={scenarioData} 
        yearlyResults={yearlyResults} 
      />
      
      {/* RMD Schedule - new component */}
      <RmdScheduleDisplay
        scenarioData={scenarioData}
        yearlyResults={yearlyResults}
      />
      
      <Collapsible
        open={isDataTableOpen}
        onOpenChange={setIsDataTableOpen}
        className="w-full"
      >
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" /> 
                Detailed Results Data
              </CardTitle>
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                  {isDataTableOpen ? (
                    <>Hide Data <ChevronUp className="h-4 w-4" /></>
                  ) : (
                    <>View Data <ChevronDown className="h-4 w-4" /></>
                  )}
                </button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Year</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead className="text-right">Traditional IRA</TableHead>
                        <TableHead className="text-right">Roth IRA</TableHead>
                        <TableHead className="text-right">Conversion</TableHead>
                        <TableHead className="text-right">RMD</TableHead>
                        <TableHead className="text-right">Total Tax</TableHead>
                        <TableHead className="text-right">Marginal Rate</TableHead>
                        {showSpouseData && (
                          <>
                            <TableHead>Spouse Age</TableHead>
                            <TableHead className="text-right">Spouse Traditional</TableHead>
                            <TableHead className="text-right">Spouse Roth</TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {yearlyResults.map((result, index) => (
                        <TableRow key={index} className={result.breakEvenYear ? "bg-amber-50/50 dark:bg-amber-950/20" : ""}>
                          <TableCell>{result.year}</TableCell>
                          <TableCell>{result.age}</TableCell>
                          <TableCell className="text-right">{formatCurrency(result.traditionalIRABalance)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(result.rothIRABalance)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(result.conversionAmount)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(result.rmdAmount)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(result.totalTax)}</TableCell>
                          <TableCell className="text-right">{formatPercent(result.marginalRate)}</TableCell>
                          {showSpouseData && (
                            <>
                              <TableCell>{result.spouseAge || '--'}</TableCell>
                              <TableCell className="text-right">{formatCurrency(result.spouseTraditionalIRABalance || 0)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(result.spouseRothIRABalance || 0)}</TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};

export default ResultsStep;
