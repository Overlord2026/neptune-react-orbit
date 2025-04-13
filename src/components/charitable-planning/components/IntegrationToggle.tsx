
import React from 'react';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";

interface IntegrationToggleProps {
  form: UseFormReturn<any>;
}

const IntegrationToggle: React.FC<IntegrationToggleProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="isIntegrated"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-input p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Integrate with Multi-Year Tax Plan</FormLabel>
            <FormDescription>
              Incorporate these charitable strategies into your broader tax planning
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

export default IntegrationToggle;
