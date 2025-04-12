
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { MultiYearScenarioData } from '../MultiYearRothConversion';

interface PartialBracketFillStepProps {
  scenarioData: MultiYearScenarioData;
  onUpdateScenarioData: (data: MultiYearScenarioData) => void;
}

// Form validation schema
const formSchema = z.object({
  startAge: z.number().min(0).max(100),
  startYear: z.number().min(2023).max(2050),
  numYears: z.number().min(1).max(50),
  filingStatus: z.enum(['single', 'married', 'head_of_household']),
  traditionalIRAStartBalance: z.number().min(0),
  rothIRAStartBalance: z.number().min(0),
  baseAnnualIncome: z.number().min(0),
  expectedAnnualReturn: z.number().min(-0.5).max(0.5),
  incomeGrowthRate: z.number().min(-0.1).max(0.2),
  conversionStrategy: z.enum(['fixed', 'bracket_12', 'bracket_12_22']),
  fixedConversionAmount: z.number().optional(),
  taxInflationAdjustment: z.boolean(),
});

const PartialBracketFillStep: React.FC<PartialBracketFillStepProps> = ({ 
  scenarioData, 
  onUpdateScenarioData 
}) => {
  // Initialize form with current scenario data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startAge: scenarioData.startAge,
      startYear: scenarioData.startYear,
      numYears: scenarioData.numYears,
      filingStatus: scenarioData.filingStatus,
      traditionalIRAStartBalance: scenarioData.traditionalIRAStartBalance,
      rothIRAStartBalance: scenarioData.rothIRAStartBalance,
      baseAnnualIncome: scenarioData.baseAnnualIncome,
      expectedAnnualReturn: scenarioData.expectedAnnualReturn,
      incomeGrowthRate: scenarioData.incomeGrowthRate,
      conversionStrategy: scenarioData.conversionStrategy,
      fixedConversionAmount: scenarioData.fixedConversionAmount,
      taxInflationAdjustment: scenarioData.taxInflationAdjustment,
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
        <CardTitle>Step 1: Basic Information & Bracket Fill Strategy</CardTitle>
        <CardDescription>
          Set up your multi-year Roth conversion strategy based on tax brackets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="startAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Age</FormLabel>
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
                name="startYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Year</FormLabel>
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
                name="numYears"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Years</FormLabel>
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
                      Years to project
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="filingStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filing Status</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleFormChange();
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select filing status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married Filing Jointly</SelectItem>
                      <SelectItem value="head_of_household">Head of Household</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="traditionalIRAStartBalance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Traditional IRA Starting Balance</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value));
                          handleFormChange();
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rothIRAStartBalance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roth IRA Starting Balance</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value));
                          handleFormChange();
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="baseAnnualIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Annual Income</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value));
                          handleFormChange();
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Not including IRA distributions
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="incomeGrowthRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Income Growth Rate: {formatPercent(field.value)}</FormLabel>
                    <FormControl>
                      <Slider
                        min={-0.05}
                        max={0.15}
                        step={0.005}
                        value={[field.value]}
                        onValueChange={(values) => {
                          field.onChange(values[0]);
                          handleFormChange();
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Annual income growth projection
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="expectedAnnualReturn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Annual Return: {formatPercent(field.value)}</FormLabel>
                  <FormControl>
                    <Slider
                      min={-0.1}
                      max={0.2}
                      step={0.005}
                      value={[field.value]}
                      onValueChange={(values) => {
                        field.onChange(values[0]);
                        handleFormChange();
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Projected annual return on investments
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="conversionStrategy"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Conversion Strategy</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleFormChange();
                      }}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="bracket_12" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Fill 12% Bracket Only
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="bracket_12_22" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Fill 12% + 22% Brackets
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="fixed" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Fixed Annual Amount
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            
            {form.watch("conversionStrategy") === "fixed" && (
              <FormField
                control={form.control}
                name="fixedConversionAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fixed Conversion Amount</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value) || 0);
                          handleFormChange();
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Annual conversion amount
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PartialBracketFillStep;
