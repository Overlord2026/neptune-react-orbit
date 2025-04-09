import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilingStatus, STANDARD_DEDUCTION } from '@/utils/taxCalculator';
import InfoTooltip from '@/components/tax/InfoTooltip';

// Define the form schema with zod
const formSchema = z.object({
  scenarioName: z.string().min(3, {
    message: "Scenario name must be at least 3 characters.",
  }),
  year: z.string().refine((val) => !isNaN(Number(val)) && [2021, 2022, 2023].includes(Number(val)), {
    message: "Year must be 2021, 2022, or 2023.",
  }),
  wages: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Wages must be a non-negative number",
  }),
  interest: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Interest must be a non-negative number",
  }),
  qualifiedDividends: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Qualified dividends must be a non-negative number",
  }),
  iraDistributions: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "IRA distributions must be a non-negative number",
  }),
  rothConversion: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Roth conversion must be a non-negative number",
  }),
  socialSecurity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Social security must be a non-negative number",
  }),
  capitalGains: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Capital gains must be a non-negative number",
  }),
  filingStatus: z.enum(['single', 'married', 'head_of_household']),
  deductionType: z.enum(["standard", "itemized"]),
  itemizedDeduction: z.string().optional().refine((val) => !val || !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Itemized deduction must be a non-negative number",
  }),
});

export type ScenarioFormValues = z.infer<typeof formSchema>;

interface ScenarioFormProps {
  defaultValues?: Partial<ScenarioFormValues>;
  onSubmit: (data: ScenarioFormValues) => void;
  isLoading?: boolean;
}

const ScenarioForm: React.FC<ScenarioFormProps> = ({ 
  defaultValues, 
  onSubmit, 
  isLoading = false 
}) => {
  const form = useForm<ScenarioFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scenarioName: "My Scenario",
      year: "2021",
      wages: "75000",
      interest: "1000",
      qualifiedDividends: "500",
      iraDistributions: "0",
      rothConversion: "0",
      socialSecurity: "0",
      capitalGains: "2500",
      filingStatus: "single",
      deductionType: "standard",
      itemizedDeduction: "",
      ...defaultValues,
    },
  });

  const watchDeductionType = form.watch("deductionType");
  const watchFilingStatus = form.watch("filingStatus");
  const watchYear = form.watch("year");
  
  const year = Number(watchYear);
  const filingStatus = watchFilingStatus as FilingStatus;
  
  // Get the standard deduction for the selected year and filing status
  const standardDeduction = 
    STANDARD_DEDUCTION[year as keyof typeof STANDARD_DEDUCTION]?.[filingStatus] || 
    STANDARD_DEDUCTION[2021][filingStatus];

  const handleSubmit = (data: ScenarioFormValues) => {
    onSubmit(data);
  };

  return (
    <Card className="bg-card border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl neptune-gold">Tax Scenario Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="scenarioName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scenario Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter scenario name" 
                        {...field} 
                        className="border-primary/40" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Year</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="2021" id="2021" />
                          <Label htmlFor="2021">2021</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="2022" id="2022" />
                          <Label htmlFor="2022">2022</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="2023" id="2023" />
                          <Label htmlFor="2023">2023</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="wages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wages/Salary ($)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter amount" 
                        {...field} 
                        className={field.value === "0" ? "" : "border-primary/40"} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="interest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interest ($)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter amount" 
                        {...field} 
                        className={field.value === "0" ? "" : "border-primary/40"} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qualifiedDividends"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualified Dividends ($)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter amount" 
                        {...field} 
                        className={field.value === "0" ? "" : "border-primary/40"} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="iraDistributions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IRA Distributions ($)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter amount" 
                        {...field} 
                        className={field.value === "0" ? "" : "border-primary/40"} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rothConversion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Roth Conversion ($)
                      <InfoTooltip text="A Roth conversion adds to your taxable income in the conversion year, but future growth can be tax-free." />
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter amount" 
                        {...field}
                        className={field.value === "0" ? "" : "border-primary/50 bg-primary/5"} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socialSecurity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Social Security Received ($)
                      <InfoTooltip text="Depending on your total provisional income, up to 85% of Social Security can be taxable." />
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter amount" 
                        {...field} 
                        className={field.value === "0" ? "" : "border-primary/40"} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capitalGains"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capital Gains ($)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter amount" 
                        {...field} 
                        className={field.value === "0" ? "" : "border-primary/40"} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="filingStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Filing Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="single" id="single" />
                          <Label htmlFor="single">Single</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="married" id="married" />
                          <Label htmlFor="married">Married Filing Jointly</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="head_of_household" id="head_of_household" />
                          <Label htmlFor="head_of_household">Head of Household</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 border-t pt-4">
              <FormField
                control={form.control}
                name="deductionType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Deduction Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard">Standard Deduction (${standardDeduction.toLocaleString()})</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="itemized" id="itemized" />
                          <Label htmlFor="itemized">Itemized Deduction</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchDeductionType === "itemized" && (
                <FormField
                  control={form.control}
                  name="itemizedDeduction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Itemized Deduction Amount ($)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter itemized deduction amount" 
                          {...field} 
                          className={field.value === "0" ? "" : "border-primary/40"} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <Button 
              type="submit" 
              className="bg-[#FFD700] hover:bg-[#E5C100] text-black w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? "Calculating..." : "Calculate Tax Scenario"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ScenarioForm;
