
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Info, Calculator, Clock } from "lucide-react";
import { MultiYearScenarioData } from '../types/ScenarioTypes';

interface RMDCalculationStepProps {
  scenarioData: MultiYearScenarioData;
  onUpdateScenarioData: (newData: Partial<MultiYearScenarioData>) => void;
}

const RMDCalculationStep: React.FC<RMDCalculationStepProps> = ({ 
  scenarioData, 
  onUpdateScenarioData 
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Required Minimum Distributions (RMDs)
          </CardTitle>
          <CardDescription>
            Configure RMD settings for accurate long-term projections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="includeRMDs"
              checked={scenarioData.includeRMDs}
              onCheckedChange={(checked) => onUpdateScenarioData({ includeRMDs: checked })}
            />
            <Label htmlFor="includeRMDs">Include Required Minimum Distributions (RMDs)</Label>
          </div>

          {scenarioData.includeRMDs && (
            <>
              <Separator className="my-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Primary Account Holder RMD Settings */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Your RMD Start Age
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Label>
                  <Input 
                    id="rmdStartAge" 
                    type="number"
                    min={72}
                    max={100}
                    value={scenarioData.rmdStartAge || 73} 
                    onChange={(e) => {
                      const age = parseInt(e.target.value);
                      if (!isNaN(age)) {
                        onUpdateScenarioData({ rmdStartAge: age });
                      }
                    }}
                  />
                  <p className="text-sm text-muted-foreground">
                    Current law requires RMDs to begin at age 73 for individuals born 1951-1959, 
                    and age 75 for individuals born 1960 or later.
                  </p>
                </div>
                
                {/* Spouse RMD Settings if applicable */}
                {scenarioData.includeSpouse && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Spouse RMD Start Age
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </Label>
                    <Input 
                      id="spouseRmdStartAge" 
                      type="number"
                      min={72}
                      max={100}
                      value={scenarioData.spouseRmdStartAge || 73} 
                      onChange={(e) => {
                        const age = parseInt(e.target.value);
                        if (!isNaN(age)) {
                          onUpdateScenarioData({ spouseRmdStartAge: age });
                        }
                      }}
                    />
                    {Math.abs((scenarioData.spouseAge || 0) - scenarioData.startAge) >= 5 && (
                      <p className="text-sm text-amber-600">
                        There is a significant age gap between you and your spouse. 
                        This will affect when RMDs begin for each account.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RMDCalculationStep;
