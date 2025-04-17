import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { MultiYearScenarioData } from '@/types/tax/rothConversionTypes';

interface SpouseDetailsStepProps {
  scenarioData: MultiYearScenarioData;
  onUpdateScenarioData: (newData: Partial<MultiYearScenarioData>) => void;
}

const SpouseDetailsStep: React.FC<SpouseDetailsStepProps> = ({ 
  scenarioData, 
  onUpdateScenarioData 
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Spouse Details</CardTitle>
          <CardDescription>
            Enter information about your spouse for a more accurate Roth conversion analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="includeSpouse"
              checked={scenarioData.includeSpouse}
              onCheckedChange={(checked) => onUpdateScenarioData({ includeSpouse: checked })}
            />
            <Label htmlFor="includeSpouse">Include Spouse in Analysis</Label>
          </div>

          {scenarioData.includeSpouse && (
            <>
              {/* Spouse Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="spouseFirstName">Spouse First Name</Label>
                  <Input
                    id="spouseFirstName"
                    type="text"
                    value={scenarioData.spouseFirstName || ''}
                    onChange={(e) => onUpdateScenarioData({ spouseFirstName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="spouseLastName">Spouse Last Name</Label>
                  <Input
                    id="spouseLastName"
                    type="text"
                    value={scenarioData.spouseLastName || ''}
                    onChange={(e) => onUpdateScenarioData({ spouseLastName: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Spouse Age and Income */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="spouseAge">Spouse Age</Label>
                  <Input
                    id="spouseAge"
                    type="number"
                    value={scenarioData.spouseAge || 0}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      onUpdateScenarioData({ spouseAge: value });
                    }}
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter spouse's current age
                  </p>
                </div>
                <div>
                  <Label htmlFor="spouseBaseAnnualIncome">
                    Spouse Base Annual Income
                  </Label>
                  <Input
                    id="spouseBaseAnnualIncome"
                    type="number"
                    value={scenarioData.spouseBaseAnnualIncome || 0}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      onUpdateScenarioData({ spouseBaseAnnualIncome: value });
                    }}
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter spouse's current annual income
                  </p>
                </div>
              </div>

              {/* Spouse IRA Balances */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="spouseTraditionalIRAStartBalance">
                    Spouse Traditional IRA Balance
                  </Label>
                  <Input
                    id="spouseTraditionalIRAStartBalance"
                    type="number"
                    value={scenarioData.spouseTraditionalIRAStartBalance || 0}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      onUpdateScenarioData({ spouseTraditionalIRAStartBalance: value });
                    }}
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Current balance in spouse's Traditional IRA
                  </p>
                </div>
                <div>
                  <Label htmlFor="spouseRothIRAStartBalance">
                    Spouse Roth IRA Balance
                  </Label>
                  <Input
                    id="spouseRothIRAStartBalance"
                    type="number"
                    value={scenarioData.spouseRothIRAStartBalance || 0}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      onUpdateScenarioData({ spouseRothIRAStartBalance: value });
                    }}
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Current balance in spouse's Roth IRA
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpouseDetailsStep;
