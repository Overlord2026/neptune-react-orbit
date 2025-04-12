
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TaxTrapChecker } from '@/components/tax/TaxTrapChecker';
import { Separator } from '@/components/ui/separator';
import TaxTrapInfoBox from '@/components/tax/TaxTrapInfoBox';

interface TaxTrapAnalysisProps {
  scenarioId: string;
  scenarioData: {
    year: number;
    filing_status: 'single' | 'married' | 'married_separate' | 'head_of_household';
    agi: number;
    magi: number;
    total_income: number;
    taxable_income: number;
    capital_gains_long: number;
    capital_gains_short: number;
    social_security_amount: number;
    household_size: number;
    medicare_enrollment: boolean;
    aca_enrollment: boolean;
  };
}

const TaxTrapAnalysis: React.FC<TaxTrapAnalysisProps> = ({ scenarioId, scenarioData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <span>Tax Trap Analysis</span>
        </CardTitle>
        <CardDescription>
          Review potential tax surcharges and threshold issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TaxTrapChecker 
          scenarioId={scenarioId}
          scenarioData={scenarioData}
        />
        
        <Separator className="my-6" />
        
        <TaxTrapInfoBox icon="info" />
      </CardContent>
    </Card>
  );
};

export default TaxTrapAnalysis;
