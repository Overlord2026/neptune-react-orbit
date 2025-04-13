import React from "react";
import { useEquityForm } from "../context/EquityFormContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, InfoIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DeferralStrategyStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

const DeferralStrategyStep: React.FC<DeferralStrategyStepProps> = ({ onNext, onPrevious }) => {
  const { formState, updateForm } = useEquityForm();
  
  // Skip if no deferred comp
  React.useEffect(() => {
    if (!formState.hasDeferredComp) {
      onNext();
    }
  }, [formState.hasDeferredComp]);

  // Only show if user has deferred comp
  if (!formState.hasDeferredComp) {
    return null;
  }

  const handleContinue = () => {
    if (formState.deferralAmount <= 0) {
      alert("Please enter a deferral amount");
      return;
    }
    onNext();
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="deferralAmount">How much would you like to defer? ($)</Label>
          <Input 
            id="deferralAmount" 
            type="number"
            value={formState.deferralAmount || ""} 
            onChange={(e) => updateForm({ deferralAmount: Number(e.target.value) })}
            placeholder="0"
            max={formState.bonusAmount}
          />
          <p className="text-xs text-muted-foreground">
            Maximum available: ${formState.bonusAmount.toLocaleString()}
          </p>
        </div>

        <div className="space-y-3 mt-4">
          <div className="flex items-center">
            <Label>Deferral Strategy</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Choose to defer your bonus to next year or split it across multiple years.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <RadioGroup 
            value={formState.deferralStrategy} 
            onValueChange={(value) => updateForm({ deferralStrategy: value as "next-year" | "multi-year" })}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="next-year" id="next-year" />
              <Label htmlFor="next-year">Defer to next year ({currentYear + 1})</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="multi-year" id="multi-year" />
              <Label htmlFor="multi-year">Stagger deferral over multiple years</Label>
            </div>
            
            {formState.deferralStrategy === "multi-year" && (
              <div className="ml-6 mb-4">
                <Label htmlFor="deferralYears">Number of years to defer across</Label>
                <Input 
                  id="deferralYears" 
                  type="number"
                  min="2"
                  max="10"
                  value={formState.deferralYears || 2} 
                  onChange={(e) => updateForm({ deferralYears: Number(e.target.value) })} 
                  className="mt-2"
                  placeholder="2"
                />
              </div>
            )}
          </RadioGroup>
        </div>

        <Card className="mt-6 bg-[#1D2433] border-[#2A2F3C]">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-medium text-white">Future Planning</h3>
              <div className="text-sm mb-4">
                <p className="text-muted-foreground mb-2">
                  If you're planning a sabbatical or retirement in the future, deferring income to those 
                  years can help reduce your overall tax liability due to lower income.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sabbaticalYear">Planning a sabbatical/lower income year?</Label>
                  <Input 
                    id="sabbaticalYear" 
                    type="number"
                    min={currentYear + 1}
                    max={currentYear + 20}
                    value={formState.sabbaticalYear || currentYear + 3} 
                    onChange={(e) => updateForm({ sabbaticalYear: Number(e.target.value) })} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retirementYear">Expected retirement year</Label>
                  <Input 
                    id="retirementYear" 
                    type="number"
                    min={currentYear + 1}
                    max={currentYear + 50}
                    value={formState.retirementYear || currentYear + 10} 
                    onChange={(e) => updateForm({ retirementYear: Number(e.target.value) })} 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button onClick={onPrevious} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={handleContinue}>
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DeferralStrategyStep;
