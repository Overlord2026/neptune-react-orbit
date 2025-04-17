import React from 'react';
import { TaxScenario } from '@/utils/tax';
import TaxScenarioComponent from '@/components/tax/TaxScenarioComponent';

const Scenario2021Return: React.FC = () => {
  // Define a tax scenario for the 2021 tax year
  const taxScenario2021: TaxScenario = {
    id: "scenario-2021",
    name: "2021 Tax Return",
    is_baseline: true,
    scenario_id: "scenario-2021",
    result: {
      scenario_name: "2021 Tax Return",
      year: 2021,
      filing_status: "single",
      total_income: 50000,
      agi: 50000,
      taxable_income: 37050,
      total_tax: 4176,
      ordinary_tax: 4176,
      capital_gains_tax: 0,
      marginal_rate: 0.22,
      marginal_capital_gains_rate: 0,
      effective_rate: 0.0835,
      federal_tax: 4176,
      state_tax: 0,
      updated_at: new Date().toISOString(),
      tax_data_updated_at: new Date().toISOString(),
      tax_data_is_current: true,
      brackets_breakdown: {
        ordinary: [
          { bracket: 10, amount: 9950, tax: 995 },
          { bracket: 12, amount: 27100, tax: 3252 },
          { bracket: 22, amount: 50000 - 9950 - 27100, tax: (50000 - 9950 - 27100) * 0.22 },
        ],
        capitalGains: [],
      },
      tax_data_version: "1.0",
    },
  };

  return (
    <div>
      <h1>2021 Tax Return Scenario</h1>
      <TaxScenarioComponent scenario={taxScenario2021} />
    </div>
  );
};

export default Scenario2021Return;
