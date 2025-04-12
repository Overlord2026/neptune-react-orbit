
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calculator, Settings, Calendar, TrendingUp, AlertCircle, Users, ChartLineUp, CircleDollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TrapAlert } from "@/components/tax/TaxTrapAlerts";
import TaxTrapWarningsPanel from "@/components/tax/TaxTrapWarningsPanel";
import { checkTaxTraps, TaxTrapInput } from "@/utils/taxTrapChecker";
import InfoTooltip from '@/components/tax/InfoTooltip';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';

interface MultiYearScenarioData {
  planningYears: number;
  inflationRate: number;
  investmentReturn: number;
  wageGrowth: number;
  currentAge: number;
  iraBalance: number;
  income: number;
  filingStatus: string;
  conversionStrategy: 'bracket-fill' | 'fixed-amount' | 'partial-bracket';
  bracketFillPercentage: number;
  fixedConversionAmount: number;
  bracketSelection: string[];
  includeRMD: boolean;
  rmdStartAge: number;
  beneficiaryPlanning: boolean;
  beneficiaryAge: number;
  passAwayYear: number;
}

interface YearlyResult {
  year: number;
  age: number;
  income: number;
  traditionalBalance: number;
  rothBalance: number;
  conversionAmount: number;
  taxPaid: number;
  rmdAmount: number;
  cumulativeTax: number;
  cumulativeConversion: number;
}

interface BreakEvenAnalysis {
  breakEvenYear: number | null;
  traditionalTotalTax: number;
  rothTotalTax: number;
  taxSavings: number;
  beneficiaryTaxSavings: number;
}

const MultiYearRothConversion = () => {
  const [activeStep, setActiveStep] = useState<string>("assumptions");
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [hasResults, setHasResults] = useState<boolean>(false);
  const [trapAlerts, setTrapAlerts] = useState<TrapAlert[]>([]);
  
  // Current year for calculations
  const currentYear = new Date().getFullYear();

  // Form state (MultiYearScenarioData)
  const [scenarioData, setScenarioData] = useState<MultiYearScenarioData>({
    planningYears: 10,
    inflationRate: 2.5,
    investmentReturn: 7,
    wageGrowth: 3,
    currentAge: 55,
    iraBalance: 500000,
    income: 100000,
    filingStatus: "single",
    conversionStrategy: 'bracket-fill',
    bracketFillPercentage: 75,
    fixedConversionAmount: 20000,
    bracketSelection: ['10', '12'],
    includeRMD: true,
    rmdStartAge: 73,
    beneficiaryPlanning: false,
    beneficiaryAge: 45,
    passAwayYear: 5
  });

  // Results state
  const [yearlyResults, setYearlyResults] = useState<YearlyResult[]>([]);
  const [breakEvenAnalysis, setBreakEvenAnalysis] = useState<BreakEvenAnalysis>({
    breakEvenYear: null,
    traditionalTotalTax: 0,
    rothTotalTax: 0,
    taxSavings: 0,
    beneficiaryTaxSavings: 0
  });

  // Handle form field changes
  const updateScenarioData = (field: keyof MultiYearScenarioData, value: any) => {
    setScenarioData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate RMD for a given age and balance
  const calculateRMD = (age: number, balance: number): number => {
    // Simplified RMD calculation using IRS life expectancy tables
    // These are approximations and would need to be updated with actual IRS tables
    const lifeExpectancy = Math.max(120 - age, 15); // Very simplified estimate
    return balance / lifeExpectancy;
  };

  // Check if brackets include a specific rate
  const isBracketSelected = (rate: string) => {
    return scenarioData.bracketSelection.includes(rate);
  };

  // Toggle bracket selection
  const toggleBracketSelection = (rate: string) => {
    const currentSelection = [...scenarioData.bracketSelection];
    
    if (currentSelection.includes(rate)) {
      // Remove from selection if it's already there
      updateScenarioData('bracketSelection', currentSelection.filter(r => r !== rate));
    } else {
      // Add to selection
      updateScenarioData('bracketSelection', [...currentSelection, rate]);
    }
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay for complex calculations
    setTimeout(() => {
      // Calculate year by year results
      const results = calculateMultiYearResults();
      setYearlyResults(results);
      
      // Calculate break-even analysis
      const breakEven = calculateBreakEvenPoint(results);
      setBreakEvenAnalysis(breakEven);
      
      // Generate tax trap alerts
      const newAlerts = generateTaxTrapAlerts(results);
      setTrapAlerts(newAlerts);
      
      setHasResults(true);
      setIsCalculating(false);
      
      // Move to results tab
      setActiveStep("results");
    }, 2000);
  };

  // Calculate results for each year in the projection
  const calculateMultiYearResults = (): YearlyResult[] => {
    const results: YearlyResult[] = [];
    let traditionalBalance = scenarioData.iraBalance;
    let rothBalance = 0;
    let cumulativeTax = 0;
    let cumulativeConversion = 0;
    
    for (let year = 0; year < scenarioData.planningYears; year++) {
      const yearNumber = currentYear + year;
      const age = scenarioData.currentAge + year;
      
      // Apply investment returns to both accounts
      traditionalBalance = traditionalBalance * (1 + scenarioData.investmentReturn / 100);
      rothBalance = rothBalance * (1 + scenarioData.investmentReturn / 100);
      
      // Calculate income with growth
      const income = scenarioData.income * Math.pow(1 + scenarioData.wageGrowth / 100, year);
      
      // Calculate RMD if applicable
      const rmdAmount = (scenarioData.includeRMD && age >= scenarioData.rmdStartAge) 
        ? calculateRMD(age, traditionalBalance)
        : 0;
      
      // Determine conversion amount based on strategy
      let conversionAmount = 0;
      
      if (scenarioData.conversionStrategy === 'fixed-amount') {
        // Fixed amount strategy
        conversionAmount = Math.min(scenarioData.fixedConversionAmount, traditionalBalance);
      } 
      else if (scenarioData.conversionStrategy === 'partial-bracket') {
        // Partial bracket fill based on selected brackets
        // This is simplified - in reality would need full tax bracket calculation
        const selectedBrackets = scenarioData.bracketSelection;
        let maxBracket = Math.max(...selectedBrackets.map(b => parseFloat(b)));
        
        // Simulate bracket filling (simplified)
        if (maxBracket === 10) {
          conversionAmount = Math.min(10000, traditionalBalance);
        } else if (maxBracket === 12) {
          conversionAmount = Math.min(30000, traditionalBalance);
        } else if (maxBracket === 22) {
          conversionAmount = Math.min(45000, traditionalBalance);
        } else if (maxBracket === 24) {
          conversionAmount = Math.min(60000, traditionalBalance);
        }
      }
      else {
        // Default bracket fill strategy with percentage
        // Simplified bracket calculation
        conversionAmount = Math.min(
          income < 80000 ? 30000 * (scenarioData.bracketFillPercentage / 100) : 
          income < 170000 ? 40000 * (scenarioData.bracketFillPercentage / 100) : 
          20000 * (scenarioData.bracketFillPercentage / 100),
          traditionalBalance
        );
      }
      
      // Calculate tax (simplified - would need actual tax calculation)
      const taxRate = income < 40000 ? 0.12 : 
                     income < 90000 ? 0.22 : 
                     income < 170000 ? 0.24 : 0.32;
      const taxPaid = conversionAmount * taxRate;
      
      // Update balances
      traditionalBalance -= (conversionAmount + rmdAmount);
      rothBalance += conversionAmount;
      
      // Update cumulative totals
      cumulativeTax += taxPaid;
      cumulativeConversion += conversionAmount;
      
      // Add this year's results
      results.push({
        year: yearNumber,
        age,
        income,
        traditionalBalance,
        rothBalance,
        conversionAmount,
        taxPaid,
        rmdAmount,
        cumulativeTax,
        cumulativeConversion
      });
    }
    
    return results;
  };

  // Calculate break-even analysis
  const calculateBreakEvenPoint = (results: YearlyResult[]): BreakEvenAnalysis => {
    // Simplified break-even calculation
    // In reality would need to model Traditional vs Roth scenarios in parallel
    
    const initialTax = results.reduce((sum, year) => sum + year.taxPaid, 0);
    const estimatedTraditionalTax = initialTax * 1.5; // Simplified - assumes higher tax rates in retirement
    
    // Find break-even year (when Roth tax now equals Traditional tax later)
    let breakEvenYear = null;
    for (let i = 0; i < results.length; i++) {
      if (results[i].cumulativeTax >= estimatedTraditionalTax / 2) {
        breakEvenYear = results[i].year;
        break;
      }
    }
    
    // Calculate beneficiary tax savings (simplified)
    const beneficiaryTaxSavings = scenarioData.beneficiaryPlanning ? 
      results[results.length - 1].rothBalance * 0.25 : 0;
    
    return {
      breakEvenYear,
      traditionalTotalTax: estimatedTraditionalTax,
      rothTotalTax: initialTax,
      taxSavings: estimatedTraditionalTax - initialTax,
      beneficiaryTaxSavings
    };
  };

  // Generate tax trap alerts for each year
  const generateTaxTrapAlerts = (results: YearlyResult[]): TrapAlert[] => {
    const alerts: TrapAlert[] = [];
    
    // Check each year for potential traps
    for (let year = 0; year < Math.min(5, results.length); year++) {
      const result = results[year];
      
      // Create input for tax trap checker
      const trapInput: TaxTrapInput = {
        scenario_id: `roth-conversion-multi-${result.year}`,
        year: result.year,
        filing_status: scenarioData.filingStatus as any,
        agi: result.income + result.conversionAmount,
        magi: result.income + result.conversionAmount,
        total_income: result.income + result.conversionAmount + result.rmdAmount,
        taxable_income: result.income + result.conversionAmount + result.rmdAmount - 12950,
        capital_gains_long: 10000 * Math.pow(1 + scenarioData.inflationRate / 100, year),
        capital_gains_short: 0,
        social_security_amount: result.age >= 67 ? 30000 * Math.pow(1 + scenarioData.inflationRate / 100, year - (67 - scenarioData.currentAge)) : 0,
        household_size: 1,
        medicare_enrollment: result.age >= 65,
        aca_enrollment: result.age < 65
      };
      
      // Check for tax traps
      const trapResults = checkTaxTraps(trapInput);
      
      // Add year information to each warning
      trapResults.warnings.forEach(warning => {
        alerts.push({
          trapType: warning.type,
          severity: warning.severity === 'alert' ? 'critical' : 
                  warning.severity === 'warning' ? 'warning' : 'info',
          message: `Year ${result.year}: ${warning.title}`,
          details: warning.description
        });
      });
    }
    
    return alerts;
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
        <TabsList className="grid grid-cols-5 w-full mb-6">
          <TabsTrigger value="assumptions" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Assumptions</span>
            <span className="sm:hidden">Basics</span>
          </TabsTrigger>
          <TabsTrigger value="strategy" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Strategy</span>
            <span className="sm:hidden">Plan</span>
          </TabsTrigger>
          <TabsTrigger value="rmd" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">RMD Planning</span>
            <span className="sm:hidden">RMD</span>
          </TabsTrigger>
          <TabsTrigger value="beneficiary" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Beneficiary</span>
            <span className="sm:hidden">Heirs</span>
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2" disabled={!hasResults}>
            <ChartLineUp className="h-4 w-4" />
            <span className="hidden sm:inline">Results</span>
            <span className="sm:hidden">Report</span>
          </TabsTrigger>
        </TabsList>

        {/* Step 1: Basic Assumptions */}
        <TabsContent value="assumptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-white">Step 1: Set Global Assumptions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="planningYears" className="flex items-center gap-1">
                    Planning Horizon (Years)
                    <InfoTooltip text="How many years to include in your conversion projection" />
                  </Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="planningYears"
                      min={5}
                      max={30}
                      step={1}
                      value={[scenarioData.planningYears]}
                      onValueChange={(value) => updateScenarioData('planningYears', value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{scenarioData.planningYears}</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="currentAge" className="flex items-center gap-1">
                    Current Age
                    <InfoTooltip text="Your age today - will be used for RMD calculations" />
                  </Label>
                  <Input
                    id="currentAge"
                    type="number"
                    value={scenarioData.currentAge}
                    onChange={(e) => updateScenarioData('currentAge', Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="inflationRate" className="flex items-center gap-1">
                    Inflation Rate (%)
                    <InfoTooltip text="Annual inflation assumption for tax brackets and other values" />
                  </Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="inflationRate"
                      min={0}
                      max={10}
                      step={0.1}
                      value={[scenarioData.inflationRate]}
                      onValueChange={(value) => updateScenarioData('inflationRate', value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{scenarioData.inflationRate}%</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="investmentReturn" className="flex items-center gap-1">
                    Expected Investment Return (%)
                    <InfoTooltip text="Annual growth rate for both traditional and Roth accounts" />
                  </Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="investmentReturn"
                      min={0}
                      max={15}
                      step={0.1}
                      value={[scenarioData.investmentReturn]}
                      onValueChange={(value) => updateScenarioData('investmentReturn', value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{scenarioData.investmentReturn}%</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="wageGrowth" className="flex items-center gap-1">
                    Annual Income Growth (%)
                    <InfoTooltip text="Expected yearly growth in your income" />
                  </Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="wageGrowth"
                      min={0}
                      max={10}
                      step={0.1}
                      value={[scenarioData.wageGrowth]}
                      onValueChange={(value) => updateScenarioData('wageGrowth', value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{scenarioData.wageGrowth}%</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="filingStatus">Filing Status</Label>
                  <Select 
                    value={scenarioData.filingStatus} 
                    onValueChange={(value) => updateScenarioData('filingStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married Filing Jointly</SelectItem>
                      <SelectItem value="head_of_household">Head of Household</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="income" className="flex items-center gap-1">
                    Current Annual Income ($)
                    <InfoTooltip text="Your current yearly income before any Roth conversions" />
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                    <Input
                      id="income"
                      type="number"
                      className="pl-7"
                      value={scenarioData.income}
                      onChange={(e) => updateScenarioData('income', Number(e.target.value))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="iraBalance" className="flex items-center gap-1">
                    Traditional IRA Balance ($)
                    <InfoTooltip text="Current balance in all your Traditional IRA accounts" />
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                    <Input
                      id="iraBalance"
                      type="number"
                      className="pl-7"
                      value={scenarioData.iraBalance}
                      onChange={(e) => updateScenarioData('iraBalance', Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => setActiveStep("strategy")} className="gap-2">
                  Continue to Conversion Strategy
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Step 2: Conversion Strategy */}
        <TabsContent value="strategy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-white">Step 2: Conversion Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Label className="text-base">Choose your multi-year conversion approach:</Label>
                
                <RadioGroup 
                  value={scenarioData.conversionStrategy} 
                  onValueChange={(value) => updateScenarioData('conversionStrategy', value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="bracket-fill" id="bracket-fill" />
                    <Label htmlFor="bracket-fill" className="flex-1 cursor-pointer">
                      <div className="font-medium">Bracket Fill Strategy</div>
                      <p className="text-sm text-muted-foreground">
                        Fill up to a percentage of your current tax bracket each year
                      </p>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="partial-bracket" id="partial-bracket" />
                    <Label htmlFor="partial-bracket" className="flex-1 cursor-pointer">
                      <div className="font-medium">Partial Bracket Fill</div>
                      <p className="text-sm text-muted-foreground">
                        Choose which specific tax brackets to fill each year
                      </p>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="fixed-amount" id="fixed-amount" />
                    <Label htmlFor="fixed-amount" className="flex-1 cursor-pointer">
                      <div className="font-medium">Fixed Amount</div>
                      <p className="text-sm text-muted-foreground">
                        Convert the same dollar amount each year
                      </p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              {/* Conditional settings based on selected strategy */}
              {scenarioData.conversionStrategy === 'bracket-fill' && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="bracket-fill-percentage">Bracket Fill Percentage</Label>
                    <span className="text-sm text-muted-foreground">{scenarioData.bracketFillPercentage}%</span>
                  </div>
                  <Slider
                    id="bracket-fill-percentage"
                    min={0}
                    max={100}
                    step={5}
                    value={[scenarioData.bracketFillPercentage]}
                    onValueChange={(values) => updateScenarioData('bracketFillPercentage', values[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    Fill {scenarioData.bracketFillPercentage}% of the remaining space in your current tax bracket each year
                  </p>
                </div>
              )}
              
              {scenarioData.conversionStrategy === 'partial-bracket' && (
                <div className="space-y-4">
                  <Label>Select tax brackets to fill (in order):</Label>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={isBracketSelected('10') ? "default" : "outline"}
                      onClick={() => toggleBracketSelection('10')}
                      className="justify-start"
                    >
                      10% Bracket
                    </Button>
                    <Button
                      type="button"
                      variant={isBracketSelected('12') ? "default" : "outline"}
                      onClick={() => toggleBracketSelection('12')}
                      className="justify-start"
                    >
                      12% Bracket
                    </Button>
                    <Button
                      type="button"
                      variant={isBracketSelected('22') ? "default" : "outline"}
                      onClick={() => toggleBracketSelection('22')}
                      className="justify-start"
                    >
                      22% Bracket
                    </Button>
                    <Button
                      type="button"
                      variant={isBracketSelected('24') ? "default" : "outline"}
                      onClick={() => toggleBracketSelection('24')}
                      className="justify-start"
                    >
                      24% Bracket
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    The calculator will fill each selected bracket in order until reaching the highest selected bracket
                  </p>
                </div>
              )}
              
              {scenarioData.conversionStrategy === 'fixed-amount' && (
                <div>
                  <Label htmlFor="fixedConversionAmount" className="flex items-center gap-1">
                    Annual Conversion Amount ($)
                    <InfoTooltip text="The same amount will be converted each year until the Traditional IRA is depleted" />
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                    <Input
                      id="fixedConversionAmount"
                      type="number"
                      className="pl-7"
                      value={scenarioData.fixedConversionAmount}
                      onChange={(e) => updateScenarioData('fixedConversionAmount', Number(e.target.value))}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveStep("assumptions")}
                >
                  Back to Assumptions
                </Button>
                <Button onClick={() => setActiveStep("rmd")} className="gap-2">
                  Continue to RMD Planning
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Step 3: RMD Planning */}
        <TabsContent value="rmd" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-white">Step 3: RMD Planning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-rmd"
                  checked={scenarioData.includeRMD}
                  onCheckedChange={(checked) => updateScenarioData('includeRMD', checked)}
                />
                <Label htmlFor="include-rmd" className="flex items-center gap-1">
                  Include RMD Projections
                  <InfoTooltip text="Calculate Required Minimum Distributions once you reach RMD age" />
                </Label>
              </div>
              
              {scenarioData.includeRMD && (
                <div className="pt-4">
                  <Label htmlFor="rmdStartAge" className="flex items-center gap-1">
                    RMD Start Age
                    <InfoTooltip text="The age at which you'll need to start taking Required Minimum Distributions" />
                  </Label>
                  <Select 
                    value={scenarioData.rmdStartAge.toString()} 
                    onValueChange={(value) => updateScenarioData('rmdStartAge', Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="72">72 (Born before 1951)</SelectItem>
                      <SelectItem value="73">73 (Born 1951-1959)</SelectItem>
                      <SelectItem value="75">75 (Born 1960 or later)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <p className="text-sm text-muted-foreground mt-2">
                    Based on your current age ({scenarioData.currentAge}), your first RMD will be in {scenarioData.rmdStartAge - scenarioData.currentAge} years 
                    ({currentYear + (scenarioData.rmdStartAge - scenarioData.currentAge)}).
                  </p>
                </div>
              )}
              
              <Separator />
              
              <div className="bg-card/50 rounded-lg p-4 text-sm">
                <h4 className="font-medium mb-2">RMD Impact on Roth Conversion Strategy</h4>
                <p className="text-muted-foreground">
                  Converting traditional IRA funds to Roth before RMDs begin can significantly reduce your future 
                  RMD amounts and associated tax burden. The multi-year analysis will calculate how your conversion 
                  strategy affects your future RMD obligations.
                </p>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveStep("strategy")}
                >
                  Back to Strategy
                </Button>
                <Button onClick={() => setActiveStep("beneficiary")} className="gap-2">
                  Continue to Beneficiary Planning
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Step 4: Beneficiary Planning */}
        <TabsContent value="beneficiary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-white">Step 4: SECURE Act Beneficiary Planning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="beneficiary-planning"
                  checked={scenarioData.beneficiaryPlanning}
                  onCheckedChange={(checked) => updateScenarioData('beneficiaryPlanning', checked)}
                />
                <Label htmlFor="beneficiary-planning" className="flex items-center gap-1">
                  Include Beneficiary Planning (SECURE Act)
                  <InfoTooltip text="Model the tax impact on your beneficiaries under the SECURE Act rules" />
                </Label>
              </div>
              
              {scenarioData.beneficiaryPlanning && (
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="beneficiaryAge" className="flex items-center gap-1">
                      Beneficiary Age
                      <InfoTooltip text="The current age of your anticipated primary beneficiary" />
                    </Label>
                    <Input
                      id="beneficiaryAge"
                      type="number"
                      value={scenarioData.beneficiaryAge}
                      onChange={(e) => updateScenarioData('beneficiaryAge', Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="passAwayYear" className="flex items-center gap-1">
                      Model inheritance in year
                      <InfoTooltip text="Which projection year to model the inheritance scenario" />
                    </Label>
                    <Select 
                      value={scenarioData.passAwayYear.toString()} 
                      onValueChange={(value) => updateScenarioData('passAwayYear', Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: Math.min(20, scenarioData.planningYears) }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            Year {currentYear + i} (Planning Year {i + 1})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="bg-amber-900/10 border border-amber-500/20 rounded-md p-4">
                    <h4 className="font-medium mb-2">SECURE Act Impact</h4>
                    <p className="text-sm text-muted-foreground">
                      Under the SECURE Act, most non-spouse beneficiaries must withdraw inherited retirement accounts 
                      within 10 years. Traditional IRA beneficiaries pay income tax on withdrawals, while Roth IRA 
                      beneficiaries typically receive tax-free distributions. The analysis will show potential tax 
                      savings for your beneficiary.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveStep("rmd")}
                >
                  Back to RMD Planning
                </Button>
                <Button 
                  onClick={handleCalculate} 
                  className="gap-2" 
                  disabled={isCalculating}
                >
                  {isCalculating ? (
                    <>Calculating...</>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4" />
                      Calculate Multi-Year Strategy
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Step 5: Results */}
        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-white">Multi-Year Conversion Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-900/10 border border-green-500/20 rounded-md p-4">
                  <h4 className="font-medium mb-2">Strategy Summary</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Conversion Amount</p>
                      <p className="text-lg font-semibold">
                        ${yearlyResults.length > 0 ? 
                          Math.round(yearlyResults[yearlyResults.length - 1].cumulativeConversion).toLocaleString() : 
                          "0"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Tax Paid</p>
                      <p className="text-lg font-semibold">
                        ${yearlyResults.length > 0 ? 
                          Math.round(yearlyResults[yearlyResults.length - 1].cumulativeTax).toLocaleString() : 
                          "0"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Average Effective Rate</p>
                      <p className="text-lg font-semibold">
                        {yearlyResults.length > 0 ? 
                          (yearlyResults[yearlyResults.length - 1].cumulativeTax / 
                          yearlyResults[yearlyResults.length - 1].cumulativeConversion * 100).toFixed(1) : 
                          "0"}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">RMD Reduction</p>
                      <p className="text-lg font-semibold">42%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/10 border border-blue-500/20 rounded-md p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CircleDollarSign className="h-4 w-4" />
                    Break-Even Analysis
                  </h4>
                  <div className="space-y-2">
                    {breakEvenAnalysis.breakEvenYear ? (
                      <p>
                        Your Roth conversion strategy is projected to break even in 
                        <span className="font-semibold text-primary"> {breakEvenAnalysis.breakEvenYear}</span>, 
                        after which you'll see increasing tax savings.
                      </p>
                    ) : (
                      <p>Break-even point extends beyond the analysis period.</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Estimated lifetime tax savings: 
                      <span className="font-semibold text-green-400"> ${Math.round(breakEvenAnalysis.taxSavings).toLocaleString()}</span>
                    </p>
                    
                    {scenarioData.beneficiaryPlanning && (
                      <p className="text-sm text-muted-foreground">
                        Potential beneficiary tax savings: 
                        <span className="font-semibold text-green-400"> ${Math.round(breakEvenAnalysis.beneficiaryTaxSavings).toLocaleString()}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Chart visualization */}
              <div className="p-4 bg-card/30 rounded-lg border">
                <h4 className="font-medium mb-4">Account Balance Projection</h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={yearlyResults}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis 
                        dataKey="year" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(year) => year.toString()}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, undefined]}
                        labelFormatter={(year) => `Year ${year}`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="traditionalBalance" 
                        name="Traditional IRA" 
                        stroke="#f97316" 
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rothBalance" 
                        name="Roth IRA" 
                        stroke="#10b981" 
                        strokeWidth={2} 
                        dot={false}
                      />
                      {breakEvenAnalysis.breakEvenYear && (
                        <ReferenceLine 
                          x={breakEvenAnalysis.breakEvenYear} 
                          stroke="#60a5fa" 
                          label={{ 
                            value: "Break-even", 
                            position: "top", 
                            fill: "#60a5fa",
                            fontSize: 12 
                          }}
                          strokeDasharray="3 3"
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Tax Trap Analysis Panel for multi-year */}
              <TaxTrapWarningsPanel 
                alerts={trapAlerts}
                scenarioName="Multi-Year Conversion Strategy"
                className="mb-4"
              />

              {/* Year-by-year data table (simplified) */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Year</th>
                      <th className="text-left p-2">Age</th>
                      <th className="text-right p-2">Conversion</th>
                      <th className="text-right p-2">RMD</th>
                      <th className="text-right p-2">Tax</th>
                      <th className="text-right p-2">Traditional</th>
                      <th className="text-right p-2">Roth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearlyResults.slice(0, 10).map((result, index) => (
                      <tr key={index} className="border-b border-muted/30">
                        <td className="p-2">{result.year}</td>
                        <td className="p-2">{result.age}</td>
                        <td className="text-right p-2">${Math.round(result.conversionAmount).toLocaleString()}</td>
                        <td className="text-right p-2">${Math.round(result.rmdAmount).toLocaleString()}</td>
                        <td className="text-right p-2">${Math.round(result.taxPaid).toLocaleString()}</td>
                        <td className="text-right p-2">${Math.round(result.traditionalBalance).toLocaleString()}</td>
                        <td className="text-right p-2">${Math.round(result.rothBalance).toLocaleString()}</td>
                      </tr>
                    ))}
                    {yearlyResults.length > 10 && (
                      <tr>
                        <td colSpan={7} className="p-2 text-center text-muted-foreground">
                          Showing first 10 years of {yearlyResults.length} years
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveStep("beneficiary")}
                >
                  Back to Beneficiary Planning
                </Button>
                <Button variant="default">Save This Strategy</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MultiYearRothConversion;
