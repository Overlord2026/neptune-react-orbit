
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator, RefreshCw, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormValues = {
  iraBalance: number;
  age: number;
  filingStatus: string;
  conversionAmount: number;
};

const RothConversionAnalyzerPage = () => {
  const [results, setResults] = useState<string | null>(null);
  const [taxLiability, setTaxLiability] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    defaultValues: {
      iraBalance: 100000,
      age: 55,
      filingStatus: 'single',
      conversionAmount: 20000,
    },
  });
  
  const onSubmit = (data: FormValues) => {
    // Validate inputs
    if (data.iraBalance < 0) {
      toast({
        title: "Invalid IRA Balance",
        description: "IRA Balance cannot be negative.",
        variant: "destructive",
      });
      return;
    }
    
    if (data.conversionAmount < 0) {
      toast({
        title: "Invalid Conversion Amount",
        description: "Conversion amount cannot be negative.",
        variant: "destructive",
      });
      return;
    }
    
    if (data.conversionAmount > data.iraBalance) {
      toast({
        title: "Invalid Conversion Amount",
        description: "Conversion amount cannot exceed IRA balance.",
        variant: "destructive",
      });
      return;
    }
    
    if (data.age < 0 || data.age > 120) {
      toast({
        title: "Invalid Age",
        description: "Please enter a valid age between 0 and 120.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Form submitted with data:", data);
    
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      // Placeholder calculation (simplified tax estimation)
      // In reality, this would be more complex based on tax brackets, etc.
      const estimatedTaxRate = data.filingStatus === 'married' ? 0.22 : 0.24;
      const estimatedTax = Math.round(data.conversionAmount * estimatedTaxRate);
      setTaxLiability(estimatedTax);
      
      setResults(`Converting $${data.conversionAmount.toLocaleString()} from Traditional IRA would result in approximately $${estimatedTax.toLocaleString()} in taxes at a ${estimatedTaxRate * 100}% marginal rate.`);
      
      toast({
        title: "Calculation Complete",
        description: "Your Roth conversion tax impact has been calculated.",
      });
      
      setIsCalculating(false);
    }, 1500);
  };
  
  const handleReset = () => {
    form.reset();
    setResults(null);
    setTaxLiability(null);
    toast({
      title: "Form Reset",
      description: "All values have been reset to defaults.",
    });
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row items-center justify-between pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight neptune-gold">Roth Conversion Analyzer</h1>
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
                            onChange={e => {
                              const value = e.target.valueAsNumber || 0;
                              if (value >= 0) {
                                field.onChange(value);
                              }
                            }}
                            min={0}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Your current Traditional IRA balance
                      </FormDescription>
                      <FormMessage />
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
                          onChange={e => {
                            const value = e.target.valueAsNumber || 0;
                            if (value >= 0 && value <= 120) {
                              field.onChange(value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Age affects early withdrawal penalties
                      </FormDescription>
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select filing status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married Filing Jointly</SelectItem>
                          <SelectItem value="head">Head of Household</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Your tax filing status
                      </FormDescription>
                      <FormMessage />
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
                            onChange={e => {
                              const value = e.target.valueAsNumber || 0;
                              if (value >= 0) {
                                field.onChange(value);
                              }
                            }}
                            min={0}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        How much you want to convert to Roth
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={isCalculating}
                  >
                    {isCalculating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      "Calculate Tax Impact"
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleReset}
                    className="flex items-center gap-2"
                    disabled={isCalculating}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
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
            {isCalculating ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] py-8">
                <Loader2 className="h-12 w-12 neptune-gold animate-spin mb-4" />
                <p className="text-muted-foreground">
                  Calculating tax implications...
                </p>
              </div>
            ) : results ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">{results}</p>
                <div className="p-4 rounded-md bg-primary/10 border border-primary/20">
                  <h3 className="font-semibold neptune-gold mb-2">Recommendation</h3>
                  <p className="text-muted-foreground">
                    Based on your input, you might owe ${taxLiability?.toLocaleString()} in taxes now, 
                    but your future withdrawals will be tax-free and your investments will grow tax-free.
                    Consider consulting with a tax professional to determine if this conversion aligns with 
                    your long-term financial goals.
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
          <CardFooter className="bg-muted/50 border-t border-primary/10">
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
