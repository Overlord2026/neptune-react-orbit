
import React from 'react';
import { TaxReturnData } from '../../SimpleReturnFilingFlow';
import { TaxTrapAdapter } from '@/components/tax/TaxTrapAdapter';

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
  return (
    <div className="space-y-2">
      <h4 className="font-medium">Potential Tax Considerations</h4>
      <TaxTrapAdapter
        scenarioId="tax-filing-review"
        scenarioData={{
          year: 2023, // Using current tax year for filing
          filing_status: data.filingStatus as any,
          agi: calculatedAGI,
          total_income: calculatedAGI,
          taxable_income: calculatedTaxableIncome,
          capital_gains_long: data.investmentIncome || 0,
          capital_gains_short: 0,
          social_security_amount: data.socialSecurityBenefits || 0,
          household_size: data.dependents.length + 1,
          medicare_enrollment: data.isOver65 || false,
          aca_enrollment: data.hasHealthInsurance || false,
          state_of_residence: data.address?.state
        }}
        className="mb-4"
      />
    </div>
  );
};

export default TaxTrapSection;
