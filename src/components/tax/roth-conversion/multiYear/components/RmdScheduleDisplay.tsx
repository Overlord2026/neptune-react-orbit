
import React from 'react';
import { YearlyResult } from '@/types/tax/rothConversionTypes';
import { formatCurrency } from '@/utils/formatUtils';

interface RmdScheduleDisplayProps {
  results: YearlyResult[];
  includeSpouse: boolean;
}

const RmdScheduleDisplay: React.FC<RmdScheduleDisplayProps> = ({ results, includeSpouse }) => {
  // Filter only years with RMDs
  const rmdYears = results.filter(result => 
    (result.rmdAmount && result.rmdAmount > 0) || 
    (includeSpouse && result.spouseRmdAmount && result.spouseRmdAmount > 0)
  );

  if (rmdYears.length === 0) {
    return <p className="text-muted-foreground">No RMDs in this scenario.</p>;
  }

  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Year</th>
            <th className="text-left p-2">Your RMD</th>
            {includeSpouse && <th className="text-left p-2">Spouse RMD</th>}
            <th className="text-left p-2">Total</th>
            <th className="text-left p-2">Tax Impact</th>
          </tr>
        </thead>
        <tbody>
          {rmdYears.map(year => {
            const yourRmd = year.rmdAmount || 0;
            const spouseRmd = includeSpouse ? year.spouseRmdAmount || 0 : 0;
            const totalRmd = yourRmd + spouseRmd;
            // Estimate tax impact at marginal rate
            const taxImpact = totalRmd * (year.marginalRate || 0.22);
            
            return (
              <tr key={year.year} className="border-b">
                <td className="p-2">{year.year}</td>
                <td className="p-2">{formatCurrency(yourRmd)}</td>
                {includeSpouse && <td className="p-2">{formatCurrency(spouseRmd)}</td>}
                <td className="p-2">{formatCurrency(totalRmd)}</td>
                <td className="p-2">{formatCurrency(taxImpact)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RmdScheduleDisplay;
