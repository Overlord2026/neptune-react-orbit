
import React, { useState } from 'react';
import { CharitableScenario } from '../types/CharitableTypes';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import StepNavButtons from '../components/StepNavButtons';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

interface CrtStepProps {
  scenario: CharitableScenario;
  updateScenario: (data: Partial<CharitableScenario>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Validation schema
const formSchema = z.object({
  useCrt: z.boolean(),
  type: z.enum(["CRAT", "CRUT"]),
  fundingAmount: z.number().min(10000, "Minimum funding amount is $10,000"),
  payoutRate: z.number().min(5, "Minimum payout is 5%").max(50, "Maximum payout is 50%"),
  trustTerm: z.union([z.literal("lifetime"), z.number().int().min(2, "Minimum term is 2 years").max(20, "Maximum term is 20 years")]),
  beneficiaryAge: z.number().min(18, "Beneficiary must be at least 18 years old"),
  spouseBeneficiary: z.boolean(),
  spouseAge: z.number().optional(),
});

export const CrtStep: React.FC<CrtStepProps> = ({ 
  scenario, 
  updateScenario, 
  onNext, 
  onBack 
}) => {
  // Initialize form with scenario data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      useCrt: scenario.crt?.useCrt || false,
      type: scenario.crt?.type || "CRAT",
      fundingAmount: scenario.crt?.fundingAmount || 100000,
      payoutRate: scenario.crt?.payoutRate || 5,
      trustTerm: scenario.crt?.trustTerm || "lifetime",
      beneficiaryAge: scenario.crt?.beneficiaryAge || scenario.age,
      spouseBeneficiary: scenario.crt?.spouseBeneficiary || false,
      spouseAge: scenario.crt?.spouseAge,
    },
  });

  const watchUseCrt = form.watch("useCrt");
  const watchType = form.watch("type");
  const watchTrustTerm = form.watch("trustTerm");
  const watchSpouse = form.watch("spouseBeneficiary");

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateScenario({
      crt: {
        useCrt: values.useCrt,
        type: values.type,
        fundingAmount: values.fundingAmount,
        payoutRate: values.payoutRate,
        trustTerm: values.trustTerm,
        beneficiaryAge: values.beneficiaryAge,
        spouseBeneficiary: values.spouseBeneficiary,
        spouseAge: values.spouseBeneficiary ? values.spouseAge : undefined,
      }
    });
    onNext();
  };

  const [showInfoCard, setShowInfoCard] = useState(false);

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6 bg-[#242A38] text-white">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Charitable Remainder Trust (CRT)</h3>
                <p className="text-gray-300">
                  CRTs let you (and/or your spouse) receive an income stream for life or a term of years, 
                  with the remainder going to charity.
                </p>
              </div>

              <FormField
                control={form.control}
                name="useCrt"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-700 p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Include a Charitable Remainder Trust</FormLabel>
                      <FormDescription className="text-sm text-gray-400">
                        Explore how a CRT could fit into your charitable giving strategy
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

              {watchUseCrt && (
                <>
                  <Alert variant="default" className="bg-[#1A1F2C]/80 border-orange-600">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <AlertTitle>CRTs are complex legal arrangements</AlertTitle>
                    <AlertDescription>
                      This tool provides educational estimates only. CRTs require attorney setup, have minimum payout requirements, 
                      and must comply with IRS regulations. Actual deduction amounts depend on IRS Section 7520 rates at time of funding.
                    </AlertDescription>
                  </Alert>

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Trust Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="CRAT" id="trust-crat" />
                              <Label htmlFor="trust-crat" className="flex items-center">
                                <span>Annuity Trust (CRAT) - Fixed annual payment</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="ml-2 h-4 w-4 text-gray-300 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="max-w-xs">
                                      <p>A CRAT pays a fixed dollar amount each year based on the initial funding value.</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="CRUT" id="trust-crut" />
                              <Label htmlFor="trust-crut" className="flex items-center">
                                <span>Unitrust (CRUT) - Variable payment based on annual valuation</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="ml-2 h-4 w-4 text-gray-300 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="max-w-xs">
                                      <p>A CRUT pays a percentage of the trust's value as recalculated annually, allowing potential growth in payments.</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fundingAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Funding Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                              <Input
                                type="number"
                                className="pl-8"
                                {...form.register("fundingAmount", { 
                                  valueAsNumber: true,
                                })}
                              />
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs text-gray-400">
                            Assets transferred to establish the trust
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="payoutRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payout Rate</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                className="pr-8"
                                step="0.1"
                                {...form.register("payoutRate", { 
                                  valueAsNumber: true,
                                })}
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs text-gray-400">
                            Typically between 5% and 8%. {watchType === "CRAT" ? "Must be at least 5% of initial value." : "Must be at least 5% of annual value."}
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="trustTerm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trust Term</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <RadioGroup
                              onValueChange={(value) => field.onChange(value === "lifetime" ? "lifetime" : parseInt(value))}
                              defaultValue={field.value.toString()}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="lifetime" id="term-lifetime" />
                                <Label htmlFor="term-lifetime">Lifetime</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="years" id="term-years" />
                                <Label htmlFor="term-years">Fixed Term (in years)</Label>
                              </div>
                            </RadioGroup>
                            
                            {watchTrustTerm !== "lifetime" && (
                              <Input 
                                type="number" 
                                min="2" 
                                max="20" 
                                className="w-full md:w-1/3" 
                                {...form.register("trustTerm", { 
                                  valueAsNumber: true,
                                })}
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs text-gray-400">
                          Term of years must be between 2 and 20 years
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="beneficiaryAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Beneficiary Age</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...form.register("beneficiaryAge", { 
                                valueAsNumber: true,
                              })}
                            />
                          </FormControl>
                          <FormDescription className="text-xs text-gray-400">
                            Your current age (for income benefits)
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="spouseBeneficiary"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-700 p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Include Spouse as Beneficiary</FormLabel>
                            <FormDescription className="text-xs text-gray-400">
                              Continues payments until both spouses pass away
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
                  </div>

                  {watchSpouse && (
                    <FormField
                      control={form.control}
                      name="spouseAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Spouse Age</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...form.register("spouseAge", { 
                                valueAsNumber: true,
                              })}
                            />
                          </FormControl>
                          <FormDescription className="text-xs text-gray-400">
                            Required if spouse is a beneficiary
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  )}
                </>
              )}
            </div>

            <StepNavButtons 
              onBack={onBack} 
              submitButtonText="Continue" 
              isSubmitDisabled={false}
              className="mt-8"
            />
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default CrtStep;
