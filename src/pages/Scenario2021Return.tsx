
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
  deductionType: z.enum(["standard", "itemized"]),
  itemizedDeduction: z.string().optional().refine((val) => !val || !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Itemized deduction must be a non-negative number",
  }),
});

type FormValues = z.infer<typeof formSchema>;

// 2021 tax brackets for single filer
const TAX_BRACKETS_2021 = [
  { min: 0, max: 9950, rate: 0.10 },
  { min: 9950, max: 40525, rate: 0.12 },
  { min: 40525, max: 86375, rate: 0.22 },
  { min: 86375, max: 164925, rate: 0.24 },
  { min: 164925, max: 209425, rate: 0.32 },
  { min: 209425, max: 523600, rate: 0.35 },
  { min: 523600, max: Infinity, rate: 0.37 },
];

// Standard deduction for 2021
const STANDARD_DEDUCTION_2021 = 12550;

const Scenario2021Return = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    agi: number;
    taxableIncome: number;
    totalTax: number;
    marginalRate: number;
    effectiveRate: number;
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
      deductionType: "standard",
      itemizedDeduction: "",
    },
  });

  const watchDeductionType = form.watch("deductionType");

  const calculateTaxScenario2021 = (data: FormValues) => {
    setIsLoading(true);
    
    // Convert string inputs to numbers
    const wages = Number(data.wages);
    const interest = Number(data.interest);
    const qualifiedDividends = Number(data.qualifiedDividends);
    const iraDistributions = Number(data.iraDistributions);
    const rothConversion = Number(data.rothConversion);
    const socialSecurity = Number(data.socialSecurity);
    const capitalGains = Number(data.capitalGains);
    
    // Calculate AGI
    const agi = wages + interest + qualifiedDividends + iraDistributions + 
                rothConversion + (socialSecurity * 0.85) + capitalGains;
    
    // Apply deductions
    const deduction = data.deductionType === "standard" 
      ? STANDARD_DEDUCTION_2021 
      : Number(data.itemizedDeduction || 0);
    
    const taxableIncome = Math.max(0, agi - deduction);
    
    // Calculate tax using 2021 tax brackets
    let totalTax = 0;
    let lastBracketLimit = 0;
    
    for (const bracket of TAX_BRACKETS_2021) {
      if (taxableIncome > bracket.min) {
        const taxableInThisBracket = Math.min(taxableIncome, bracket.max) - lastBracketLimit;
        totalTax += taxableInThisBracket * bracket.rate;
        lastBracketLimit = bracket.max;
      }
    }
    
    // Find marginal rate
    let marginalRate = 0;
    for (let i = TAX_BRACKETS_2021.length - 1; i >= 0; i--) {
      if (taxableIncome > TAX_BRACKETS_2021[i].min) {
        marginalRate = TAX_BRACKETS_2021[i].rate;
        break;
      }
    }
    
    // Calculate effective rate
    const effectiveRate = taxableIncome > 0 ? totalTax / taxableIncome : 0;
    
    // Assuming withholding based on a simple calculation (40% of total income tax for demo purposes)
    const assumedWithholding = totalTax * 0.4;
    const refundOrOwed = assumedWithholding - totalTax;
    
    // Store results
    const calculationResults = {
      agi,
      taxableIncome,
      totalTax,
      marginalRate,
      effectiveRate,
      refundOrOwed
    };

    setResults(calculationResults);
    
    // In a real app, we would store this to a database
    console.log("Storing scenario results:", calculationResults);

    // Simulate API call completion
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Calculation Complete",
        description: "Your 2021 tax scenario has been calculated.",
      });
    }, 1000);
  };

  function onSubmit(data: FormValues) {
    calculateTaxScenario2021(data);
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
                                <Label htmlFor="standard">Standard Deduction (${STANDARD_DEDUCTION_2021.toLocaleString()})</Label>
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
                    <div className="text-sm text-right">${results.taxableIncome.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                    
                    <div className="text-sm font-medium">Total Tax:</div>
                    <div className="text-sm text-right">${results.totalTax.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                    
                    <div className="text-sm font-medium">Marginal Rate:</div>
                    <div className="text-sm text-right">{(results.marginalRate * 100).toFixed(1)}%</div>
                    
                    <div className="text-sm font-medium">Effective Rate:</div>
                    <div className="text-sm text-right">{(results.effectiveRate * 100).toFixed(1)}%</div>
                    
                    <div className="text-sm font-medium">Tax Due/Refund:</div>
                    <div className={`text-sm text-right ${results.refundOrOwed >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {results.refundOrOwed >= 0 ? "+" : ""}{results.refundOrOwed.toLocaleString(undefined, {maximumFractionDigits: 2})}
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
