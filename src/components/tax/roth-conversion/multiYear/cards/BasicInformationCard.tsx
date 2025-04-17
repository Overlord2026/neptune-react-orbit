
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
    return value.toLocaleString(); // Use toLocaleString for better readability
  };

  // Helper to handle currency inputs
  const handleCurrencyChange = (field: keyof MultiYearScenarioData, value: string) => {
    const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
    if (!isNaN(numericValue)) {
      onUpdateScenarioData({ [field]: numericValue });
    } else {
      onUpdateScenarioData({ [field]: 0 });
    }
  };

  return (
    <Card className="bg-custom-background-secondary border-custom-background-tertiary shadow-lg">
      <CardHeader className="bg-custom-background-tertiary rounded-t-lg p-4">
        <CardTitle className="text-xl flex items-center gap-2 text-white">
          <Calculator className="h-5 w-5 text-[#00C47C]" />
          Basic Information
        </CardTitle>
        <CardDescription className="text-custom-text-muted text-sm">
          Enter your age and retirement account information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startAge" className="text-custom-text-secondary text-sm">Current Age</Label>
            <Input 
              id="startAge"
              type="number"
              min={0}
              max={120}
              value={scenarioData.startAge || ''}
              className="bg-custom-background-tertiary text-white border-custom-background-tertiary focus:ring-[#00C47C] text-base py-2"
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
            <Label htmlFor="startYear" className="text-custom-text-secondary text-sm">Start Year</Label>
            <Input 
              id="startYear"
              type="number"
              min={2023}
              max={2050}
              value={scenarioData.startYear || ''}
              className="bg-custom-background-tertiary text-white border-custom-background-tertiary focus:ring-[#00C47C] text-base py-2"
              onChange={(e) => {
                const year = parseInt(e.target.value);
                onUpdateScenarioData({ startYear: isNaN(year) ? new Date().getFullYear() : year });
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedAnnualReturn" className="text-custom-text-secondary flex items-center text-sm">
            Expected Annual Return
            <Info className="inline-block ml-1 h-4 w-4 text-[#00C47C]" />
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
            <span className="text-sm font-medium w-12 text-white">
              {(scenarioData.expectedAnnualReturn * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-custom-text-muted">
            Estimated average annual return on investments
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="traditionalIRAStartBalance" className="text-custom-text-secondary text-sm">Traditional IRA Balance</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-custom-text-muted">$</span>
            <Input 
              id="traditionalIRAStartBalance"
              className="pl-7 bg-custom-background-tertiary text-white border-custom-background-tertiary focus:ring-[#00C47C] text-base py-2"
              value={formatCurrency(scenarioData.traditionalIRAStartBalance)}
              onChange={(e) => handleCurrencyChange('traditionalIRAStartBalance', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rothIRAStartBalance" className="text-custom-text-secondary text-sm">Roth IRA Balance</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-custom-text-muted">$</span>
            <Input 
              id="rothIRAStartBalance"
              className="pl-7 bg-custom-background-tertiary text-white border-custom-background-tertiary focus:ring-[#00C47C] text-base py-2"
              value={formatCurrency(scenarioData.rothIRAStartBalance)}
              onChange={(e) => handleCurrencyChange('rothIRAStartBalance', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInformationCard;
