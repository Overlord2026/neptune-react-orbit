
import React from 'react';
import { FilingStatusType } from '@/types/tax/filingTypes';
import TaxTrapAlerts from './TaxTrapAlerts';
import { TrapAlert } from '@/components/tax/TaxTrapAlerts';

interface ScenarioData {
  year: number;
  filing_status: FilingStatusType;
  agi: number;
  total_income: number;
  taxable_income: number;
  capital_gains_long: number;
  capital_gains_short: number;
  social_security_amount: number;
  household_size: number;
  medicare_enrollment: boolean;
  aca_enrollment: boolean;
}

interface TaxTrapAdapterProps {
  scenarioId: string;
  scenarioData: ScenarioData;
  className?: string;
}

export const TaxTrapAdapter: React.FC<TaxTrapAdapterProps> = ({ scenarioId, scenarioData, className }) => {
  // Sample traps based on scenario data
  const generateTraps = (): TrapAlert[] => {
    const traps: TrapAlert[] = [];
    
    // Check for IRMAA threshold for Medicare enrollees
    if (scenarioData.medicare_enrollment && scenarioData.agi > 97000) {
      traps.push({
        trapType: 'irmaa',
        severity: 'warning',
        message: 'IRMAA Medicare Surcharge Alert',
        details: 'Your income may trigger IRMAA surcharges on your Medicare premiums.'
      });
    }
    
    // Check for ACA subsidy cliff for ACA enrollees
    if (scenarioData.aca_enrollment && scenarioData.agi > 70000 && scenarioData.agi < 75000) {
      traps.push({
        trapType: 'aca',
        severity: 'critical', 
        message: 'ACA Premium Subsidy Cliff',
        details: 'You\'re approaching the income limit for ACA premium tax credits.'
      });
    }
    
    // Check for Social Security taxation thresholds
    if (scenarioData.social_security_amount > 0) {
      const combinedIncome = scenarioData.agi + scenarioData.social_security_amount * 0.5;
      
      if (combinedIncome > 44000 && scenarioData.filing_status === 'married_joint') {
        traps.push({
          trapType: 'social_security',
          severity: 'info',
          message: 'Social Security Taxation',
          details: '85% of your Social Security benefits may be taxable.'
        });
      }
    }
    
    // Check for capital gains bracket jumps
    if (scenarioData.capital_gains_long > 10000) {
      if ((scenarioData.filing_status === 'single' && scenarioData.agi > 445850) ||
          (scenarioData.filing_status === 'married_joint' && scenarioData.agi > 501600)) {
        traps.push({
          trapType: 'capital_gains',
          severity: 'warning',
          message: 'Capital Gains Rate Increase',
          details: 'Your long-term capital gains may be taxed at 20% instead of 15%.'
        });
      }
    }
    
    return traps;
  };
  
  const trapAlerts = generateTraps();
  
  return <TaxTrapAlerts alerts={trapAlerts} className={className} />;
};
