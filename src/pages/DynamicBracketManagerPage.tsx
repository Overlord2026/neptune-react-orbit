
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, PieChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { Progress } from "@/components/ui/progress";

// Income tax brackets for 2023 (simplified)
const TAX_BRACKETS = [
  { min: 0, max: 11000, rate: 0.10, label: '10%' },
  { min: 11000, max: 44725, rate: 0.12, label: '12%' },
  { min: 44725, max: 95375, rate: 0.22, label: '22%' },
  { min: 95375, max: 182100, rate: 0.24, label: '24%' },
  { min: 182100, max: 231250, rate: 0.32, label: '32%' },
  { min: 231250, max: 578125, rate: 0.35, label: '35%' },
  { min: 578125, max: Infinity, rate: 0.37, label: '37%' }
];

const DynamicBracketManagerPage = () => {
  const [income, setIncome] = useState<number>(100000);
  const [deductions, setDeductions] = useState<number>(13850); // Standard deduction 2023
  
  // Calculate taxable income
  const taxableIncome = Math.max(0, income - deductions);
  
  // Calculate tax owed
  const calculateTax = (income: number): number => {
    let tax = 0;
    let remainingIncome = income;
    
    for (const bracket of TAX_BRACKETS) {
      if (remainingIncome <= 0) break;
      
      const taxableAmountInBracket = Math.min(
        remainingIncome,
        bracket.max - bracket.min
      );
      
      tax += taxableAmountInBracket * bracket.rate;
      remainingIncome -= taxableAmountInBracket;
    }
    
    return tax;
  };
  
  const totalTax = calculateTax(taxableIncome);
  const effectiveRate = taxableIncome > 0 ? (totalTax / taxableIncome) * 100 : 0;
  
  // Find current marginal bracket
  const currentBracket = TAX_BRACKETS.find(
    bracket => taxableIncome > bracket.min && taxableIncome <= bracket.max
  ) || TAX_BRACKETS[0];
  
  // Prepare data for chart
  const prepareBracketData = () => {
    return TAX_BRACKETS.map(bracket => {
      const min = bracket.min;
      const max = bracket.max === Infinity ? 1000000 : bracket.max;
      const isInBracket = taxableIncome > min && taxableIncome <= max;
      
      // Calculate amount in each bracket
      let amountInBracket = 0;
      if (taxableIncome > min) {
        amountInBracket = Math.min(taxableIncome - min, max - min);
      }
      
      return {
        name: bracket.label,
        range: `$${min.toLocaleString()} - $${max === 1000000 ? '∞' : max.toLocaleString()}`,
        rate: bracket.rate * 100,
        amountInBracket,
        isActive: isInBracket
      };
    });
  };
  
  const bracketData = prepareBracketData();
  
  // Calculate next bracket threshold
  const nextBracketIndex = TAX_BRACKETS.findIndex(
    bracket => bracket.min <= taxableIncome && bracket.max >= taxableIncome
  );
  const nextBracketThreshold = nextBracketIndex < TAX_BRACKETS.length - 1 
    ? TAX_BRACKETS[nextBracketIndex + 1].min 
    : null;
  const distanceToNextBracket = nextBracketThreshold 
    ? nextBracketThreshold - taxableIncome 
    : 0;

  // Custom fill function for the bar chart that returns a string
  const getBarFill = (data: any): string => {
    return data.isActive ? "#FFD700" : "#0ea5e9";
  };
  
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight neptune-gold">Dynamic Bracket Manager</h1>
          <p className="text-muted-foreground">
            Visualize how your income relates to tax brackets and plan strategies to optimize your tax situation.
          </p>
        </div>
        <Link to="/tax-planning" className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors flex items-center gap-2 whitespace-nowrap">
          <ArrowLeft className="h-4 w-4" />
          Back to Tax Planning Hub
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 bg-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl neptune-gold">
              <PieChart className="h-5 w-5" />
              Income Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="income">Gross Income: ${income.toLocaleString()}</Label>
              </div>
              <Slider 
                id="income"
                value={[income]} 
                min={0} 
                max={1000000} 
                step={1000}
                onValueChange={(values) => setIncome(values[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="deductions">Deductions: ${deductions.toLocaleString()}</Label>
              </div>
              <Slider 
                id="deductions"
                value={[deductions]} 
                min={0} 
                max={50000} 
                step={100}
                onValueChange={(values) => setDeductions(values[0])}
              />
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-primary/10 rounded-md">
                <h3 className="font-semibold mb-2 neptune-gold">Your Tax Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Gross Income:</span>
                  <span className="text-right">${income.toLocaleString()}</span>
                  
                  <span className="text-muted-foreground">Deductions:</span>
                  <span className="text-right">${deductions.toLocaleString()}</span>
                  
                  <span className="text-muted-foreground">Taxable Income:</span>
                  <span className="text-right">${taxableIncome.toLocaleString()}</span>
                  
                  <span className="text-muted-foreground">Total Tax:</span>
                  <span className="text-right">${Math.round(totalTax).toLocaleString()}</span>
                  
                  <span className="text-muted-foreground">Effective Tax Rate:</span>
                  <span className="text-right">{effectiveRate.toFixed(2)}%</span>
                  
                  <span className="text-muted-foreground">Current Bracket:</span>
                  <span className="text-right">{currentBracket.rate * 100}%</span>
                </div>
              </div>
              
              {nextBracketThreshold && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Distance to next bracket:</span>
                    <span>${distanceToNextBracket.toLocaleString()}</span>
                  </div>
                  <Progress value={100 - (distanceToNextBracket / (nextBracketThreshold - TAX_BRACKETS[nextBracketIndex].min) * 100)} className="h-2" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 bg-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl neptune-gold">Tax Bracket Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={bracketData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value: any, name: any, props: any) => [
                    `$${Number(value).toLocaleString()}`,
                    name === 'amountInBracket' ? 'Amount In Bracket' : name
                  ]}
                  labelFormatter={(label) => `Tax Rate: ${label}`}
                />
                <Legend />
                <Bar 
                  dataKey="amountInBracket" 
                  name="Amount in Bracket" 
                  radius={[4, 4, 0, 0]}
                >
                  {bracketData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isActive ? "#FFD700" : "#0ea5e9"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DynamicBracketManagerPage;
