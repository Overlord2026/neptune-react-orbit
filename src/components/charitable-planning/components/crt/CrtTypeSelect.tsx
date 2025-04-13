
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InfoTooltip from '@/components/tax/InfoTooltip';
import { Control } from 'react-hook-form';

interface CrtTypeSelectProps {
  control: Control<any>;
}

const CrtTypeSelect: React.FC<CrtTypeSelectProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>CRT Type</FormLabel>
          <div className="flex items-center gap-2">
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select CRT type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="CRAT">CRAT - Fixed Annual Payment</SelectItem>
                <SelectItem value="CRUT">CRUT - Variable Payment Based on Trust Value</SelectItem>
              </SelectContent>
            </Select>
            <InfoTooltip text="CRAT provides fixed annual payments while CRUT payments vary based on the trust's value each year." />
          </div>
        </FormItem>
      )}
    />
  );
};

export default CrtTypeSelect;
