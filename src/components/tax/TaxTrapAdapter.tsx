
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaxTrapChecker } from '@/components/tax/TaxTrapChecker';
import { FilingStatusType } from '@/types/tax/filingTypes';

interface TaxTrapAdapterProps {
  scenarioId: string;
  scenarioData: {
    year: number;
    filing_status: FilingStatusType | 'single' | 'married' | 'married_separate' | 'head_of_household';
    agi: number;
    total_income: number;
    taxable_income: number;
    capital_gains_long: number;
    capital_gains_short?: number;
    social_security_amount: number;
    household_size: number;
    medicare_enrollment: boolean;
    aca_enrollment: boolean;
  };
  className?: string;
  autoCalculate?: boolean;
}

export const TaxTrapAdapter: React.FC<TaxTrapAdapterProps> = ({ 
  scenarioId, 
  scenarioData, 
  className,
  autoCalculate = true
}) => {
  const [shouldCalculate, setShouldCalculate] = useState(autoCalculate);
  
  // Convert the provided filing status to the expected format
  const convertFilingStatus = (status: FilingStatusType | string): 'single' | 'married' | 'married_separate' | 'head_of_household' => {
    if (status === 'married_joint') return 'married';
    return status as 'single' | 'married' | 'married_separate' | 'head_of_household';
  };
  
  // Only show results if we should calculate
  if (!shouldCalculate) {
    return null;
  }

  return (
    <Card className={`border-[#334155] bg-[#1a202c] shadow-md ${className}`}>
      <CardHeader className="border-b border-[#2d3748] bg-[#1e293b]">
        <CardTitle className="text-white text-lg font-semibold">Tax Threshold Results</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <TaxTrapChecker
          scenarioId={scenarioId}
          scenarioData={{
            year: scenarioData.year,
            filing_status: convertFilingStatus(scenarioData.filing_status),
            agi: scenarioData.agi,
            magi: scenarioData.agi, // Simplified for demo purposes
            total_income: scenarioData.total_income,
            taxable_income: scenarioData.taxable_income,
            capital_gains_long: scenarioData.capital_gains_long,
            capital_gains_short: scenarioData.capital_gains_short || 0,
            social_security_amount: scenarioData.social_security_amount,
            household_size: scenarioData.household_size,
            medicare_enrollment: scenarioData.medicare_enrollment,
            aca_enrollment: scenarioData.aca_enrollment
          }}
        />
      </CardContent>
    </Card>
  );
};
