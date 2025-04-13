
import React from 'react';
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Check, X, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { YearlyResult } from '../../types/ScenarioTypes';

interface FilingStatusComparisonProps {
  yearlyResults: YearlyResult[];
  showMfsComparison: boolean;
}

// Format currency values
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

// Format percentage values
const formatPercent = (decimal: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(decimal);
};

const FilingStatusComparison: React.FC<FilingStatusComparisonProps> = ({ 
  yearlyResults,
  showMfsComparison
}) => {
  if (!showMfsComparison || yearlyResults.length === 0) {
    return null;
  }
  
  // Get the most recent result for display
  const currentResult = yearlyResults[yearlyResults.length - 1];
  
  // Only show if we have MFS comparison data
  if (!currentResult.mfsComparison) {
    return null;
  }
  
  const { 
    mfjTotalTax, 
    spouse1Tax, 
    spouse2Tax, 
    combinedMfsTax,
    taxDifference,
    mfjIrmaa,
    spouse1Irmaa,
    spouse2Irmaa,
    combinedMfsIrmaa
  } = currentResult.mfsComparison;
  
  const isMfjBetter = combinedMfsTax > mfjTotalTax;
  const totalMfjCost = mfjTotalTax + (mfjIrmaa || 0);
  const totalMfsCost = combinedMfsTax + (combinedMfsIrmaa || 0);
  const isMfjBetterWithIrmaa = totalMfsCost > totalMfjCost;
  
  // Calculate tax savings
  const taxSavings = Math.abs(totalMfjCost - totalMfsCost);
  const savingsPercent = taxSavings / Math.max(totalMfjCost, totalMfsCost);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filing Status Comparison: MFJ vs. MFS</CardTitle>
        <CardDescription>
          Analysis of tax implications for different filing status options
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`rounded-lg p-4 ${isMfjBetter ? 'bg-green-50/10 border border-green-500/30' : 'bg-slate-50/5 border border-border'}`}>
            <h3 className="text-md font-medium mb-2 flex items-center gap-2">
              Married Filing Jointly
              {isMfjBetter && <Check className="h-4 w-4 text-green-500" />}
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Income Tax:</span>
                <span className="font-medium">{formatCurrency(mfjTotalTax)}</span>
              </div>
              
              {mfjIrmaa !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IRMAA Surcharge:</span>
                  <span className="font-medium text-amber-500">{formatCurrency(mfjIrmaa)}</span>
                </div>
              )}
              
              {(mfjIrmaa !== undefined) && (
                <div className="flex justify-between border-t border-muted pt-1 mt-1">
                  <span className="font-medium">Total Cost:</span>
                  <span className="font-medium">{formatCurrency(totalMfjCost)}</span>
                </div>
              )}
              
              {isMfjBetter && (
                <div className="mt-2 text-xs bg-green-500/10 p-2 rounded text-green-500 flex items-start gap-1">
                  <TrendingDown className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>Saves {formatCurrency(taxSavings)} ({formatPercent(savingsPercent)} less) compared to MFS</span>
                </div>
              )}
            </div>
          </div>
          
          <div className={`rounded-lg p-4 ${!isMfjBetter ? 'bg-green-50/10 border border-green-500/30' : 'bg-slate-50/5 border border-border'}`}>
            <h3 className="text-md font-medium mb-2 flex items-center gap-2">
              Married Filing Separately
              {!isMfjBetter && <Check className="h-4 w-4 text-green-500" />}
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Spouse 1 Tax:</span>
                <span>{formatCurrency(spouse1Tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Spouse 2 Tax:</span>
                <span>{formatCurrency(spouse2Tax)}</span>
              </div>
              <div className="flex justify-between border-t border-muted pt-1 mt-1">
                <span className="font-medium">Combined Tax:</span>
                <span className="font-medium">{formatCurrency(combinedMfsTax)}</span>
              </div>
              
              {spouse1Irmaa !== undefined && spouse2Irmaa !== undefined && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Spouse 1 IRMAA:</span>
                    <span className="text-amber-500">{formatCurrency(spouse1Irmaa)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Spouse 2 IRMAA:</span>
                    <span className="text-amber-500">{formatCurrency(spouse2Irmaa)}</span>
                  </div>
                  <div className="flex justify-between border-t border-muted pt-1 mt-1">
                    <span className="font-medium">Total Cost:</span>
                    <span className="font-medium">{formatCurrency(totalMfsCost)}</span>
                  </div>
                </>
              )}
              
              {!isMfjBetter && (
                <div className="mt-2 text-xs bg-green-500/10 p-2 rounded text-green-500 flex items-start gap-1">
                  <TrendingDown className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>Saves {formatCurrency(taxSavings)} ({formatPercent(savingsPercent)} less) compared to MFJ</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className={`mt-4 p-3 rounded-lg ${isMfjBetter !== isMfjBetterWithIrmaa ? 'bg-amber-50/10 border border-amber-500/30' : 'bg-slate-50/5 border border-border'}`}>
          {isMfjBetter !== isMfjBetterWithIrmaa ? (
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                <span className="font-medium">IRMAA Impact:</span> While taxes are lower when filing {isMfjBetter ? 'jointly' : 'separately'}, 
                IRMAA surcharges make filing {isMfjBetterWithIrmaa ? 'jointly' : 'separately'} more advantageous overall when 
                considering total costs.
              </p>
            </div>
          ) : (
            <p className="text-sm">
              <span className="font-medium">Analysis:</span> Filing {isMfjBetterWithIrmaa ? 'jointly' : 'separately'} saves approximately {formatCurrency(taxSavings)} 
              {isMfjBetterWithIrmaa && mfjIrmaa !== undefined && combinedMfsIrmaa !== undefined ? ' (including IRMAA surcharges)' : ''}.
            </p>
          )}
        </div>
        
        <div className="mt-4 p-3 rounded-lg bg-slate-50/5 border border-border">
          <h4 className="text-sm font-medium mb-2">Other Considerations:</h4>
          <ul className="text-sm list-inside space-y-1 text-muted-foreground">
            <li className="flex gap-2 items-start">
              <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>MFS filers cannot claim certain credits like the Earned Income Credit or education credits</span>
            </li>
            <li className="flex gap-2 items-start">
              <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>If one spouse itemizes deductions, the other must also itemize (cannot take standard deduction)</span>
            </li>
            <li className="flex gap-2 items-start">
              <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>MFS may have lower IRA contribution limits and Roth IRA income limits</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilingStatusComparison;
