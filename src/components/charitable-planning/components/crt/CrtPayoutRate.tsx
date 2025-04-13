
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import InfoTooltip from '@/components/tax/InfoTooltip';
import { Control } from 'react-hook-form';

interface CrtPayoutRateProps {
  control: Control<any>;
}

const CrtPayoutRate: React.FC<CrtPayoutRateProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="payoutRate"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Payout Rate: {field.value}%</FormLabel>
          <div className="flex items-center gap-2">
            <FormControl>
              <Slider
                min={5}
                max={50}
                step={0.5}
                value={[field.value]}
                onValueChange={(vals) => field.onChange(vals[0])}
              />
            </FormControl>
            <InfoTooltip text="The percentage of the trust's value paid annually to the beneficiary. IRS requires a minimum 5% payout rate." />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CrtPayoutRate;
