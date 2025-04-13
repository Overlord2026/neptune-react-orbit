
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DollarSign, Info } from "lucide-react";
import { MultiYearScenarioData } from '../../types/ScenarioTypes';

interface IncomeInformationCardProps {
  scenarioData: MultiYearScenarioData;
  onUpdateScenarioData: (newData: Partial<MultiYearScenarioData>) => void;
}

const IncomeInformationCard: React.FC<IncomeInformationCardProps> = ({ 
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
            onValueChange={(value: 'fixed' | 'bracket_12' | 'bracket_22') => {
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
              <RadioGroupItem value="bracket_22" id="bracket_22" />
              <Label htmlFor="bracket_22" className="cursor-pointer">
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
  );
};

export default IncomeInformationCard;
