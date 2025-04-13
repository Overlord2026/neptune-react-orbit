
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalculatorIcon, AlertTriangle } from 'lucide-react';
import { calculateCRTScenario, CRTScenarioOutput } from '../utils/crtScenarioUtils';
import InfoTooltip from '@/components/tax/InfoTooltip';
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  trustType: z.enum(["CRAT", "CRUT"]),
  fundingAmount: z.number().min(10000, "Minimum funding is $10,000"),
  payoutRate: z.number().min(5, "Minimum 5%").max(50, "Maximum 50%"),
  term: z.union([z.number().min(2, "Minimum 2 years"), z.literal("lifetime")]),
  beneficiaryAge: z.number().min(18, "Minimum age is 18").max(120, "Maximum age is 120"),
  spouseBeneficiary: z.boolean(),
  spouseAge: z.number().optional(),
  discountRate: z.number().optional(),
  estateSubjectToTax: z.boolean(),
  agiForLimits: z.number().optional()
});

type FormValues = z.infer<typeof formSchema>;

interface CrtScenarioCalculatorProps {
  onScenarioCalculated?: (result: CRTScenarioOutput) => void;
  initialValues?: Partial<FormValues>;
}

const CrtScenarioCalculator: React.FC<CrtScenarioCalculatorProps> = ({ 
  onScenarioCalculated,
  initialValues
}) => {
  const [result, setResult] = useState<CRTScenarioOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trustType: initialValues?.trustType || "CRAT",
      fundingAmount: initialValues?.fundingAmount || 100000,
      payoutRate: initialValues?.payoutRate || 5,
      term: initialValues?.term || "lifetime",
      beneficiaryAge: initialValues?.beneficiaryAge || 65,
      spouseBeneficiary: initialValues?.spouseBeneficiary || false,
      spouseAge: initialValues?.spouseAge || 65,
      discountRate: initialValues?.discountRate || 4.4,
      estateSubjectToTax: initialValues?.estateSubjectToTax || false,
      agiForLimits: initialValues?.agiForLimits || 200000
    }
  });

  const spouseBeneficiary = form.watch("spouseBeneficiary");
  const trustType = form.watch("trustType");
  const estateSubjectToTax = form.watch("estateSubjectToTax");
  
  const calculateResults = (values: FormValues) => {
    const scenarioResult = calculateCRTScenario({
      trustType: values.trustType,
      fundingAmount: values.fundingAmount,
      payoutRate: values.payoutRate,
      term: values.term,
      beneficiaryAge: values.beneficiaryAge,
      spouseBeneficiary: values.spouseBeneficiary,
      spouseAge: values.spouseAge,
      discountRate: values.discountRate,
      estateSubjectToTax: values.estateSubjectToTax,
      agiForLimits: values.agiForLimits
    });
    
    setResult(scenarioResult);
    if (onScenarioCalculated) {
      onScenarioCalculated(scenarioResult);
    }
  };

  const onSubmit = (values: FormValues) => {
    calculateResults(values);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      maximumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalculatorIcon className="h-5 w-5 text-primary" />
            CRT Scenario Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="trustType"
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
              
              <FormField
                control={form.control}
                name="fundingAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funding Amount</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input
                          type="number"
                          min={10000}
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <InfoTooltip text="The amount of assets you plan to place into the CRT. Generally, larger amounts make more sense due to setup costs." />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="payoutRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payout Rate: {field.value}%</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Slider
                          min={5}
                          max={50}
                          step={0.5}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                        />
                      </FormControl>
                      <InfoTooltip text="The percentage of the trust's value paid annually to the beneficiary. IRS requires a minimum 5% payout rate." />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="term"
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
              
              <FormField
                control={form.control}
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
              
              <FormField
                control={form.control}
                name="spouseBeneficiary"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Include Spouse as Beneficiary
                      </FormLabel>
                      <FormDescription>
                        Payments continue until the death of both beneficiaries
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
              
              {spouseBeneficiary && (
                <FormField
                  control={form.control}
                  name="spouseAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spouse Age</FormLabel>
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
                        <InfoTooltip text="Age of the spouse, used in the calculation of charitable deduction for lifetime CRTs." />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="discountRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IRS Section 7520 Rate (%)</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          min={0}
                          max={20}
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <InfoTooltip text="The IRS Section 7520 rate used for charitable calculations. This rate changes monthly and significantly affects deduction values." />
                    </div>
                    <FormDescription>
                      Current IRS Section 7520 rate is typically between 2-6%. Higher rates generally favor CRATs, while lower rates favor CRUTs.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="estateSubjectToTax"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Estate Subject to Federal Estate Tax
                      </FormLabel>
                      <FormDescription>
                        Estate expected to exceed federal exemption amount
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
              
              <FormField
                control={form.control}
                name="agiForLimits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your AGI (for deduction limits)</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <InfoTooltip text="Your Adjusted Gross Income, used to calculate deduction limitations. Charitable deductions are typically limited to a percentage of your AGI." />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">Calculate CRT Scenario</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>CRT Scenario Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-4">Tax Benefits</h4>
                <div className="space-y-4">
                  <div className="bg-background p-3 rounded-md border">
                    <div className="text-sm text-muted-foreground">Charitable Deduction</div>
                    <div className="text-xl font-medium">{formatCurrency(result.deduction)}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.deductionPercentage.toFixed(1)}% of funding amount
                    </div>
                  </div>
                  
                  {estateSubjectToTax && (
                    <div className="bg-background p-3 rounded-md border">
                      <div className="text-sm text-muted-foreground">Estate Tax Savings</div>
                      <div className="text-xl font-medium">{formatCurrency(result.estateReduction)}</div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Trust Projections</h4>
                <div className="space-y-4">
                  <div className="bg-background p-3 rounded-md border">
                    <div className="text-sm text-muted-foreground">
                      Annual {trustType === "CRAT" ? "Fixed" : "Initial"} Income
                    </div>
                    <div className="text-xl font-medium">{formatCurrency(result.annualIncome)}</div>
                    {trustType === "CRUT" && (
                      <div className="text-sm text-muted-foreground">
                        Will vary annually based on trust value
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-background p-3 rounded-md border">
                    <div className="text-sm text-muted-foreground">Projected Value to Charity</div>
                    <div className="text-xl font-medium">{formatCurrency(result.remainderToCharity)}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <Alert className="mt-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <h4 className="font-medium mb-1">Important Notes</h4>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  {result.disclaimers.map((disclaimer, index) => (
                    <li key={index}>{disclaimer}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-4">
            <Button variant="outline" onClick={() => form.handleSubmit(onSubmit)()}>
              Recalculate
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default CrtScenarioCalculator;
