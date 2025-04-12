
import React from 'react';
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Info } from "lucide-react";
import * as z from "zod";
import { MultiYearScenarioData } from '../MultiYearRothConversion';

interface RMDCalculationStepProps {
  scenarioData: MultiYearScenarioData;
  onUpdateScenarioData: (data: MultiYearScenarioData) => void;
}

// Form validation schema
const formSchema = z.object({
  includeRMDs: z.boolean(),
  rmdStartAge: z.number().min(59).max(100),
});

const RMDCalculationStep: React.FC<RMDCalculationStepProps> = ({ 
  scenarioData, 
  onUpdateScenarioData 
}) => {
  // Initialize form with current scenario data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      includeRMDs: scenarioData.includeRMDs,
      rmdStartAge: scenarioData.rmdStartAge,
    },
  });
  
  // Handle form changes
  const handleFormChange = () => {
    const values = form.getValues();
    onUpdateScenarioData({
      ...scenarioData,
      ...values,
    });
  };
  
  // Calculate expected RMD year
  const rmdYear = scenarioData.startYear + (scenarioData.rmdStartAge - scenarioData.startAge);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 2: Required Minimum Distribution (RMD) Settings</CardTitle>
        <CardDescription>
          Configure how RMDs will affect your multi-year Roth conversion strategy.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="includeRMDs"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Include RMDs in Calculation</FormLabel>
                    <FormDescription>
                      Automatically calculate and apply RMDs when you reach the starting age
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        handleFormChange();
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {form.watch("includeRMDs") && (
              <>
                <FormField
                  control={form.control}
                  name="rmdStartAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RMD Start Age</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(parseInt(e.target.value));
                            handleFormChange();
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Currently 73 under SECURE Act 2.0 for those born in 1960 or later
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-200 dark:border-blue-800/40">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        RMD Calculation Information
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        Based on your inputs, you'll reach RMD age in <span className="font-semibold">{rmdYear}</span> when you turn {scenarioData.rmdStartAge}.
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        The calculator will automatically withdraw RMDs from your Traditional IRA and add them to your taxable income starting that year.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-md">
                  <h4 className="text-sm font-medium mb-2">How RMDs are calculated:</h4>
                  <ol className="list-decimal text-sm ml-5 space-y-1">
                    <li>Account balance on December 31 of the previous year</li>
                    <li>Divided by your life expectancy factor from IRS tables</li>
                    <li>Result is the minimum amount you must withdraw that year</li>
                  </ol>
                  <p className="text-xs text-muted-foreground mt-2">
                    This calculator uses the IRS Uniform Lifetime Table for RMD calculations.
                  </p>
                </div>
              </>
            )}
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RMDCalculationStep;
