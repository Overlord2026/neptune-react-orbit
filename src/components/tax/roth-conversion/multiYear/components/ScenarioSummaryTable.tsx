
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { YearlyResult } from '@/types/tax/rothConversionTypes';
import { formatCurrency, formatPercent } from '@/utils/formatUtils';
import { Skeleton } from '@/components/ui/skeleton';

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
      <Card>
        <CardHeader>
          <CardTitle>Scenario Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get the final year's data
  const finalYearResult = yearlyResults[yearlyResults.length - 1];
  
  // Calculate overall metrics
  const totalConversion = yearlyResults.reduce((sum, year) => sum + year.conversionAmount, 0);
  const totalTaxPaid = yearlyResults.reduce((sum, year) => sum + year.totalTax, 0);
  const averageEffectiveRate = totalTaxPaid / totalConversion;
  
  // Calculate balance metrics
  const initialBalance = yearlyResults[0].traditionalIraBalance + (yearlyResults[0].spouseTraditionalIraBalance || 0);
  const finalRothBalance = finalYearResult.rothIraBalance + (finalYearResult.spouseRothIraBalance || 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Roth Conversion Summary</CardTitle>
      </CardHeader>
      <CardContent>
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
            <div>
              <p className="text-sm text-muted-foreground">Average Effective Tax Rate</p>
              <p className="text-lg font-medium">{formatPercent(averageEffectiveRate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Years</p>
              <p className="text-lg font-medium">{yearlyResults.length}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Balance Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Initial Traditional IRA</p>
                <p className="text-lg font-medium">{formatCurrency(initialBalance)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Final Roth IRA</p>
                <p className="text-lg font-medium">{formatCurrency(finalRothBalance)}</p>
              </div>
            </div>
          </div>
          
          {finalYearResult.breakEvenYear && (
            <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                This scenario reached its break-even point in year {finalYearResult.year}, making it financially advantageous.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioSummaryTable;
