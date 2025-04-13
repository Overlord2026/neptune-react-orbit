
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Calculator, Info } from "lucide-react";
import { MultiYearScenarioData } from '../../types/ScenarioTypes';

interface BasicInformationCardProps {
  scenarioData: MultiYearScenarioData;
  onUpdateScenarioData: (newData: Partial<MultiYearScenarioData>) => void;
}

const BasicInformationCard: React.FC<BasicInformationCardProps> = ({ 
  scenarioData, 
  onUpdateScenarioData 
}) => {
  // Helper to format currency inputs
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return '';
    return value.toString();
  };

  // Helper to handle currency inputs
  const handleCurrencyChange = (field: keyof MultiYearScenarioData, value: string) => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      onUpdateScenarioData({ [field]: numericValue });
    } else {
      onUpdateScenarioData({ [field]: 0 });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Basic Information
        </CardTitle>
        <CardDescription>
          Enter your age and retirement account information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startAge">Current Age</Label>
            <Input 
              id="startAge"
              type="number"
              min={0}
              max={120}
              value={scenarioData.startAge || ''}
              onChange={(e) => {
                const age = parseInt(e.target.value);
                onUpdateScenarioData({ 
                  startAge: isNaN(age) ? 0 : age,
                  // Automatically set RMD age based on current age
                  rmdStartAge: isNaN(age) || age < 73 ? 73 : age
                });
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startYear">Start Year</Label>
            <Input 
              id="startYear"
              type="number"
              min={2023}
              max={2050}
              value={scenarioData.startYear || ''}
              onChange={(e) => {
                const year = parseInt(e.target.value);
                onUpdateScenarioData({ startYear: isNaN(year) ? new Date().getFullYear() : year });
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="numYears">Projection Years</Label>
          <Input 
            id="numYears"
            type="number"
            min={1}
            max={50}
            value={scenarioData.numYears || ''}
            onChange={(e) => {
              const years = parseInt(e.target.value);
              onUpdateScenarioData({ numYears: isNaN(years) ? 1 : years });
            }}
          />
          <p className="text-sm text-muted-foreground">
            Number of years to include in the projection
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="traditionalIRAStartBalance">Traditional IRA Balance</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
            <Input 
              id="traditionalIRAStartBalance"
              className="pl-7"
              value={formatCurrency(scenarioData.traditionalIRAStartBalance)}
              onChange={(e) => handleCurrencyChange('traditionalIRAStartBalance', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rothIRAStartBalance">Roth IRA Balance</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
            <Input 
              id="rothIRAStartBalance"
              className="pl-7"
              value={formatCurrency(scenarioData.rothIRAStartBalance)}
              onChange={(e) => handleCurrencyChange('rothIRAStartBalance', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedAnnualReturn">
            Expected Annual Return
            <Info className="inline-block ml-1 h-4 w-4 text-muted-foreground" />
          </Label>
          <div className="flex items-center gap-4">
            <Slider 
              id="expectedAnnualReturn"
              min={0} 
              max={20} 
              step={0.25}
              value={[scenarioData.expectedAnnualReturn * 100]} 
              onValueChange={([value]) => {
                onUpdateScenarioData({ expectedAnnualReturn: value / 100 });
              }}
              className="flex-grow"
            />
            <span className="text-sm font-medium w-12 text-right">
              {(scenarioData.expectedAnnualReturn * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Estimated average annual return on investments
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInformationCard;
