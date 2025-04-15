
import React from 'react';
import BasicInformationCard from './cards/BasicInformationCard';
import IncomeInformationCard from './cards/IncomeInformationCard';
import TaxConsiderationWarning from './common/TaxConsiderationWarning';
import { MultiYearScenarioData } from '@/types/tax/rothConversionTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PartialBracketFillStepProps {
  scenarioData: MultiYearScenarioData;
  onUpdateScenarioData: (newData: Partial<MultiYearScenarioData>) => void;
}

const PartialBracketFillStep: React.FC<PartialBracketFillStepProps> = ({ 
  scenarioData, 
  onUpdateScenarioData 
}) => {
  // Handle toggle changes
  const handleToggleChange = (field: string) => (checked: boolean) => {
    onUpdateScenarioData({
      [field]: checked
    });
  };

  return (
    <div className="space-y-6">
      <BasicInformationCard
        scenarioData={scenarioData}
        onUpdateScenarioData={onUpdateScenarioData}
      />

      <IncomeInformationCard
        scenarioData={scenarioData}
        onUpdateScenarioData={onUpdateScenarioData}
      />

      {/* Filing and Community Property Options */}
      <Card>
        <CardHeader>
          <CardTitle>Filing & Community Property Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {scenarioData.filingStatus === 'married_joint' && (
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compare-mfj-mfs" className="font-medium">
                  Compare MFJ vs. MFS
                </Label>
                <p className="text-sm text-muted-foreground">
                  Compare tax impact of filing jointly vs. separately
                </p>
              </div>
              <Switch
                id="compare-mfj-mfs"
                checked={scenarioData.compareMfjVsMfs || false}
                onCheckedChange={handleToggleChange('compareMfjVsMfs')}
              />
            </div>
          )}

          {scenarioData.filingStatus === 'married_joint' && (
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="community-property" className="font-medium">
                  Community Property State
                </Label>
                <p className="text-sm text-muted-foreground">
                  Applies community property income splitting rules
                </p>
              </div>
              <Switch
                id="community-property"
                checked={scenarioData.isInCommunityPropertyState || false}
                onCheckedChange={handleToggleChange('isInCommunityPropertyState')}
              />
            </div>
          )}

          {scenarioData.isInCommunityPropertyState && (
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="split-income" className="font-medium">
                  Split Community Income
                </Label>
                <p className="text-sm text-muted-foreground">
                  Split eligible income 50/50 between spouses
                </p>
              </div>
              <Switch
                id="split-income"
                checked={scenarioData.splitCommunityIncome || false}
                onCheckedChange={handleToggleChange('splitCommunityIncome')}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <TaxConsiderationWarning />
    </div>
  );
};

export default PartialBracketFillStep;
