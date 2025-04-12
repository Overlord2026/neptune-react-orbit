
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertTriangle } from "lucide-react";
import * as z from "zod";
import { MultiYearScenarioData } from '../MultiYearRothConversion';

interface BeneficiaryStepProps {
  scenarioData: MultiYearScenarioData;
  onUpdateScenarioData: (data: MultiYearScenarioData) => void;
}

// Form validation schema
const formSchema = z.object({
  includeBeneficiary: z.boolean(),
  assumedDeathYear: z.number().min(2023).max(2100).optional(),
  beneficiaryAge: z.number().min(18).max(100),
  beneficiaryIncomeTaxRate: z.number().min(0).max(0.5),
});

const BeneficiaryStep: React.FC<BeneficiaryStepProps> = ({ 
  scenarioData, 
  onUpdateScenarioData 
}) => {
  // Initialize form with current scenario data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      includeBeneficiary: scenarioData.includeBeneficiary,
      assumedDeathYear: scenarioData.assumedDeathYear || scenarioData.startYear + 15, // Default to halfway through projection
      beneficiaryAge: scenarioData.beneficiaryAge,
      beneficiaryIncomeTaxRate: scenarioData.beneficiaryIncomeTaxRate,
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
  
  // Format percentage for display
  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 3: SECURE Act Inheritance Planning</CardTitle>
        <CardDescription>
          Analyze the impact of the SECURE Act on your beneficiaries' inheritance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-6">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md border border-amber-200 dark:border-amber-800/40">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    SECURE Act Requirements
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Under the SECURE Act, most non-spouse beneficiaries must withdraw inherited retirement accounts within 10 years. This can have significant tax implications depending on the account type.
                  </p>
                </div>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="includeBeneficiary"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Include Inheritance Analysis</FormLabel>
                    <FormDescription>
                      Compare Traditional IRA vs. Roth IRA inheritance tax impacts
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
            
            {form.watch("includeBeneficiary") && (
              <>
                <FormField
                  control={form.control}
                  name="assumedDeathYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assumed Year of Death (for analysis)</FormLabel>
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
                        This is only for inheritance analysis. Year must be within your projection period ({scenarioData.startYear} - {scenarioData.startYear + scenarioData.numYears - 1}).
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="beneficiaryAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Beneficiary Age</FormLabel>
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
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="beneficiaryIncomeTaxRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Beneficiary Tax Rate: {formatPercent(field.value)}</FormLabel>
                        <FormControl>
                          <Slider
                            min={0}
                            max={0.5}
                            step={0.01}
                            value={[field.value]}
                            onValueChange={(values) => {
                              field.onChange(values[0]);
                              handleFormChange();
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Estimated marginal tax rate of your beneficiary
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-md">
                  <h4 className="text-sm font-medium mb-2">SECURE Act Inheritance Rules:</h4>
                  <ul className="text-sm ml-5 space-y-1 list-disc">
                    <li>For Traditional IRAs: Beneficiaries pay income tax on distributions at their tax rate</li>
                    <li>For Roth IRAs: Qualified distributions are tax-free for beneficiaries</li>
                    <li>10-year rule applies to most non-spouse beneficiaries (some exceptions apply)</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BeneficiaryStep;
