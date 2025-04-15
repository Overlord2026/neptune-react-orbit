
import React from "react";
import { useEquityForm } from "../context/EquityFormContext";

export const EquityPlanningTable: React.FC = () => {
  const { formState } = useEquityForm();
  const currentYear = new Date().getFullYear();
  
  // Get values safely with defaults for potentially undefined fields
  const vestedShares = formState.vestedShares || 0;
  const fairMarketValue = formState.fairMarketValue || 0;
  const strikePrice = formState.strikePrice || 0;
  const partialShares = formState.partialShares || 0;
  const splitYears = formState.splitYears || 2;
  
  // Calculate simple data for display
  const calculateRows = () => {
    const rows = [];
    
    if (formState.exerciseStrategy === "full") {
      // Single exercise of all shares
      rows.push({
        year: currentYear,
        shares: vestedShares,
        value: vestedShares * fairMarketValue,
        cost: vestedShares * strikePrice,
        spread: vestedShares * (fairMarketValue - strikePrice)
      });
    } 
    else if (formState.exerciseStrategy === "partial") {
      // Partial exercise
      rows.push({
        year: currentYear,
        shares: partialShares,
        value: partialShares * fairMarketValue,
        cost: partialShares * strikePrice,
        spread: partialShares * (fairMarketValue - strikePrice)
      });
    }
    else if (formState.exerciseStrategy === "split") {
      // Split across multiple years
      const sharesPerYear = Math.floor(vestedShares / splitYears);
      let remainingShares = vestedShares;
      
      for (let i = 0; i < splitYears; i++) {
        const sharesToExercise = i === splitYears - 1 
          ? remainingShares // Last year gets any remainder
          : sharesPerYear;
          
        rows.push({
          year: currentYear + i,
          shares: sharesToExercise,
          value: sharesToExercise * fairMarketValue,
          cost: sharesToExercise * strikePrice,
          spread: sharesToExercise * (fairMarketValue - strikePrice)
        });
        
        remainingShares -= sharesPerYear;
      }
    }
    
    return rows;
  };
  
  const rows = calculateRows();
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-xs text-muted-foreground">
          <tr>
            <th className="py-2 px-2 text-left">Year</th>
            <th className="py-2 px-2 text-right">Shares</th>
            <th className="py-2 px-2 text-right">Market Value</th>
            <th className="py-2 px-2 text-right">Exercise Cost</th>
            <th className="py-2 px-2 text-right">Spread</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-[#20273B]" : ""}>
              <td className="py-2 px-2">{row.year}</td>
              <td className="py-2 px-2 text-right">{row.shares.toLocaleString()}</td>
              <td className="py-2 px-2 text-right">${row.value.toLocaleString()}</td>
              <td className="py-2 px-2 text-right">${row.cost.toLocaleString()}</td>
              <td className="py-2 px-2 text-right font-medium">
                ${row.spread.toLocaleString()}
              </td>
            </tr>
          ))}
          <tr className="font-medium text-white">
            <td className="py-3 px-2">Total</td>
            <td className="py-3 px-2 text-right">
              {rows.reduce((sum, row) => sum + row.shares, 0).toLocaleString()}
            </td>
            <td className="py-3 px-2 text-right">
              ${rows.reduce((sum, row) => sum + row.value, 0).toLocaleString()}
            </td>
            <td className="py-3 px-2 text-right">
              ${rows.reduce((sum, row) => sum + row.cost, 0).toLocaleString()}
            </td>
            <td className="py-3 px-2 text-right">
              ${rows.reduce((sum, row) => sum + row.spread, 0).toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
