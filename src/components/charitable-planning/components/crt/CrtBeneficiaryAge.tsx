
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InfoTooltip from '@/components/tax/InfoTooltip';
import { Control } from 'react-hook-form';

interface CrtBeneficiaryAgeProps {
  control: Control<any>;
}

const CrtBeneficiaryAge: React.FC<CrtBeneficiaryAgeProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="beneficiaryAge"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Beneficiary Age</FormLabel>
          <div className="flex items-center gap-2">
            <FormControl>
              <Input
                type="number"
                min={18}
                max={120}
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <InfoTooltip text="Age of the primary income beneficiary. For lifetime CRTs, this affects the charitable deduction calculation." />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CrtBeneficiaryAge;
