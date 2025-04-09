
import React from 'react';

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

const TaxTrapChecker: React.FC<TaxTrapCheckerProps> = () => {
  return <div>Tax Trap Checker</div>;
};

// Export as default since that's the correct pattern being used
export default TaxTrapChecker;
