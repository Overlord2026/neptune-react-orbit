
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/hooks/use-toast';
import { TaxTrapChecker } from '@/components/tax/TaxTrapChecker';
import { TaxTrapWarning, checkTaxTraps, TaxTrapInput } from '@/utils/taxTrapChecker';
import RothConversionSlider from '@/components/tax/RothConversionSlider';
import { TaxInput, calculateTaxScenario, TaxResult } from '@/utils/taxCalculator';

const INITIAL_TAX_INPUT: TaxInput = {
  year: 2023,
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

const SCENARIO_ID = "2023-base-scenario";

const Scenario2023Return: React.FC = () => {
  const [taxInput, setTaxInput] = useState<TaxInput>(INITIAL_TAX_INPUT);
  const [taxResult, setTaxResult] = useState<TaxResult | null>(null);
  const [thresholdWarnings, setThresholdWarnings] = useState<TaxTrapWarning[]>([]);
  const { toast } = useToast();

  // Calculate tax and check for traps whenever tax input changes
  useEffect(() => {
    // Calculate tax scenario with current inputs
    const result = calculateTaxScenario(taxInput, "2023 Return Scenario");
    setTaxResult(result);

    // Check for tax traps
    const trapInput: TaxTrapInput = {
      scenario_id: SCENARIO_ID,
      year: taxInput.year,
      filing_status: taxInput.filing_status,
      agi: result.agi,
      total_income: result.total_income,
      taxable_income: result.taxable_income,
      capital_gains_long: taxInput.capital_gains, // Assuming all capital gains are long-term
      capital_gains_short: 0,
      social_security_amount: taxInput.social_security,
      household_size: 2, // Default for this demo
      medicare_enrollment: true, // Assuming Medicare enrolled for this demo
      aca_enrollment: false
    };

    const trapResults = checkTaxTraps(trapInput);
    setThresholdWarnings(trapResults.warnings);
  }, [taxInput]);

  // Handle Roth conversion slider change
  const handleRothConversionChange = (value: number) => {
    setTaxInput(prevInput => ({
      ...prevInput,
      roth_conversion: value
    }));
    
    // Notify with toast when significant changes occur
    if (value > 0 && value % 50000 === 0) {
      toast({
        title: "Tax Impact Updated",
        description: `Roth conversion of $${value.toLocaleString()} affects your tax situation`,
      });
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">2023 Tax Return Scenario</h1>
      
      <div className="mb-8">
        <RothConversionSlider
          initialValue={taxInput.roth_conversion}
          maxValue={300000}
          onValueChange={handleRothConversionChange}
          thresholdWarnings={thresholdWarnings}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Tax Input Summary Card */}
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

        {/* Tax Results Card */}
        {taxResult && (
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
        )}
      </div>

      {/* Tax Trap Checker */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Tax Impact Analysis</h2>
        {taxResult && (
          <TaxTrapChecker 
            scenarioId={SCENARIO_ID} 
            scenarioData={{
              year: taxInput.year,
              filing_status: taxInput.filing_status,
              agi: taxResult.agi,
              total_income: taxResult.total_income,
              taxable_income: taxResult.taxable_income,
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

export default Scenario2023Return;
