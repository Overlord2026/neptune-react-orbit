
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, BarChart3, PieChart } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { calculateTaxScenario, saveScenario, FilingStatus } from '@/utils/taxCalculator';

// Define the form schema with zod
const formSchema = z.object({
  wages: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Wages must be a non-negative number",
  }),
  interest: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Interest must be a non-negative number",
  }),
  qualifiedDividends: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Qualified dividends must be a non-negative number",
  }),
  iraDistributions: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "IRA distributions must be a non-negative number",
  }),
  rothConversion: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Roth conversion must be a non-negative number",
  }),
  socialSecurity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Social security must be a non-negative number",
  }),
  capitalGains: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Capital gains must be a non-negative number",
  }),
  filingStatus: z.enum(['single', 'married', 'head_of_household']),
  deductionType: z.enum(["standard", "itemized"]),
  itemizedDeduction: z.string().optional().refine((val) => !val || !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Itemized deduction must be a non-negative number",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const Scenario2021Return = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    agi: number;
    taxable_income: number;
    total_tax: number;
    marginal_rate: number;
    effective_rate: number;
    refundOrOwed: number;
  } | null>(null);
  
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wages: "75000",
      interest: "1000",
      qualifiedDividends: "500",
      iraDistributions: "0",
      rothConversion: "0",
      socialSecurity: "0",
      capitalGains: "2500",
      filingStatus: "single",
      deductionType: "standard",
      itemizedDeduction: "",
    },
  });

  const watchDeductionType = form.watch("deductionType");

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    
    try {
      // Convert string inputs to numbers
      const wages = Number(data.wages);
      const interest = Number(data.interest);
      const dividends = Number(data.qualifiedDividends);
      const ira_distributions = Number(data.iraDistributions);
      const roth_conversion = Number(data.rothConversion);
      const social_security = Number(data.socialSecurity);
      const capital_gains = Number(data.capitalGains);
      const itemizedDeductionAmount = data.itemizedDeduction ? Number(data.itemizedDeduction) : 0;
      
      // Use the tax calculator utility
      const result = calculateTaxScenario({
        year: 2021,
        wages,
        interest,
        dividends,
        capital_gains,
        ira_distributions,
        roth_conversion,
        social_security,
        isItemizedDeduction: data.deductionType === "itemized",
        itemizedDeductionAmount: data.deductionType === "itemized" ? itemizedDeductionAmount : undefined,
        filing_status: data.filingStatus as FilingStatus,
      }, "2021 Base Scenario");
      
      // Save the result
      await saveScenario(result);
      
      // Assuming withholding based on a simple calculation (40% of total income tax for demo purposes)
      const assumedWithholding = result.total_tax * 0.4;
      const refundOrOwed = assumedWithholding - result.total_tax;
      
      // Update the UI with results
      setResults({
        agi: result.agi,
        taxable_income: result.taxable_income,
        total_tax: result.total_tax,
        marginal_rate: result.marginal_rate,
        effective_rate: result.effective_rate,
        refundOrOwed
      });
      
      toast({
        title: "Calculation Complete",
        description: "Your 2021 tax scenario has been calculated.",
      });
    } catch (error) {
      console.error("Error calculating tax scenario:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error calculating your tax scenario.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row items-center justify-between pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight neptune-gold">
            2021 Tax Return Analysis
          </h1>
          <p className="text-muted-foreground">
            Enter or review your 2021 income, deductions, and any Roth conversion amounts. 
            The tool will calculate your total tax, marginal rate, and effective tax rate.
          </p>
        </div>
        <Link to="/tax-planning/roth-analysis" className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Analysis
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="bg-card border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl neptune-gold">Input Your 2021 Tax Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="wages"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wages/Salary ($)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter amount" 
                              {...field} 
                              className={field.value === "0" ? "" : "border-primary/40"} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="interest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interest ($)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter amount" 
                              {...field} 
                              className={field.value === "0" ? "" : "border-primary/40"} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="qualifiedDividends"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qualified Dividends ($)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter amount" 
                              {...field} 
                              className={field.value === "0" ? "" : "border-primary/40"} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="iraDistributions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IRA Distributions ($)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter amount" 
                              {...field} 
                              className={field.value === "0" ? "" : "border-primary/40"} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rothConversion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Roth Conversion ($)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter amount" 
                              {...field}
                              className={field.value === "0" ? "" : "border-primary/50 bg-primary/5"} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="socialSecurity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Social Security Received ($)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter amount" 
                              {...field} 
                              className={field.value === "0" ? "" : "border-primary/40"} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="capitalGains"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capital Gains ($)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter amount" 
                              {...field} 
                              className={field.value === "0" ? "" : "border-primary/40"} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="filingStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Filing Status</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="single" id="single" />
                                <Label htmlFor="single">Single</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="married" id="married" />
                                <Label htmlFor="married">Married Filing Jointly</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="head_of_household" id="head_of_household" />
                                <Label htmlFor="head_of_household">Head of Household</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4 border-t pt-4">
                    <FormField
                      control={form.control}
                      name="deductionType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Deduction Type</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="standard" id="standard" />
                                <Label htmlFor="standard">Standard Deduction</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="itemized" id="itemized" />
                                <Label htmlFor="itemized">Itemized Deduction</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {watchDeductionType === "itemized" && (
                      <FormField
                        control={form.control}
                        name="itemizedDeduction"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Itemized Deduction Amount ($)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter itemized deduction amount" 
                                {...field} 
                                className={field.value === "0" ? "" : "border-primary/40"} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="bg-[#FFD700] hover:bg-[#E5C100] text-black w-full sm:w-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? "Calculating..." : "Calculate 2021 Scenario"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="bg-card border-primary/20 h-full">
            <CardHeader>
              <CardTitle className="text-xl neptune-gold">Results Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">AGI:</div>
                    <div className="text-sm text-right">${results.agi.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                    
                    <div className="text-sm font-medium">Taxable Income:</div>
                    <div className="text-sm text-right">${results.taxable_income.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                    
                    <div className="text-sm font-medium">Total Tax:</div>
                    <div className="text-sm text-right">${results.total_tax.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                    
                    <div className="text-sm font-medium">Marginal Rate:</div>
                    <div className="text-sm text-right">{(results.marginal_rate * 100).toFixed(1)}%</div>
                    
                    <div className="text-sm font-medium">Effective Rate:</div>
                    <div className="text-sm text-right">{(results.effective_rate * 100).toFixed(1)}%</div>
                    
                    <div className="text-sm font-medium">Tax Due/Refund:</div>
                    <div className={`text-sm text-right ${results.refundOrOwed >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {results.refundOrOwed >= 0 ? "+" : ""}${Math.abs(results.refundOrOwed).toLocaleString(undefined, {maximumFractionDigits: 2})}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-center space-x-2">
                      <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
                        <PieChart className="h-3 w-3" />
                        Income Chart
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        Tax Breakdown
                      </Button>
                    </div>
                    <div className="mt-4 h-32 bg-muted/20 rounded flex items-center justify-center text-xs text-muted-foreground">
                      Charts will appear here after calculation
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
                  Enter your information and click Calculate to see results
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Scenario2021Return;
