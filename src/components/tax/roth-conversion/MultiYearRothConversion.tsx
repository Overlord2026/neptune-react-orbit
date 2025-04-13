import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calculator, ChevronRight, User, Clock, Users, DollarSign, ChartLine, BarChart4 } from "lucide-react";
import TaxTrapWarningsPanel from '../TaxTrapWarningsPanel';
import PartialBracketFillStep from './multiYear/PartialBracketFillStep';
import SpouseDetailsStep from './multiYear/SpouseDetailsStep';
import RMDCalculationStep from './multiYear/RMDCalculationStep';
import BeneficiaryStep from './multiYear/BeneficiaryStep';
import ResultsStep from './multiYear/ResultsStep';
import SummaryStep from './multiYear/SummaryStep';
import { calculateMultiYearScenario } from '@/utils/taxCalculator';
import { MultiYearScenarioData, YearlyResult } from './types/ScenarioTypes';
import TaxConsiderationWarning from './multiYear/common/TaxConsiderationWarning';
import { TrapAlert } from '@/components/tax/TaxTrapAlerts';

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
    taxInflationAdjustment: true,
    
    includeSpouse: true,
    spouseAge: 53,
    spouseTraditionalIRAStartBalance: 300000,
    spouseRothIRAStartBalance: 50000,
    spouseBaseAnnualIncome: 60000,
    spouseRmdStartAge: 73,
    
    combinedIRAApproach: true,
    
    isInCommunityPropertyState: false,
    splitCommunityIncome: false,
    
    compareMfjVsMfs: false,
    
    includeIrmaa: true
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
  
  // Convert warnings to the format expected by TaxTrapWarningsPanel
  const latestWarnings: TrapAlert[] = yearlyResults.length > 0 
    ? yearlyResults[yearlyResults.length - 1].warnings.map(warning => ({
        trapType: warning.trapType || warning.type,
        severity: warning.severity === 'high' ? 'critical' : 
                 warning.severity === 'medium' ? 'warning' : 'info',
        message: warning.message || warning.description // Use message or fallback to description
      }))
    : [];

  const handleUpdateScenarioData = (newData: Partial<MultiYearScenarioData>) => {
    setScenarioData(prev => ({
      ...prev,
      ...newData
    }));
  };
  
  return (
    <div className="space-y-6">
      <Tabs 
        value={currentStep} 
        onValueChange={setCurrentStep}
        className="w-full"
      >
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger 
            value="bracket-fill"
            className="flex items-center gap-2"
          >
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Bracket Fill</span>
            <span className="sm:hidden">1</span>
          </TabsTrigger>
          <TabsTrigger 
            value="spouse-details"
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Spouse Details</span>
            <span className="sm:hidden">2</span>
          </TabsTrigger>
          <TabsTrigger 
            value="rmd"
            className="flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">RMDs</span>
            <span className="sm:hidden">3</span>
          </TabsTrigger>
          <TabsTrigger 
            value="beneficiary"
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Beneficiary</span>
            <span className="sm:hidden">4</span>
          </TabsTrigger>
          <TabsTrigger 
            value="results"
            className="flex items-center gap-2"
            disabled={!hasCalculated}
          >
            <ChartLine className="h-4 w-4" />
            <span className="hidden sm:inline">Results</span>
            <span className="sm:hidden">5</span>
          </TabsTrigger>
          <TabsTrigger 
            value="summary"
            className="flex items-center gap-2"
            disabled={!hasCalculated}
          >
            <BarChart4 className="h-4 w-4" />
            <span className="hidden sm:inline">Summary</span>
            <span className="sm:hidden">6</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="bracket-fill" className="mt-0 space-y-4">
          <PartialBracketFillStep 
            scenarioData={scenarioData} 
            onUpdateScenarioData={handleUpdateScenarioData} 
          />
          <div className="flex justify-end mt-4">
            <Button 
              onClick={() => navigateToStep('spouse-details')}
              className="flex items-center gap-2"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="spouse-details" className="mt-0 space-y-4">
          <SpouseDetailsStep
            scenarioData={scenarioData}
            onUpdateScenarioData={handleUpdateScenarioData}
          />
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              onClick={() => navigateToStep('bracket-fill')}
            >
              Back
            </Button>
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
            onUpdateScenarioData={handleUpdateScenarioData} 
          />
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              onClick={() => navigateToStep('spouse-details')}
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
            onUpdateScenarioData={handleUpdateScenarioData} 
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
        <>
          <TaxConsiderationWarning />
          <TaxTrapWarningsPanel
            alerts={latestWarnings}
            scenarioName={`Multi-Year Roth Conversion (${scenarioData.startYear} - ${scenarioData.startYear + scenarioData.numYears - 1})`}
            className="mt-2"
          />
        </>
      )}
    </div>
  );
};

export default MultiYearRothConversion;
