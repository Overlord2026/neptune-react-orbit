
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";

type FormValues = {
  iraBalance: number;
  age: number;
  filingStatus: string;
  conversionAmount: number;
};

const RothConversionAnalyzerPage = () => {
  const [results, setResults] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    defaultValues: {
      iraBalance: 100000,
      age: 55,
      filingStatus: 'single',
      conversionAmount: 20000,
    },
  });
  
  const onSubmit = (data: FormValues) => {
    console.log("Form submitted with data:", data);
    // This would normally calculate tax implications
    setResults(`Converting $${data.conversionAmount.toLocaleString()} from Traditional IRA would result in approximately $${Math.round(data.conversionAmount * 0.24).toLocaleString()} in taxes at a 24% marginal rate.`);
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight neptune-gold">Roth Conversion Analyzer</h1>
          <p className="text-muted-foreground">Evaluate tax implications of converting Traditional IRA funds to a Roth IRA.</p>
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
              <Calculator className="h-6 w-6" />
              Conversion Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="iraBalance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Traditional IRA Balance</FormLabel>
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
                        Your current Traditional IRA balance
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
                        Age affects early withdrawal penalties
                      </FormDescription>
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
                        <select 
                          {...field} 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        >
                          <option value="single">Single</option>
                          <option value="married">Married Filing Jointly</option>
                          <option value="head">Head of Household</option>
                        </select>
                      </FormControl>
                      <FormDescription>
                        Your tax filing status
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="conversionAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount to Convert</FormLabel>
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
                        How much you want to convert to Roth
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
              Conversion Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">{results}</p>
                <div className="p-4 rounded-md bg-primary/10 border border-primary/20">
                  <h3 className="font-semibold neptune-gold mb-2">Recommendation</h3>
                  <p className="text-muted-foreground">
                    This is a placeholder recommendation. In a complete implementation,
                    we would analyze your specific tax situation and provide personalized guidance.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                <p className="text-muted-foreground">
                  Enter your details and click "Calculate Tax Impact" to see the analysis of your potential Roth conversion.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-muted/50 rounded-b-lg">
            <p className="text-sm text-muted-foreground py-2">
              <strong>Note:</strong> This is a simplified analysis. Consult with a tax professional before making conversion decisions.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RothConversionAnalyzerPage;
