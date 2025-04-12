
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, PieChart, BarChart3, Layers, LayoutGrid } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { 
  getBrackets, 
  calculateTax,
  calculateEffectiveRate,
  STANDARD_DEDUCTION 
} from '@/utils/taxBracketData';
import {
  calculateTaxableIncome,
  getDistanceToNextBracket,
  formatCurrency,
  formatPercent
} from '@/utils/taxUtils';
import InfoTooltip from '@/components/tax/InfoTooltip';

const DynamicBracketManagerPage = () => {
  const [income, setIncome] = useState<number>(100000);
  const [deductions, setDeductions] = useState<number>(13850); // Standard deduction 2023
  const [selectedYear, setSelectedYear] = useState<number>(2025); // Updated default year to 2025
  const [filingStatus, setFilingStatus] = useState<"single" | "married" | "head_of_household">("single");
  const [bracketType, setBracketType] = useState<"ordinary" | "ltcg">("ordinary");
  
  // Calculate taxable income
  const taxableIncome = calculateTaxableIncome(
    income,
    selectedYear,
    filingStatus,
    false, // Using standard deduction
    deductions
  );
  
  // Get tax brackets for the selected criteria
  const taxBrackets = getBrackets(selectedYear, filingStatus, bracketType);
  
  // Calculate total tax
  const totalTax = calculateTax(taxableIncome, selectedYear, filingStatus, bracketType);
  
  // Calculate effective tax rate
  const effectiveRate = calculateEffectiveRate(taxableIncome, totalTax);
  
  // Find current marginal bracket
  const currentBracket = taxBrackets.find(
    bracket => taxableIncome > bracket.bracket_min && taxableIncome <= bracket.bracket_max
  ) || taxBrackets[0];
  
  // Get distance to next bracket
  const { nextBracketRate, distance: distanceToNextBracket } = getDistanceToNextBracket(
    taxableIncome,
    selectedYear,
    filingStatus,
    bracketType
  );
  
  // Calculate progress to next bracket
  const currentBracketRange = currentBracket ? 
    (currentBracket.bracket_max === Infinity ? 1000000 : currentBracket.bracket_max) - currentBracket.bracket_min : 0;
    
  const progressToNextBracket = currentBracketRange > 0 ?
    ((taxableIncome - currentBracket.bracket_min) / currentBracketRange) * 100 : 0;
  
  // Prepare data for chart
  const prepareBracketData = () => {
    return taxBrackets.map(bracket => {
      const min = bracket.bracket_min;
      const max = bracket.bracket_max === Infinity ? 1000000 : bracket.bracket_max;
      const isInBracket = taxableIncome > min && taxableIncome <= max;
      
      // Calculate amount in each bracket
      let amountInBracket = 0;
      if (taxableIncome > min) {
        amountInBracket = Math.min(taxableIncome - min, max - min);
      }
      
      return {
        name: `${(bracket.rate * 100).toFixed(0)}%`,
        range: `${formatCurrency(min)} - ${max === 1000000 ? '∞' : formatCurrency(max)}`,
        rate: bracket.rate * 100,
        amountInBracket,
        isActive: isInBracket
      };
    });
  };
  
  const bracketData = prepareBracketData();
  
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight neptune-gold">Dynamic Bracket Manager</h1>
          <p className="text-muted-foreground">
            Visualize how your income relates to tax brackets and plan strategies to optimize your tax situation.
            <InfoTooltip 
              text="Use this tool to see how different levels of income impact your tax brackets and overall tax liability." 
              link="/tax-planning/basic-education#tax-brackets" 
              linkText="Learn about tax brackets"
            />
          </p>
          {selectedYear === 2025 && (
            <p className="text-xs text-gray-400 mt-1">
              Tax rates and thresholds for 2025 are projected/estimated and may change once official IRS figures are released. For the most accurate information, consult the latest IRS publications.
            </p>
          )}
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
                <Label htmlFor="income">Gross Income: {formatCurrency(income)}</Label>
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
                <Label htmlFor="deductions">Deductions: {formatCurrency(deductions)}</Label>
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
            
            <div className="flex flex-wrap gap-2">
              <div className="bg-muted/30 px-3 py-1 rounded-full text-sm">
                <label className="mr-2">Year:</label>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-transparent"
                >
                  <option value={2025}>2025 (Projected)</option>
                  <option value={2023}>2023</option>
                  <option value={2022}>2022</option>
                  <option value={2021}>2021</option>
                </select>
              </div>
              
              <div className="bg-muted/30 px-3 py-1 rounded-full text-sm">
                <label className="mr-2">Filing:</label>
                <select 
                  value={filingStatus} 
                  onChange={(e) => setFilingStatus(e.target.value as "single" | "married" | "head_of_household")}
                  className="bg-transparent"
                >
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="head_of_household">Head of Household</option>
                </select>
              </div>
              
              <div className="bg-muted/30 px-3 py-1 rounded-full text-sm">
                <label className="mr-2">Type:</label>
                <select 
                  value={bracketType} 
                  onChange={(e) => setBracketType(e.target.value as "ordinary" | "ltcg")}
                  className="bg-transparent"
                >
                  <option value="ordinary">Ordinary Income</option>
                  <option value="ltcg">Long-Term Capital Gains</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-primary/10 rounded-md">
                <h3 className="font-semibold mb-2 neptune-gold">Your Tax Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Gross Income:</span>
                  <span className="text-right">{formatCurrency(income)}</span>
                  
                  <span className="text-muted-foreground">Deductions:</span>
                  <span className="text-right">{formatCurrency(deductions)}</span>
                  
                  <span className="text-muted-foreground">Taxable Income:</span>
                  <span className="text-right">{formatCurrency(taxableIncome)}</span>
                  
                  <span className="text-muted-foreground">Total Tax:</span>
                  <span className="text-right">{formatCurrency(Math.round(totalTax))}</span>
                  
                  <span className="text-muted-foreground">Effective Tax Rate:</span>
                  <span className="text-right">{formatPercent(effectiveRate)}</span>
                  
                  <span className="text-muted-foreground">Current Bracket:</span>
                  <span className="text-right">{formatPercent(currentBracket?.rate || 0)}</span>
                </div>
              </div>
              
              {nextBracketRate !== null && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress in current bracket:</span>
                    <span>{Math.min(100, progressToNextBracket).toFixed(0)}%</span>
                  </div>
                  <Progress value={Math.min(100, progressToNextBracket)} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">To next bracket ({formatPercent(nextBracketRate)}):</span>
                    <span>{formatCurrency(distanceToNextBracket)}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 bg-card border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl neptune-gold">
              {bracketType === "ordinary" ? "Ordinary Income" : "Capital Gains"} Tax Brackets
              <InfoTooltip 
                text={bracketType === "ordinary" 
                  ? "Ordinary income includes wages, interest, short-term gains, and most taxable distributions." 
                  : "Long-term capital gains are taxed at preferential rates for assets held more than one year."
                }
                icon="help"
                link={bracketType === "ordinary" 
                  ? "/tax-planning/basic-education#ordinary-income" 
                  : "/tax-planning/basic-education#capital-gains"
                }
              />
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant={bracketType === "ordinary" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setBracketType("ordinary")}
              >
                <Layers className="h-4 w-4 mr-1" />
                Ordinary
              </Button>
              <Button 
                variant={bracketType === "ltcg" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setBracketType("ltcg")}
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                Capital Gains
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={bracketData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis 
                  label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }} 
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: any, name: any) => [
                    formatCurrency(Number(value)),
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
            
            <div className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left px-2 py-1">Rate</th>
                      <th className="text-left px-2 py-1">Income Range</th>
                      <th className="text-right px-2 py-1">Tax in Bracket</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bracketData.map((bracket, index) => {
                      // Calculate tax paid in each bracket
                      const bracketTax = bracket.amountInBracket * (bracket.rate / 100);
                      
                      return (
                        <tr key={index} className={bracket.isActive ? "bg-primary/10" : ""}>
                          <td className="px-2 py-1">{bracket.name}</td>
                          <td className="px-2 py-1">{bracket.range}</td>
                          <td className="text-right px-2 py-1">{formatCurrency(bracketTax)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DynamicBracketManagerPage;
