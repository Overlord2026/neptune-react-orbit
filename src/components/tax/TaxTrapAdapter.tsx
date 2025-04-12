
import React from 'react';
import { TaxTrapWarning, checkTaxTraps, TaxTrapInput } from '@/utils/taxTrapChecker';
import TaxTrapAlerts, { TrapAlert } from './TaxTrapAlerts';

interface TaxTrapAdapterProps {
  scenarioId: string;
  scenarioData: {
    year: number;
    filing_status: 'single' | 'married' | 'married_separate' | 'head_of_household';
    agi: number;
    magi?: number;
    total_income: number;
    taxable_income: number;
    capital_gains_long: number;
    capital_gains_short?: number;
    social_security_amount?: number;
    household_size?: number;
    medicare_enrollment?: boolean;
    aca_enrollment?: boolean;
    state_of_residence?: string;
  };
  className?: string;
}

export function TaxTrapAdapter({ scenarioId, scenarioData, className }: TaxTrapAdapterProps) {
  // Convert the scenarioData to the format expected by checkTaxTraps
  const trapInput: TaxTrapInput = {
    scenario_id: scenarioId,
    year: scenarioData.year,
    filing_status: scenarioData.filing_status,
    agi: scenarioData.agi,
    magi: scenarioData.magi,
    total_income: scenarioData.total_income,
    taxable_income: scenarioData.taxable_income,
    capital_gains_long: scenarioData.capital_gains_long,
    capital_gains_short: scenarioData.capital_gains_short || 0,
    social_security_amount: scenarioData.social_security_amount || 0,
    household_size: scenarioData.household_size || 2,
    medicare_enrollment: scenarioData.medicare_enrollment || false,
    aca_enrollment: scenarioData.aca_enrollment || false,
    state_of_residence: scenarioData.state_of_residence
  };

  // Check for tax traps based on the scenario data
  const trapResults = checkTaxTraps(trapInput);
  
  // Convert TaxTrapWarnings to TrapAlerts format
  const convertToTrapAlerts = (warnings: TaxTrapWarning[]): TrapAlert[] => {
    return warnings.map(warning => ({
      trapType: warning.type,
      // Map severity from TaxTrapWarning to TrapAlert format
      severity: warning.severity === 'alert' ? 'critical' : 
               warning.severity === 'warning' ? 'warning' : 'info',
      message: warning.title,
      details: warning.description
    }));
  };

  const trapAlerts = convertToTrapAlerts(trapResults.warnings);

  return (
    <div className={className}>
      {trapAlerts.length > 0 ? (
        <TaxTrapAlerts alerts={trapAlerts} />
      ) : (
        <div className="text-sm text-muted-foreground p-4 bg-slate-800/10 rounded-md border border-slate-700/30">
          No additional surcharges or bracket issues detected.
        </div>
      )}
    </div>
  );
}
