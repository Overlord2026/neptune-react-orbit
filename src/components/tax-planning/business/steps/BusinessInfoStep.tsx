
import React from 'react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { BusinessIncomeInput } from '@/utils/tax/businessTaxCalculator';
import { ArrowRight, Info } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface BusinessInfoStepProps {
  businessInput: BusinessIncomeInput;
  updateBusinessInput: (updates: Partial<BusinessIncomeInput>) => void;
  setShowComparison: (show: boolean) => void;
  setShowMultiYear: (show: boolean) => void;
  onNext: () => void;
}

const formSchema = z.object({
  businessType: z.enum(['sole_proprietorship', 'single_member_llc', 's_corp', 'partnership']),
  businessName: z.string().optional(),
  income: z.number().min(0, "Income must be a positive number"),
  year: z.number().min(2023).max(2025),
  interestedInSCorp: z.boolean().optional(),
  interestedInMultiYear: z.boolean().optional(),
});

const BusinessInfoStep: React.FC<BusinessInfoStepProps> = ({ 
  businessInput, 
  updateBusinessInput,
  setShowComparison,
  setShowMultiYear,
  onNext 
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessType: businessInput.businessType,
      businessName: '',
      income: businessInput.income,
      year: businessInput.year,
      interestedInSCorp: false,
      interestedInMultiYear: false,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateBusinessInput({
      businessType: values.businessType,
      income: values.income,
      year: values.year,
    });
    
    setShowComparison(!!values.interestedInSCorp);
    setShowMultiYear(!!values.interestedInMultiYear);
    
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Basic Business Information</h3>
        <p className="text-muted-foreground">Tell us about your business structure and income</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="businessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Business Entity Type
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Your business structure affects how you pay taxes. Ask a tax professional if you're unsure.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                      <SelectItem value="single_member_llc">Single-Member LLC</SelectItem>
                      <SelectItem value="s_corp">S Corporation</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Business Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Estimated Annual Revenue
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Your total business income before expenses.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
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
                  <Select
                    onValueChange={value => field.onChange(Number(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025 (Projected)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="interestedInSCorp"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I'm interested in comparing different entity structures (like S-Corporation)
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="interestedInMultiYear"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I want to see multi-year tax projections for my business
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
          
          <Button type="submit" className="w-full">
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BusinessInfoStep;
