
import React from 'react';
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Calendar, User, CircleDollarSign, FileCheck2 } from "lucide-react";
import { MultiYearScenarioData, YearlyResult } from '../types/ScenarioTypes';
import FilingStatusComparison from './components/FilingStatusComparison';
import CommunityPropertyInfo from './components/CommunityPropertyInfo';
import RmdScheduleDisplay from './components/RmdScheduleDisplay';

// Format currency values
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

// Format percentage values
const formatPercent = (decimal: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(decimal);
};

interface SummaryStepProps {
  yearlyResults: YearlyResult[];
  scenarioData: MultiYearScenarioData;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ 
  yearlyResults, 
  scenarioData 
}) => {
  // Get initial and final results
  const initialResult = yearlyResults[0];
  const finalResult = yearlyResults[yearlyResults.length - 1];
  
  // Calculate key metrics
  const totalTaxPaid = finalResult.cumulativeTaxPaid;
  const totalTaxSaved = finalResult.cumulativeTaxSaved;
  const totalConversion = yearlyResults.reduce((sum, year) => sum + year.conversionAmount, 0);
  const totalRMDs = yearlyResults.reduce((sum, year) => sum + year.rmdAmount, 0);
  const initialTotalBalance = initialResult.traditionalIRABalance + initialResult.rothIRABalance;
  const finalTotalBalance = finalResult.traditionalIRABalance + finalResult.rothIRABalance;
  const growthRate = Math.pow((finalTotalBalance / initialTotalBalance), 1/scenarioData.numYears) - 1;
  
  // Find break-even point if any
  const breakEvenYear = yearlyResults.find(result => result.breakEvenYear);
  const hasBreakeven = !!breakEvenYear;
  
  // Find any tax trap warnings
  const hasTaxTraps = yearlyResults.some(result => result.warnings.length > 0);
  
  // Get beneficiary analysis if available
  const hasBeneficiaryAnalysis = scenarioData.includeBeneficiary && scenarioData.assumedDeathYear;
  
  // Add spouse information if included
  const showSpouseInfo = scenarioData.includeSpouse;
  
  // Calculate combined balances if spouse is included
  const initialSpouseBalance = initialResult.spouseTraditionalIRABalance || 0 + initialResult.spouseRothIRABalance || 0;
  const finalSpouseBalance = finalResult.spouseTraditionalIRABalance || 0 + finalResult.spouseRothIRABalance || 0;
  const totalInitialBalance = initialTotalBalance + initialSpouseBalance;
  const totalFinalBalance = finalTotalBalance + finalSpouseBalance;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Multi-Year Roth Conversion Summary</CardTitle>
          <CardDescription>
            {scenarioData.startYear} - {scenarioData.startYear + scenarioData.numYears - 1} ({scenarioData.numYears} years)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-lg">Strategy Performance</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Initial Balance</p>
                    <p className="text-lg font-medium">{formatCurrency(showSpouseInfo ? totalInitialBalance : initialTotalBalance)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Final Balance</p>
                    <p className="text-lg font-medium">{formatCurrency(showSpouseInfo ? totalFinalBalance : finalTotalBalance)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Annual Growth</p>
                    <p className="text-lg font-medium">{formatPercent(scenarioData.expectedAnnualReturn)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tax Savings</p>
                    <p className="text-lg font-medium">{formatCurrency(totalTaxSaved)}</p>
                  </div>
                </div>

                {hasBreakeven && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800/40">
                    <p className="text-sm">
                      <span className="font-medium">Break-Even Point:</span> Your Roth conversion strategy breaks even in {breakEvenYear.year} (Year {breakEvenYear.year - scenarioData.startYear + 1})
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-lg">Conversion & RMDs</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Converted</p>
                    <p className="text-lg font-medium">{formatCurrency(totalConversion)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total RMDs</p>
                    <p className="text-lg font-medium">{formatCurrency(totalRMDs)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tax Paid on Conversions</p>
                    <p className="text-lg font-medium">{formatCurrency(totalTaxPaid)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Conversion Strategy</p>
                    <p className="text-lg font-medium">
                      {scenarioData.conversionStrategy === 'fixed' ? 'Fixed Amount' : 
                        scenarioData.conversionStrategy === 'bracket_12' ? '12% Bracket' : '12% + 22% Brackets'}
                    </p>
                  </div>
                </div>
                
                {hasTaxTraps && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded border border-amber-200 dark:border-amber-800/40 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5" />
                    <p className="text-sm">
                      Tax traps detected at some point in the analysis. See the Tax Trap Analysis panel for details.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Filing Status Comparison - new component */}
          {scenarioData.compareMfjVsMfs && scenarioData.filingStatus === 'married' && (
            <FilingStatusComparison 
              yearlyResults={yearlyResults} 
              showMfsComparison={scenarioData.compareMfjVsMfs} 
            />
          )}

          {/* Community Property Info - new component */}
          <CommunityPropertyInfo 
            scenarioData={scenarioData} 
            yearlyResults={yearlyResults} 
          />

          {/* RMD Schedule - new component */}
          <RmdScheduleDisplay
            scenarioData={scenarioData}
            yearlyResults={yearlyResults}
          />
          
          {hasBeneficiaryAnalysis && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-500" />
                  <CardTitle className="text-lg">Beneficiary SECURE Act Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div>
                  <Badge variant="outline" className="mb-3">
                    Assumed Death Year: {scenarioData.assumedDeathYear}
                  </Badge>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-slate-50 dark:bg-slate-900/40">
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-sm">Traditional IRA Inheritance</CardTitle>
                      </CardHeader>
                      <CardContent className="py-3 px-4">
                        <p className="text-sm mb-2">
                          Your beneficiary would inherit approximately <span className="font-semibold">
                            {formatCurrency(yearlyResults.find(r => r.year === scenarioData.assumedDeathYear)?.traditionalIRABalance || 0)}
                          </span> in a Traditional IRA.
                        </p>
                        <p className="text-sm">
                          Under the SECURE Act, they would need to withdraw all funds within 10 years, potentially pushing them into higher tax brackets.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-slate-50 dark:bg-slate-900/40">
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-sm">Roth IRA Inheritance</CardTitle>
                      </CardHeader>
                      <CardContent className="py-3 px-4">
                        <p className="text-sm mb-2">
                          Your beneficiary would inherit approximately <span className="font-semibold">
                            {formatCurrency(yearlyResults.find(r => r.year === scenarioData.assumedDeathYear)?.rothIRABalance || 0)}
                          </span> in a Roth IRA.
                        </p>
                        <p className="text-sm">
                          While they must withdraw within 10 years, these withdrawals would be completely tax-free.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-4 bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800/40">
                    <p className="text-sm">
                      <span className="font-medium">Potential benefit to beneficiary:</span> By converting to Roth, you could save your beneficiary approximately {formatCurrency((yearlyResults.find(r => r.year === scenarioData.assumedDeathYear)?.traditionalIRABalance || 0) * (scenarioData.beneficiaryIncomeTaxRate || 0))} in taxes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-indigo-500" />
                <CardTitle className="text-lg">Final Account Projection</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Traditional IRA ({scenarioData.startYear + scenarioData.numYears - 1})</p>
                  <p className="text-lg font-medium">{formatCurrency(finalResult.traditionalIRABalance)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Roth IRA ({scenarioData.startYear + scenarioData.numYears - 1})</p>
                  <p className="text-lg font-medium">{formatCurrency(finalResult.rothIRABalance)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Balance</p>
                  <p className="text-lg font-medium">{formatCurrency(finalTotalBalance)}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="h-6 w-full rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <div className="h-full bg-green-500 dark:bg-green-600 transition-all" style={{ 
                    width: `${(finalResult.rothIRABalance / finalTotalBalance) * 100}%` 
                  }}></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>Traditional: {formatPercent(finalResult.traditionalIRABalance / finalTotalBalance)}</span>
                  <span>Roth: {formatPercent(finalResult.rothIRABalance / finalTotalBalance)}</span>
                </div>
              </div>
              
              {/* Spouse balances if included */}
              {showSpouseInfo && (
                <div className="mt-6 pt-4 border-t border-muted">
                  <h3 className="text-sm font-medium mb-3">Spouse Account Balances</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Traditional IRA</p>
                      <p className="text-lg font-medium">{formatCurrency(finalResult.spouseTraditionalIRABalance || 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Roth IRA</p>
                      <p className="text-lg font-medium">{formatCurrency(finalResult.spouseRothIRABalance || 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Balance</p>
                      <p className="text-lg font-medium">{formatCurrency((finalResult.spouseTraditionalIRABalance || 0) + (finalResult.spouseRothIRABalance || 0))}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CircleDollarSign className="h-4 w-4" />
            <p className="text-sm">Analysis is based on projected growth and current tax laws. Actual results may vary.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SummaryStep;
