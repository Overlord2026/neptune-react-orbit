
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InfoTooltip from '@/components/tax/InfoTooltip';
import { Control } from 'react-hook-form';

interface CrtSpouseAgeProps {
  control: Control<any>;
  disabled?: boolean;
}

const CrtSpouseAge: React.FC<CrtSpouseAgeProps> = ({ control, disabled = false }) => {
  return (
    <FormField
      control={control}
      name="spouseAge"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Spouse Age</FormLabel>
          <div className="flex items-center gap-2">
            <FormControl>
              <Input
                type="number"
                min={18}
                max={120}
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                disabled={disabled}
                placeholder={disabled ? "N/A" : "Age"}
              />
            </FormControl>
            <InfoTooltip text="Age of the spouse, used in the calculation of charitable deduction for lifetime CRTs." />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CrtSpouseAge;
