
import React from 'react';
import { CharitableScenario } from '../types/CharitableTypes';

interface YearlyPlanTableProps {
  scenario: CharitableScenario;
}

const YearlyPlanTable: React.FC<YearlyPlanTableProps> = ({ scenario }) => {
  if (!scenario.multiYearPlan.isIntegrated) {
    return null;
  }

  return (
    <div className="bg-[#1A1F2C] p-4 rounded-md">
      <h5 className="font-medium text-white mb-2">5-Year Projection:</h5>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] text-sm">
          <thead>
            <tr className="text-muted-foreground border-b border-[#333]">
              <th className="text-left py-2 font-medium">Year</th>
              <th className="text-right py-2 font-medium">Contribution</th>
              <th className="text-right py-2 font-medium">Strategy</th>
              <th className="text-right py-2 font-medium">Tax Savings</th>
            </tr>
          </thead>
          <tbody>
            {scenario.multiYearPlan.years.map((year, index) => (
              <tr key={index} className="border-b border-[#333] last:border-0">
                <td className="py-3 text-white">{year.year}</td>
                <td className="py-3 text-right text-white">
                  ${year.contribution.toLocaleString()}
                </td>
                <td className="py-3 text-right">
                  {year.isItemizing ? (
                    <span className="text-[#00C47C]">Itemize</span>
                  ) : (
                    <span className="text-amber-500">Standard</span>
                  )}
                </td>
                <td className="py-3 text-right text-white">
                  ${year.taxSavings.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default YearlyPlanTable;
