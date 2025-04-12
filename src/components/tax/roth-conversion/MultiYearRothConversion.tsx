
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calculator, Settings, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { TrapAlert } from "@/components/tax/TaxTrapAlerts";
import TaxTrapWarningsPanel from "@/components/tax/TaxTrapWarningsPanel";
import { checkTaxTraps, TaxTrapInput } from "@/utils/taxTrapChecker";

const MultiYearRothConversion = () => {
  const [activeStep, setActiveStep] = useState<string>("assumptions");
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [hasResults, setHasResults] = useState<boolean>(false);
  const [trapAlerts, setTrapAlerts] = useState<TrapAlert[]>([]);

  // Form state
  const [planningYears, setPlanningYears] = useState<number>(10);
  const [inflationRate, setInflationRate] = useState<number>(2.5);
  const [investmentReturn, setInvestmentReturn] = useState<number>(7);
  const [wageGrowth, setWageGrowth] = useState<number>(3);
  const [currentAge, setCurrentAge] = useState<number>(55);
  const [iraBalance, setIraBalance] = useState<number>(500000);
  const [income, setIncome] = useState<number>(100000);
  const [filingStatus, setFilingStatus] = useState<string>("single");
  const [bracketFillStrategy, setBracketFillStrategy] = useState<boolean>(true);
  const [bracketFillPercentage, setBracketFillPercentage] = useState<number>(75);
  const [includeRMD, setIncludeRMD] = useState<boolean>(true);
  const [beneficiaryPlanning, setBeneficiaryPlanning] = useState<boolean>(false);

  const handleCalculate = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      setHasResults(true);
      setIsCalculating(false);
      
      // Example logic to check tax traps for multiple years
      // This would be expanded with real multi-year projections
      const currentYear = new Date().getFullYear();
      const newAlerts: TrapAlert[] = [];
      
      // Check each year for potential traps
      for (let year = 0; year < 3; year++) {
        const trapInput: TaxTrapInput = {
          scenario_id: `roth-conversion-multi-${currentYear + year}`,
          year: currentYear + year,
          filing_status: filingStatus as any,
          agi: income * Math.pow(1 + wageGrowth / 100, year) + (year === 0 ? 50000 : year === 1 ? 75000 : 40000), // Example conversion amounts
          magi: income * Math.pow(1 + wageGrowth / 100, year) + (year === 0 ? 50000 : year === 1 ? 75000 : 40000),
          total_income: income * Math.pow(1 + wageGrowth / 100, year) + (year === 0 ? 50000 : year === 1 ? 75000 : 40000),
          taxable_income: (income * Math.pow(1 + wageGrowth / 100, year) + (year === 0 ? 50000 : year === 1 ? 75000 : 40000)) - 12950,
          capital_gains_long: 10000 * Math.pow(1 + inflationRate / 100, year),
          capital_gains_short: 0,
          social_security_amount: year > 5 ? 30000 : 0, // Example: SS starts in year 6
          household_size: 1,
          medicare_enrollment: currentAge + year >= 65,
          aca_enrollment: currentAge + year < 65
        };
        
        const trapResults = checkTaxTraps(trapInput);
        
        // Add year information to each warning
        trapResults.warnings.forEach(warning => {
          newAlerts.push({
            trapType: warning.type,
            severity: warning.severity === 'alert' ? 'critical' : 
                    warning.severity === 'warning' ? 'warning' : 'info',
            message: `Year ${currentYear + year}: ${warning.title}`,
            details: warning.description
          });
        });
      }
      
      setTrapAlerts(newAlerts);
      
      // Move to results tab
      setActiveStep("results");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-6">
          <TabsTrigger value="assumptions" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Global Assumptions</span>
            <span className="sm:hidden">Assumptions</span>
          </TabsTrigger>
          <TabsTrigger value="yearly-planning" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Year-by-Year Planning</span>
            <span className="sm:hidden">Planning</span>
          </TabsTrigger>
          <TabsTrigger value="rmd-planning" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">RMD & Retirement</span>
            <span className="sm:hidden">RMD</span>
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2" disabled={!hasResults}>
            <AlertCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis & Results</span>
            <span className="sm:hidden">Results</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assumptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-white">Step 1: Set Global Assumptions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="planningYears">Planning Horizon (Years)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="planningYears"
                      min={5}
                      max={30}
                      step={1}
                      value={[planningYears]}
                      onValueChange={(value) => setPlanningYears(value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{planningYears}</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="currentAge">Current Age</Label>
                  <Input
                    id="currentAge"
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="inflationRate"
                      min={0}
                      max={10}
                      step={0.1}
                      value={[inflationRate]}
                      onValueChange={(value) => setInflationRate(value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{inflationRate}%</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="investmentReturn">Expected Investment Return (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="investmentReturn"
                      min={0}
                      max={15}
                      step={0.1}
                      value={[investmentReturn]}
                      onValueChange={(value) => setInvestmentReturn(value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{investmentReturn}%</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="wageGrowth">Annual Income Growth (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="wageGrowth"
                      min={0}
                      max={10}
                      step={0.1}
                      value={[wageGrowth]}
                      onValueChange={(value) => setWageGrowth(value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{wageGrowth}%</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="filingStatus">Filing Status</Label>
                  <Select value={filingStatus} onValueChange={setFilingStatus}>
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
                  <Label htmlFor="income">Current Annual Income ($)</Label>
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
                  <Label htmlFor="iraBalance">Traditional IRA Balance ($)</Label>
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
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => setActiveStep("yearly-planning")} className="gap-2">
                  Continue to Year-by-Year Planning
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="yearly-planning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-white">Step 2: Year-by-Year Conversion Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="bracket-fill"
                  checked={bracketFillStrategy}
                  onCheckedChange={setBracketFillStrategy}
                />
                <Label htmlFor="bracket-fill">Use Bracket Fill Strategy</Label>
              </div>
              
              {bracketFillStrategy && (
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
                    Fill {bracketFillPercentage}% of the remaining space in your tax bracket each year
                  </p>
                </div>
              )}
              
              <Separator />
              
              <div className="text-center text-muted-foreground py-4">
                <p>In a full implementation, this would show a year-by-year table for manual entry</p>
                <p className="text-sm">Currently using the bracket fill strategy for all years</p>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveStep("assumptions")}
                >
                  Back to Assumptions
                </Button>
                <Button onClick={() => setActiveStep("rmd-planning")} className="gap-2">
                  Continue to RMD Planning
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rmd-planning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-white">Step 3: RMD & Secure Act Planning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-rmd"
                  checked={includeRMD}
                  onCheckedChange={setIncludeRMD}
                />
                <Label htmlFor="include-rmd">Include RMD Projections</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="beneficiary-planning"
                  checked={beneficiaryPlanning}
                  onCheckedChange={setBeneficiaryPlanning}
                />
                <Label htmlFor="beneficiary-planning">Include Beneficiary Planning (SECURE Act)</Label>
              </div>
              
              <Separator />
              
              {includeRMD && (
                <div className="bg-card/50 rounded-lg p-4 text-sm text-muted-foreground">
                  <p>
                    Based on your current age ({currentAge}) and IRA balance (${iraBalance.toLocaleString()}),
                    your first RMD will be at age 73 in {73 - currentAge} years.
                  </p>
                  <p className="mt-2">
                    Full implementation would show a projection of RMD amounts and tax impacts.
                  </p>
                </div>
              )}
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveStep("yearly-planning")}
                >
                  Back to Year Planning
                </Button>
                <Button onClick={handleCalculate} className="gap-2" disabled={isCalculating}>
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
        
        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-white">Multi-Year Conversion Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-900/10 border border-green-500/20 rounded-md p-4">
                <h4 className="font-medium mb-2">Strategy Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Conversion Amount</p>
                    <p className="text-lg font-semibold">$165,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Tax Paid</p>
                    <p className="text-lg font-semibold">$36,300</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Tax Rate</p>
                    <p className="text-lg font-semibold">22%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">RMD Reduction</p>
                    <p className="text-lg font-semibold">42%</p>
                  </div>
                </div>
              </div>
              
              {/* Tax Trap Analysis Panel for multi-year */}
              <TaxTrapWarningsPanel 
                alerts={trapAlerts}
                scenarioName="Multi-Year Conversion Strategy"
                className="mb-4"
              />

              <div className="text-center text-muted-foreground py-4">
                <p>In a full implementation, this would show charts and more detailed analysis</p>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveStep("rmd-planning")}
                  className="mr-2"
                >
                  Back to RMD Planning
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
