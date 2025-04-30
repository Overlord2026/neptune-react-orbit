
import React from "react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calculator, HelpCircle } from "lucide-react";
import { formatCurrency, formatPercent } from "@/utils/formatters";
import { calculateStockOptions } from "@/utils/tax/stockOptionCalculator";
import { StockOptionInputs, StockOptionResults, STATE_TAX_RATES } from "@/types/tax/stockOptionTypes";
import { useToast } from "@/hooks/use-toast";

const defaultInputs: StockOptionInputs = {
  optionType: 'nso',
  numberOfShares: 5000,
  grantPrice: 35,
  currentMarketPrice: 75,
  annualIncome: 250000,
  filingStatus: 'married',
  stateOfResidence: 'CA',
  exerciseAndHold: false,
  holdingPeriod: 1
};

export function OptionsCalculator() {
  const { toast } = useToast();
  const [inputs, setInputs] = useState<StockOptionInputs>(defaultInputs);
  const [results, setResults] = useState<StockOptionResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
      const calculationResults = calculateStockOptions(inputs);
      setResults(calculationResults);
      setIsCalculating(false);
      setHasCalculated(true);
      
      toast({
        title: "Analysis complete",
        description: "Your stock option analysis has been calculated."
      });
    }, 800);
  };

  // Reset results when inputs change after calculation
  const handleInputChange = (updatedInputs: Partial<StockOptionInputs>) => {
    setInputs(prev => ({ ...prev, ...updatedInputs }));
    if (hasCalculated) {
      setHasCalculated(false);
    }
  };

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-2">Stock Option Analysis</h1>
      <p className="text-gray-400 mb-6">
        Determine the best years to receive deferred compensation based on projected tax brackets.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Inputs */}
        <Card className="md:col-span-5 p-6">
          <h2 className="text-xl font-semibold mb-4">Option Details</h2>
          
          <div className="space-y-4">
            <div>
              <Label>Option Type</Label>
              <Select 
                value={inputs.optionType}
                onValueChange={(value: 'nso' | 'iso') => handleInputChange({ optionType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nso">Non-Qualified Stock Options (NSO)</SelectItem>
                  <SelectItem value="iso">Incentive Stock Options (ISO)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Number of Shares</Label>
              <Input
                type="number"
                value={inputs.numberOfShares}
                onChange={e => handleInputChange({ numberOfShares: Number(e.target.value) })}
              />
            </div>

            <div>
              <Label>Grant/Strike Price ($)</Label>
              <Input
                type="number"
                value={inputs.grantPrice}
                onChange={e => handleInputChange({ grantPrice: Number(e.target.value) })}
              />
            </div>

            <div>
              <Label>Current Market Price ($)</Label>
              <Input
                type="number"
                value={inputs.currentMarketPrice}
                onChange={e => handleInputChange({ currentMarketPrice: Number(e.target.value) })}
              />
            </div>

            <div>
              <Label>Annual Income (without options) ($)</Label>
              <Input
                type="number"
                value={inputs.annualIncome}
                onChange={e => handleInputChange({ annualIncome: Number(e.target.value) })}
              />
            </div>

            <div>
              <Label>Filing Status</Label>
              <Select
                value={inputs.filingStatus}
                onValueChange={(value: 'single' | 'married') => handleInputChange({ filingStatus: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select filing status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married Filing Jointly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>State of Residence</Label>
              <Select
                value={inputs.stateOfResidence}
                onValueChange={(value: keyof typeof STATE_TAX_RATES) => 
                  handleInputChange({ stateOfResidence: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                  <SelectItem value="FL">Florida</SelectItem>
                  <SelectItem value="IL">Illinois</SelectItem>
                  <SelectItem value="WA">Washington</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {inputs.optionType === 'iso' && (
              <>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={inputs.exerciseAndHold}
                    onCheckedChange={checked => 
                      handleInputChange({ exerciseAndHold: checked })}
                  />
                  <Label className="cursor-pointer">Exercise and Hold</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>If checked, you'll exercise and hold the shares. If unchecked, you'll exercise and sell immediately.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {inputs.exerciseAndHold && (
                  <div>
                    <Label>Holding Period (Years)</Label>
                    <Input
                      type="number"
                      value={inputs.holdingPeriod}
                      onChange={e => handleInputChange({ holdingPeriod: Number(e.target.value) })}
                    />
                    <p className="text-sm text-gray-400 mt-1">Must hold for at least 1 year for favorable tax treatment</p>
                  </div>
                )}
              </>
            )}

            <Button 
              onClick={handleCalculate} 
              disabled={isCalculating}
              className="w-full mt-4"
              size="lg"
            >
              <Calculator className="mr-2 h-4 w-4" />
              {isCalculating ? "Calculating..." : "Calculate Tax Impact"}
            </Button>
          </div>
        </Card>

        {/* Results */}
        <Card className="md:col-span-7 p-6">
          <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
          
          {hasCalculated && results ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Option Value</Label>
                  <p className="text-2xl font-semibold">{formatCurrency(results.optionValue)}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Net Proceeds</Label>
                  <p className="text-2xl font-semibold">{formatCurrency(results.netProceeds)}</p>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <h3 className="text-lg font-semibold mb-3">Tax Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Federal Tax:</span>
                    <span>{formatCurrency(results.federalTaxDue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>State Tax:</span>
                    <span>{formatCurrency(results.stateTaxDue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FICA Tax:</span>
                    <span>{formatCurrency(results.ficaTaxDue)}</span>
                  </div>
                  {results.amtImpact > 0 && (
                    <div className="flex justify-between">
                      <span>AMT Impact:</span>
                      <span>{formatCurrency(results.amtImpact)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold border-t border-gray-800 pt-2">
                    <span>Total Tax Due:</span>
                    <span>{formatCurrency(results.totalTaxDue)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <div className="flex justify-between items-center">
                  <span>Effective Tax Rate:</span>
                  <span className="text-xl font-semibold">
                    {formatPercent(results.effectiveTaxRate / 100)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-10 border border-dashed rounded-lg bg-muted/5">
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-muted-foreground">No Analysis Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Enter your stock option details and click the Calculate button to analyze the tax impacts.
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
