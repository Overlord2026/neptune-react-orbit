
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Define tax brackets (simple U.S. federal brackets for 2023, single filer)
// These are simplified for demonstration purposes
interface TaxBracket {
  rate: number;
  min: number;
  max: number | null;
  label: string;
}

const TAX_BRACKETS: TaxBracket[] = [
  { rate: 10, min: 0, max: 11000, label: '10%' },
  { rate: 12, min: 11000, max: 44725, label: '12%' },
  { rate: 22, min: 44725, max: 95375, label: '22%' },
  { rate: 24, min: 95375, max: 182100, label: '24%' },
  { rate: 32, min: 182100, max: 231250, label: '32%' },
  { rate: 35, min: 231250, max: 578125, label: '35%' },
  { rate: 37, min: 578125, max: null, label: '37%' },
];

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

const DynamicBracketManagerPage = () => {
  const [income, setIncome] = useState<number>(75000);
  
  // Determine which tax bracket the income falls into
  const currentBracket = useMemo(() => {
    return TAX_BRACKETS.find(bracket => 
      income >= bracket.min && (bracket.max === null || income < bracket.max)
    ) || TAX_BRACKETS[0];
  }, [income]);
  
  // Find the next bracket (if there is one)
  const nextBracket = useMemo(() => {
    const currentIndex = TAX_BRACKETS.indexOf(currentBracket);
    return currentIndex < TAX_BRACKETS.length - 1 ? TAX_BRACKETS[currentIndex + 1] : null;
  }, [currentBracket]);
  
  // Calculate amount to next bracket
  const amountToNextBracket = useMemo(() => {
    if (nextBracket) {
      return nextBracket.min - income;
    }
    return 0;
  }, [income, nextBracket]);
  
  // Generate data for chart visualization
  const chartData = useMemo(() => {
    return TAX_BRACKETS.map(bracket => {
      const width = bracket.max ? bracket.max - bracket.min : 250000;
      const isCurrentBracket = bracket === currentBracket;
      
      return {
        name: bracket.label,
        value: width,
        rate: bracket.rate,
        isCurrentBracket,
        min: bracket.min,
        max: bracket.max
      };
    });
  }, [currentBracket]);
  
  // Generate advice based on income and bracket
  const getTaxAdvice = () => {
    if (nextBracket) {
      const distanceToNext = nextBracket.min - income;
      const percentToNext = ((income - currentBracket.min) / (nextBracket.min - currentBracket.min)) * 100;
      
      if (percentToNext > 80) {
        return `You're very close to moving into the next bracket (${nextBracket.label}). Consider deferring ${formatCurrency(distanceToNext)} of income to next year or increasing retirement contributions.`;
      } else if (percentToNext > 40) {
        return `You're in the middle of your current bracket. You have ${formatCurrency(distanceToNext)} before reaching the ${nextBracket.label} bracket.`;
      } else {
        return `You're still in the lower portion of your current bracket with ${formatCurrency(distanceToNext)} before reaching the ${nextBracket.label} bracket.`;
      }
    } else {
      return "You're in the highest tax bracket. Consider tax-loss harvesting or increased charitable giving.";
    }
  };
  
  const handleIncomeChange = (value: number[]) => {
    setIncome(value[0]);
  };

  // Custom styles for the chart
  const getBarFill = (data: any) => {
    return data.isCurrentBracket ? "#FFD700" : "#0ea5e9";
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight neptune-gold">Dynamic Bracket Manager</h1>
          <p className="text-muted-foreground">Visualize your tax situation and optimize around bracket thresholds.</p>
        </div>
        <Link to="/tax-planning" className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors w-full sm:w-auto text-center sm:text-left flex items-center justify-center sm:justify-start gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Tax Planning Hub
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-card border-primary/20 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-xl neptune-gold flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Income Simulator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Adjust your income:</span>
                <span className="text-xl font-medium neptune-gold">{formatCurrency(income)}</span>
              </div>
              <div className="px-1">
                <Slider 
                  value={[income]} 
                  min={0} 
                  max={600000} 
                  step={1000}
                  onValueChange={handleIncomeChange}
                  className="[&>.bg-primary]:bg-[#FFD700]"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$0</span>
                <span>$600,000</span>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-md border border-primary/20">
              <h3 className="text-lg font-medium neptune-gold mb-2">Tax Bracket Analysis</h3>
              <p className="text-white mb-4">
                At {formatCurrency(income)} of income, you're in the <span className="text-primary font-medium">{currentBracket.label}</span> tax bracket.
              </p>
              <p className="text-muted-foreground text-sm">{getTaxAdvice()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-primary/20 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-xl neptune-gold">Tax Bracket Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 50, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={formatCurrency} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fill: '#A0A0A0' }} 
                    width={40} 
                  />
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `Range: ${formatCurrency(props.payload.min)} - ${props.payload.max ? formatCurrency(props.payload.max) : 'No limit'}`,
                      `Tax Rate: ${props.payload.rate}%`
                    ]}
                    contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
                    itemStyle={{ color: '#FFD700' }}
                    labelStyle={{ fontWeight: 'bold', color: '#FFF' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill={getBarFill}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isCurrentBracket ? "#FFD700" : "#0ea5e9"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#FFD700] rounded-sm"></div>
                <span className="text-muted-foreground">Current Bracket</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#0ea5e9] rounded-sm"></div>
                <span className="text-muted-foreground">Other Brackets</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DynamicBracketManagerPage;
