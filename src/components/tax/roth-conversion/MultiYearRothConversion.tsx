
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { ArrowRightCircle, ArrowLeftCircle, CalendarClock, TrendingUp, ChartBar, Download, Check, Settings } from "lucide-react";
import InfoTooltip from '@/components/tax/InfoTooltip';
import { TaxTrapChecker } from '@/components/tax/TaxTrapChecker';
import { useToast } from "@/hooks/use-toast";

interface GlobalAssumptions {
  planningYears: number;
  inflationRate: number;
  investmentReturn: number;
  wageGrowthRate: number;
}

interface AnnualSettings {
  year: number;
  income: number;
  conversionAmount: number;
  autoFillBracket: boolean;
  bracketFillPercentage: number;
}

interface RMDSettings {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  includeSecureAct: boolean;
}

const STEPS = ["Global Assumptions", "Annual Conversion Plan", "RMD Scenario", "Results & Analysis"];

const MultiYearRothConversion = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Global assumptions state
  const [globalAssumptions, setGlobalAssumptions] = useState<GlobalAssumptions>({
    planningYears: 10,
    inflationRate: 2.5,
    investmentReturn: 6.0,
    wageGrowthRate: 2.0
  });
  
  // Annual settings state
  const [annualSettings, setAnnualSettings] = useState<AnnualSettings[]>(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: globalAssumptions.planningYears }, (_, index) => ({
      year: currentYear + index,
      income: 80000 * Math.pow(1 + globalAssumptions.wageGrowthRate / 100, index), // Grow income by wage growth rate
      conversionAmount: 15000,
      autoFillBracket: false,
      bracketFillPercentage: 75
    }));
  });
  
  // RMD settings state
  const [rmdSettings, setRmdSettings] = useState<RMDSettings>({
    currentAge: 55,
    retirementAge: 65,
    lifeExpectancy: 90,
    includeSecureAct: false
  });
  
  const handleNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleGlobalAssumptionsChange = (field: keyof GlobalAssumptions, value: number) => {
    setGlobalAssumptions(prev => ({
      ...prev,
      [field]: value
    }));
    
    // If changing the planning years, update the annual settings array
    if (field === 'planningYears' && value !== globalAssumptions.planningYears) {
      const currentYear = new Date().getFullYear();
      if (value > globalAssumptions.planningYears) {
        // Need to add more years
        const additionalYears = value - globalAssumptions.planningYears;
        const newYears = Array.from({ length: additionalYears }, (_, index) => {
          const yearIndex = globalAssumptions.planningYears + index;
          return {
            year: currentYear + yearIndex,
            income: 80000 * Math.pow(1 + globalAssumptions.wageGrowthRate / 100, yearIndex),
            conversionAmount: 15000,
            autoFillBracket: false,
            bracketFillPercentage: 75
          };
        });
        
        setAnnualSettings([...annualSettings, ...newYears]);
      } else {
        // Need to remove years
        setAnnualSettings(annualSettings.slice(0, value));
      }
    }
  };
  
  const handleAnnualSettingChange = (index: number, field: keyof AnnualSettings, value: any) => {
    setAnnualSettings(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };
  
  const handleRMDSettingChange = (field: keyof RMDSettings, value: any) => {
    setRmdSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const calculateResults = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      setIsCalculating(false);
      setHasCalculated(true);
      
      toast({
        title: "Calculation complete",
        description: "Multi-year Roth conversion analysis has been generated"
      });
    }, 2500);
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderGlobalAssumptionsStep();
      case 1:
        return renderAnnualConversionPlanStep();
      case 2:
        return renderRMDScenarioStep();
      case 3:
        return renderResultsStep();
      default:
        return null;
    }
  };
  
  const renderGlobalAssumptionsStep = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-white mb-4">Global Planning Assumptions</h3>
          <p className="text-sm text-muted-foreground mb-6">
            These assumptions will be applied across all years in your planning horizon.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="planningYears" className="flex items-center gap-1">
                  Planning Horizon (Years)
                  <InfoTooltip text="The number of years to plan for Roth conversions" />
                </Label>
                <span className="text-sm text-muted-foreground">{globalAssumptions.planningYears} years</span>
              </div>
              <Slider
                id="planningYears"
                min={5}
                max={30}
                step={1}
                value={[globalAssumptions.planningYears]}
                onValueChange={([value]) => handleGlobalAssumptionsChange('planningYears', value)}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5 years</span>
                <span>30 years</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="inflationRate" className="flex items-center gap-1">
                  Inflation Rate
                  <InfoTooltip text="Expected annual inflation rate for future calculations" />
                </Label>
                <span className="text-sm text-muted-foreground">{globalAssumptions.inflationRate}%</span>
              </div>
              <Slider
                id="inflationRate"
                min={0}
                max={10}
                step={0.5}
                value={[globalAssumptions.inflationRate]}
                onValueChange={([value]) => handleGlobalAssumptionsChange('inflationRate', value)}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>10%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="investmentReturn" className="flex items-center gap-1">
                  Investment Return Rate
                  <InfoTooltip text="Expected annual return on investments (pre-tax)" />
                </Label>
                <span className="text-sm text-muted-foreground">{globalAssumptions.investmentReturn}%</span>
              </div>
              <Slider
                id="investmentReturn"
                min={0}
                max={12}
                step={0.5}
                value={[globalAssumptions.investmentReturn]}
                onValueChange={([value]) => handleGlobalAssumptionsChange('investmentReturn', value)}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>12%</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="wageGrowthRate" className="flex items-center gap-1">
                  Wage Growth Rate
                  <InfoTooltip text="Expected annual income growth rate" />
                </Label>
                <span className="text-sm text-muted-foreground">{globalAssumptions.wageGrowthRate}%</span>
              </div>
              <Slider
                id="wageGrowthRate"
                min={0}
                max={10}
                step={0.5}
                value={[globalAssumptions.wageGrowthRate]}
                onValueChange={([value]) => handleGlobalAssumptionsChange('wageGrowthRate', value)}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>10%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
          <h4 className="text-amber-400 font-medium mb-2">Important Note</h4>
          <p className="text-sm text-muted-foreground">
            Future projections are estimates based on your provided assumptions. Actual results may vary due to changes in tax laws, 
            market performance, or personal circumstances. Consider consulting with a tax professional before implementing a 
            multi-year conversion strategy.
          </p>
        </div>
      </div>
    );
  };
  
  const renderAnnualConversionPlanStep = () => {
    // Show a subset of years with pagination for clarity
    const yearsPerPage = 5;
    const [currentYearPage, setCurrentYearPage] = useState(0);
    const displayedYears = annualSettings.slice(
      currentYearPage * yearsPerPage, 
      (currentYearPage + 1) * yearsPerPage
    );
    const totalPages = Math.ceil(annualSettings.length / yearsPerPage);
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-white mb-4">Annual Conversion Plan</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Set your planned conversion amount for each year or use automatic bracket filling strategies.
          </p>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="outline" 
            size="sm"
            disabled={currentYearPage === 0}
            onClick={() => setCurrentYearPage(prev => Math.max(0, prev - 1))}
          >
            <ArrowLeftCircle className="mr-2 h-4 w-4" />
            Previous Years
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentYearPage + 1} of {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            disabled={currentYearPage >= totalPages - 1}
            onClick={() => setCurrentYearPage(prev => Math.min(totalPages - 1, prev + 1))}
          >
            Next Years
            <ArrowRightCircle className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          {displayedYears.map((year, index) => {
            const actualIndex = currentYearPage * yearsPerPage + index;
            return (
              <Card key={year.year} className="border-primary/10">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-white flex items-center">
                      <CalendarClock className="mr-2 h-4 w-4 text-primary" />
                      Year {year.year}
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      Year {actualIndex + 1} of {annualSettings.length}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="flex items-center gap-1 mb-2">
                        Projected Income
                        <InfoTooltip text="Projected income for this year based on growth rate" />
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                        <Input
                          type="number"
                          className="pl-7"
                          value={Math.round(year.income)}
                          onChange={(e) => handleAnnualSettingChange(actualIndex, 'income', Number(e.target.value))}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Input 
                        type="checkbox" 
                        className="w-4 h-4" 
                        id={`autoFill-${year.year}`}
                        checked={year.autoFillBracket}
                        onChange={(e) => handleAnnualSettingChange(actualIndex, 'autoFillBracket', e.target.checked)}
                      />
                      <Label htmlFor={`autoFill-${year.year}`} className="flex items-center gap-1">
                        Use Bracket Fill Strategy
                        <InfoTooltip text="Automatically calculate optimal conversion amount based on tax bracket" />
                      </Label>
                    </div>
                    
                    {year.autoFillBracket ? (
                      <div className="md:col-span-2">
                        <div className="flex justify-between items-center">
                          <Label className="flex items-center gap-1">
                            Bracket Fill Percentage
                            <InfoTooltip text="Percentage of tax bracket to fill with conversion" />
                          </Label>
                          <span className="text-sm text-muted-foreground">{year.bracketFillPercentage}%</span>
                        </div>
                        <Slider
                          min={0}
                          max={100}
                          step={5}
                          value={[year.bracketFillPercentage]}
                          onValueChange={([value]) => handleAnnualSettingChange(actualIndex, 'bracketFillPercentage', value)}
                          className="py-4"
                        />
                      </div>
                    ) : (
                      <div>
                        <Label className="flex items-center gap-1 mb-2">
                          Conversion Amount
                          <InfoTooltip text="Amount to convert from Traditional to Roth IRA" />
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                          <Input
                            type="number"
                            className="pl-7"
                            value={year.conversionAmount}
                            onChange={(e) => handleAnnualSettingChange(actualIndex, 'conversionAmount', Number(e.target.value))}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };
  
  const renderRMDScenarioStep = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-white mb-4">RMD & Secure Act Scenario</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Configure your retirement and RMD planning assumptions to model long-term tax impacts.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentAge" className="flex items-center gap-1 mb-2">
                Current Age
                <InfoTooltip text="Your current age for retirement planning purposes" />
              </Label>
              <Input
                id="currentAge"
                type="number"
                value={rmdSettings.currentAge}
                onChange={(e) => handleRMDSettingChange('currentAge', Number(e.target.value))}
              />
            </div>
            
            <div>
              <Label htmlFor="retirementAge" className="flex items-center gap-1 mb-2">
                Expected Retirement Age
                <InfoTooltip text="Age at which you plan to retire" />
              </Label>
              <Input
                id="retirementAge"
                type="number"
                value={rmdSettings.retirementAge}
                onChange={(e) => handleRMDSettingChange('retirementAge', Number(e.target.value))}
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Input 
                type="checkbox" 
                className="w-4 h-4" 
                id="includeSecureAct"
                checked={rmdSettings.includeSecureAct}
                onChange={(e) => handleRMDSettingChange('includeSecureAct', e.target.checked)}
              />
              <Label htmlFor="includeSecureAct" className="flex items-center gap-1">
                Include Secure Act Inheritance Analysis
                <InfoTooltip text="Model the impact of the SECURE Act on inherited IRAs" />
              </Label>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="lifeExpectancy" className="flex items-center gap-1 mb-2">
                Life Expectancy
                <InfoTooltip text="Estimated age for end-of-life planning" />
              </Label>
              <Input
                id="lifeExpectancy"
                type="number"
                value={rmdSettings.lifeExpectancy}
                onChange={(e) => handleRMDSettingChange('lifeExpectancy', Number(e.target.value))}
              />
            </div>
            
            {rmdSettings.includeSecureAct && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
                <h4 className="text-primary font-medium mb-2">Secure Act Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Including SECURE Act analysis will model the impact of the 10-year distribution rule for non-spouse 
                  beneficiaries of your retirement accounts. This helps with estate planning and tax optimization 
                  for your heirs.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2 flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            RMD Information
          </h4>
          <p className="text-sm text-muted-foreground">
            Required Minimum Distributions (RMDs) begin at age 73 (or 75 for those born after 1960) under current tax law. 
            Converting Traditional IRA funds to Roth before RMDs begin can significantly reduce your future tax liability.
          </p>
        </div>
      </div>
    );
  };
  
  const renderResultsStep = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-white mb-4">Results & Analysis</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Review the projected outcomes of your multi-year Roth conversion strategy.
          </p>
        </div>
        
        {!hasCalculated ? (
          <div className="text-center p-8">
            <Button 
              onClick={calculateResults}
              size="lg"
              className="mb-4"
              disabled={isCalculating}
            >
              {isCalculating ? (
                <>Calculating...</>
              ) : (
                <>
                  <ChartBar className="mr-2 h-5 w-5" />
                  Generate Analysis
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
              Click to generate your multi-year Roth conversion analysis
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="border-green-500/20 bg-green-900/10">
              <CardContent className="pt-4">
                <h4 className="font-medium text-green-400 mb-4">Conversion Strategy Summary</h4>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Conversion Amount</p>
                    <p className="text-xl font-semibold">$235,000</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Total Tax Cost</p>
                    <p className="text-xl font-semibold">$52,800</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Average Tax Rate</p>
                    <p className="text-xl font-semibold">22.5%</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Projected Tax Savings</p>
                    <p className="text-xl font-semibold text-green-400">$78,200</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Report
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <h4 className="font-medium text-white">Year-by-Year Breakdown</h4>
            
            <div className="h-64 bg-slate-800/50 rounded-lg flex justify-center items-center mb-4">
              <p className="text-slate-400 italic">
                [Chart visualization would appear here showing yearly conversion impact]
              </p>
            </div>
            
            <h4 className="font-medium text-white">Long-term RMD Impact</h4>
            
            <div className="h-64 bg-slate-800/50 rounded-lg flex justify-center items-center mb-4">
              <p className="text-slate-400 italic">
                [Chart visualization would appear here showing RMD reduction over time]
              </p>
            </div>
            
            <h4 className="font-medium text-white">Tax Trap Analysis (First 5 Years)</h4>
            
            <TaxTrapChecker
              scenarioId="roth-conversion-multi-year-1"
              scenarioData={{
                year: new Date().getFullYear(),
                filing_status: "single",
                agi: annualSettings[0].income + annualSettings[0].conversionAmount,
                magi: annualSettings[0].income + annualSettings[0].conversionAmount,
                total_income: annualSettings[0].income + annualSettings[0].conversionAmount,
                taxable_income: annualSettings[0].income + annualSettings[0].conversionAmount - 12950,
                capital_gains_long: 0,
                capital_gains_short: 0,
                social_security_amount: 0,
                household_size: 1,
                medicare_enrollment: false,
                aca_enrollment: false
              }}
              className="mb-4"
            />
            
            <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
              <h4 className="text-amber-400 font-medium mb-2">Key Observations</h4>
              <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                <li>Your conversion strategy stays below IRMAA thresholds in most years</li>
                <li>Converting early provides estimated 30+ years of tax-free growth</li>
                <li>Your projected RMDs decrease by over 40% at age 73</li>
                <li>Consider splitting Year 3 conversion to avoid capital gains bracket jump</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            {STEPS.map((step, index) => (
              <React.Fragment key={step}>
                {index > 0 && <span className="h-px w-4 bg-muted" />}
                <div 
                  className={`flex items-center justify-center rounded-full w-8 h-8 text-xs font-medium ${
                    currentStep === index 
                      ? "bg-primary text-primary-foreground" 
                      : (currentStep > index ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")
                  }`}
                >
                  {currentStep > index ? <Check className="h-4 w-4" /> : index + 1}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        <span className="text-sm text-muted-foreground">Step {currentStep + 1} of {STEPS.length}</span>
      </div>
      
      <div>
        <h3 className="text-lg font-medium">
          {STEPS[currentStep]}
        </h3>
        <p className="text-sm text-muted-foreground">
          {currentStep === 0 && "Set global parameters for your multi-year analysis"}
          {currentStep === 1 && "Plan your year-by-year conversion strategy"}
          {currentStep === 2 && "Configure retirement and RMD parameters"}
          {currentStep === 3 && "Review projections and analysis"}
        </p>
      </div>
      
      <Separator className="my-4" />
      
      <div className="min-h-[400px]">
        {renderStepContent()}
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePreviousStep}
          disabled={currentStep === 0}
        >
          <ArrowLeftCircle className="mr-2 h-4 w-4" />
          Previous Step
        </Button>
        
        <Button
          onClick={currentStep < STEPS.length - 1 ? handleNextStep : calculateResults}
          disabled={isCalculating || (currentStep === STEPS.length - 1 && hasCalculated)}
        >
          {currentStep < STEPS.length - 1 ? (
            <>
              Next Step
              <ArrowRightCircle className="ml-2 h-4 w-4" />
            </>
          ) : isCalculating ? (
            <>Calculating...</>
          ) : hasCalculated ? (
            <>Analysis Complete</>
          ) : (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              Generate Analysis
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MultiYearRothConversion;
