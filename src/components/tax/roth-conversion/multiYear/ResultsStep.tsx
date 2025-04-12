
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
import { MultiYearScenarioData, YearlyResult } from '../MultiYearRothConversion';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

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
    conversionAmount: result.conversionAmount,
    rmdAmount: result.rmdAmount,
    totalTax: result.totalTax,
    traditionalScenarioBalance: result.traditionalScenarioBalance,
    combinedBalance: result.traditionalIRABalance + result.rothIRABalance,
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
    conversion: { label: "Conversion Amount", theme: { light: "#9333ea", dark: "#a855f7" } },
    rmd: { label: "RMD Amount", theme: { light: "#b91c1c", dark: "#ef4444" } },
    tax: { label: "Annual Tax", theme: { light: "#f59e0b", dark: "#fbbf24" } },
    traditionalOnly: { label: "Traditional Only", theme: { light: "#6b7280", dark: "#9ca3af" } },
    combined: { label: "Combined Balance", theme: { light: "#0369a1", dark: "#38bdf8" } },
    taxSaved: { label: "Tax Savings", theme: { light: "#15803d", dark: "#22c55e" } },
  };
  
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
                          <Line
                            type="monotone"
                            name="combined"
                            dataKey="combinedBalance"
                            stroke="var(--color-combined)"
                            strokeWidth={2}
                            dot={false}
                            strokeDasharray="5 5"
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
                          <Line
                            type="monotone"
                            name="rmd"
                            dataKey="rmdAmount"
                            stroke="var(--color-rmd)"
                            strokeWidth={2}
                          />
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
                        <TableHead>Traditional IRA</TableHead>
                        <TableHead>Roth IRA</TableHead>
                        <TableHead>Conversion</TableHead>
                        <TableHead>RMD</TableHead>
                        <TableHead>Total Tax</TableHead>
                        <TableHead>Marginal Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {yearlyResults.map((result, index) => (
                        <TableRow key={index} className={result.breakEvenYear ? "bg-amber-50/50 dark:bg-amber-950/20" : ""}>
                          <TableCell>{result.year}</TableCell>
                          <TableCell>{result.age}</TableCell>
                          <TableCell>{formatCurrency(result.traditionalIRABalance)}</TableCell>
                          <TableCell>{formatCurrency(result.rothIRABalance)}</TableCell>
                          <TableCell>{formatCurrency(result.conversionAmount)}</TableCell>
                          <TableCell>{formatCurrency(result.rmdAmount)}</TableCell>
                          <TableCell>{formatCurrency(result.totalTax)}</TableCell>
                          <TableCell>{formatPercent(result.marginalRate)}</TableCell>
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
