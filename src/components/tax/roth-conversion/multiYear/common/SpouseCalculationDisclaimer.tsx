
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { MultiYearScenarioData } from '../../types/ScenarioTypes';

interface SpouseCalculationDisclaimerProps {
  scenarioData: MultiYearScenarioData;
}

const SpouseCalculationDisclaimer: React.FC<SpouseCalculationDisclaimerProps> = ({ scenarioData }) => {
  if (!scenarioData.includeSpouse) {
    return null;
  }

  return (
    <Alert className="bg-blue-950/20 border-blue-800/30">
      <Info className="h-4 w-4 text-blue-500" />
      <AlertTitle>Spousal Calculation Disclaimer</AlertTitle>
      <AlertDescription className="text-sm">
        <div className="space-y-2 mt-1">
          <p>
            This analysis includes both your and your spouse's accounts for a more comprehensive retirement strategy.
          </p>
          {scenarioData.isInCommunityPropertyState && (
            <p>
              Community Property State: Income is being {scenarioData.splitCommunityIncome ? 'split equally' : 'reported individually'} between spouses.
            </p>
          )}
          {scenarioData.compareMfjVsMfs && (
            <p>
              Filing Status Comparison: This analysis compares tax implications of filing jointly vs. separately.
            </p>
          )}
          {scenarioData.combinedIRAApproach && (
            <p>
              Combined IRA Strategy: Conversion amounts are being optimized across both accounts to maximize tax efficiency.
            </p>
          )}
          <p className="text-xs mt-4 text-muted-foreground">
            Note: These calculations are for estimation purposes only. Please consult with a tax professional before making decisions about your retirement accounts.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default SpouseCalculationDisclaimer;
