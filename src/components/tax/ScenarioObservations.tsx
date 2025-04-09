
import React from 'react';
import { TaxResult } from '@/utils/taxCalculator';

interface ScenarioObservationsProps {
  scenarios: TaxResult[];
}

const ScenarioObservations: React.FC<ScenarioObservationsProps> = ({ scenarios }) => {
  const generateObservations = () => {
    if (scenarios.length < 3) return "Not enough scenario data for comparison.";

    const [scenario2021, scenario2022, scenario2023] = scenarios;
    
    const taxDiff2021To2022 = scenario2022.total_tax - scenario2021.total_tax;
    const taxDiffPercent2021To2022 = (taxDiff2021To2022 / scenario2021.total_tax * 100).toFixed(1);
    
    const taxDiff2022To2023 = scenario2023.total_tax - scenario2022.total_tax;
    const taxDiffPercent2022To2023 = (taxDiff2022To2023 / scenario2022.total_tax * 100).toFixed(1);
    
    const effectiveRateDiff2021To2023 = 
      ((scenario2023.effective_rate - scenario2021.effective_rate) * 100).toFixed(1);
      
    const observations = [
      `From 2021 to 2022, your total tax increased by $${taxDiff2021To2022.toLocaleString()} (${taxDiffPercent2021To2022}%).`,
      `With the 2023 Roth conversion scenario, your total tax increases by $${taxDiff2022To2023.toLocaleString()} (${taxDiffPercent2022To2023}%) compared to 2022.`,
      `Your effective tax rate in the 2023 Roth conversion scenario is ${effectiveRateDiff2021To2023}% higher than in 2021.`,
    ];

    // Additional observation if Roth conversion is significant
    if (taxDiff2022To2023 > 5000) {
      observations.push(`The Roth conversion has a significant tax impact. Consider spreading the conversion across multiple years.`);
    }
    
    // Safe harbor mention
    observations.push(`Remember: To avoid underpayment penalties, ensure you've met safe harbor requirements by paying at least 100% of last year's tax liability through withholding or estimated payments.`);

    return observations;
  };

  const observations = generateObservations();

  return (
    <ul className="space-y-2 text-sm">
      {Array.isArray(observations) ? (
        observations.map((observation, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2 mt-0.5 text-[#FFD700]">•</span>
            <span>{observation}</span>
          </li>
        ))
      ) : (
        <li>{observations}</li>
      )}
    </ul>
  );
};

export default ScenarioObservations;
