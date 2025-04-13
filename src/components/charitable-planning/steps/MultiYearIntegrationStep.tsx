
import React from 'react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormDescription 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CharitableScenario } from '../types/CharitableTypes';
import { Calendar, PanelRight } from 'lucide-react';

interface MultiYearIntegrationStepProps {
  scenario: CharitableScenario;
  updateScenario: (data: Partial<CharitableScenario>) => void;
  onNext: () => void;
  onBack: () => void;
}

const formSchema = z.object({
  isIntegrated: z.boolean(),
});

export const MultiYearIntegrationStep: React.FC<MultiYearIntegrationStepProps> = ({ 
  scenario, 
  updateScenario, 
  onNext, 
  onBack 
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isIntegrated: scenario.multiYearPlan.isIntegrated,
    },
  });

  const watchIsIntegrated = form.watch("isIntegrated");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Generate a 5-year projection based on selected strategies
    const years = generateMultiYearPlan(scenario, values.isIntegrated);
    
    updateScenario({
      multiYearPlan: {
        isIntegrated: values.isIntegrated,
        years,
      },
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary/10 border border-primary/20 rounded-md p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="text-[#FFD700]" size={20} />
          <h3 className="font-medium text-lg">Multi-Year Integration</h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          See how your charitable giving strategy plays out over multiple years, and how it integrates 
          with your broader tax planning strategy.
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="isIntegrated"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-input p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Integrate with Multi-Year Tax Plan</FormLabel>
                    <FormDescription>
                      Incorporate these charitable strategies into your broader tax planning
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
            
            {watchIsIntegrated && (
              <div className="bg-[#242A38] p-4 rounded-md flex items-start space-x-3">
                <PanelRight className="text-[#FFD700] shrink-0 mt-0.5" size={18} />
                <div className="text-sm">
                  <p className="font-medium text-white">Multi-Year Preview</p>
                  <p className="text-muted-foreground mb-3">
                    Based on your selections, we'll generate a 5-year plan showing how your charitable giving 
                    impacts your taxes each year.
                  </p>
                  
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-[#1A1F2C] p-2 rounded text-center">
                        <div className="text-white font-medium">Year 1</div>
                        {scenario.dafStrategy.approach === "bunching" ? (
                          <div className="text-[#00C47C]">Large Contribution</div>
                        ) : (
                          <div className="text-muted-foreground">Standard Giving</div>
                        )}
                      </div>
                      <div className="bg-[#1A1F2C] p-2 rounded text-center">
                        <div className="text-white font-medium">Year 2</div>
                        {scenario.dafStrategy.approach === "bunching" ? (
                          <div className="text-amber-500">Standard Deduction</div>
                        ) : (
                          <div className="text-muted-foreground">Standard Giving</div>
                        )}
                      </div>
                      <div className="bg-[#1A1F2C] p-2 rounded text-center">
                        <div className="text-white font-medium">Year 3</div>
                        {scenario.dafStrategy.approach === "bunching" && scenario.dafStrategy.bunchingYears <= 2 ? (
                          <div className="text-[#00C47C]">Large Contribution</div>
                        ) : (
                          <div className="text-muted-foreground">Standard Giving</div>
                        )}
                      </div>
                    </div>
                    
                    {scenario.qcd.useQcd && (
                      <div className="bg-[#1A1F2C] p-2 rounded text-xs">
                        <div className="text-white font-medium">QCD Impact</div>
                        <div className="text-[#00C47C]">
                          ${scenario.qcd.amount.toLocaleString()} QCD each year reduces AGI
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
              >
                Back
              </Button>
              <Button type="submit">Continue to Results</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

// Helper function to generate a multi-year plan based on the scenario
const generateMultiYearPlan = (scenario: CharitableScenario, isIntegrated: boolean) => {
  if (!isIntegrated) return [];
  
  const currentYear = new Date().getFullYear();
  const standardDeduction = 12950; // Simplified for demo
  let years = [];
  
  for (let i = 0; i < 5; i++) {
    const year = currentYear + i;
    let contribution = scenario.annualGiving.amount;
    
    // If bunching strategy is selected, adjust contribution based on the cycle
    if (scenario.dafStrategy.useDaf && scenario.dafStrategy.approach === "bunching") {
      const cyclePosition = i % scenario.dafStrategy.bunchingYears;
      contribution = cyclePosition === 0 ? (scenario.dafStrategy.bunchingAmount || contribution * scenario.dafStrategy.bunchingYears) : 0;
    }
    
    // If variable giving is selected and we have data for this year, use that instead
    if (scenario.annualGiving.type === "variable" && scenario.annualGiving.yearlyAmounts) {
      const yearlyAmount = scenario.annualGiving.yearlyAmounts.find(y => y.year === year);
      if (yearlyAmount) {
        contribution = yearlyAmount.amount;
      }
    }
    
    // Calculate itemized deduction total (simplified)
    const otherItemizedDeductions = 5000; // Placeholder for other deductions
    const itemizedTotal = contribution + otherItemizedDeductions;
    
    // Determine if itemizing makes sense for this year
    const isItemizing = itemizedTotal > standardDeduction;
    
    // Calculate tax savings (simplified)
    const marginalRate = 0.24; // Example rate
    const taxSavings = isItemizing ? (itemizedTotal - standardDeduction) * marginalRate : 0;
    
    years.push({
      year,
      contribution,
      isItemizing,
      standardDeduction,
      itemizedTotal,
      taxSavings
    });
  }
  
  return years;
};

export default MultiYearIntegrationStep;
