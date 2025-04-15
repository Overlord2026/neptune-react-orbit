
import React from 'react';
import { TaxReturnData } from '../../types/TaxReturnTypes';
import { TaxTrapAdapter } from '@/components/tax/TaxTrapAdapter';
import { Card } from '@/components/ui/card';
import { FilingStatusType } from '@/types/tax/filingTypes';

interface TaxTrapSectionProps {
  data: TaxReturnData;
  calculatedAGI: number;
  calculatedTaxableIncome: number;
}

const TaxTrapSection: React.FC<TaxTrapSectionProps> = ({ 
  data, 
  calculatedAGI, 
  calculatedTaxableIncome 
}) => {
  // Convert legacy filing status to the standardized format if needed
  const convertFilingStatus = (status: string): FilingStatusType => {
    if (status === 'married') return 'married_joint';
    return status as FilingStatusType;
  };

  return (
    <div className="space-y-2">
      <h4 className="font-medium">Potential Tax Considerations</h4>
      <Card className="p-4">
        <TaxTrapAdapter
          scenarioId="tax-filing-review"
          scenarioData={{
            year: 2023, // Using current tax year for filing
            filing_status: convertFilingStatus(data.filingStatus),
            agi: calculatedAGI,
            total_income: calculatedAGI,
            taxable_income: calculatedTaxableIncome,
            capital_gains_long: data.investmentIncome || 0,
            capital_gains_short: 0,
            social_security_amount: data.socialSecurityBenefits || 0,
            household_size: data.dependents.length + 1,
            medicare_enrollment: data.isOver65 || false,
            aca_enrollment: data.hasHealthInsurance || false
          }}
          className="mb-4"
        />
      </Card>
    </div>
  );
};

export default TaxTrapSection;
