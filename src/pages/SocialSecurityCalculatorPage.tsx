
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CircleDollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import InfoTooltip from '@/components/tax/InfoTooltip';

type FormValues = {
  annualIncome: number;
  ssiBenefits: number;
  age: number;
  otherIncome: number;
};

const SocialSecurityCalculatorPage = () => {
  const [taxResults, setTaxResults] = useState<any | null>(null);
  
  const form = useForm<FormValues>({
    defaultValues: {
      annualIncome: 60000,
      ssiBenefits: 18000,
      age: 67,
      otherIncome: 5000,
    },
  });
  
  const onSubmit = (data: FormValues) => {
    console.log("Social Security Tax Calculator form submitted with data:", data);
    
    // Simplified calculation for demonstration purposes
    const totalIncome = data.annualIncome + data.ssiBenefits + data.otherIncome;
    let taxableSSI = 0;
    
    // Simplified calculation of taxable portion of Social Security benefits
    if (totalIncome > 25000 && totalIncome <= 34000) {
      // Up to 50% of benefits may be taxable
      taxableSSI = data.ssiBenefits * 0.5;
    } else if (totalIncome > 34000) {
      // Up to 85% of benefits may be taxable
      taxableSSI = data.ssiBenefits * 0.85;
    }
    
    const results = {
      totalIncome,
      taxableSSI: Math.round(taxableSSI),
      estimatedTaxOnSSI: Math.round(taxableSSI * 0.22), // Assuming 22% tax bracket
    };
    
    setTaxResults(results);
    toast({
      title: "Calculation Complete",
      description: "Social Security tax impact has been calculated.",
    });
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight neptune-gold">Social Security Tax Calculator</h1>
          <p className="text-muted-foreground">Estimate the tax impact of your Social Security benefits</p>
        </div>
        <Link to="/tax-planning" className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Tax Planning Hub
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl neptune-gold flex items-center gap-3">
              <CircleDollarSign className="h-6 w-6" />
              Your Income Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="annualIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Income (Excluding SSI)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-3">$</span>
                          <Input 
                            type="number" 
                            className="pl-7" 
                            {...field} 
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Your annual income from all sources excluding Social Security
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ssiBenefits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Annual Social Security Benefits
                        <InfoTooltip text="Depending on your total provisional income, up to 85% of Social Security can be taxable." />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-3">$</span>
                          <Input 
                            type="number" 
                            className="pl-7" 
                            {...field} 
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Total annual Social Security benefits you receive
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Current Age</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0} 
                          max={120}
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Your current age affects certain tax calculations
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="otherIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Income (Interest, Dividends, etc.)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-3">$</span>
                          <Input 
                            type="number" 
                            className="pl-7" 
                            {...field} 
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Income from interest, dividends, or other sources
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full mt-4">
                  Calculate Tax Impact
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl neptune-gold">
              Social Security Tax Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {taxResults ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-md bg-primary/5 border border-primary/20">
                    <div className="text-sm text-muted-foreground mb-1">Total Income</div>
                    <div className="text-xl neptune-gold font-semibold">${taxResults.totalIncome.toLocaleString()}</div>
                  </div>
                  <div className="p-4 rounded-md bg-primary/5 border border-primary/20">
                    <div className="text-sm text-muted-foreground mb-1">Taxable SSI Portion</div>
                    <div className="text-xl neptune-gold font-semibold">${taxResults.taxableSSI.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="p-4 rounded-md bg-primary/10 border border-primary/20">
                  <h3 className="font-semibold neptune-gold mb-2">Estimated Tax on Social Security</h3>
                  <div className="text-2xl neptune-gold font-bold">${taxResults.estimatedTaxOnSSI.toLocaleString()}</div>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Based on an estimated tax rate of 22% on the taxable portion of your benefits.
                  </p>
                </div>
                
                <div className="p-4 rounded-md bg-primary/5 border border-primary/20">
                  <h3 className="font-semibold neptune-gold mb-2">Recommendation</h3>
                  <p className="text-muted-foreground">
                    {taxResults.taxableSSI > 0 ? 
                      "Consider strategies to reduce your overall income to potentially lower the taxable portion of your Social Security benefits." : 
                      "Your Social Security benefits are currently not subject to federal income tax."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                <p className="text-muted-foreground">
                  Enter your income details and click "Calculate Tax Impact" to see the analysis of your Social Security benefits taxation.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-muted/50 rounded-b-lg">
            <p className="text-sm text-muted-foreground py-2">
              <strong>Note:</strong> This is a simplified calculation. Actual tax implications may vary based on filing status, deductions, and other factors.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SocialSecurityCalculatorPage;
