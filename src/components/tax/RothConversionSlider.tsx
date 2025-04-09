
import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TaxTrapWarning } from '@/utils/taxTrapChecker';

interface RothConversionSliderProps {
  initialValue?: number;
  maxValue?: number;
  onValueChange: (value: number) => void;
  thresholdWarnings?: TaxTrapWarning[];
}

const RothConversionSlider: React.FC<RothConversionSliderProps> = ({
  initialValue = 0,
  maxValue = 300000,
  onValueChange,
  thresholdWarnings = []
}) => {
  const [sliderValue, setSliderValue] = useState(initialValue);
  const [inputValue, setInputValue] = useState(initialValue.toString());

  useEffect(() => {
    // Update input field when slider value changes from parent
    setSliderValue(initialValue);
    setInputValue(initialValue.toString());
  }, [initialValue]);

  const handleSliderChange = (value: number[]) => {
    const newValue = value[0];
    setSliderValue(newValue);
    setInputValue(newValue.toString());
    onValueChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Only update slider and trigger calculation if value is a number
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      // Clamp value between 0 and maxValue
      const clampedValue = Math.min(Math.max(0, numValue), maxValue);
      setSliderValue(clampedValue);
      onValueChange(clampedValue);
    }
  };

  const handleInputBlur = () => {
    // Clean up input on blur (if empty or NaN)
    if (inputValue === '' || isNaN(parseInt(inputValue, 10))) {
      setInputValue('0');
      setSliderValue(0);
      onValueChange(0);
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50/30 dark:bg-blue-900/10 dark:border-blue-900/40 mb-6">
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label htmlFor="roth-conversion-amount" className="text-lg font-medium">
              Roth Conversion Amount
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">$</span>
              <Input
                id="roth-conversion-amount"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="w-24 text-right"
              />
            </div>
          </div>
          
          <Slider
            value={[sliderValue]}
            min={0}
            max={maxValue}
            step={1000}
            onValueChange={handleSliderChange}
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>${(maxValue / 2).toLocaleString()}</span>
            <span>${maxValue.toLocaleString()}</span>
          </div>
          
          {thresholdWarnings && thresholdWarnings.length > 0 && (
            <div className="space-y-2 mt-4">
              {thresholdWarnings.map((warning, index) => (
                <Alert key={index} className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertDescription className="text-amber-800 dark:text-amber-300 text-sm">
                    {warning.description}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RothConversionSlider;
