
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
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CharitableScenario } from '../types/CharitableTypes';
import { ChevronsDown, AlertTriangle, AlertCircle } from 'lucide-react';

interface QcdStepProps {
  scenario: CharitableScenario;
  updateScenario: (data: Partial<CharitableScenario>) => void;
  onNext: () => void;
  onBack: () => void;
}

const formSchema = z.object({
  useQcd: z.boolean(),
  qcdAmount: z.number().min(0).max(100000),
});

export const QcdStep: React.FC<QcdStepProps> = ({ 
  scenario, 
  updateScenario, 
  onNext, 
  onBack 
}) => {
  // If user is under 70.5, they shouldn't be on this step
  if (scenario.age < 70.5) {
    React.useEffect(() => {
      onNext(); // Skip this step
    }, []);
    return null;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      useQcd: scenario.qcd.useQcd,
      qcdAmount: scenario.qcd.amount || 5000,
    },
  });

  const watchUseQcd = form.watch("useQcd");
  const watchQcdAmount = form.watch("qcdAmount");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateScenario({
      qcd: {
        useQcd: values.useQcd,
        amount: values.qcdAmount,
      },
    });
    onNext();
  };

  // Simple RMD estimate (very simplified)
  const estimatedRMD = Math.round((500000 / (90 - scenario.age)) / 100) * 100;
  const qcdMaxAmount = 100000;
  const isOverLimit = watchQcdAmount > qcdMaxAmount;

  return (
    <div className="space-y-6">
      <div className="bg-primary/10 border border-primary/20 rounded-md p-4">
        <div className="flex items-center space-x-3 mb-4">
          <ChevronsDown className="text-[#FFD700]" size={20} />
          <h3 className="font-medium text-lg">Qualified Charitable Distributions (QCDs)</h3>
        </div>
        
        <div className="bg-[#242A38] p-4 rounded-md mb-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-[#FFD700] shrink-0 mt-0.5" size={18} />
            <div className="text-sm">
              <p className="font-medium">QCD Benefits</p>
              <p className="text-muted-foreground mb-2">
                At age {scenario.age}, you can make Qualified Charitable Distributions (QCDs) 
                directly from your IRA to eligible charities, up to $100,000 annually.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Counts toward your Required Minimum Distribution (RMD)</li>
                <li>Excluded from your Adjusted Gross Income (AGI)</li>
                <li>May help avoid Medicare IRMAA surcharges</li>
                <li>Not subject to the 60% AGI charitable limitation</li>
              </ul>
            </div>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="useQcd"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-input p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Make Qualified Charitable Distributions</FormLabel>
                    <FormDescription>
                      Distribute funds directly from your IRA to qualified charities
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
            
            {watchUseQcd && (
              <FormField
                control={form.control}
                name="qcdAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>QCD Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-400">$</span>
                        <Input 
                          type="number" 
                          className={`pl-7 ${isOverLimit ? "border-red-400" : ""}`}
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Your estimated RMD is approximately ${estimatedRMD.toLocaleString()}. Using QCD can reduce or eliminate 
                      the taxable portion of your RMD.
                    </FormDescription>
                    
                    {isOverLimit && (
                      <div className="flex items-start space-x-2 mt-2 text-red-400">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                        <p className="text-xs">
                          QCDs are limited to $100,000 per year
                        </p>
                      </div>
                    )}
                  </FormItem>
                )}
              />
            )}
            
            {watchUseQcd && watchQcdAmount > 0 && (
              <div className="bg-[#242A38] p-4 rounded-md">
                <h4 className="font-medium mb-2 text-white">QCD Tax Impact</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">QCD Amount:</span>
                    <span className="text-white font-medium">${watchQcdAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Reduction in AGI:</span>
                    <span className="text-[#00C47C] font-medium">-${watchQcdAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Potential tax savings:</span>
                    <span className="text-[#00C47C] font-medium">
                      ~${Math.round(watchQcdAmount * 0.24).toLocaleString()}
                    </span>
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
              <Button type="submit">Continue</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
