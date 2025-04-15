
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/hooks/use-toast';
import { TaxTrapAdapter } from '@/components/tax/TaxTrapAdapter';
import RothConversionSlider from '@/components/tax/RothConversionSlider';
import { TaxInput, calculateTaxScenario, TaxResult } from '@/utils/taxCalculator';
import { Shield } from 'lucide-react';
import BracketSummary from '@/components/tax/BracketSummary';
import { Link } from 'react-router-dom';
import RealTimeBracketPreview from '@/components/tax/RealTimeBracketPreview';
import ShareFeature from '@/components/tax-planning/ShareFeature';
import { FilingStatusType } from '@/types/tax/filingTypes';

const INITIAL_TAX_INPUT: TaxInput = {
  year: 2025,
  wages: 120000,
  interest: 5000,
  dividends: 8000,
  capital_gains: 15000,
  ira_distributions: 0,
  roth_conversion: 0,
  social_security: 30000,
  isItemizedDeduction: false,
  itemizedDeductionAmount: 0,
  filing_status: 'married_joint',
};

const SCENARIO_ID = "2025-base-scenario";

const Scenario2025Return: React.FC = () => {
  const [taxInput, setTaxInput] = useState<TaxInput>(INITIAL_TAX_INPUT);
  const [taxResult, setTaxResult] = useState<TaxResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const result = calculateTaxScenario(taxInput, "2025 Return Scenario");
    setTaxResult(result);
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
        <p className="text-xs text-gray-400 mb-2">
          Tax rates and thresholds for 2025 are projected/estimated and may change once official IRS figures are released. For the most accurate information, consult the latest IRS publications.
        </p>
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
                  <span className="font-medium">
                    {taxInput.filing_status === 'married_joint' ? 'Married Filing Jointly' : 
                     taxInput.filing_status === 'single' ? 'Single' : 
                     taxInput.filing_status === 'head_of_household' ? 'Head of Household' : 'Married Filing Separately'}
                  </span>
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
                    <span className="font-medium">${taxResult.total_income?.toLocaleString()}</span>
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
          <TaxTrapAdapter 
            scenarioId={SCENARIO_ID} 
            scenarioData={{
              year: taxInput.year,
              filing_status: taxInput.filing_status,
              agi: taxResult.agi,
              total_income: taxResult.total_income || 0,
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

export default Scenario2025Return;
