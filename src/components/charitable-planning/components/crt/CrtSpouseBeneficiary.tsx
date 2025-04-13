
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Control } from 'react-hook-form';

interface CrtSpouseBeneficiaryProps {
  control: Control<any>;
}

const CrtSpouseBeneficiary: React.FC<CrtSpouseBeneficiaryProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="spouseBeneficiary"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">
              Include Spouse as Beneficiary
            </FormLabel>
            <FormDescription>
              Payments continue until the death of both beneficiaries
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default CrtSpouseBeneficiary;
