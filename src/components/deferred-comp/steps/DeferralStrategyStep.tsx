
import React from 'react';
import { useEquityForm } from '../context/EquityFormContext';
import { 
  Card, CardHeader, CardTitle, CardDescription, CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { InfoTooltip } from '../components/InfoTooltip';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatUtils';

const DeferralStrategyStep: React.FC = () => {
  const { formState, updateFormState } = useEquityForm();
  
  const handleDeferralAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    updateFormState({
      deferralAmount: isNaN(value) ? 0 : Math.min(value, formState.bonusAmount)
    });
  };
  
  const handleDeferralSliderChange = (value: number[]) => {
    updateFormState({
      deferralAmount: value[0]
    });
  };
  
  const handleDeferralStrategyChange = (value: string) => {
    updateFormState({
      deferralStrategy: value as "next-year" | "multi-year"
    });
  };
  
  const handleDeferralYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    updateFormState({
      deferralYears: isNaN(value) ? undefined : Math.max(2, value)
    });
  };
  
  const currentYear = new Date().getFullYear();
  const deferralPercentage = formState.bonusAmount > 0 
    ? (formState.deferralAmount / formState.bonusAmount) * 100 
    : 0;
  const showMultiYearOptions = formState.deferralStrategy === "multi-year";
  
  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Deferred Compensation Strategy
            <InfoTooltip content="Defer part of your bonus to future years to potentially reduce your tax burden." />
          </CardTitle>
          <CardDescription>
            Choose how you'd like to defer your compensation to optimize tax impact.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="deferral-amount" className="text-sm font-medium">
                Amount to defer (from your ${formatCurrency(formState.bonusAmount)} bonus)
              </Label>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex-grow">
                  <Slider
                    value={[formState.deferralAmount]}
                    max={formState.bonusAmount}
                    step={1000}
                    onValueChange={handleDeferralSliderChange}
                  />
                </div>
                <div className="w-24">
                  <Input
                    id="deferral-amount"
                    type="number"
                    value={formState.deferralAmount}
                    onChange={handleDeferralAmountChange}
                    min={0}
                    max={formState.bonusAmount}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Deferring {deferralPercentage.toFixed(0)}% of your bonus
              </p>
            </div>
            
            {formState.deferralAmount > 0 && (
              <div className="mt-6">
                <Label className="text-sm font-medium">Deferral timing</Label>
                <RadioGroup
                  value={formState.deferralStrategy}
                  onValueChange={handleDeferralStrategyChange}
                  className="flex flex-col space-y-2 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="next-year" id="next-year" />
                    <Label htmlFor="next-year" className="cursor-pointer">
                      One year (receive in {currentYear + 1})
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="multi-year" id="multi-year" />
                    <Label htmlFor="multi-year" className="cursor-pointer">
                      Multi-year (spread over several years)
                    </Label>
                  </div>
                </RadioGroup>
                
                {showMultiYearOptions && (
                  <div className="mt-4 ml-6">
                    <Label htmlFor="deferral-years" className="text-sm font-medium">
                      Number of years to spread deferral
                    </Label>
                    <Input
                      id="deferral-years"
                      type="number"
                      className="w-24 mt-1"
                      value={formState.deferralYears || 2}
                      onChange={handleDeferralYearsChange}
                      min={2}
                      max={10}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      You'll receive approximately {formatCurrency(formState.deferralAmount / (formState.deferralYears || 2))} per year
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {formState.deferralAmount > 0 && (
              <Alert className="bg-amber-50 border-amber-200 mt-6">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">Important note about deferred compensation</AlertTitle>
                <AlertDescription className="text-amber-700">
                  Be aware that deferred compensation is generally subject to your employer's creditors. 
                  Your ability to receive these funds depends on your employer's financial health when the 
                  deferral period ends.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            {formState.deferralAmount > 0 ? (
              <>
                You'll receive ${formatCurrency(formState.bonusAmount - formState.deferralAmount)} this year 
                and defer ${formatCurrency(formState.deferralAmount)} to {formState.deferralStrategy === "next-year" 
                  ? `next year (${currentYear + 1})` 
                  : `${formState.deferralYears || 2} years (${currentYear + 1} to ${currentYear + (formState.deferralYears || 2)})`
                }.
              </>
            ) : (
              <>You're not currently deferring any compensation.</>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeferralStrategyStep;
