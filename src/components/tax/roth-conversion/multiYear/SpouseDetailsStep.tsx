
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Info, AlertTriangle, Users, X, Check } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MultiYearScenarioData } from '@/types/tax/rothConversionTypes';
import { Checkbox } from "@/components/ui/checkbox";
import { FilingStatusType } from '@/types/tax/filingTypes';

interface SpouseDetailsStepProps {
  scenarioData: MultiYearScenarioData;
  onUpdateScenarioData: (newData: Partial<MultiYearScenarioData>) => void;
}

const SpouseDetailsStep: React.FC<SpouseDetailsStepProps> = ({ 
  scenarioData, 
  onUpdateScenarioData 
}) => {
  const [isMarried, setIsMarried] = useState<boolean>(
    scenarioData.filingStatus === 'married_joint' || scenarioData.filingStatus === 'married_separate'
  );

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

  // Handle marriage status change
  const handleMarriageStatusChange = (isMarried: boolean) => {
    setIsMarried(isMarried);
    
    if (isMarried) {
      onUpdateScenarioData({ 
        filingStatus: 'married_joint' as FilingStatusType,
        includeSpouse: true
      });
    } else {
      onUpdateScenarioData({ 
        filingStatus: 'single' as FilingStatusType,
        includeSpouse: false,
        isInCommunityPropertyState: false,
        splitCommunityIncome: false,
        compareMfjVsMfs: false
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5" />
            Personal Status
          </CardTitle>
          <CardDescription>
            Tell us about your personal status to tailor the analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="maritalStatus">Are you married?</Label>
            <ToggleGroup 
              type="single" 
              value={isMarried ? "yes" : "no"}
              onValueChange={(value) => {
                if (value) handleMarriageStatusChange(value === "yes");
              }}
              className="justify-start"
            >
              <ToggleGroupItem value="yes" className="gap-2">
                <Check className="h-4 w-4" /> Yes
              </ToggleGroupItem>
              <ToggleGroupItem value="no" className="gap-2">
                <X className="h-4 w-4" /> No
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {isMarried && (
            <>
              <div className="space-y-2">
                <Label htmlFor="filingStatus">Filing Status</Label>
                <Select 
                  value={scenarioData.filingStatus} 
                  onValueChange={(value) => {
                    onUpdateScenarioData({ 
                      filingStatus: value as FilingStatusType,
                    });
                  }}
                >
                  <SelectTrigger id="filingStatus">
                    <SelectValue placeholder="Select filing status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="married_joint">Married Filing Jointly (MFJ)</SelectItem>
                    <SelectItem value="married_separate">Married Filing Separately (MFS)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="compareMfjVsMfs"
                  checked={scenarioData.compareMfjVsMfs}
                  onCheckedChange={(checked) => onUpdateScenarioData({ compareMfjVsMfs: !!checked })}
                />
                <Label htmlFor="compareMfjVsMfs" className="text-sm">
                  Calculate both MFJ and MFS to compare tax impacts
                </Label>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="isInCommunityPropertyState"
                  checked={scenarioData.isInCommunityPropertyState}
                  onCheckedChange={(checked) => onUpdateScenarioData({ isInCommunityPropertyState: !!checked })}
                />
                <Label htmlFor="isInCommunityPropertyState" className="text-sm">
                  We live in a community property state
                </Label>
              </div>

              {scenarioData.isInCommunityPropertyState && (
                <div className="rounded-lg border border-amber-600/30 bg-amber-50/10 p-4 text-sm">
                  <div className="flex gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="font-medium text-amber-500">Community Property State Selected</p>
                      <p className="text-muted-foreground">
                        In community property states, most income earned during marriage is considered community property 
                        and may be treated as earned equally by both spouses for tax purposes.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="splitCommunityIncome"
                        checked={scenarioData.splitCommunityIncome}
                        onCheckedChange={(checked) => onUpdateScenarioData({ splitCommunityIncome: !!checked })}
                      />
                      <Label htmlFor="splitCommunityIncome" className="text-sm">
                        Split community income 50/50 for tax calculations
                      </Label>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {isMarried && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Spouse/Partner Details</CardTitle>
            <CardDescription>
              Provide information about your spouse for more accurate calculations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="spouseFirstName">Spouse First Name</Label>
                <Input 
                  id="spouseFirstName" 
                  value={scenarioData.spouseFirstName || ''} 
                  onChange={(e) => onUpdateScenarioData({ spouseFirstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spouseLastName">Spouse Last Name</Label>
                <Input 
                  id="spouseLastName" 
                  value={scenarioData.spouseLastName || ''} 
                  onChange={(e) => onUpdateScenarioData({ spouseLastName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="spouseAge">Spouse Age</Label>
              <Input 
                id="spouseAge" 
                type="number"
                min={0}
                max={120}
                value={scenarioData.spouseAge || ''} 
                onChange={(e) => {
                  const age = parseInt(e.target.value);
                  if (!isNaN(age)) {
                    onUpdateScenarioData({ 
                      spouseAge: age,
                      // Automatically set RMD age based on spouse's current age
                      spouseRmdStartAge: age >= 73 ? age : 73
                    });
                  }
                }}
              />
            </div>

            <Separator className="my-4" />
            
            <h3 className="text-lg font-semibold">Spouse Financial Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="spouseBaseAnnualIncome">Spouse Annual Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input 
                  id="spouseBaseAnnualIncome" 
                  className="pl-7"
                  value={formatCurrency(scenarioData.spouseBaseAnnualIncome)}
                  onChange={(e) => handleCurrencyChange('spouseBaseAnnualIncome', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="spouseTraditionalIRABalance">Spouse Traditional IRA Balance</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input 
                  id="spouseTraditionalIRABalance" 
                  className="pl-7"
                  value={formatCurrency(scenarioData.spouseTraditionalIRABalance)}
                  onChange={(e) => handleCurrencyChange('spouseTraditionalIRABalance', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="spouseRothIRAStartBalance">Spouse Roth IRA Balance</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input 
                  id="spouseRothIRAStartBalance" 
                  className="pl-7"
                  value={formatCurrency(scenarioData.spouseRothIRAStartBalance)}
                  onChange={(e) => handleCurrencyChange('spouseRothIRAStartBalance', e.target.value)}
                />
              </div>
            </div>

            <Separator className="my-4" />
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Spouse RMD Start Age
                <Info className="h-4 w-4 text-muted-foreground" />
              </Label>
              <Input 
                id="spouseRmdStartAge" 
                type="number"
                min={60}
                max={100}
                value={scenarioData.spouseRmdStartAge || 73} 
                onChange={(e) => {
                  const age = parseInt(e.target.value);
                  if (!isNaN(age)) {
                    onUpdateScenarioData({ spouseRmdStartAge: age });
                  }
                }}
              />
              <p className="text-sm text-muted-foreground">
                Current law requires RMDs to begin at age 73 for individuals born 1951-1959, 
                and age 75 for individuals born 1960 or later.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isMarried && 
       scenarioData.includeSpouse && 
       (scenarioData.spouseTraditionalIRAStartBalance || 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">IRA Planning Approach</CardTitle>
            <CardDescription>
              Choose how to handle IRAs for you and your spouse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id="combinedIRAApproach"
                  checked={!!scenarioData.combinedIRAApproach}
                  onCheckedChange={(checked) => onUpdateScenarioData({ combinedIRAApproach: checked })}
                />
                <Label htmlFor="combinedIRAApproach">Use combined approach for IRA planning</Label>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {scenarioData.combinedIRAApproach 
                  ? "Combined approach optimizes conversions across both IRAs to minimize total tax burden."
                  : "Separate approach handles each IRA independently with its own conversion strategy."}
              </p>

              {scenarioData.spouseAge && Math.abs(scenarioData.spouseAge - scenarioData.startAge) >= 8 && (
                <div className="rounded-lg border border-amber-600/30 bg-amber-50/10 p-4 text-sm mt-4">
                  <div className="flex gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-amber-500">Age Gap Alert</p>
                      <p className="text-muted-foreground">
                        There is a significant age gap between you and your spouse. 
                        This may impact RMD timing and optimal conversion strategy. We recommend 
                        exploring both combined and separate approaches.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {isMarried && (
        <div className="rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-sm">
          <h4 className="font-medium mb-2">Spousal Data Considerations</h4>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>For MFJ filers, we calculate tax impacts based on combined income and assets</li>
            <li>For MFS filers, we provide separate tax calculations for each spouse</li>
            {scenarioData.isInCommunityPropertyState && (
              <li>Community property rules affect how income is allocated between spouses</li>
            )}
            <li>Age differences between spouses may impact optimal conversion strategies</li>
            <li>Consider consulting with a tax professional regarding your specific situation</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SpouseDetailsStep;
