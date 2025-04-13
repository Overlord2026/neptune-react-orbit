
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, Calculator, DollarSign, Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MultiYearScenarioData } from '../types/ScenarioTypes';

interface PartialBracketFillStepProps {
  scenarioData: MultiYearScenarioData;
  onUpdateScenarioData: (newData: Partial<MultiYearScenarioData>) => void;
}

const PartialBracketFillStep: React.FC<PartialBracketFillStepProps> = ({ 
  scenarioData, 
  onUpdateScenarioData 
}) => {
  // Helper to format currency inputs
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return '';
    return value.toString();
  };

  // Helper to format percentage inputs
  const formatPercent = (value: number | undefined) => {
    if (value === undefined) return '';
    return (value * 100).toString();
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

  // Helper to handle percentage inputs
  const handlePercentChange = (field: keyof MultiYearScenarioData, value: string) => {
    const numericValue = parseFloat(value) / 100;
    if (!isNaN(numericValue)) {
      onUpdateScenarioData({ [field]: numericValue });
    } else {
      onUpdateScenarioData({ [field]: 0 });
    }
  };

  return (
    <div className="space-y-6">
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

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Income Information
          </CardTitle>
          <CardDescription>
            Enter your income details and conversion strategy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="baseAnnualIncome">Annual Income</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <Input 
                id="baseAnnualIncome"
                className="pl-7"
                value={formatCurrency(scenarioData.baseAnnualIncome)}
                onChange={(e) => handleCurrencyChange('baseAnnualIncome', e.target.value)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Your current annual income from all sources (excluding retirement accounts)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="incomeGrowthRate">
              Income Growth Rate
              <Info className="inline-block ml-1 h-4 w-4 text-muted-foreground" />
            </Label>
            <div className="flex items-center gap-4">
              <Slider 
                id="incomeGrowthRate"
                min={0} 
                max={10} 
                step={0.1}
                value={[scenarioData.incomeGrowthRate * 100]} 
                onValueChange={([value]) => {
                  onUpdateScenarioData({ incomeGrowthRate: value / 100 });
                }}
                className="flex-grow"
              />
              <span className="text-sm font-medium w-12 text-right">
                {(scenarioData.incomeGrowthRate * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Estimated annual growth rate of your income
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="conversionStrategy">
              Conversion Strategy
            </Label>
            <RadioGroup 
              id="conversionStrategy"
              value={scenarioData.conversionStrategy}
              onValueChange={(value: 'fixed' | 'bracket_12' | 'bracket_12_22') => {
                onUpdateScenarioData({ conversionStrategy: value });
              }}
              className="pt-2"
            >
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="fixed" id="fixed" />
                <Label htmlFor="fixed" className="cursor-pointer">
                  Fixed Amount
                </Label>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="bracket_12" id="bracket_12" />
                <Label htmlFor="bracket_12" className="cursor-pointer">
                  Fill 12% Bracket
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bracket_12_22" id="bracket_12_22" />
                <Label htmlFor="bracket_12_22" className="cursor-pointer">
                  Fill 22% Bracket
                </Label>
              </div>
            </RadioGroup>
          </div>

          {scenarioData.conversionStrategy === 'fixed' && (
            <div className="space-y-2">
              <Label htmlFor="fixedConversionAmount">Fixed Conversion Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input 
                  id="fixedConversionAmount"
                  className="pl-7"
                  value={formatCurrency(scenarioData.fixedConversionAmount)}
                  onChange={(e) => handleCurrencyChange('fixedConversionAmount', e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Annual fixed amount to convert from Traditional to Roth IRA
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="rounded-lg border border-amber-600/30 bg-amber-50/10 p-4 text-sm">
        <div className="flex gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
          <div>
            <p className="font-medium text-amber-500">Important Tax Consideration</p>
            <p className="text-muted-foreground">
              For the most accurate results, consider your full tax situation, including other income sources
              and potential deductions. The projections use a simplified tax model and should not be the sole basis
              for financial decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartialBracketFillStep;
