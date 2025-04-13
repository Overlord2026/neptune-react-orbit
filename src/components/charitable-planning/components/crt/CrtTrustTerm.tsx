
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InfoTooltip from '@/components/tax/InfoTooltip';
import { Control } from 'react-hook-form';

interface CrtTrustTermProps {
  control: Control<any>;
}

const CrtTrustTerm: React.FC<CrtTrustTermProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="trustTerm"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Trust Term</FormLabel>
          <div className="flex items-center gap-2">
            <Select 
              onValueChange={(val) => field.onChange(val === "lifetime" ? "lifetime" : parseInt(val))}
              defaultValue={field.value.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="lifetime">Lifetime</SelectItem>
                <SelectItem value="2">2 Years</SelectItem>
                <SelectItem value="5">5 Years</SelectItem>
                <SelectItem value="10">10 Years</SelectItem>
                <SelectItem value="15">15 Years</SelectItem>
                <SelectItem value="20">20 Years</SelectItem>
              </SelectContent>
            </Select>
            <InfoTooltip text="The period over which the trust will make payments before the remainder goes to charity. Lifetime terms are based on life expectancy." />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CrtTrustTerm;
