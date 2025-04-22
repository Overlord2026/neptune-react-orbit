
import React from "react";

interface TaxSummaryBarProps {
  totalTax: number;
  income: number;
}

const TaxSummaryBar: React.FC<TaxSummaryBarProps> = ({ totalTax, income }) => {
  // Calculate percentage for tax bar
  const pct = income ? Math.min(100, Math.round((totalTax / income) * 100)) : 0;

  return (
    <div className="w-full my-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">Total Tax</span>
        <span className="text-xs">{pct}%</span>
      </div>
      <div className="h-4 bg-slate-200 rounded overflow-hidden dark:bg-slate-800">
        <div
          className="h-4 bg-[#9b87f5] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs mt-1 text-muted-foreground">
        <span>${totalTax.toLocaleString()}</span>
        <span>Income: ${income.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default TaxSummaryBar;
