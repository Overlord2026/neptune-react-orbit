
import React from 'react';
import { CharitableScenario } from '../types/CharitableTypes';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface YearlyPlanTableProps {
  scenario: CharitableScenario;
}

const YearlyPlanTable: React.FC<YearlyPlanTableProps> = ({ scenario }) => {
  if (!scenario.multiYearPlan.isIntegrated) {
    return null;
  }

  const [openRows, setOpenRows] = React.useState<Record<number, boolean>>({});

  const toggleRow = (index: number) => {
    setOpenRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Check if any years have additional notes
  const hasNotes = scenario.multiYearPlan.years.some(year => 
    (year as any).additionalNotes && (year as any).additionalNotes.length > 0
  );

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
              {hasNotes && <th className="text-right py-2 font-medium">Details</th>}
            </tr>
          </thead>
          <tbody>
            {scenario.multiYearPlan.years.map((year, index) => {
              const hasAdditionalNotes = (year as any).additionalNotes && (year as any).additionalNotes.length > 0;
              
              return (
                <React.Fragment key={index}>
                  <tr className={`border-b ${openRows[index] ? "" : "border-[#333]"} ${openRows[index] && !hasAdditionalNotes ? "border-0" : ""}`}>
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
                    {hasNotes && (
                      <td className="py-3 text-right">
                        {hasAdditionalNotes ? (
                          <button
                            onClick={() => toggleRow(index)}
                            className="text-primary hover:text-primary/80 flex items-center justify-end"
                          >
                            {openRows[index] ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </button>
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                    )}
                  </tr>
                  
                  {hasAdditionalNotes && (
                    <tr className={`border-b border-[#333] last:border-0 ${openRows[index] ? "" : "hidden"}`}>
                      <td colSpan={hasNotes ? 5 : 4} className="py-2 px-4 bg-[#181C28]">
                        <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                          {(year as any).additionalNotes.map((note: string, noteIndex: number) => (
                            <li key={noteIndex}>{note}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default YearlyPlanTable;
