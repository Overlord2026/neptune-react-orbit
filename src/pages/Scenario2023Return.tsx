
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/hooks/use-toast';
import { TaxTrapChecker } from '@/components/tax/TaxTrapChecker';
import { TaxTrapWarning, checkTaxTraps, TaxTrapInput } from '@/utils/taxTrapChecker';
import RothConversionSlider from '@/components/tax/RothConversionSlider';
import { TaxInput, calculateTaxScenario, TaxResult } from '@/utils/taxCalculator';
import { Shield } from 'lucide-react';
import BracketSummary from '@/components/tax/BracketSummary';
import { Link } from 'react-router-dom';
import RealTimeBracketPreview from '@/components/tax/RealTimeBracketPreview';
import ShareFeature from '@/components/tax-planning/ShareFeature';

const INITIAL_TAX_INPUT: TaxInput = {
  year: 2025, // Updated from 2023 to 2025
  wages: 120000,
  interest: 5000,
  dividends: 8000,
  capital_gains: 15000,
  ira_distributions: 0,
  roth_conversion: 0,
  social_security: 30000,
  isItemizedDeduction: false,
  filing_status: 'married',
};

const SCENARIO_ID = "2025-base-scenario"; // Updated from 2023 to 2025

const Scenario2025Return: React.FC = () => {
  const [taxInput, setTaxInput] = useState<TaxInput>(INITIAL_TAX_INPUT);
  const [taxResult, setTaxResult] = useState<TaxResult | null>(null);
  const [thresholdWarnings, setThresholdWarnings] = useState<TaxTrapWarning[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const result = calculateTaxScenario(taxInput, "2025 Return Scenario"); // Updated scenario name
    setTaxResult(result);

    const trapInput: TaxTrapInput = {
      scenario_id: SCENARIO_ID,
      year: taxInput.year,
      filing_status: taxInput.filing_status,
      agi: result.agi,
      total_income: result.total_income,
      taxable_income: result.taxable_income,
      capital_gains_long: taxInput.capital_gains,
      capital_gains_short: 0,
      social_security_amount: taxInput.social_security,
      household_size: 2,
      medicare_enrollment: true,
      aca_enrollment: false
    };

    const trapResults = checkTaxTraps(trapInput);
    setThresholdWarnings(trapResults.warnings);
  }, [taxInput]);

  const handleRothConversionChange = (value: number) => {
    setTaxInput(prevInput => ({
      ...prevInput,
      roth_conversion: value
    }));
    
    if (value > 0 && value % 50000 === 0) {
      toast({
        title: "Tax Impact Updated",
        description: `Roth conversion of $${value.toLocaleString()} affects your tax situation`,
      });
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-6">2025 Tax Return Scenario</h1>
        <ShareFeature 
          title="2025 Tax Return Scenario" 
          description="My optimized 2025 tax return analysis with Roth conversion planning."
          variant="button"
        />
      </div>
      
      <div className="mb-8 relative">
        <ShareFeature title="Tax Bracket Analysis" position="top-right" />
        <RealTimeBracketPreview
          baseIncome={taxInput.wages + taxInput.interest + taxInput.dividends + taxInput.ira_distributions + 0.85 * taxInput.social_security} 
          year={taxInput.year} 
          filingStatus={taxInput.filing_status}
          capitalGains={taxInput.capital_gains}
          maxConversion={300000}
          onChange={handleRothConversionChange}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative">
          <ShareFeature title="Tax Inputs" position="top-right" />
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Tax Inputs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Filing Status:</span>
                  <span className="font-medium">{taxInput.filing_status === 'married' ? 'Married Filing Jointly' : 
                                              taxInput.filing_status === 'single' ? 'Single' : 'Head of Household'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Wages:</span>
                  <span className="font-medium">${taxInput.wages.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Interest:</span>
                  <span className="font-medium">${taxInput.interest.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Dividends:</span>
                  <span className="font-medium">${taxInput.dividends.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Capital Gains:</span>
                  <span className="font-medium">${taxInput.capital_gains.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Social Security:</span>
                  <span className="font-medium">${taxInput.social_security.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Roth Conversion:</span>
                  <span className="font-bold text-blue-600">${taxInput.roth_conversion.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {taxResult && (
          <div className="relative">
            <ShareFeature title="Tax Results" position="top-right" />
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Tax Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Income:</span>
                    <span className="font-medium">${taxResult.total_income.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Adjusted Gross Income:</span>
                    <span className="font-medium">${taxResult.agi.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Taxable Income:</span>
                    <span className="font-medium">${taxResult.taxable_income.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Tax:</span>
                    <span className="font-bold text-lg">${Math.round(taxResult.total_tax).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Marginal Tax Rate:</span>
                    <span className="font-medium">{(taxResult.marginal_rate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Effective Tax Rate:</span>
                    <span className="font-medium">{(taxResult.effective_rate * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {taxResult && (
        <div className="mt-6 relative">
          <ShareFeature title="Tax Bracket Summary" position="top-right" />
          <BracketSummary scenario={taxResult} />
        </div>
      )}

      <div className="mt-8 relative">
        <ShareFeature title="Tax Impact Analysis" position="top-right" />
        <h2 className="text-xl font-semibold mb-4">Tax Impact Analysis</h2>
        {taxResult && (
          <TaxTrapChecker 
            scenarioId={SCENARIO_ID} 
            scenarioData={{
              year: taxInput.year,
              filing_status: taxInput.filing_status,
              agi: result.agi,
              total_income: result.total_income,
              taxable_income: result.taxable_income,
              capital_gains_long: taxInput.capital_gains,
              capital_gains_short: 0,
              social_security_amount: taxInput.social_security,
              household_size: 2,
              medicare_enrollment: true,
              aca_enrollment: false
            }} 
          />
        )}
      </div>
    </div>
  );
};

export default Scenario2025Return;
