
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { MultiYearScenarioData } from '../../types/ScenarioTypes';

interface SpouseCalculationDisclaimerProps {
  scenarioData: MultiYearScenarioData;
}

const SpouseCalculationDisclaimer: React.FC<SpouseCalculationDisclaimerProps> = ({ scenarioData }) => {
  if (!scenarioData.includeSpouse) return null;

  const isMFJ = scenarioData.filingStatus === 'married';
  const isMFS = scenarioData.filingStatus === 'married_separate';
  const isInCommunityState = scenarioData.isInCommunityPropertyState;
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <h3 className="font-medium">Spousal Calculation Information</h3>
            <p className="text-sm text-muted-foreground">
              {isMFJ ? 
                "For married filing jointly (MFJ), your tax calculations combine both your and your spouse's income, deductions, and credits." :
                "For married filing separately (MFS), your tax calculations are performed separately for you and your spouse."}
            </p>
            
            {isInCommunityState && (
              <p className="text-sm text-muted-foreground">
                As residents of a community property state
                {scenarioData.splitCommunityIncome ? 
                  ", income is split 50/50 between you and your spouse for tax purposes." : 
                  ", income could be split 50/50 between spouses, though you've chosen not to apply this for this analysis."}
              </p>
            )}
            
            {scenarioData.combinedIRAApproach ? (
              <p className="text-sm text-muted-foreground">
                Your analysis uses a combined IRA optimization approach, which coordinates Roth conversions across both IRAs to maximize tax efficiency.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Your analysis uses a separate IRA approach, optimizing each spouse's Roth conversions independently.
              </p>
            )}
            
            {scenarioData.compareMfjVsMfs && (
              <p className="text-sm text-muted-foreground font-medium text-blue-500">
                Your results include a comparison of MFJ vs. MFS filing options to help identify potential tax advantages.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpouseCalculationDisclaimer;
