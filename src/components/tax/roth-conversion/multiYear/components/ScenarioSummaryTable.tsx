
import React from 'react';
import { YearlyResult } from '@/types/tax/rothConversionTypes';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/formatUtils';

interface ScenarioSummaryTableProps {
  yearlyResults: YearlyResult[];
  hasCalculated: boolean;
}

const ScenarioSummaryTable: React.FC<ScenarioSummaryTableProps> = ({ 
  yearlyResults, 
  hasCalculated 
}) => {
  // Return loading state if calculation hasn't been performed yet
  if (!hasCalculated || yearlyResults.length === 0) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  // Get the final year's data
  const finalYearResult = yearlyResults[yearlyResults.length - 1];
  
  // Calculate overall metrics
  const totalConversion = yearlyResults.reduce((sum, year) => sum + (year.conversionAmount || 0), 0);
  const totalTaxPaid = yearlyResults.reduce((sum, year) => sum + (year.totalTax || 0), 0);
  const totalRmds = yearlyResults.reduce((sum, year) => sum + (year.rmdAmount || 0) + (year.spouseRmdAmount || 0), 0);
  const averageEffectiveRate = totalTaxPaid / (totalConversion > 0 ? totalConversion : 1);
  
  // Calculate balance metrics
  const initialBalance = yearlyResults[0].traditionalIraBalance + (yearlyResults[0].spouseTraditionalIraBalance || 0);
  const finalRothBalance = finalYearResult.rothIraBalance + (finalYearResult.spouseRothIraBalance || 0);
  
  // Find break-even year if exists
  const breakEvenYear = yearlyResults.find(year => year.breakEvenYear)?.year;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Conversion</p>
          <p className="text-lg font-medium">{formatCurrency(totalConversion)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Tax Paid</p>
          <p className="text-lg font-medium">{formatCurrency(totalTaxPaid)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Avg. Effective Rate</p>
          <p className="text-lg font-medium">{(averageEffectiveRate * 100).toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total RMDs</p>
          <p className="text-lg font-medium">{formatCurrency(totalRmds)}</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">Balance Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Initial Trad. IRA</p>
            <p className="text-lg font-medium">{formatCurrency(initialBalance)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Final Roth IRA</p>
            <p className="text-lg font-medium">{formatCurrency(finalRothBalance)}</p>
          </div>
        </div>
      </div>
      
      {breakEvenYear && (
        <div className="mt-4 p-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-md">
          <p className="text-sm text-green-800 dark:text-green-300">
            Break-even reached in year {breakEvenYear}
          </p>
        </div>
      )}
    </div>
  );
};

export default ScenarioSummaryTable;
