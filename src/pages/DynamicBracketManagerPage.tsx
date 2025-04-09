
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Define tax bracket structure
type TaxBracket = {
  min: number;
  max: number | null;
  rate: number;
  label: string;
};

// 2024 Single Filer Tax Brackets (simplified for demonstration)
const TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 11000, rate: 10, label: "10% Bracket" },
  { min: 11001, max: 44725, rate: 12, label: "12% Bracket" },
  { min: 44726, max: 95375, rate: 22, label: "22% Bracket" },
  { min: 95376, max: 182100, rate: 24, label: "24% Bracket" },
  { min: 182101, max: 231250, rate: 32, label: "32% Bracket" },
  { min: 231251, max: 578125, rate: 35, label: "35% Bracket" },
  { min: 578126, max: null, rate: 37, label: "37% Bracket" }
];

// Determine current tax bracket based on income
const getCurrentBracket = (income: number): TaxBracket => {
  for (let i = TAX_BRACKETS.length - 1; i >= 0; i--) {
    if (income >= TAX_BRACKETS[i].min) {
      return TAX_BRACKETS[i];
    }
  }
  return TAX_BRACKETS[0]; // Default to lowest bracket
};

// Get next bracket (for advice)
const getNextBracket = (income: number): TaxBracket | null => {
  const currentBracket = getCurrentBracket(income);
  const currentIndex = TAX_BRACKETS.findIndex(bracket => bracket.min === currentBracket.min);
  
  if (currentIndex < TAX_BRACKETS.length - 1) {
    return TAX_BRACKETS[currentIndex + 1];
  }
  
  return null; // No next bracket if in highest bracket
};

const DynamicBracketManagerPage = () => {
  const [income, setIncome] = useState<number>(75000);
  const [currentBracket, setCurrentBracket] = useState<TaxBracket>(TAX_BRACKETS[0]);
  const [nextBracket, setNextBracket] = useState<TaxBracket | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Update bracket information and chart data based on income
  useEffect(() => {
    const bracket = getCurrentBracket(income);
    setCurrentBracket(bracket);
    setNextBracket(getNextBracket(income));
    
    // Generate chart data
    const data = TAX_BRACKETS.map(bracket => ({
      name: `${bracket.rate}%`,
      min: bracket.min,
      max: bracket.max || 600000,
      rate: bracket.rate,
      current: bracket.min <= income && (bracket.max === null || income <= bracket.max)
    }));
    
    setChartData(data);
  }, [income]);
  
  // Format currency
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };
  
  // Generate advice text based on current and next bracket
  const getAdviceText = (): string => {
    if (!nextBracket) {
      return `At ${formatCurrency(income)}, you're in the highest bracket (${currentBracket.rate}%). Consider tax-efficient investment strategies and retirement account contributions.`;
    }
    
    const amountToNext = nextBracket.min - income;
    
    if (amountToNext > 50000) {
      return `At ${formatCurrency(income)}, you're in the ${currentBracket.rate}% bracket. You have significant room (${formatCurrency(amountToNext)}) before reaching the next bracket.`;
    }
    
    return `At ${formatCurrency(income)}, you're in the ${currentBracket.rate}% bracket. Consider strategic withdrawals or Roth conversions to avoid the next bracket, which starts at ${formatCurrency(nextBracket.min)}.`;
  };
  
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight neptune-gold">Dynamic Bracket Manager</h1>
          <p className="text-muted-foreground">Visualize your tax brackets and optimize your income strategies</p>
        </div>
        <Link to="/tax-planning" className="flex items-center gap-2 border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors w-full sm:w-auto justify-center sm:justify-start">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Tax Planning</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg neptune-gold">Tax Bracket Visualization</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis 
                    tickFormatter={(value) => `$${value/1000}k`} 
                    domain={[0, 'dataMax']} 
                  />
                  <Tooltip 
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Amount']}
                    labelFormatter={(label) => `${label} Tax Bracket`}
                  />
                  <Bar 
                    dataKey="max" 
                    fill={(data: any) => data.current ? "#FFD700" : "#0ea5e9"} 
                    name="Bracket Ceiling"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg neptune-gold">Income Simulator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="income-slider" className="block text-sm font-medium mb-2">
                Adjust Annual Income: {formatCurrency(income)}
              </label>
              <input
                id="income-slider"
                type="range"
                min="0"
                max="600000"
                step="1000"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#FFD700]"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>$0</span>
                <span>$300k</span>
                <span>$600k</span>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-primary/20 bg-card/50">
              <h3 className="text-md font-semibold neptune-gold mb-2">Current Bracket</h3>
              <div className="text-2xl font-bold neptune-gold mb-1">{currentBracket.rate}%</div>
              <p className="text-xs text-muted-foreground">
                Range: {formatCurrency(currentBracket.min)} - {currentBracket.max ? formatCurrency(currentBracket.max) : 'No Limit'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Tax Planning Advice</h3>
              <p className="text-sm text-muted-foreground">{getAdviceText()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DynamicBracketManagerPage;
