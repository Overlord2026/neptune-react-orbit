
import React from 'react';
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
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CharitableScenario } from '../types/CharitableTypes';
import { Coins, ArrowLeftRight } from 'lucide-react';

interface DafBunchingStepProps {
  scenario: CharitableScenario;
  updateScenario: (data: Partial<CharitableScenario>) => void;
  onNext: () => void;
  onBack: () => void;
}

const formSchema = z.object({
  useDaf: z.boolean(),
  approach: z.enum(["annual", "bunching"]),
  bunchingYears: z.number().min(1).max(10),
  bunchingAmount: z.number().optional(),
});

export const DafBunchingStep: React.FC<DafBunchingStepProps> = ({ 
  scenario, 
  updateScenario, 
  onNext,
  onBack
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      useDaf: scenario.dafStrategy.useDaf,
      approach: scenario.dafStrategy.approach,
      bunchingYears: scenario.dafStrategy.bunchingYears,
      bunchingAmount: scenario.dafStrategy.bunchingAmount || scenario.annualGiving.amount * 2,
    },
  });

  const watchApproach = form.watch("approach");
  const watchUseDaf = form.watch("useDaf");
  const watchBunchingYears = form.watch("bunchingYears");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateScenario({
      dafStrategy: {
        useDaf: values.useDaf,
        approach: values.approach,
        bunchingYears: values.bunchingYears,
        bunchingAmount: values.bunchingAmount,
      },
    });
    onNext();
  };

  const calculatedAnnualAmount = scenario.annualGiving.amount;
  const suggestedBunchingAmount = calculatedAnnualAmount * watchBunchingYears;

  return (
    <div className="space-y-6">
      <div className="bg-primary/10 border border-primary/20 rounded-md p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Coins className="text-[#FFD700]" size={20} />
          <h3 className="font-medium text-lg">Donor-Advised Fund & Bunching Strategy</h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          A Donor-Advised Fund (DAF) allows you to make a large charitable contribution in one year to maximize tax benefits, 
          while distributing the actual grants to charities over multiple years.
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="useDaf"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-input p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Use a Donor-Advised Fund</FormLabel>
                    <FormDescription>
                      Contribute to a DAF to separate tax deduction timing from charitable giving timing
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
            
            {watchUseDaf && (
              <FormField
                control={form.control}
                name="approach"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Contribution Strategy</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-3"
                      >
                        <div className="flex items-center space-x-2 rounded-lg border border-input p-3">
                          <RadioGroupItem value="annual" id="annual" />
                          <FormLabel htmlFor="annual" className="cursor-pointer flex-1">
                            <div className="font-medium">Annual Contributions</div>
                            <div className="text-sm text-muted-foreground">
                              Contribute your normal giving amount each year
                            </div>
                          </FormLabel>
                        </div>
                        
                        <div className="flex items-center space-x-2 rounded-lg border border-input p-3">
                          <RadioGroupItem value="bunching" id="bunching" />
                          <FormLabel htmlFor="bunching" className="cursor-pointer flex-1">
                            <div className="font-medium">Bunching Strategy</div>
                            <div className="text-sm text-muted-foreground">
                              Make larger contributions in specific years to exceed the standard deduction
                            </div>
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            
            {watchUseDaf && watchApproach === "bunching" && (
              <>
                <FormField
                  control={form.control}
                  name="bunchingYears"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of years to bunch</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1}
                          max={10}
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 2)} 
                        />
                      </FormControl>
                      <FormDescription>
                        Contribute {watchBunchingYears} years worth of donations in a single year, then skip the next {watchBunchingYears - 1} years
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bunchingAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bunched contribution amount</FormLabel>
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
                      <FormDescription>
                        Suggested amount: ${suggestedBunchingAmount.toLocaleString()} 
                        ({watchBunchingYears} × ${calculatedAnnualAmount.toLocaleString()})
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <div className="bg-[#242A38] p-4 rounded-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <ArrowLeftRight className="text-[#FFD700]" size={16} />
                    <h4 className="font-medium">Bunching Strategy Preview</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    In Year 1, contribute ${form.watch("bunchingAmount")?.toLocaleString() || suggestedBunchingAmount.toLocaleString()} to your DAF.
                    Then take the standard deduction for the next {watchBunchingYears - 1} years while continuing to give from your DAF.
                  </p>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {[...Array(Math.min(5, watchBunchingYears + 2))].map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`p-2 rounded text-center text-xs ${
                          idx === 0 
                            ? "bg-[#00C47C]/20 border border-[#00C47C]/40" 
                            : "bg-[#242A38] border border-[#333]"
                        }`}
                      >
                        <div className="font-medium">Year {idx + 1}</div>
                        <div className={idx === 0 ? "text-[#00C47C]" : "text-muted-foreground"}>
                          {idx === 0 ? "Itemize" : "Standard"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            <div className="flex justify-between pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
              >
                Back
              </Button>
              <Button type="submit">Continue</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
