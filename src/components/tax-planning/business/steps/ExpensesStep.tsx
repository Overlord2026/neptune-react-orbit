
import React, { useState } from 'react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { BusinessIncomeInput } from '@/utils/tax/businessTaxCalculator';
import { ArrowLeft, ArrowRight, PlusCircle, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { formatCurrency } from '@/utils/formatUtils';

interface ExpensesStepProps {
  businessInput: BusinessIncomeInput;
  updateBusinessInput: (updates: Partial<BusinessIncomeInput>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const commonExpenseTypes = [
  { id: 'supplies', name: 'Supplies & Materials' },
  { id: 'advertising', name: 'Advertising & Marketing' },
  { id: 'travel', name: 'Travel' },
  { id: 'insurance', name: 'Business Insurance' },
  { id: 'utilities', name: 'Utilities' },
  { id: 'professional_fees', name: 'Professional Fees' },
  { id: 'education', name: 'Education & Training' },
];

const formSchema = z.object({
  expenses: z.record(z.string(), z.number().min(0, "Expense must be a positive number")),
  useHomeOffice: z.boolean().optional(),
  homeOfficePercent: z.number().min(0).max(100).optional(),
  homeOfficeExpenses: z.number().min(0).optional(),
  sCorpWages: z.number().min(0).optional(),
  sCorpDistributions: z.number().min(0).optional(),
  partnershipShare: z.number().min(0).optional(),
});

const ExpensesStep: React.FC<ExpensesStepProps> = ({ 
  businessInput, 
  updateBusinessInput,
  onNext,
  onPrev
}) => {
  const [customExpenses, setCustomExpenses] = useState<string[]>([]);
  const [newExpenseName, setNewExpenseName] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expenses: businessInput.expenses || {},
      useHomeOffice: businessInput.useHomeOffice || false,
      homeOfficePercent: businessInput.homeOfficePercent || 0,
      homeOfficeExpenses: businessInput.homeOfficeExpenses || 0,
      sCorpWages: businessInput.sCorpWages || 0,
      sCorpDistributions: businessInput.sCorpDistributions || 0,
      partnershipShare: businessInput.partnershipShare || 0,
    },
  });

  const useHomeOffice = form.watch('useHomeOffice');
  const expenses = form.watch('expenses');
  const isSCorp = businessInput.businessType === 's_corp';
  const isPartnership = businessInput.businessType === 'partnership';

  // Calculate total expenses
  const totalStandardExpenses = Object.values(expenses || {}).reduce((sum, value) => sum + (value || 0), 0);
  const homeOfficeAmount = useHomeOffice ? (form.watch('homeOfficeExpenses') || 0) : 0;
  const totalExpenses = totalStandardExpenses + homeOfficeAmount;

  const addCustomExpense = () => {
    if (newExpenseName.trim() !== "") {
      setCustomExpenses([...customExpenses, newExpenseName.trim()]);
      setNewExpenseName("");
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateBusinessInput({
      expenses: values.expenses,
      useHomeOffice: values.useHomeOffice,
      homeOfficePercent: values.homeOfficePercent,
      homeOfficeExpenses: values.homeOfficeExpenses,
      sCorpWages: values.sCorpWages,
      sCorpDistributions: values.sCorpDistributions,
      partnershipShare: values.partnershipShare,
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Business Expenses</h3>
        <p className="text-muted-foreground">Enter your estimated annual business expenses</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Summary Card */}
          <Card className="border-[#2A2F3C] bg-[#1A1F2C]/50">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Revenue:</p>
                  <p className="font-semibold text-white">{formatCurrency(businessInput.income)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Expenses:</p>
                  <p className="font-semibold text-white">{formatCurrency(totalExpenses)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Net Profit:</p>
                  <p className="font-semibold text-white">{formatCurrency(businessInput.income - totalExpenses)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Common Expenses */}
          <div className="space-y-4">
            <h4 className="font-medium text-white">Common Business Expenses</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {commonExpenseTypes.map((expense) => (
                <FormField
                  key={expense.id}
                  control={form.control}
                  name={`expenses.${expense.id}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{expense.name}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
          
          {/* Custom Expenses */}
          {customExpenses.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-white">Custom Expenses</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {customExpenses.map((expenseName, index) => (
                  <FormField
                    key={`custom_${index}`}
                    control={form.control}
                    name={`expenses.custom_${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{expenseName}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Add Custom Expense */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add another expense type..."
              value={newExpenseName}
              onChange={(e) => setNewExpenseName(e.target.value)}
              className="max-w-xs"
            />
            <Button 
              type="button" 
              variant="outline"
              size="icon"
              onClick={addCustomExpense}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Home Office Deduction */}
          <div className="space-y-4 pt-4 border-t border-[#2A2F3C]">
            <FormField
              control={form.control}
              name="useHomeOffice"
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
                      I use part of my home regularly and exclusively for business
                    </FormLabel>
                    <FormDescription>
                      You may be eligible for the home office deduction.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            {useHomeOffice && (
              <div className="grid grid-cols-1 gap-4 pl-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="homeOfficePercent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Home Office Percentage
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">The percentage of your home used for business. If your home is 1,000 sq ft and your office is 100 sq ft, enter 10%.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                            className="mr-2"
                          />
                          <span>%</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="homeOfficeExpenses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home Office Expenses</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
          
          {/* S-Corporation specific fields */}
          {isSCorp && (
            <div className="space-y-4 pt-4 border-t border-[#2A2F3C]">
              <h4 className="font-medium text-white flex items-center gap-2">
                S-Corporation Income Allocation
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">S-Corporation owners must pay themselves a "reasonable salary" before taking distributions. The IRS scrutinizes this allocation.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="sCorpWages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner Salary (W-2 Wages)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sCorpDistributions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distributions</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Note: The sum of wages and distributions should approximately equal your net profit.
              </p>
            </div>
          )}
          
          {/* Partnership specific fields */}
          {isPartnership && (
            <div className="space-y-4 pt-4 border-t border-[#2A2F3C]">
              <h4 className="font-medium text-white">Partnership Information</h4>
              <FormField
                control={form.control}
                name="partnershipShare"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Share of Partnership Net Profit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          
          {/* Navigation buttons */}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onPrev}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button type="submit">
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ExpensesStep;
