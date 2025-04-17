
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
    <Card className="bg-[#007BFF] border-[#0069d9] shadow-lg">
      <CardHeader className="bg-[#0069d9] rounded-t-lg p-5">
        <CardTitle className="text-2xl md:text-xl flex items-center gap-3 text-white">
          <Calculator className="h-6 w-6 text-white" />
          Basic Information
        </CardTitle>
        <CardDescription className="text-white/80 text-base md:text-sm">
          Enter your age and retirement account information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="startAge" className="text-white text-base font-medium">Current Age</Label>
            <Input 
              id="startAge"
              type="number"
              min={0}
              max={120}
              value={scenarioData.startAge || ''}
              className="bg-white text-black border-white/20 focus:ring-[#ffffff] text-base py-3"
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
          <div className="space-y-3">
            <Label htmlFor="startYear" className="text-white text-base font-medium">Start Year</Label>
            <Input 
              id="startYear"
              type="number"
              min={2023}
              max={2050}
              value={scenarioData.startYear || ''}
              className="bg-white text-black border-white/20 focus:ring-[#ffffff] text-base py-3"
              onChange={(e) => {
                const year = parseInt(e.target.value);
                onUpdateScenarioData({ startYear: isNaN(year) ? new Date().getFullYear() : year });
              }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="expectedAnnualReturn" className="text-white flex items-center text-base font-medium">
            Expected Annual Return
            <Info className="inline-block ml-2 h-5 w-5 text-white/80" />
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
            <span className="text-base font-semibold w-16 text-white bg-[#0069d9] px-3 py-1.5 rounded-md">
              {(scenarioData.expectedAnnualReturn * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-sm text-white/80">
            Estimated average annual return on investments
          </p>
        </div>

        <div className="space-y-3">
          <Label htmlFor="traditionalIRAStartBalance" className="text-white text-base font-medium">Traditional IRA Balance</Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black font-medium">$</span>
            <Input 
              id="traditionalIRAStartBalance"
              className="pl-8 bg-white text-black border-white/20 focus:ring-[#ffffff] text-base py-3"
              value={formatCurrency(scenarioData.traditionalIRAStartBalance)}
              onChange={(e) => handleCurrencyChange('traditionalIRAStartBalance', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="rothIRAStartBalance" className="text-white text-base font-medium">Roth IRA Balance</Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black font-medium">$</span>
            <Input 
              id="rothIRAStartBalance"
              className="pl-8 bg-white text-black border-white/20 focus:ring-[#ffffff] text-base py-3"
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
