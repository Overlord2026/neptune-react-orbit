
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InfoTooltip from '@/components/tax/InfoTooltip';
import { Control } from 'react-hook-form';

interface CrtFundingAmountProps {
  control: Control<any>;
}

const CrtFundingAmount: React.FC<CrtFundingAmountProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="fundingAmount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Funding Amount</FormLabel>
          <div className="flex items-center gap-2">
            <FormControl>
              <Input
                type="number"
                min={10000}
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <InfoTooltip text="The amount of assets you plan to place into the CRT. Generally, larger amounts make more sense due to setup costs." />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CrtFundingAmount;
