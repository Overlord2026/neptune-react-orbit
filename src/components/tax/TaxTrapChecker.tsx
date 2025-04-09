
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

// Export as a named function for named imports
export function TaxTrapChecker({ scenarioId, scenarioData }: TaxTrapCheckerProps) {
  return <div>Tax Trap Checker</div>;
}

// Also export as default for existing imports in the codebase
export default TaxTrapChecker;
