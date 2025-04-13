
import React, { useState } from 'react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CharitableScenario } from '../types/CharitableTypes';
import { AlertCircle } from 'lucide-react';

interface BasicGivingStepProps {
  scenario: CharitableScenario;
  updateScenario: (data: Partial<CharitableScenario>) => void;
  onNext: () => void;
}

const formSchema = z.object({
  givingType: z.enum(["fixed", "variable"]),
  amount: z.number().min(0),
  isItemizing: z.boolean(),
  age: z.number().min(0).max(120),
});

export const BasicGivingStep: React.FC<BasicGivingStepProps> = ({ 
  scenario, 
  updateScenario, 
  onNext 
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      givingType: scenario.annualGiving.type,
      amount: scenario.annualGiving.amount,
      isItemizing: scenario.isItemizing,
      age: scenario.age,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateScenario({
      annualGiving: {
        type: values.givingType,
        amount: values.amount,
      },
      isItemizing: values.isItemizing,
      age: values.age,
    });
    onNext();
  };

  // Check if user is eligible for QCD
  const isEligibleForQCD = form.watch("age") >= 70.5;

  return (
    <div className="space-y-6">
      <div className="bg-primary/10 border border-primary/20 rounded-md p-4">
        <h3 className="font-medium text-lg mb-2">Basic Giving Profile</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Tell us about your charitable giving plans and tax situation.
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="givingType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>How do you plan to give?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id="fixed" />
                        <FormLabel htmlFor="fixed" className="cursor-pointer">
                          Fixed annual amount
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="variable" id="variable" />
                        <FormLabel htmlFor="variable" className="cursor-pointer">
                          Variable amount over time
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{form.watch("givingType") === "fixed" ? "Annual giving amount" : "First year giving amount"}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-400">$</span>
                      <Input 
                        type="number" 
                        className="pl-7" 
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)} 
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isItemizing"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>I typically itemize deductions on my tax return</FormLabel>
                    <FormDescription className="text-xs">
                      If you're not itemizing deductions, charitable contributions won't directly reduce your taxes unless they help you exceed the standard deduction.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your age</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {isEligibleForQCD && (
              <div className="bg-[#242A38] p-4 rounded-md flex items-start space-x-3">
                <AlertCircle className="text-[#FFD700] shrink-0 mt-0.5" size={18} />
                <div className="text-sm">
                  <p className="font-medium text-white">QCD Eligible</p>
                  <p className="text-muted-foreground">
                    At age {form.watch("age")}, you're eligible for Qualified Charitable Distributions (QCDs) directly from your IRA, which can reduce your Required Minimum Distributions and lower your Adjusted Gross Income.
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button type="submit">Continue</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
