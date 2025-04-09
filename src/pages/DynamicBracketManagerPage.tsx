
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define tax brackets - these would typically come from a data source
interface TaxBracket {
  rate: number;
  single: {
    min: number;
    max: number | null;
  };
  married: {
    min: number;
    max: number | null;
  };
  label: string;
}

const taxBrackets: TaxBracket[] = [
  {
    rate: 10,
    single: { min: 0, max: 11000 },
    married: { min: 0, max: 22000 },
    label: '10%',
  },
  {
    rate: 12,
    single: { min: 11001, max: 44725 },
    married: { min: 22001, max: 89450 },
    label: '12%',
  },
  {
    rate: 22,
    single: { min: 44726, max: 95375 },
    married: { min: 89451, max: 190750 },
    label: '22%',
  },
  {
    rate: 24,
    single: { min: 95376, max: 182100 },
    married: { min: 190751, max: 364200 },
    label: '24%',
  },
  {
    rate: 32,
    single: { min: 182101, max: 231250 },
    married: { min: 364201, max: 462500 },
    label: '32%',
  },
  {
    rate: 35,
    single: { min: 231251, max: 578125 },
    married: { min: 462501, max: 693750 },
    label: '35%',
  },
  {
    rate: 37,
    single: { min: 578126, max: null },
    married: { min: 693751, max: null },
    label: '37%',
  },
];

const DynamicBracketManagerPage = () => {
  const [income, setIncome] = useState<number>(75000);
  const [filingStatus, setFilingStatus] = useState<'single' | 'married'>('single');
  const [currentBracket, setCurrentBracket] = useState<TaxBracket | null>(null);
  const [nextBracket, setNextBracket] = useState<TaxBracket | null>(null);
  
  // Prepare data for the chart
  const chartData = taxBrackets.map(bracket => {
    const bracketRange = filingStatus === 'single' ? bracket.single : bracket.married;
    const max = bracketRange.max || (filingStatus === 'single' ? 600000 : 750000); // Cap for visualization
    
    return {
      name: bracket.label,
      range: max - bracketRange.min,
      min: bracketRange.min,
      max: max,
      rate: bracket.rate
    };
  });
  
  // Update brackets when income or filing status changes
  useEffect(() => {
    const getCurrentBracket = () => {
      return taxBrackets.find(bracket => {
        const range = filingStatus === 'single' ? bracket.single : bracket.married;
        return income >= range.min && (range.max === null || income <= range.max);
      }) || null;
    };
    
    const getNextBracket = (current: TaxBracket | null) => {
      if (!current) return null;
      
      const currentIndex = taxBrackets.findIndex(bracket => bracket.rate === current.rate);
      return currentIndex < taxBrackets.length - 1 ? taxBrackets[currentIndex + 1] : null;
    };
    
    const current = getCurrentBracket();
    setCurrentBracket(current);
    setNextBracket(getNextBracket(current));
  }, [income, filingStatus]);

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Handle income slider change
  const handleIncomeChange = (value: number[]) => {
    setIncome(value[0]);
  };
  
  // Get recommendation based on current bracket and income
  const getRecommendation = () => {
    if (!currentBracket || !nextBracket) {
      return "Consider consulting with a tax professional for personalized advice.";
    }
    
    const nextBracketMin = filingStatus === 'single' ? nextBracket.single.min : nextBracket.married.min;
    const distanceToNextBracket = nextBracketMin - income;
    
    if (distanceToNextBracket <= 10000) {
      return `You're ${formatCurrency(distanceToNextBracket)} away from entering the ${nextBracket.label} bracket. Consider strategic tax planning to stay within your current bracket.`;
    } else {
      return `You have room for ${formatCurrency(distanceToNextBracket)} more income before entering the next tax bracket.`;
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight neptune-gold">Dynamic Bracket Manager</h1>
          <p className="text-muted-foreground">
            Visualize tax brackets and plan your income strategy
          </p>
        </div>
        <Link to="/tax-planning" className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors w-full sm:w-auto text-center sm:text-left flex items-center justify-center sm:justify-start gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Tax Planning
        </Link>
      </div>

      {/* Income Input Card */}
      <Card className="bg-card border-primary/20">
        <CardHeader>
          <CardTitle className="neptune-gold">Set Your Income</CardTitle>
          <CardDescription>Adjust the slider to see how income affects your tax bracket</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="text-2xl font-bold text-primary">{formatCurrency(income)}</span>
            <div className="h-12">
              <Slider
                defaultValue={[income]}
                max={500000}
                step={1000}
                className="mt-6"
                onValueChange={handleIncomeChange}
              />
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button 
              variant={filingStatus === 'single' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setFilingStatus('single')}
            >
              Single
            </Button>
            <Button 
              variant={filingStatus === 'married' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setFilingStatus('married')}
            >
              Married Filing Jointly
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Tax Bracket Info */}
      <Card className="bg-card border-primary/20">
        <CardHeader>
          <CardTitle className="neptune-gold">Your Tax Bracket</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentBracket ? (
            <>
              <div className="p-4 bg-primary/5 rounded-md border border-primary/20">
                <h3 className="text-xl font-bold text-primary mb-2">
                  {currentBracket.rate}% Tax Bracket
                </h3>
                <p className="text-muted-foreground">
                  Income Range: {formatCurrency(filingStatus === 'single' ? currentBracket.single.min : currentBracket.married.min)} 
                  {' - '} 
                  {(filingStatus === 'single' ? currentBracket.single.max : currentBracket.married.max) 
                    ? formatCurrency(filingStatus === 'single' ? currentBracket.single.max! : currentBracket.married.max!)
                    : 'and above'}
                </p>
              </div>
              
              <div className="mt-4">
                <h4 className="font-semibold text-lg mb-2">Recommendation</h4>
                <p>{getRecommendation()}</p>
              </div>
            </>
          ) : (
            <p>Please select an income level to see your tax bracket.</p>
          )}
        </CardContent>
      </Card>
      
      {/* Tax Bracket Visualization */}
      <Card className="bg-card border-primary/20">
        <CardHeader>
          <CardTitle className="neptune-gold">Tax Bracket Visualization</CardTitle>
          <CardDescription>See where your income falls within federal tax brackets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                <YAxis dataKey="name" type="category" />
                <Tooltip
                  formatter={(value: any, name: string) => [
                    name === 'range' ? formatCurrency(value) : value,
                    name === 'range' ? 'Bracket Range' : name
                  ]}
                  labelFormatter={(label) => `${label} Tax Bracket`}
                />
                <Legend />
                <Bar 
                  dataKey="range" 
                  name="Income Range" 
                  fill={(data: any) => {
                    // Use gold color for the current bracket
                    const isCurrentBracket = 
                      currentBracket && 
                      data.rate === currentBracket.rate;
                    return isCurrentBracket ? "#FFD700" : "#0ea5e9";
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicBracketManagerPage;
