
import React, { useState } from 'react';
import TaxTrapInputForm from '@/components/tax/TaxTrapInputForm';
import TaxTrapAnalysis from '@/components/tax/TaxTrapAnalysis';

const TaxTrapContainer: React.FC = () => {
  const [filingStatus, setFilingStatus] = useState<'single' | 'married' | 'married_separate' | 'head_of_household'>('single');
  const [year, setYear] = useState(2023);
  const [agi, setAgi] = useState(85000);
  const [capitalGains, setCapitalGains] = useState(5000);
  const [socialSecurityAmount, setSocialSecurityAmount] = useState(0);
  const [isOnMedicare, setIsOnMedicare] = useState(false);
  const [hasACA, setHasACA] = useState(false);
  const [householdSize, setHouseholdSize] = useState(1);
  
  // Generated scenario ID for the tax trap checker
  const scenarioId = `user-scenario-${Math.random().toString(36).substring(2, 9)}`;
  
  // Derived values
  const magi = agi; // Simplified for demo purposes
  const totalIncome = agi + capitalGains;
  const taxableIncome = Math.max(0, agi - (filingStatus === 'single' ? 12950 : filingStatus === 'married' ? 25900 : 19400));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <TaxTrapInputForm 
          filingStatus={filingStatus}
          setFilingStatus={setFilingStatus}
          year={year}
          setYear={setYear}
          agi={agi}
          setAgi={setAgi}
          capitalGains={capitalGains}
          setCapitalGains={setCapitalGains}
          socialSecurityAmount={socialSecurityAmount}
          setSocialSecurityAmount={setSocialSecurityAmount}
          isOnMedicare={isOnMedicare}
          setIsOnMedicare={setIsOnMedicare}
          hasACA={hasACA}
          setHasACA={setHasACA}
          householdSize={householdSize}
          setHouseholdSize={setHouseholdSize}
        />
      </div>
      
      <div className="lg:col-span-2">
        <TaxTrapAnalysis
          scenarioId={scenarioId}
          scenarioData={{
            year,
            filing_status: filingStatus,
            agi,
            magi,
            total_income: totalIncome,
            taxable_income: taxableIncome,
            capital_gains_long: capitalGains,
            capital_gains_short: 0,
            social_security_amount: socialSecurityAmount,
            household_size: householdSize,
            medicare_enrollment: isOnMedicare,
            aca_enrollment: hasACA,
          }}
        />
      </div>
    </div>
  );
};

export default TaxTrapContainer;
