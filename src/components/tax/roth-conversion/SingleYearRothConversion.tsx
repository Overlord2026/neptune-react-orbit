import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Loader2, Calculator, AlertTriangle, CheckCircle2 } from "lucide-react";
import { FilingStatusType } from '@/types/tax/filingTypes';
import InfoTooltip from '@/components/tax/InfoTooltip';
import { TaxTrapChecker } from '@/components/tax/TaxTrapChecker';
import { useToast } from "@/hooks/use-toast";
import { TrapAlert } from '@/components/tax/TaxTrapAlerts';
import TaxTrapWarningsPanel from '@/components/tax/TaxTrapWarningsPanel';
import { checkTaxTraps, TaxTrapInput } from '@/utils/taxTrapChecker';

interface ConversionResult {
  conversionAmount: number;
  taxLiability: number;
  marginalRate: number;
  effectiveRate: number;
}

const SingleYearRothConversion = () => {
  const [income, setIncome] = useState<number>(80000);
  const [iraBalance, setIraBalance] = useState<number>(500000);
  const [filingStatus, setFilingStatus] = useState<FilingStatusType>('single');
  const [conversionAmount, setConversionAmount] = useState<number>(20000);
  const [useBracketFill, setUseBracketFill] = useState<boolean>(false);
  const [bracketFillPercentage, setBracketFillPercentage] = useState<number>(75);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const { toast } = useToast();
  const [trapAlerts, setTrapAlerts] = useState<TrapAlert[]>([]);

  const handleCalculate = () => {
    if (conversionAmount > iraBalance) {
      toast({
        title: "Invalid conversion amount",
        description: "Conversion amount cannot exceed IRA balance",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);

    // Simulate calculation delay
    setTimeout(() => {
      // Simple tax estimation (this would be replaced with actual tax calculation)
      const actualConversionAmount = useBracketFill 
        ? calculateBracketFillAmount(income, filingStatus, bracketFillPercentage)
        : conversionAmount;
        
      const marginalRate = estimateMarginalRate(income + actualConversionAmount, filingStatus);
      const taxLiability = actualConversionAmount * marginalRate;
      const effectiveRate = taxLiability / actualConversionAmount;
      
      setResult({
        conversionAmount: actualConversionAmount,
        taxLiability,
        marginalRate,
        effectiveRate
      });
      
      // Check for tax traps
      const currentYear = new Date().getFullYear();
      const trapInput: TaxTrapInput = {
        scenario_id: "roth-conversion-single",
        year: currentYear,
        filing_status: filingStatus === 'married_joint' ? 'married' : filingStatus,
        agi: income + actualConversionAmount,
        magi: income + actualConversionAmount,
        total_income: income + actualConversionAmount,
        taxable_income: income + actualConversionAmount - 12950, // Simple estimation
        capital_gains_long: 0,
        capital_gains_short: 0,
        social_security_amount: 0,
        household_size: 1,
        medicare_enrollment: false,
        aca_enrollment: false
      };
      
      const trapResults = checkTaxTraps(trapInput);

      // Convert TaxTrapWarnings to TrapAlerts format
      const newAlerts: TrapAlert[] = trapResults.warnings.map(warning => ({
        trapType: warning.type,
        severity: warning.severity === 'alert' ? 'critical' : 
                warning.severity === 'warning' ? 'warning' : 'info',
        message: warning.title,
        details: warning.description
      }));
      
      setTrapAlerts(newAlerts);
      setIsCalculating(false);
      
      toast({
        title: "Calculation complete",
        description: "Roth conversion analysis has been updated"
      });
    }, 1200);
  };

  const calculateBracketFillAmount = (income: number, filingStatus: FilingStatusType, percentage: number) => {
    // This is a simplified calculation - would be replaced with actual bracket calculation
    const brackets = {
      single: [10275, 41775, 89075, 170050, 215950, 539900],
      married: [20550, 83550, 178150, 340100, 431900, 647850],
      married_separate: [10275, 41775, 89075, 170050, 215950, 323925],
      head_of_household: [14650, 55900, 89050, 170050, 215950, 539900]
    };

    // Find next bracket threshold
    const thresholds = brackets[filingStatus];
    let nextThreshold = thresholds[thresholds.length - 1];
    
    for (const threshold of thresholds) {
      if (income < threshold) {
        nextThreshold = threshold;
        break;
      }
    }
    
    // Calculate space to next bracket and apply fill percentage
    const spaceToFill = nextThreshold - income;
    const fillAmount = Math.round(spaceToFill * (percentage / 100));
    return Math.min(fillAmount, iraBalance);
  };

  const estimateMarginalRate = (totalIncome: number, filingStatus: FilingStatusType) => {
    // Simplified marginal rate estimation
    const rates = {
      single: [
        { threshold: 0, rate: 0.10 },
        { threshold: 10275, rate: 0.12 },
        { threshold: 41775, rate: 0.22 },
        { threshold: 89075, rate: 0.24 },
        { threshold: 170050, rate: 0.32 },
        { threshold: 215950, rate: 0.35 },
        { threshold: 539900, rate: 0.37 }
      ],
      married: [
        { threshold: 0, rate: 0.10 },
        { threshold: 20550, rate: 0.12 },
        { threshold: 83550, rate: 0.22 },
        { threshold: 178150, rate: 0.24 },
        { threshold: 340100, rate: 0.32 },
        { threshold: 431900, rate: 0.35 },
        { threshold: 647850, rate: 0.37 }
      ],
      married_separate: [
        { threshold: 0, rate: 0.10 },
        { threshold: 10275, rate: 0.12 },
        { threshold: 41775, rate: 0.22 },
        { threshold: 89075, rate: 0.24 },
        { threshold: 170050, rate: 0.32 },
        { threshold: 215950, rate: 0.35 },
        { threshold: 323925, rate: 0.37 }
      ],
      head_of_household: [
        { threshold: 0, rate: 0.10 },
        { threshold: 14650, rate: 0.12 },
        { threshold: 55900, rate: 0.22 },
        { threshold: 89050, rate: 0.24 },
        { threshold: 170050, rate: 0.32 },
        { threshold: 215950, rate: 0.35 },
        { threshold: 539900, rate: 0.37 }
      ]
    };

    const bracketRates = rates[filingStatus];
    let rate = bracketRates[0].rate;
    
    for (let i = bracketRates.length - 1; i >= 0; i--) {
      if (totalIncome > bracketRates[i].threshold) {
        rate = bracketRates[i].rate;
        break;
      }
    }
    
    return rate;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Current Financial Situation</h3>
        
        <div className="grid gap-4">
          <div>
            <Label htmlFor="income" className="flex items-center gap-1">
              Current Annual Income
              <InfoTooltip text="Your total taxable income before the Roth conversion" />
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-muted-foreground">$</span>
              <Input
                id="income"
                type="number"
                className="pl-7"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="iraBalance" className="flex items-center gap-1">
              Traditional IRA Balance
              <InfoTooltip text="Total balance in all Traditional IRA accounts" />
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-muted-foreground">$</span>
              <Input
                id="iraBalance"
                type="number"
                className="pl-7"
                value={iraBalance}
                onChange={(e) => setIraBalance(Number(e.target.value))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="filingStatus">Filing Status</Label>
            <Select value={filingStatus} onValueChange={(value) => setFilingStatus(value as FilingStatusType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select filing status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married Filing Jointly</SelectItem>
                <SelectItem value="married_separate">Married Filing Separately</SelectItem>
                <SelectItem value="head_of_household">Head of Household</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Separator />
        
        <h3 className="text-lg font-medium text-white">Conversion Strategy</h3>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="bracket-fill"
            checked={useBracketFill} 
            onCheckedChange={setUseBracketFill} 
          />
          <Label htmlFor="bracket-fill" className="flex items-center gap-1">
            Use Bracket Fill Strategy
            <InfoTooltip text="Automatically calculate conversion amount to fill your current tax bracket to the specified percentage" />
          </Label>
        </div>
        
        {useBracketFill ? (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="bracket-fill-percentage">Bracket Fill Percentage</Label>
              <span className="text-sm text-muted-foreground">{bracketFillPercentage}%</span>
            </div>
            <Slider
              id="bracket-fill-percentage"
              min={0}
              max={100}
              step={5}
              value={[bracketFillPercentage]}
              onValueChange={(values) => setBracketFillPercentage(values[0])}
            />
            <p className="text-xs text-muted-foreground">
              Fill {bracketFillPercentage}% of the remaining space in your current tax bracket
            </p>
          </div>
        ) : (
          <div>
            <Label htmlFor="conversionAmount" className="flex items-center gap-1">
              Amount to Convert
              <InfoTooltip text="Amount you want to convert from Traditional IRA to Roth IRA" />
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-muted-foreground">$</span>
              <Input
                id="conversionAmount"
                type="number"
                className="pl-7"
                value={conversionAmount}
                onChange={(e) => setConversionAmount(Number(e.target.value))}
              />
            </div>
          </div>
        )}
        
        <Button 
          onClick={handleCalculate} 
          className="w-full"
          disabled={isCalculating}
        >
          {isCalculating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Tax Impact
            </>
          )}
        </Button>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Conversion Analysis</h3>
        
        {isCalculating ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="animate-spin h-8 w-8 text-primary mb-4" />
            <p>Analyzing your conversion scenario...</p>
          </div>
        ) : result ? (
          <div className="space-y-4">
            <Card className="border border-green-500/20 bg-green-900/10">
              <CardContent className="pt-4">
                <h4 className="font-medium flex items-center gap-1 text-green-400 mb-2">
                  <CheckCircle2 className="h-4 w-4" /> Conversion Summary
                </h4>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Conversion Amount</p>
                    <p className="text-xl font-semibold">${result.conversionAmount.toLocaleString()}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Tax Due</p>
                    <p className="text-xl font-semibold">${Math.round(result.taxLiability).toLocaleString()}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Marginal Rate</p>
                    <p className="text-xl font-semibold">{(result.marginalRate * 100).toFixed(1)}%</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Effective Rate</p>
                    <p className="text-xl font-semibold">{(result.effectiveRate * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <TaxTrapWarningsPanel 
              alerts={trapAlerts}
              scenarioName={`${result.conversionAmount.toLocaleString()} Roth Conversion`}
              className="mb-4"
            />
          </div>
        ) : (
          <div className="bg-card/50 rounded-lg p-6 flex flex-col items-center text-center">
            <Calculator className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Analysis Yet</h3>
            <p className="text-muted-foreground">
              Enter your information and click "Calculate Tax Impact" to see the analysis of your potential Roth conversion.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleYearRothConversion;
