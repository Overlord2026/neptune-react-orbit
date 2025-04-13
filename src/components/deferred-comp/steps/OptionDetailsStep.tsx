
import React from "react";
import { useEquityForm } from "../context/EquityFormContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, InfoIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface OptionDetailsStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const OptionDetailsStep: React.FC<OptionDetailsStepProps> = ({ onNext, onPrevious }) => {
  const { formState, updateForm } = useEquityForm();

  // Skip this step if not relevant based on equityType
  React.useEffect(() => {
    if (formState.equityType !== "NSO" && formState.equityType !== "ISO") {
      onNext();
    }
  }, [formState.equityType]);

  // Only render if this step is relevant for the selected equity type
  if (formState.equityType !== "NSO" && formState.equityType !== "ISO") {
    return null;
  }

  const handleContinue = () => {
    if (!formState.strikePrice || !formState.fairMarketValue || !formState.vestedShares) {
      alert("Please fill in all required fields");
      return;
    }
    onNext();
  };

  const showAmtWarning = formState.equityType === "ISO" && 
    (formState.fairMarketValue - formState.strikePrice) * formState.vestedShares > 100000;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="strikePrice">Strike Price ($)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The price at which you can purchase each share.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input 
              id="strikePrice" 
              type="number"
              step="0.01"
              value={formState.strikePrice || ""} 
              onChange={(e) => updateForm({ strikePrice: Number(e.target.value) })} 
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="fairMarketValue">Current Fair Market Value ($)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The current market value of each share.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input 
              id="fairMarketValue" 
              type="number"
              step="0.01"
              value={formState.fairMarketValue || ""} 
              onChange={(e) => updateForm({ fairMarketValue: Number(e.target.value) })} 
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="vestedShares">Number of vested shares</Label>
            <Input 
              id="vestedShares" 
              type="number"
              value={formState.vestedShares || ""} 
              onChange={(e) => updateForm({ vestedShares: Number(e.target.value) })} 
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unvestedShares">Number of unvested shares</Label>
            <Input 
              id="unvestedShares" 
              type="number"
              value={formState.unvestedShares || ""} 
              onChange={(e) => updateForm({ unvestedShares: Number(e.target.value) })} 
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <Label>Exercise strategy</Label>
          <RadioGroup 
            value={formState.exerciseStrategy} 
            onValueChange={(value) => updateForm({ exerciseStrategy: value as "full" | "partial" | "split" })}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="full" id="full" />
              <Label htmlFor="full">Exercise all vested options at once</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="partial" id="partial" />
              <Label htmlFor="partial">Exercise partial options now</Label>
            </div>
            
            {formState.exerciseStrategy === "partial" && (
              <div className="ml-6 mb-4">
                <Label htmlFor="partialShares">Number of shares to exercise</Label>
                <Input 
                  id="partialShares" 
                  type="number"
                  value={formState.partialShares || ""} 
                  onChange={(e) => updateForm({ partialShares: Number(e.target.value) })} 
                  className="mt-2"
                  placeholder="0"
                />
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="split" id="split" />
              <Label htmlFor="split">Split exercise across multiple tax years</Label>
            </div>
            
            {formState.exerciseStrategy === "split" && (
              <div className="ml-6 mb-4">
                <Label htmlFor="splitYears">Number of years to split across</Label>
                <Input 
                  id="splitYears" 
                  type="number"
                  min="2"
                  max="10"
                  value={formState.splitYears || 2} 
                  onChange={(e) => updateForm({ splitYears: Number(e.target.value) })} 
                  className="mt-2"
                  placeholder="2"
                />
              </div>
            )}
          </RadioGroup>
        </div>

        {showAmtWarning && (
          <Card className="bg-amber-900/20 border-amber-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-500">AMT Warning</CardTitle>
              <CardDescription>
                Based on your inputs, you may be subject to Alternative Minimum Tax (AMT).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-300">
                The spread between your strike price and FMV is significant, which may trigger AMT liability. 
                Consider consulting with a tax professional before exercising.
              </p>
            </CardContent>
          </Card>
        )}
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
