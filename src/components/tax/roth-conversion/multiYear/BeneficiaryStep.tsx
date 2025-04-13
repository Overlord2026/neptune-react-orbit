
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Info, User } from "lucide-react";
import { MultiYearScenarioData } from '../types/ScenarioTypes';

interface BeneficiaryStepProps {
  scenarioData: MultiYearScenarioData;
  onUpdateScenarioData: (newData: Partial<MultiYearScenarioData>) => void;
}

const BeneficiaryStep: React.FC<BeneficiaryStepProps> = ({ 
  scenarioData, 
  onUpdateScenarioData 
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <User className="h-5 w-5" />
            Beneficiary Details
          </CardTitle>
          <CardDescription>
            Enter details about your beneficiary for potential SECURE Act impacts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="includeBeneficiary"
              checked={scenarioData.includeBeneficiary}
              onCheckedChange={(checked) => onUpdateScenarioData({ includeBeneficiary: checked })}
            />
            <Label htmlFor="includeBeneficiary">Include Beneficiary Analysis</Label>
          </div>

          {scenarioData.includeBeneficiary && (
            <>
              <Separator className="my-4" />

              <div className="space-y-2">
                <Label htmlFor="beneficiaryAge">Beneficiary Age</Label>
                <Input 
                  id="beneficiaryAge" 
                  type="number"
                  min={0}
                  max={120}
                  value={scenarioData.beneficiaryAge.toString()} 
                  onChange={(e) => {
                    const age = parseInt(e.target.value);
                    if (!isNaN(age)) {
                      onUpdateScenarioData({ beneficiaryAge: age });
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="beneficiaryIncomeTaxRate">Beneficiary Income Tax Rate</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">%</span>
                  <Input 
                    id="beneficiaryIncomeTaxRate" 
                    className="pl-7"
                    type="number"
                    min={0}
                    max={100}
                    value={(scenarioData.beneficiaryIncomeTaxRate * 100).toString()}
                    onChange={(e) => {
                      const rate = parseFloat(e.target.value) / 100;
                      if (!isNaN(rate)) {
                        onUpdateScenarioData({ beneficiaryIncomeTaxRate: rate });
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Assumed Death Year
                  <Info className="h-4 w-4 text-muted-foreground" />
                </Label>
                <Input 
                  id="assumedDeathYear" 
                  type="number"
                  min={scenarioData.startYear}
                  max={scenarioData.startYear + scenarioData.numYears - 1}
                  value={scenarioData.assumedDeathYear?.toString() || ''} 
                  onChange={(e) => {
                    const year = parseInt(e.target.value);
                    if (!isNaN(year)) {
                      onUpdateScenarioData({ assumedDeathYear: year });
                    }
                  }}
                />
                <p className="text-sm text-muted-foreground">
                  The year you anticipate passing away. This is used to project the tax impact on your beneficiary under the SECURE Act.
                </p>
              </div>

              {/* If spouse is included, show option to analyze spouse's death too */}
              {scenarioData.includeSpouse && (
                <>
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Spouse's Assumed Death Year
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </Label>
                    <Input 
                      id="spouseAssumedDeathYear" 
                      type="number"
                      min={scenarioData.startYear}
                      max={scenarioData.startYear + scenarioData.numYears - 1}
                      value={scenarioData.spouseAssumedDeathYear?.toString() || ''} 
                      onChange={(e) => {
                        const year = parseInt(e.target.value);
                        if (!isNaN(year)) {
                          onUpdateScenarioData({ spouseAssumedDeathYear: year });
                        }
                      }}
                    />
                    <p className="text-sm text-muted-foreground">
                      The year your spouse is anticipated to pass away. This impacts inheritance planning for both IRAs.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border p-3 bg-muted/20">
                    <p className="text-sm">
                      <strong>Note:</strong> When analyzing couples, we consider both survival scenarios: 
                      (1) primary account holder survives spouse, and (2) spouse survives primary account holder.
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BeneficiaryStep;
