import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { useCharitable } from '../context/CharitableContext';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CharitableScenario, CharitableRemainderTrust } from '../types/CharitableTypes';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Gift } from "lucide-react";
import InfoTooltip from '@/components/tax/InfoTooltip';
import StepNavButtons from '../components/StepNavButtons';
import { calculateCrtBenefits } from '../utils/crtCalculationUtils';

interface CrtStepProps {
  scenario: CharitableScenario;
  updateScenario: (data: Partial<CharitableScenario>) => void;
  onNext: () => void;
  onBack: () => void;
}

const formSchema = z.object({
  useCrt: z.boolean(),
  type: z.enum(["CRAT", "CRUT"]),
  fundingAmount: z.number().min(10000, "Minimum funding is $10,000"),
  payoutRate: z.number().min(5, "Minimum 5%").max(50, "Maximum 50%"),
  trustTerm: z.union([z.number().min(2, "Minimum 2 years"), z.literal("lifetime")]),
  beneficiaryAge: z.number().min(18, "Minimum age is 18").max(120, "Maximum age is 120"),
  spouseBeneficiary: z.boolean(),
  spouseAge: z.number().optional(),
});

export const CrtStep: React.FC<CrtStepProps> = ({ 
  scenario, 
  updateScenario, 
  onNext, 
  onBack 
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      useCrt: scenario.crt?.useCrt || false,
      type: scenario.crt?.type || "CRAT",
      fundingAmount: scenario.crt?.fundingAmount || 100000,
      payoutRate: scenario.crt?.payoutRate || 5,
      trustTerm: scenario.crt?.trustTerm || "lifetime",
      beneficiaryAge: scenario.crt?.beneficiaryAge || 65,
      spouseBeneficiary: scenario.crt?.spouseBeneficiary || false,
      spouseAge: scenario.crt?.spouseAge || 65
    },
  });

  const useCrt = form.watch("useCrt");
  const type = form.watch("type");
  const fundingAmount = form.watch("fundingAmount");
  const payoutRate = form.watch("payoutRate");
  const trustTerm = form.watch("trustTerm");
  const beneficiaryAge = form.watch("beneficiaryAge");
  const spouseBeneficiary = form.watch("spouseBeneficiary");
  
  const crtBenefits = useCrt ? calculateCrtBenefits({
    type,
    fundingAmount,
    payoutRate,
    trustTerm,
    beneficiaryAge,
    spouseBeneficiary,
    spouseAge: form.watch("spouseAge")
  }) : { immediateDeduction: 0, annualPayout: 0 };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const crtData: CharitableRemainderTrust = {
      useCrt: values.useCrt,
      type: values.type,
      fundingAmount: values.fundingAmount,
      payoutRate: values.payoutRate,
      trustTerm: values.trustTerm,
      beneficiaryAge: values.beneficiaryAge,
      spouseBeneficiary: values.spouseBeneficiary,
      spouseAge: values.spouseAge
    };

    updateScenario({ crt: crtData });
    onNext();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/10 border border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Gift className="text-[#FFD700]" size={20} />
            <h3 className="font-medium text-lg">Charitable Remainder Trust (CRT)</h3>
            <InfoTooltip text="A CRT allows you to donate assets to charity while maintaining an income stream, providing immediate tax deductions and potential income tax savings." />
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="useCrt"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Use Charitable Remainder Trust
                      </FormLabel>
                      <FormDescription>
                        Establish a CRT to provide income and tax benefits
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
              
              {useCrt && (
                <>
                  <FormField
                    control={form.control}
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
                          <InfoTooltip content="The amount of assets you plan to place into the CRT. Generally, larger amounts make more sense due to setup costs." />
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
                          <InfoTooltip content="The percentage of the trust's value paid annually to the beneficiary. IRS requires a minimum 5% payout rate." />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="trustTerm"
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
                          <InfoTooltip content="The period over which the trust will make payments before the remainder goes to charity. Lifetime terms are based on life expectancy." />
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
                          <InfoTooltip content="Age of the primary income beneficiary. For lifetime CRTs, this affects the charitable deduction calculation." />
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
                            <InfoTooltip content="Age of the spouse, used in the calculation of charitable deduction for lifetime CRTs." />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <div className="bg-primary/5 rounded-md p-4">
                    <h4 className="font-medium mb-2">Estimated Benefits</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Charitable Deduction</div>
                        <div className="text-xl font-medium">${Math.round(crtBenefits.immediateDeduction).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Annual Payout</div>
                        <div className="text-xl font-medium">${Math.round(crtBenefits.annualPayout).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              <StepNavButtons
                onBack={onBack}
                isSubmitting={form.formState.isSubmitting}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrtStep;
