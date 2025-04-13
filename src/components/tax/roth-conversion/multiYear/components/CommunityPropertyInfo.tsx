
import React from 'react';
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { AlertCircle, ArrowRight } from "lucide-react";
import { MultiYearScenarioData, YearlyResult } from '../../types/ScenarioTypes';

interface CommunityPropertyInfoProps {
  scenarioData: MultiYearScenarioData;
  yearlyResults: YearlyResult[];
}

// Format currency values
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

const CommunityPropertyInfo: React.FC<CommunityPropertyInfoProps> = ({ 
  scenarioData,
  yearlyResults
}) => {
  // Only show if community property is enabled
  if (!scenarioData.isInCommunityPropertyState || !scenarioData.splitCommunityIncome) {
    return null;
  }
  
  // Get the current year result for display
  const currentResult = yearlyResults.length > 0 ? yearlyResults[0] : null;
  const finalResult = yearlyResults.length > 0 ? yearlyResults[yearlyResults.length - 1] : null;
  
  if (!currentResult || !currentResult.communityPropertySplit || !finalResult) {
    return null;
  }
  
  const { 
    originalPrimaryIncome,
    originalSpouseIncome,
    splitPrimaryIncome,
    splitSpouseIncome
  } = currentResult.communityPropertySplit;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Community Property Income Split</CardTitle>
        <CardDescription>
          In community property states, income earned during marriage may be split 50/50 for tax purposes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Before Income Split:</h3>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Primary Income:</span>
              <span>{formatCurrency(originalPrimaryIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Spouse Income:</span>
              <span>{formatCurrency(originalSpouseIncome)}</span>
            </div>
            <div className="mt-1 pt-1 border-t border-border flex justify-between font-medium">
              <span>Total Income:</span>
              <span>{formatCurrency(originalPrimaryIncome + originalSpouseIncome)}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">After Income Split:</h3>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Primary Income:</span>
              <div className="flex items-center gap-1">
                <span>{formatCurrency(splitPrimaryIncome)}</span>
                {originalPrimaryIncome !== splitPrimaryIncome && (
                  <span className={`text-xs ${splitPrimaryIncome > originalPrimaryIncome ? 'text-green-500' : 'text-amber-500'}`}>
                    {splitPrimaryIncome > originalPrimaryIncome ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Spouse Income:</span>
              <div className="flex items-center gap-1">
                <span>{formatCurrency(splitSpouseIncome)}</span>
                {originalSpouseIncome !== splitSpouseIncome && (
                  <span className={`text-xs ${splitSpouseIncome > originalSpouseIncome ? 'text-green-500' : 'text-amber-500'}`}>
                    {splitSpouseIncome > originalSpouseIncome ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-1 pt-1 border-t border-border flex justify-between font-medium">
              <span>Total Income:</span>
              <span>{formatCurrency(splitPrimaryIncome + splitSpouseIncome)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-md bg-slate-100/5 border border-border p-3">
          <h3 className="text-sm font-semibold mb-2">Income Split Details:</h3>
          
          {/* Wages split */}
          {scenarioData.baseAnnualIncome > 0 && scenarioData.spouseBaseAnnualIncome && scenarioData.spouseBaseAnnualIncome > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center mb-2 text-sm">
              <div className="sm:col-span-4">
                <span>Salary/Wages:</span>
              </div>
              <div className="sm:col-span-3 text-right">
                <span className="text-muted-foreground">{formatCurrency(scenarioData.baseAnnualIncome)} / {formatCurrency(scenarioData.spouseBaseAnnualIncome)}</span>
              </div>
              <div className="hidden sm:flex sm:col-span-1 justify-center">
                <ArrowRight className="h-4 w-4 text-amber-500" />
              </div>
              <div className="sm:col-span-4 text-right">
                <span>{formatCurrency((scenarioData.baseAnnualIncome + scenarioData.spouseBaseAnnualIncome) / 2)} each spouse</span>
              </div>
            </div>
          )}
          
          {/* IRA Distributions - these are typically separate property */}
          {finalResult.rmdAmount > 0 || (finalResult.spouseRmdAmount && finalResult.spouseRmdAmount > 0) ? (
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center mb-2 text-sm">
              <div className="sm:col-span-4">
                <span>IRA Distributions:</span>
              </div>
              <div className="sm:col-span-3 text-right">
                <span className="text-muted-foreground">{formatCurrency(finalResult.rmdAmount)} / {formatCurrency(finalResult.spouseRmdAmount || 0)}</span>
              </div>
              <div className="hidden sm:flex sm:col-span-1 justify-center">
                <ArrowRight className="h-4 w-4 text-blue-500" />
              </div>
              <div className="sm:col-span-4 text-right">
                <span>Not split (separate property)</span>
              </div>
            </div>
          ) : null}
          
          {/* Roth Conversions - these are typically separate property */}
          {finalResult.conversionAmount > 0 || (finalResult.spouseConversionAmount && finalResult.spouseConversionAmount > 0) ? (
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center mb-2 text-sm">
              <div className="sm:col-span-4">
                <span>Roth Conversions:</span>
              </div>
              <div className="sm:col-span-3 text-right">
                <span className="text-muted-foreground">{formatCurrency(finalResult.conversionAmount)} / {formatCurrency(finalResult.spouseConversionAmount || 0)}</span>
              </div>
              <div className="hidden sm:flex sm:col-span-1 justify-center">
                <ArrowRight className="h-4 w-4 text-blue-500" />
              </div>
              <div className="sm:col-span-4 text-right">
                <span>Not split (separate property)</span>
              </div>
            </div>
          ) : null}
        </div>
        
        <div className="bg-amber-50/10 p-3 rounded border border-amber-600/30 text-sm">
          <div className="flex gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-500">Community Property Disclaimer</p>
              <p className="text-muted-foreground">
                Actual community property treatment may differ based on your specific situation and state laws.
                Some income types (like IRA distributions) are typically separate property, while others 
                (like wages earned during marriage) may be community property. Seek legal and tax advice for 
                official classification of assets and income. This analysis is for estimation purposes only.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityPropertyInfo;
