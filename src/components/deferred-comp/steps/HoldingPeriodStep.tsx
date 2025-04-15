
import React from 'react';
import { useEquityForm } from '../context/EquityFormContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FormItem, FormLabel, FormDescription, FormControl } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { InfoTooltip } from '../components/InfoTooltip';

export const HoldingPeriodStep: React.FC = () => {
  const { formState, updateFormState } = useEquityForm();
  
  // Convert string to number for holdingPeriod if it exists
  const holdingPeriod = formState.holdingPeriod !== undefined ? Number(formState.holdingPeriod) : undefined;
  
  const handleIsDisqualifyingChange = (value: string) => {
    const isDisqualifying = value === 'true';
    updateFormState({
      isDisqualifyingDisposition: isDisqualifying,
    });
  };
  
  const handleHoldingPeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Store the holding period as a number
    const periodValue = e.target.value === '' ? undefined : Number(e.target.value);
    updateFormState({
      holdingPeriod: periodValue,
    });
  };
  
  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            ISO Holding Period
            <InfoTooltip content="The holding period affects the tax treatment of your ISO exercise." />
          </CardTitle>
          <CardDescription>
            Specify if your ISO exercise will result in a qualifying or disqualifying disposition.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <FormItem>
              <FormLabel>Do you plan to sell shares within 1 year of exercise or 2 years of grant?</FormLabel>
              <FormControl>
                <RadioGroup
                  value={formState.isDisqualifyingDisposition ? 'true' : 'false'}
                  onValueChange={handleIsDisqualifyingChange}
                  className="flex flex-col space-y-2 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="disqualifying-yes" />
                    <Label htmlFor="disqualifying-yes">
                      Yes (Disqualifying Disposition - Taxed as Ordinary Income)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="disqualifying-no" />
                    <Label htmlFor="disqualifying-no">
                      No (Qualifying Disposition - Capital Gains Treatment)
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                A qualifying disposition requires holding shares for at least 1 year after exercise and 2 years after grant.
              </FormDescription>
            </FormItem>
            
            {!formState.isDisqualifyingDisposition && (
              <FormItem>
                <FormLabel>How many months do you plan to hold after exercise before selling?</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    value={holdingPeriod !== undefined ? holdingPeriod : ''} 
                    onChange={handleHoldingPeriodChange} 
                    min={0}
                    placeholder="Enter months" 
                  />
                </FormControl>
                <FormDescription>
                  For tax planning purposes, typically 12+ months is recommended for ISOs.
                </FormDescription>
              </FormItem>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HoldingPeriodStep;
