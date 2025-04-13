
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Control } from 'react-hook-form';

interface CrtUseTrustToggleProps {
  control: Control<any>;
}

const CrtUseTrustToggle: React.FC<CrtUseTrustToggleProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="useCrt"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">
              Use Charitable Remainder Trust
            </FormLabel>
            <FormDescription>
              Establish a CRT to provide income and tax benefits
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

export default CrtUseTrustToggle;
