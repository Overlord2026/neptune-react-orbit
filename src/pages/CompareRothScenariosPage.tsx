
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { TaxResult } from '@/utils/taxCalculator';

// Mock data for initial render (will be replaced with actual data)
const initialScenarios: TaxResult[] = [
  {
    scenario_name: "2021 Scenario",
    year: 2021,
    total_income: 80000,
    agi: 80000,
    taxable_income: 67450,
    total_tax: 7672,
    marginal_rate: 0.12,
    effective_rate: 0.114,
    updated_at: new Date()
  },
  {
    scenario_name: "2022 Scenario",
    year: 2022,
    total_income: 83000,
    agi: 83000,
    taxable_income: 70050,
    total_tax: 8022,
    marginal_rate: 0.12,
    effective_rate: 0.115,
    updated_at: new Date()
  },
  {
    scenario_name: "2023 Scenario",
    year: 2023,
    total_income: 136000,
    agi: 136000,
    taxable_income: 108300,
    total_tax: 15922,
    marginal_rate: 0.22,
    effective_rate: 0.147,
    updated_at: new Date()
  }
];

const CompareRothScenariosPage = () => {
  const [scenarios, setScenarios] = useState<TaxResult[]>(initialScenarios);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch data from an API or database
    // For now, we're using the mock data
    const fetchScenarios = async () => {
      try {
        // Simulating API call
        setTimeout(() => {
          setScenarios(initialScenarios);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching scenarios:', error);
        setIsLoading(false);
      }
    };

    fetchScenarios();
  }, []);

  // Prepare chart data
  const chartData = scenarios.map(scenario => ({
    name: `${scenario.year}`,
    totalTax: scenario.total_tax,
    effectiveRate: Number((scenario.effective_rate * 100).toFixed(1)),
    scenario: scenario.scenario_name
  }));

  // Generate observations based on scenario data
  const generateObservations = () => {
    if (scenarios.length < 3) return "Not enough scenario data for comparison.";

    const [scenario2021, scenario2022, scenario2023] = scenarios;
    
    const taxDiff2021To2022 = scenario2022.total_tax - scenario2021.total_tax;
    const taxDiffPercent2021To2022 = (taxDiff2021To2022 / scenario2021.total_tax * 100).toFixed(1);
    
    const taxDiff2022To2023 = scenario2023.total_tax - scenario2022.total_tax;
    const taxDiffPercent2022To2023 = (taxDiff2022To2023 / scenario2022.total_tax * 100).toFixed(1);
    
    const effectiveRateDiff2021To2023 = 
      ((scenario2023.effective_rate - scenario2021.effective_rate) * 100).toFixed(1);
      
    const observations = [
      `From 2021 to 2022, your total tax increased by $${taxDiff2021To2022.toLocaleString()} (${taxDiffPercent2021To2022}%).`,
      `With the 2023 Roth conversion scenario, your total tax increases by $${taxDiff2022To2023.toLocaleString()} (${taxDiffPercent2022To2023}%) compared to 2022.`,
      `Your effective tax rate in the 2023 Roth conversion scenario is ${effectiveRateDiff2021To2023}% higher than in 2021.`,
    ];

    // Additional observation if Roth conversion is significant
    if (taxDiff2022To2023 > 5000) {
      observations.push(`The Roth conversion has a significant tax impact. Consider spreading the conversion across multiple years.`);
    }
    
    // Safe harbor mention
    observations.push(`Remember: To avoid underpayment penalties, ensure you've met safe harbor requirements by paying at least 100% of last year's tax liability through withholding or estimated payments.`);

    return observations;
  };

  const observations = generateObservations();

  const formatCurrency = (value: number | string) => {
    if (typeof value === 'string') value = parseFloat(value);
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row items-center justify-between pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight neptune-gold">
            Compare Roth Scenarios
          </h1>
          <p className="text-muted-foreground">
            Compare how different tax years and Roth conversion strategies affect your overall tax situation.
          </p>
        </div>
        <Link to="/tax-planning/roth-analysis" className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Roth Analysis
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <Card className="bg-card border-primary/20">
            <CardHeader>
              <CardTitle className="neptune-gold">Scenario Comparison</CardTitle>
              <CardDescription>
                Compare key tax metrics across your different scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Metric</TableHead>
                      <TableHead className="text-center bg-blue-950/30">
                        Scenario 1 (2021)
                      </TableHead>
                      <TableHead className="text-center bg-green-950/30">
                        Scenario 2 (2022)
                      </TableHead>
                      <TableHead className="text-center bg-amber-950/30">
                        Scenario 3 (2023 w/ Roth)
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Total Income</TableCell>
                      <TableCell className="text-center">{formatCurrency(scenarios[0].total_income)}</TableCell>
                      <TableCell className="text-center">{formatCurrency(scenarios[1].total_income)}</TableCell>
                      <TableCell className="text-center">{formatCurrency(scenarios[2].total_income)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Taxable Income</TableCell>
                      <TableCell className="text-center">{formatCurrency(scenarios[0].taxable_income)}</TableCell>
                      <TableCell className="text-center">{formatCurrency(scenarios[1].taxable_income)}</TableCell>
                      <TableCell className="text-center">{formatCurrency(scenarios[2].taxable_income)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Marginal Rate</TableCell>
                      <TableCell className="text-center">{formatPercent(scenarios[0].marginal_rate)}</TableCell>
                      <TableCell className="text-center">{formatPercent(scenarios[1].marginal_rate)}</TableCell>
                      <TableCell className="text-center">{formatPercent(scenarios[2].marginal_rate)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Effective Tax Rate</TableCell>
                      <TableCell className="text-center">{formatPercent(scenarios[0].effective_rate)}</TableCell>
                      <TableCell className="text-center">{formatPercent(scenarios[1].effective_rate)}</TableCell>
                      <TableCell className="text-center">{formatPercent(scenarios[2].effective_rate)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Total Tax</TableCell>
                      <TableCell className="text-center">{formatCurrency(scenarios[0].total_tax)}</TableCell>
                      <TableCell className="text-center">{formatCurrency(scenarios[1].total_tax)}</TableCell>
                      <TableCell className="text-center">{formatCurrency(scenarios[2].total_tax)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Tax Owed/Refund</TableCell>
                      <TableCell className="text-center">Calculated at filing</TableCell>
                      <TableCell className="text-center">Calculated at filing</TableCell>
                      <TableCell className="text-center">Calculated at filing</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 bg-card border-primary/20">
              <CardHeader>
                <CardTitle className="neptune-gold">Tax Comparison Chart</CardTitle>
                <CardDescription>
                  Visual comparison of total tax and effective tax rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={{
                      "2021": { color: "#1e40af" },
                      "2022": { color: "#047857" },
                      "2023": { color: "#FFD700" },
                    }}
                  >
                    <BarChart 
                      data={chartData} 
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="totalTax" name="Total Tax ($)" fill="var(--color-2021)" className="opacity-80 hover:opacity-100" barSize={40} />
                      <Bar yAxisId="right" dataKey="effectiveRate" name="Effective Rate (%)" fill="var(--color-2023)" className="opacity-80 hover:opacity-100" barSize={40} />
                    </BarChart>
                  </ChartContainer>
                </div>
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
                <ul className="space-y-2 text-sm">
                  {Array.isArray(observations) ? (
                    observations.map((observation, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 mt-0.5 text-[#FFD700]">•</span>
                        <span>{observation}</span>
                      </li>
                    ))
                  ) : (
                    <li>{observations}</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link to="/tax-planning/roth-analysis/2021">
              <Button className="bg-blue-600 hover:bg-blue-700" size="lg">
                <Edit className="h-4 w-4 mr-2" />
                Edit 2021 Scenario
              </Button>
            </Link>
            <Button className="bg-green-600 hover:bg-green-700" size="lg">
              <Edit className="h-4 w-4 mr-2" />
              Edit 2022 Scenario
            </Button>
            <Button className="bg-[#FFD700] hover:bg-[#E5C100] text-black" size="lg">
              <Edit className="h-4 w-4 mr-2" />
              Edit 2023 Scenario
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CompareRothScenariosPage;
