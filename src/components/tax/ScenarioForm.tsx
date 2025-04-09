
import React, { useState } from 'react';
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilingStatus, STANDARD_DEDUCTION } from '@/utils/taxCalculator';
import InfoTooltip from '@/components/tax/InfoTooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  socialSecurityReceived: z.boolean().default(false),
  socialSecurity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Social security must be a non-negative number",
  }),
  shortTermCapitalGains: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Short-term capital gains must be a non-negative number",
  }),
  longTermCapitalGains: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Long-term capital gains must be a non-negative number",
  }),
  filingStatus: z.enum(['single', 'married_joint', 'married_separate', 'head_of_household']),
  deductionType: z.enum(["standard", "itemized"]),
  itemizedDeduction: z.string().optional().refine((val) => !val || !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Itemized deduction must be a non-negative number",
  }),
  medicareEnrolled: z.boolean().default(false),
  acaEnrolled: z.boolean().default(false),
  householdSize: z.string().optional().refine((val) => !val || !isNaN(Number(val)) && Number(val) >= 0 && Number.isInteger(Number(val)), {
    message: "Household size must be a non-negative integer",
  }),
  stateOfResidence: z.string().optional(),
  dependents: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number.isInteger(Number(val)), {
    message: "Number of dependents must be a non-negative integer",
  }),
});

export type ScenarioFormValues = z.infer<typeof formSchema>;

interface ScenarioFormProps {
  defaultValues?: Partial<ScenarioFormValues>;
  onSubmit: (data: ScenarioFormValues) => void;
  isLoading?: boolean;
}

const STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" }
];

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
      socialSecurityReceived: false,
      socialSecurity: "0",
      shortTermCapitalGains: "0",
      longTermCapitalGains: "2500",
      filingStatus: "single",
      deductionType: "standard",
      itemizedDeduction: "",
      medicareEnrolled: false,
      acaEnrolled: false,
      householdSize: "1",
      stateOfResidence: "",
      dependents: "0",
      ...defaultValues,
    },
  });

  const watchDeductionType = form.watch("deductionType");
  const watchFilingStatus = form.watch("filingStatus");
  const watchYear = form.watch("year");
  const watchSocialSecurityReceived = form.watch("socialSecurityReceived");
  const watchAcaEnrolled = form.watch("acaEnrolled");
  const watchMedicareEnrolled = form.watch("medicareEnrolled");
  
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
                name="filingStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Filing Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-primary/40">
                          <SelectValue placeholder="Select filing status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married_joint">Married Filing Jointly</SelectItem>
                        <SelectItem value="married_separate">Married Filing Separately</SelectItem>
                        <SelectItem value="head_of_household">Head of Household</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dependents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Dependents</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Enter number of dependents" 
                        {...field} 
                        className="border-primary/40" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <h3 className="text-lg font-medium text-primary col-span-2 mt-4 mb-1">Income Sources</h3>
              
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
                name="socialSecurityReceived"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center space-x-2">
                        <span>Receiving Social Security?</span>
                        <InfoTooltip text="Depending on your total provisional income, up to 85% of Social Security can be taxable." />
                      </FormLabel>
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

              {watchSocialSecurityReceived && (
                <FormField
                  control={form.control}
                  name="socialSecurity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Social Security Amount ($)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter annual social security amount" 
                          {...field} 
                          className={field.value === "0" ? "" : "border-primary/40"} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="col-span-2">
                <h3 className="text-lg font-medium text-primary mb-1">Investment Income</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Different tax rates apply to short-term vs long-term capital gains
                </p>
              </div>

              <FormField
                control={form.control}
                name="shortTermCapitalGains"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short-Term Capital Gains ($)</FormLabel>
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
                name="longTermCapitalGains"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Long-Term Capital Gains ($)</FormLabel>
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

              <div className="col-span-2">
                <h3 className="text-lg font-medium text-primary mt-4 mb-1">Health Coverage & Medicare</h3>
              </div>

              <FormField
                control={form.control}
                name="medicareEnrolled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center space-x-2">
                        <span>Enrolled in Medicare Part B/D?</span>
                        <InfoTooltip text="High income in a given year could increase your Medicare premiums two years later." icon="alertCircle" />
                      </FormLabel>
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

              {watchMedicareEnrolled && (
                <div className="bg-amber-950/30 p-3 rounded-md text-sm">
                  Income in this scenario will affect IRMAA surcharges two years from now.
                </div>
              )}

              <FormField
                control={form.control}
                name="acaEnrolled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Enrolled in marketplace/ACA health insurance?
                      </FormLabel>
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

              {watchAcaEnrolled && (
                <>
                  <FormField
                    control={form.control}
                    name="householdSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Household Size</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="1"
                            step="1"
                            placeholder="Enter household size" 
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
                    name="stateOfResidence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State of Residence</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-primary/40">
                              <SelectValue placeholder="Select a state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[200px]">
                            {STATES.map(state => (
                              <SelectItem key={state.value} value={state.value}>{state.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
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
              {isLoading ? "Calculating..." : "Calculate Tax Scenario with Potential Tax Traps"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ScenarioForm;
