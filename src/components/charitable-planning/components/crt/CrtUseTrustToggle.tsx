
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Control } from 'react-hook-form';
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CrtUseTrustToggleProps {
  control: Control<any>;
  disabled?: boolean;
}

const CrtUseTrustToggle: React.FC<CrtUseTrustToggleProps> = ({ control, disabled = false }) => {
  return (
    <FormField
      control={control}
      name="useCrt"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <FormLabel className="text-base">
                Use Charitable Remainder Trust
              </FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-sm">
                      A CRT provides income while donating assets to charity. You receive an immediate tax deduction and income for life or a term of years.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <FormDescription>
              Establish a CRT to provide income and tax benefits
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default CrtUseTrustToggle;
