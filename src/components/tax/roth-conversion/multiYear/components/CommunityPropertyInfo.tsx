
import React from 'react';
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
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
  const currentResult = yearlyResults.length > 0 ? yearlyResults[yearlyResults.length - 1] : null;
  
  if (!currentResult || !currentResult.communityPropertySplit) {
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
          In community property states, certain income types may be split 50/50 between spouses
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
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">After Income Split:</h3>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Primary Income:</span>
              <span>{formatCurrency(splitPrimaryIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Spouse Income:</span>
              <span>{formatCurrency(splitSpouseIncome)}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50/10 p-3 rounded border border-amber-600/30 text-sm">
          <div className="flex gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-500">Community Property Disclaimer</p>
              <p className="text-muted-foreground">
                Actual community property treatment may differ based on your specific situation and state laws.
                Seek legal and tax advice for official classification of assets and income.
                This analysis is for estimation purposes only.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityPropertyInfo;
