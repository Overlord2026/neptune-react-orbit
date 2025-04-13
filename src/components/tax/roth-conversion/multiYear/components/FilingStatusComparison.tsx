
import React from 'react';
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Check, X } from "lucide-react";
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filing Status Comparison: MFJ vs. MFS</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`rounded-lg p-4 ${isMfjBetter ? 'bg-green-50/10 border border-green-500/30' : 'bg-slate-50/5'}`}>
            <h3 className="text-md font-medium mb-2 flex items-center gap-2">
              Married Filing Jointly
              {isMfjBetter && <Check className="h-4 w-4 text-green-500" />}
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Tax:</span>
                <span className="font-medium">{formatCurrency(mfjTotalTax)}</span>
              </div>
              
              {mfjIrmaa !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IRMAA Surcharge:</span>
                  <span className="font-medium">{formatCurrency(mfjIrmaa)}</span>
                </div>
              )}
              
              {(mfjIrmaa !== undefined) && (
                <div className="flex justify-between border-t border-muted pt-1 mt-1">
                  <span className="font-medium">Total Cost:</span>
                  <span className="font-medium">{formatCurrency(totalMfjCost)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className={`rounded-lg p-4 ${!isMfjBetter ? 'bg-green-50/10 border border-green-500/30' : 'bg-slate-50/5'}`}>
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
                    <span>{formatCurrency(spouse1Irmaa)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Spouse 2 IRMAA:</span>
                    <span>{formatCurrency(spouse2Irmaa)}</span>
                  </div>
                  <div className="flex justify-between border-t border-muted pt-1 mt-1">
                    <span className="font-medium">Total Cost:</span>
                    <span className="font-medium">{formatCurrency(totalMfsCost)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className={`mt-4 p-3 rounded-lg ${isMfjBetterWithIrmaa ? 'bg-amber-50/10 border border-amber-500/30' : 'bg-green-50/10 border border-green-500/30'}`}>
          <p className="text-sm">
            <span className="font-medium">Analysis:</span> Filing {isMfjBetterWithIrmaa ? 'jointly' : 'separately'} saves approximately {formatCurrency(Math.abs(totalMfjCost - totalMfsCost))} {isMfjBetterWithIrmaa ? '(including IRMAA surcharges)' : ''}.
          </p>
          {isMfjBetter !== isMfjBetterWithIrmaa && (
            <p className="text-sm mt-1">
              <span className="font-medium">Note:</span> While taxes are lower when filing {isMfjBetter ? 'jointly' : 'separately'}, IRMAA surcharges make filing {isMfjBetterWithIrmaa ? 'jointly' : 'separately'} more advantageous overall.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FilingStatusComparison;
