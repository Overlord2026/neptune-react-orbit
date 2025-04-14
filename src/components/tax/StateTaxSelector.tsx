import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StateCode, getStateTaxDisclaimer, getStateTaxSummary, stateTaxData } from '@/utils/stateTaxData';
import { Info } from 'lucide-react';

interface StateTaxSelectorProps {
  includeStateTax: boolean;
  selectedState: StateCode;
  onIncludeStateChange: (include: boolean) => void;
  onStateChange: (state: StateCode) => void;
}

const StateTaxSelector: React.FC<StateTaxSelectorProps> = ({
  includeStateTax,
  selectedState,
  onIncludeStateChange,
  onStateChange,
}) => {
  // Get the popular states first, then alphabetically sort the rest
  const popularStates: StateCode[] = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'].filter(
    // Filter to only include states that are valid StateCode values
    state => Object.keys(stateTaxData).includes(state)
  ) as StateCode[];
  
  // Create a list of all available states for the dropdown
  const stateOptions = Object.keys(stateTaxData) as StateCode[];
  
  // Sort states: popular states first, then the rest alphabetically
  const sortedStates = [
    ...popularStates.filter(state => stateOptions.includes(state)),
    ...stateOptions.filter(state => !popularStates.includes(state) && state !== 'NONE' && state !== 'OTHER')
  ];
  
  // Always add these special options at the end
  const allStates = [...sortedStates, 'NONE', 'OTHER'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="include-state-tax">Include State Income Tax</Label>
          <p className="text-sm text-muted-foreground">
            Add state tax calculations to your scenario
          </p>
        </div>
        <Switch
          id="include-state-tax"
          checked={includeStateTax}
          onCheckedChange={onIncludeStateChange}
        />
      </div>

      {includeStateTax && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="state-select">Select your state of residence</Label>
            <Select
              value={selectedState}
              onValueChange={(value) => onStateChange(value as StateCode)}
            >
              <SelectTrigger id="state-select" className="w-full">
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                {allStates.map((stateCode) => (
                  <SelectItem key={stateCode} value={stateCode}>
                    {stateTaxData[stateCode].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedState && (
            <>
              <Alert className="bg-primary/10 border border-primary/20">
                <div className="flex gap-2">
                  <Info className="h-4 w-4 text-primary mt-0.5" />
                  <AlertDescription>
                    {getStateTaxDisclaimer(selectedState)}
                  </AlertDescription>
                </div>
              </Alert>

              <div className="p-4 border rounded-md bg-muted/20">
                <h4 className="font-medium mb-1">Tax Structure</h4>
                <p className="text-sm text-muted-foreground">{getStateTaxSummary(selectedState)}</p>
                
                {selectedState !== 'NONE' && selectedState !== 'OTHER' && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium mb-1">Brackets:</h5>
                    <div className="text-xs space-y-1">
                      {stateTaxData[selectedState].type === 'flat' ? (
                        <div>
                          Flat rate of {stateTaxData[selectedState].flatRate}% on all taxable income
                        </div>
                      ) : stateTaxData[selectedState].type === 'graduated' ? (
                        stateTaxData[selectedState].brackets?.map((bracket, index) => (
                          <div key={index}>
                            ${bracket.min.toLocaleString()} - {bracket.max === Infinity ? '∞' : `$${bracket.max.toLocaleString()}`}: {bracket.rate}%
                          </div>
                        ))
                      ) : (
                        <div>No state income tax</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StateTaxSelector;
