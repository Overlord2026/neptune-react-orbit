
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import { TaxInput, calculateTaxScenario } from '@/utils/taxCalculator';
import { formatPercent } from '@/utils/taxBracketData';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { FilingStatusType } from '@/types/tax/filingTypes';

interface RealTimeBracketPreviewProps {
  baseIncome: number;
  year: number;
  filingStatus: FilingStatusType;
  capitalGains?: number;
  maxConversion?: number;
  onChange?: (amount: number) => void;
}

const RealTimeBracketPreview: React.FC<RealTimeBracketPreviewProps> = ({
  baseIncome,
  year,
  filingStatus,
  capitalGains = 0,
  maxConversion = 500000,
  onChange
}) => {
  // State for conversion amount
  const [conversionAmount, setConversionAmount] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("0");
  const debouncedConversion = useDebounce(conversionAmount, 300);
  
  // State for tax results
  const [currentResult, setCurrentResult] = useState<any>(null);
  const [previousResult, setPreviousResult] = useState<any>(null);
  const [bracketShift, setBracketShift] = useState<{
    ordinary: boolean;
    ltcg: boolean;
  }>({ ordinary: false, ltcg: false });
  
  // Calculate tax scenario when conversion amount changes
  useEffect(() => {
    // Save previous result for comparison
    if (currentResult) {
      setPreviousResult(currentResult);
    }
    
    // Calculate new tax scenario with current conversion amount
    const taxInput: TaxInput = {
      year,
      filing_status: filingStatus,
      wages: baseIncome,
      interest: 0,
      dividends: 0,
      capital_gains: capitalGains,
      ira_distributions: 0,
      roth_conversion: debouncedConversion,
      social_security: 0,
      isItemizedDeduction: false,
      itemizedDeductionAmount: 0
    };

    const result = calculateTaxScenario(taxInput, "Real-time Preview");
    setCurrentResult(result);
    
    // Detect bracket shifts
    if (previousResult) {
      setBracketShift({
        ordinary: previousResult.marginal_rate !== result.marginal_rate,
        ltcg: previousResult.marginal_capital_gains_rate !== result.marginal_capital_gains_rate
      });
    }
    
    // Call onChange prop if provided
    if (onChange) {
      onChange(debouncedConversion);
    }
  }, [debouncedConversion, baseIncome, year, filingStatus, capitalGains, onChange]);

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const newValue = value[0];
    setConversionAmount(newValue);
    setInputValue(newValue.toString());
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      // Clamp value between 0 and maxConversion
      const clampedValue = Math.min(Math.max(0, numValue), maxConversion);
      setConversionAmount(clampedValue);
    }
  };

  // Handle input blur
  const handleInputBlur = () => {
    if (inputValue === '' || isNaN(parseInt(inputValue, 10))) {
      setInputValue('0');
      setConversionAmount(0);
    }
  };

  return (
    <Card className="border-blue-300/50 bg-blue-50/10 dark:bg-blue-950/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Real-Time Bracket Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="conversion-amount">Conversion Amount:</Label>
            <div className="flex items-center">
              <span className="mr-2">$</span>
              <Input
                id="conversion-amount"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="w-24 text-right"
              />
            </div>
          </div>
          
          <Slider
            value={[conversionAmount]}
            min={0}
            max={maxConversion}
            step={1000}
            onValueChange={handleSliderChange}
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>${Math.floor(maxConversion / 2).toLocaleString()}</span>
            <span>${maxConversion.toLocaleString()}</span>
          </div>
        </div>

        {currentResult && (
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Estimated Taxable Income:</span>
              <span className="font-medium">${Math.round(currentResult.taxable_income).toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Marginal Tax Rate:</span>
              <span className={`font-medium ${bracketShift.ordinary ? 'text-amber-600' : ''}`}>
                {formatPercent(currentResult.marginal_rate)}
              </span>
            </div>
            
            {capitalGains > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">LTCG Rate:</span>
                <span className={`font-medium ${bracketShift.ltcg ? 'text-amber-600' : ''}`}>
                  {formatPercent(currentResult.marginal_capital_gains_rate)}
                </span>
              </div>
            )}
            
            <div className="text-sm mt-2">
              Your current marginal bracket is{' '}
              <span className="font-medium">{formatPercent(currentResult.marginal_rate)}</span>{' '}
              for ordinary income
              {capitalGains > 0 && (
                <>, and <span className="font-medium">{formatPercent(currentResult.marginal_capital_gains_rate)}</span> for LTCG</>
              )}.
            </div>
            
            {/* Bracket threshold warnings */}
            {(bracketShift.ordinary || bracketShift.ltcg) && previousResult && (
              <Alert className="mt-2 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-600/30">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 dark:text-amber-300">
                  {bracketShift.ordinary && (
                    <div>
                      Crossing from {formatPercent(previousResult.marginal_rate)} to {formatPercent(currentResult.marginal_rate)} ordinary income bracket.
                    </div>
                  )}
                  {bracketShift.ltcg && capitalGains > 0 && (
                    <div>
                      Your LTCG bracket jumps from {formatPercent(previousResult.marginal_capital_gains_rate)} to {formatPercent(currentResult.marginal_capital_gains_rate)}.
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeBracketPreview;
