
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface TaxBracket {
  rate: number;
  min: number;
  max: number | null;
  label: string;
}

// Simplified 2023 Single filing status tax brackets (for demonstration purposes)
const singleTaxBrackets: TaxBracket[] = [
  { rate: 10, min: 0, max: 11000, label: "10%" },
  { rate: 12, min: 11001, max: 44725, label: "12%" },
  { rate: 22, min: 44726, max: 95375, label: "22%" },
  { rate: 24, min: 95376, max: 182100, label: "24%" },
  { rate: 32, min: 182101, max: 231250, label: "32%" },
  { rate: 35, min: 231251, max: 578125, label: "35%" },
  { rate: 37, min: 578126, max: null, label: "37%" }
];

const DynamicBracketManagerPage = () => {
  const [income, setIncome] = useState<number>(75000);
  const [currentBracket, setCurrentBracket] = useState<TaxBracket | null>(null);
  const [nextBracket, setNextBracket] = useState<TaxBracket | null>(null);
  
  const maxIncome = 500000; // Maximum slider value

  // Determine tax bracket based on income
  useEffect(() => {
    const bracket = singleTaxBrackets.find(
      b => income >= b.min && (b.max === null || income <= b.max)
    ) || null;
    
    setCurrentBracket(bracket);
    
    const nextBracketIndex = bracket 
      ? singleTaxBrackets.findIndex(b => b.rate === bracket.rate) + 1 
      : -1;
    
    setNextBracket(
      nextBracketIndex >= 0 && nextBracketIndex < singleTaxBrackets.length
        ? singleTaxBrackets[nextBracketIndex]
        : null
    );
  }, [income]);

  // Generate chart data
  const generateChartData = () => {
    return singleTaxBrackets.map(bracket => ({
      name: bracket.label,
      range: bracket.max ? bracket.max - bracket.min : maxIncome - bracket.min,
      rate: bracket.rate,
      isCurrent: currentBracket?.rate === bracket.rate,
    }));
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Next bracket info text
  const getNextBracketText = () => {
    if (!nextBracket) {
      return "You're in the highest tax bracket.";
    }
    
    const amountToNext = nextBracket.min - income;
    return `You're ${formatCurrency(amountToNext)} away from the next bracket (${nextBracket.label}).`;
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight neptune-gold">Dynamic Bracket Manager</h1>
          <p className="text-muted-foreground">
            Visualize your income tax brackets and plan strategic withdrawals.
          </p>
        </div>
        <Link to="/tax-planning" className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Tax Planning Hub
        </Link>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl neptune-gold flex items-center gap-3">
              <DollarSign className="h-6 w-6" />
              Income Slider
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">$0</span>
                <span className="text-primary text-xl font-medium">
                  {formatCurrency(income)}
                </span>
                <span className="text-muted-foreground">{formatCurrency(maxIncome)}</span>
              </div>
              
              <Slider
                value={[income]}
                min={0}
                max={maxIncome}
                step={1000}
                onValueChange={(values) => setIncome(values[0])}
                className="my-6"
              />
            </div>
            
            {currentBracket && (
              <div className="p-4 rounded-md bg-primary/10 border border-primary/20">
                <h3 className="font-semibold neptune-gold mb-2">Current Tax Bracket</h3>
                <p className="text-lg font-medium mb-2">
                  At {formatCurrency(income)} of income, you're in the{" "}
                  <span className="neptune-gold">{currentBracket.label}</span> bracket.
                </p>
                <p className="text-muted-foreground">
                  {getNextBracketText()}
                </p>
                <p className="text-muted-foreground mt-2">
                  Consider strategic withdrawals or Roth conversions to optimize your tax situation.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl neptune-gold">
              Bracket Visualization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={generateChartData()}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#A0A0A0" />
                  <YAxis stroke="#A0A0A0" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                    formatter={(value, name) => [
                      name === 'rate' ? `${value}%` : `${formatCurrency(value)}`,
                      name === 'rate' ? 'Tax Rate' : 'Income Range'
                    ]}
                  />
                  <Bar 
                    dataKey="rate" 
                    name="Tax Rate" 
                    fill={(data) => data.isCurrent ? "#FFD700" : "#0ea5e9"} 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 rounded-b-lg">
            <p className="text-sm text-muted-foreground py-2">
              <strong>Note:</strong> These are simplified 2023 tax brackets for single filing status. Consult a tax professional for personalized advice.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DynamicBracketManagerPage;
