
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react'; // Correctly import Info from lucide-react
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { FilingStatusType, getBrackets, formatCurrency, formatPercent } from '@/utils/taxBracketData';

const WhichBracketAmIInPage: React.FC = () => {
  // States for the form inputs and selections
  const [filingStatus, setFilingStatus] = useState<FilingStatusType>('single');
  const [taxYear, setTaxYear] = useState<number>(2023);
  const [ordinaryIncome, setOrdinaryIncome] = useState<string>('');
  const [capitalGains, setCapitalGains] = useState<string>('');
  const [calculatedOrdinaryBracket, setCalculatedOrdinaryBracket] = useState<number | null>(null);
  const [calculatedCapitalGainsBracket, setCalculatedCapitalGainsBracket] = useState<number | null>(null);
  
  // Get available years from the data (we'll assume 2021-2023 for now)
  const availableTaxYears = [2021, 2022, 2023];

  // Get brackets based on selected filing status and year
  const ordinaryBrackets = getBrackets(taxYear, filingStatus, 'ordinary');
  const capitalGainsBrackets = getBrackets(taxYear, filingStatus, 'ltcg');

  // Handle form submission
  const handleCalculate = () => {
    const ordinaryAmount = parseFloat(ordinaryIncome) || 0;
    const capitalAmount = parseFloat(capitalGains) || 0;
    
    // Find the bracket for ordinary income
    const ordinaryBracket = ordinaryBrackets.find(
      bracket => ordinaryAmount > bracket.bracket_min && ordinaryAmount <= bracket.bracket_max
    );
    
    // Find the bracket for capital gains, but we need to account for the stacking of income
    const totalIncome = ordinaryAmount + capitalAmount;
    const capitalGainsBracket = capitalGainsBrackets.find(
      bracket => totalIncome > bracket.bracket_min && totalIncome <= bracket.bracket_max
    );
    
    setCalculatedOrdinaryBracket(ordinaryBracket ? ordinaryBracket.rate * 100 : null);
    setCalculatedCapitalGainsBracket(capitalGainsBracket ? capitalGainsBracket.rate * 100 : null);
  };

  // Format currency values
  const formatBracketRange = (min: number, max: number) => {
    return max === Infinity 
      ? `Over ${formatCurrency(min)}` 
      : `${formatCurrency(min)} – ${formatCurrency(max)}`;
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Which Tax Bracket Am I In?</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Select Options</CardTitle>
            <CardDescription>Choose your filing status and tax year</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Filing Status</label>
              <Select 
                value={filingStatus} 
                onValueChange={(value) => setFilingStatus(value as FilingStatusType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select filing status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married Filing Jointly</SelectItem>
                  <SelectItem value="head_of_household">Head of Household</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Tax Year</label>
              <Select 
                value={taxYear.toString()} 
                onValueChange={(value) => setTaxYear(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tax year" />
                </SelectTrigger>
                <SelectContent>
                  {availableTaxYears.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-4 border-t">
              <CardTitle className="text-lg mb-3">Find Your Bracket</CardTitle>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Ordinary Income
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="inline-block ml-2 h-4 w-4 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">This is your total taxable income from wages, self-employment, interest, etc. after deductions.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input 
                    type="number" 
                    value={ordinaryIncome} 
                    onChange={(e) => setOrdinaryIncome(e.target.value)}
                    placeholder="Enter ordinary income"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Long-Term Capital Gains
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="inline-block ml-2 h-4 w-4 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Gains from assets held for more than a year, which are taxed at preferential rates.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input 
                    type="number" 
                    value={capitalGains} 
                    onChange={(e) => setCapitalGains(e.target.value)}
                    placeholder="Enter capital gains"
                  />
                </div>
                
                <Button className="w-full" onClick={handleCalculate}>Calculate My Bracket</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Results Panel */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tax Brackets for {taxYear}</CardTitle>
            <CardDescription>
              Filing as: {filingStatus === 'single' ? 'Single' : 
                        filingStatus === 'married' ? 'Married Filing Jointly' : 
                        'Head of Household'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Ordinary Income Brackets */}
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  Ordinary Income Brackets
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="inline-block ml-2 h-4 w-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Marginal tax rates apply to specific income ranges. Each dollar of income is taxed at the rate for its bracket.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </h3>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rate</TableHead>
                      <TableHead>Income Range</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordinaryBrackets.map((bracket) => {
                      const isHighlighted = calculatedOrdinaryBracket !== null && 
                        Math.abs(bracket.rate * 100 - calculatedOrdinaryBracket) < 0.01;
                      
                      return (
                        <TableRow 
                          key={`ordinary-${bracket.bracket_min}`}
                          className={isHighlighted ? 'bg-primary/10 font-semibold' : ''}
                        >
                          <TableCell>{formatPercent(bracket.rate)}</TableCell>
                          <TableCell>{formatBracketRange(bracket.bracket_min, bracket.bracket_max)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              
              {/* Capital Gains Brackets */}
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  Long-Term Capital Gains Brackets
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="inline-block ml-2 h-4 w-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Long-term capital gains are taxed at lower rates than ordinary income, but the bracket you fall into depends on your total taxable income.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </h3>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rate</TableHead>
                      <TableHead>Income Range</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {capitalGainsBrackets.map((bracket) => {
                      const isHighlighted = calculatedCapitalGainsBracket !== null && 
                        Math.abs(bracket.rate * 100 - calculatedCapitalGainsBracket) < 0.01;
                      
                      return (
                        <TableRow 
                          key={`ltcg-${bracket.bracket_min}`}
                          className={isHighlighted ? 'bg-primary/10 font-semibold' : ''}
                        >
                          <TableCell>{formatPercent(bracket.rate)}</TableCell>
                          <TableCell>{formatBracketRange(bracket.bracket_min, bracket.bracket_max)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              
              {/* Tax Concepts Explainer */}
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Understanding Tax Concepts</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div>
                    <strong>Marginal vs. Effective Rate:</strong> Your marginal rate is the tax on your last dollar earned. 
                    Your effective rate is your total tax divided by total income, which is typically lower.
                  </div>
                  <div>
                    <strong>Capital Gains:</strong> Long-term capital gains (from assets held &gt;1 year) are taxed at preferential rates,
                    which are generally lower than ordinary income rates.
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WhichBracketAmIInPage;
