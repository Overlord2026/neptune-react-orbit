
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BusinessIncomeInput, projectMultiYearBusinessTax } from '@/utils/tax/businessTaxCalculator';
import { formatCurrency } from '@/utils/formatUtils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  TooltipProps
} from 'recharts';

interface MultiYearPlanStepProps {
  businessInput: BusinessIncomeInput;
  updateBusinessInput: (updates: Partial<BusinessIncomeInput>) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface ChartTooltipProps extends TooltipProps<number, string> { }

const CustomTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1F2C] p-3 border border-[#2A2F3C] rounded-md shadow-md">
        <p className="font-medium text-white">{`Year: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {formatCurrency(entry.value as number)}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const MultiYearPlanStep: React.FC<MultiYearPlanStepProps> = ({
  businessInput,
  updateBusinessInput,
  onNext,
  onPrev
}) => {
  const [growthRate, setGrowthRate] = useState<number>(5);
  const [projectionYears, setProjectionYears] = useState<number>(5);
  const [projectionsData, setProjectionsData] = useState<any[]>([]);

  // Calculate multi-year projections
  useEffect(() => {
    const updatedInput = {
      ...businessInput,
      projectedGrowth: growthRate / 100
    };
    
    const results = projectMultiYearBusinessTax(updatedInput, projectionYears);
    
    // Format data for chart and table
    const formattedData = results.map((result, index) => {
      const year = businessInput.year + index;
      return {
        year: year.toString(),
        netProfit: result.netProfit,
        selfEmploymentTax: result.selfEmploymentTax,
        payrollTaxes: result.payrollTaxes,
        income: businessInput.income * Math.pow((1 + growthRate / 100), index),
        qbiDeduction: result.qbiDeduction || 0
      };
    });
    
    setProjectionsData(formattedData);
  }, [businessInput, growthRate, projectionYears]);

  // Handle continue
  const handleContinue = () => {
    updateBusinessInput({
      projectedGrowth: growthRate / 100
    });
    onNext();
  };

  // Calculate if any years might push the user into a higher tax bracket
  const warningThresholds = {
    single: { 
      medium: 182100, // QBI phase-out 
      high: 578125 // Top bracket
    },
    married: {
      medium: 364200, // QBI phase-out
      high: 693750 // Top bracket
    }
  };
  
  const hasIncomeThresholdWarning = projectionsData.some(yearData => 
    yearData.netProfit > warningThresholds.single.medium
  );
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Multi-Year Business Planning</h3>
        <p className="text-muted-foreground">See how your business growth affects your tax situation over time</p>
      </div>
      
      {/* Controls Section */}
      <Card className="border-[#2A2F3C] bg-[#1A1F2C]/70">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label>Annual Growth Rate: {growthRate}%</Label>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <Slider
                value={[growthRate]}
                min={0}
                max={30}
                step={1}
                onValueChange={(values) => setGrowthRate(values[0])}
                className="py-4"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <Label className="w-48">Projection Years:</Label>
              <Input
                type="number"
                min={2}
                max={10}
                value={projectionYears}
                onChange={(e) => setProjectionYears(Number(e.target.value))}
                className="w-24"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Chart */}
      <Card className="border-[#2A2F3C] bg-[#1A1F2C]/70">
        <CardHeader>
          <CardTitle className="text-lg">Projected Business Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectionsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3C" />
                <XAxis dataKey="year" stroke="#8E9196" />
                <YAxis stroke="#8E9196" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="netProfit" name="Net Profit" fill="#9b87f5" />
                <Bar dataKey="qbiDeduction" name="QBI Deduction" fill="#7E69AB" />
                {businessInput.businessType === 'sole_proprietorship' || businessInput.businessType === 'single_member_llc' ? (
                  <Bar dataKey="selfEmploymentTax" name="SE Tax" fill="#ea384c" />
                ) : (
                  <Bar dataKey="payrollTaxes" name="Payroll Taxes" fill="#ea384c" />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Projection Table */}
      <Card className="border-[#2A2F3C] bg-[#1A1F2C]/70">
        <CardHeader>
          <CardTitle className="text-lg">Year-by-Year Projection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>Net Profit</TableHead>
                  {businessInput.businessType === 'sole_proprietorship' || businessInput.businessType === 'single_member_llc' ? (
                    <TableHead>SE Tax</TableHead>
                  ) : (
                    <TableHead>Payroll Taxes</TableHead>
                  )}
                  <TableHead>QBI Deduction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectionsData.map((row) => (
                  <TableRow key={row.year}>
                    <TableCell>{row.year}</TableCell>
                    <TableCell>{formatCurrency(row.netProfit)}</TableCell>
                    <TableCell>
                      {businessInput.businessType === 'sole_proprietorship' || businessInput.businessType === 'single_member_llc'
                        ? formatCurrency(row.selfEmploymentTax)
                        : formatCurrency(row.payrollTaxes)}
                    </TableCell>
                    <TableCell>{formatCurrency(row.qbiDeduction)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Warnings */}
      {hasIncomeThresholdWarning && (
        <Alert className="bg-yellow-600/10 text-yellow-500 border-yellow-600/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Income Threshold Alert</AlertTitle>
          <AlertDescription>
            Your projected business income may cross important tax thresholds in future years, including QBI deduction limitations. Consider tax planning strategies to manage these changes.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Navigation buttons */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={handleContinue}>
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MultiYearPlanStep;
