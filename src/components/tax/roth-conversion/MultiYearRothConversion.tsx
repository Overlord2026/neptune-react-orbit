import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calculator, ChevronRight, User, Clock, DollarSign, ChartLine, BarChart4 } from "lucide-react";
import TaxTrapWarningsPanel from '../TaxTrapWarningsPanel';
import { TrapAlert } from '../TaxTrapAlerts';
import PartialBracketFillStep from './multiYear/PartialBracketFillStep';
import RMDCalculationStep from './multiYear/RMDCalculationStep';
import BeneficiaryStep from './multiYear/BeneficiaryStep';
import ResultsStep from './multiYear/ResultsStep';
import SummaryStep from './multiYear/SummaryStep';
import { calculateMultiYearScenario } from '@/utils/taxCalculator';

export interface MultiYearScenarioData {
  startAge: number;
  startYear: number;
  numYears: number;
  filingStatus: 'single' | 'married' | 'head_of_household';
  
  traditionalIRAStartBalance: number;
  rothIRAStartBalance: number;
  expectedAnnualReturn: number;
  
  baseAnnualIncome: number;
  incomeGrowthRate: number;
  
  conversionStrategy: 'fixed' | 'bracket_12' | 'bracket_12_22';
  fixedConversionAmount?: number;
  
  includeRMDs: boolean;
  rmdStartAge: number;
  
  includeBeneficiary: boolean;
  assumedDeathYear?: number;
  beneficiaryAge: number;
  beneficiaryIncomeTaxRate: number;
  
  taxInflationAdjustment: boolean;
}

export interface YearlyResult {
  year: number;
  age: number;
  traditionalIRABalance: number;
  rothIRABalance: number;
  conversionAmount: number;
  rmdAmount: number;
  totalTax: number;
  marginalRate: number;
  warnings: TrapAlert[];
  cumulativeTaxPaid: number;
  cumulativeTaxSaved: number;
  traditionalScenarioBalance: number;
  rothScenarioBalance: number;
  breakEvenYear: boolean;
}

const MultiYearRothConversion: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<string>("bracket-fill");
  const [scenarioData, setScenarioData] = useState<MultiYearScenarioData>({
    startAge: 55,
    startYear: new Date().getFullYear(),
    numYears: 30,
    filingStatus: 'married',
    traditionalIRAStartBalance: 500000,
    rothIRAStartBalance: 100000,
    expectedAnnualReturn: 0.06,
    baseAnnualIncome: 80000,
    incomeGrowthRate: 0.02,
    conversionStrategy: 'bracket_12',
    includeRMDs: true,
    rmdStartAge: 73,
    includeBeneficiary: false,
    beneficiaryAge: 50,
    beneficiaryIncomeTaxRate: 0.24,
    taxInflationAdjustment: true
  });
  
  const [yearlyResults, setYearlyResults] = useState<YearlyResult[]>([]);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  
  useEffect(() => {
    if (hasCalculated) {
      runCalculation();
    }
  }, [scenarioData, hasCalculated]);
  
  const runCalculation = async () => {
    setIsCalculating(true);
    
    try {
      const results = await calculateMultiYearScenario(scenarioData);
      setYearlyResults(results);
    } catch (error) {
      console.error("Error calculating multi-year scenario:", error);
    } finally {
      setIsCalculating(false);
    }
  };
  
  const navigateToStep = (step: string) => {
    setCurrentStep(step);
  };
  
  const handleCalculate = () => {
    setHasCalculated(true);
    runCalculation();
    navigateToStep('results');
  };
  
  const latestWarnings = yearlyResults.length > 0 
    ? yearlyResults[yearlyResults.length - 1].warnings 
    : [];
  
  return (
    <div className="space-y-6">
      <Tabs 
        value={currentStep} 
        onValueChange={setCurrentStep}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger 
            value="bracket-fill"
            className="flex items-center gap-2"
          >
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Bracket Fill</span>
            <span className="sm:hidden">1</span>
          </TabsTrigger>
          <TabsTrigger 
            value="rmd"
            className="flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">RMDs</span>
            <span className="sm:hidden">2</span>
          </TabsTrigger>
          <TabsTrigger 
            value="beneficiary"
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Beneficiary</span>
            <span className="sm:hidden">3</span>
          </TabsTrigger>
          <TabsTrigger 
            value="results"
            className="flex items-center gap-2"
            disabled={!hasCalculated}
          >
            <ChartLine className="h-4 w-4" />
            <span className="hidden sm:inline">Results</span>
            <span className="sm:hidden">4</span>
          </TabsTrigger>
          <TabsTrigger 
            value="summary"
            className="flex items-center gap-2"
            disabled={!hasCalculated}
          >
            <BarChart4 className="h-4 w-4" />
            <span className="hidden sm:inline">Summary</span>
            <span className="sm:hidden">5</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="bracket-fill" className="mt-0 space-y-4">
          <PartialBracketFillStep 
            scenarioData={scenarioData} 
            onUpdateScenarioData={setScenarioData} 
          />
          <div className="flex justify-end mt-4">
            <Button 
              onClick={() => navigateToStep('rmd')}
              className="flex items-center gap-2"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="rmd" className="mt-0 space-y-4">
          <RMDCalculationStep 
            scenarioData={scenarioData} 
            onUpdateScenarioData={setScenarioData} 
          />
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              onClick={() => navigateToStep('bracket-fill')}
            >
              Back
            </Button>
            <Button 
              onClick={() => navigateToStep('beneficiary')}
              className="flex items-center gap-2"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="beneficiary" className="mt-0 space-y-4">
          <BeneficiaryStep 
            scenarioData={scenarioData} 
            onUpdateScenarioData={setScenarioData} 
          />
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              onClick={() => navigateToStep('rmd')}
            >
              Back
            </Button>
            <Button 
              onClick={handleCalculate}
              className="flex items-center gap-2"
              disabled={isCalculating}
            >
              {isCalculating ? "Calculating..." : "Calculate Results"}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="results" className="mt-0 space-y-4">
          <ResultsStep 
            yearlyResults={yearlyResults}
            scenarioData={scenarioData}
            isCalculating={isCalculating}
          />
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              onClick={() => navigateToStep('beneficiary')}
            >
              Back
            </Button>
            <Button 
              onClick={() => navigateToStep('summary')}
              className="flex items-center gap-2"
            >
              View Summary <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="summary" className="mt-0 space-y-4">
          <SummaryStep 
            yearlyResults={yearlyResults}
            scenarioData={scenarioData}
          />
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              onClick={() => navigateToStep('results')}
            >
              Back
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setScenarioData({
                  ...scenarioData,
                });
                navigateToStep('bracket-fill');
              }}
            >
              Start New Scenario
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      {hasCalculated && yearlyResults.length > 0 && (
        <TaxTrapWarningsPanel
          alerts={latestWarnings}
          scenarioName={`Multi-Year Roth Conversion (${scenarioData.startYear} - ${scenarioData.startYear + scenarioData.numYears - 1})`}
          className="mt-6"
        />
      )}
    </div>
  );
};

export default MultiYearRothConversion;
