
import React from 'react';
import TaxTrapWarnings from './TaxTrapWarnings';
import { checkTaxTraps, TaxTrapInput, TaxTrapResult } from '@/utils/taxTraps';
import { Card, CardContent } from '@/components/ui/card';

interface TaxTrapCheckerProps {
  scenarioId: string;
  scenarioData: {
    year: number;
    filing_status: 'single' | 'married' | 'married_separate' | 'head_of_household';
    agi: number;
    magi?: number;
    total_income: number;
    taxable_income: number;
    capital_gains_long: number;
    capital_gains_short: number;
    social_security_amount: number;
    household_size: number;
    medicare_enrollment: boolean;
    aca_enrollment: boolean;
    state_of_residence?: string;
  };
}

// Only use named export to be consistent with the imports
export function TaxTrapChecker({ scenarioId, scenarioData }: TaxTrapCheckerProps) {
  // Convert the component's props to the format expected by checkTaxTraps
  const trapInput: TaxTrapInput = {
    scenario_id: scenarioId,
    year: scenarioData.year,
    filing_status: scenarioData.filing_status as any,
    agi: scenarioData.agi,
    magi: scenarioData.magi,
    total_income: scenarioData.total_income,
    taxable_income: scenarioData.taxable_income,
    capital_gains_long: scenarioData.capital_gains_long,
    capital_gains_short: scenarioData.capital_gains_short,
    social_security_amount: scenarioData.social_security_amount,
    household_size: scenarioData.household_size,
    medicare_enrollment: scenarioData.medicare_enrollment,
    aca_enrollment: scenarioData.aca_enrollment,
    state_of_residence: scenarioData.state_of_residence
  };

  // Check for tax traps based on the scenario data
  const trapResults: TaxTrapResult = checkTaxTraps(trapInput);

  return (
    <div className="space-y-4">
      <TaxTrapWarnings warnings={trapResults.warnings} />
      
      {/* Display additional information based on specific trap types */}
      {trapResults.irmaa_data && (
        <Card className="bg-amber-50/30 dark:bg-amber-900/10">
          <CardContent className="pt-4">
            <h4 className="font-medium mb-2">Medicare IRMAA Impact</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Part B Monthly Surcharge:</span>
                <span className="font-medium">${trapResults.irmaa_data.partB_surcharge}</span>
              </div>
              <div className="flex justify-between">
                <span>Part D Monthly Surcharge:</span>
                <span className="font-medium">${trapResults.irmaa_data.partD_surcharge}</span>
              </div>
              <div className="flex justify-between">
                <span>Annual Impact:</span>
                <span className="font-medium">${trapResults.irmaa_data.annual_impact}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {trapResults.social_security_data && (
        <Card className="bg-amber-50/30 dark:bg-amber-900/10">
          <CardContent className="pt-4">
            <h4 className="font-medium mb-2">Social Security Taxation</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Taxable Percentage:</span>
                <span className="font-medium">{trapResults.social_security_data.taxable_percentage.toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Additional Tax:</span>
                <span className="font-medium">${trapResults.social_security_data.tax_increase}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
