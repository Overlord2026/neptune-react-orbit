
import React from 'react';
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { HeartHandshake } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CharitableScenario } from '../types/CharitableTypes';
import { useDebounce } from '@/hooks/useDebounce';
import AdvancedStrategiesToggle from '../components/AdvancedStrategiesToggle';

interface BasicGivingStepProps {
  scenario: CharitableScenario;
  updateScenario: (data: Partial<CharitableScenario>) => void;
  onNext: () => void;
}

const formSchema = z.object({
  amount: z.number().min(0, "Amount must be positive"),
  isItemizing: z.boolean(),
  age: z.number().min(18, "Must be at least 18").max(120, "Please enter a valid age"),
  advancedStrategies: z.boolean()
});

export const BasicGivingStep: React.FC<BasicGivingStepProps> = ({ 
  scenario, 
  updateScenario, 
  onNext 
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: scenario.annualGiving.amount || 0,
      isItemizing: scenario.isItemizing || false,
      age: scenario.age || 65,
      advancedStrategies: scenario.advancedStrategies || false
    }
  });

  // Update scenario when form changes (after debounce)
  const debouncedWatch = useDebounce(form.watch(), 500);
  
  React.useEffect(() => {
    const { amount, isItemizing, age, advancedStrategies } = debouncedWatch;
    
    if (amount !== undefined && isItemizing !== undefined && age !== undefined && advancedStrategies !== undefined) {
      updateScenario({
        annualGiving: {
          ...scenario.annualGiving,
          amount: amount
        },
        isItemizing,
        age,
        advancedStrategies
      });
    }
  }, [debouncedWatch, updateScenario, scenario]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Already updated via watch/useEffect, just proceed
    onNext();
  };

  return (
    <Card className="bg-primary/10 border border-primary/20">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <HeartHandshake className="text-[#FFD700]" size={24} />
          <h3 className="font-medium text-lg">Your Charitable Giving Profile</h3>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Charitable Giving</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(Number(e.target.value))}
                      placeholder="0"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the amount you typically donate to charity each year
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isItemizing"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Itemize Tax Deductions
                    </FormLabel>
                    <FormDescription>
                      Do you currently itemize your tax deductions?
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
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Age</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(Number(e.target.value))}
                      placeholder="65"
                    />
                  </FormControl>
                  <FormDescription>
                    Used to determine eligibility for age-specific strategies
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <AdvancedStrategiesToggle control={form.control} />
            
            <div className="pt-4">
              <Button type="submit" className="w-full">Continue</Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default BasicGivingStep;
