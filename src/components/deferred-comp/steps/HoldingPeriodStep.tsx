
import React from "react";
import { useEquityForm } from "../context/EquityFormContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HoldingPeriodStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const HoldingPeriodStep: React.FC<HoldingPeriodStepProps> = ({ onNext, onPrevious }) => {
  const { formState, updateForm } = useEquityForm();
  
  const handleChange = (value: "less-than-year" | "more-than-year" | "unknown") => {
    const isDisqualifying = value === "less-than-year";
    updateForm({ 
      holdingPeriod: value,
      isDisqualifyingDisposition: isDisqualifying
    });
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-[#1D2433] border-[#2A2F3C]">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-medium">ISO Holding Period</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>
                        For favorable tax treatment, ISO shares must be held for at least 1 year after exercise 
                        and 2 years after the grant date. Selling before these periods creates a "disqualifying disposition" 
                        and the spread is taxed as ordinary income.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Do you plan to hold your ISO shares for the required period to qualify for long-term capital gains treatment?
              </p>
              
              <RadioGroup 
                value={formState.holdingPeriod} 
                onValueChange={(value) => handleChange(value as "less-than-year" | "more-than-year" | "unknown")}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="more-than-year" id="more-than-year" />
                  <Label htmlFor="more-than-year" className="cursor-pointer">
                    <span className="font-medium">Hold for qualifying period</span>
                    <p className="text-sm text-muted-foreground">
                      I plan to hold for at least 1 year after exercise and 2 years after grant.
                      This may trigger AMT now but qualifies for LTCG treatment upon sale.
                    </p>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="less-than-year" id="less-than-year" />
                  <Label htmlFor="less-than-year" className="cursor-pointer">
                    <span className="font-medium">Sell within a year (Disqualifying Disposition)</span>
                    <p className="text-sm text-muted-foreground">
                      I plan to sell the shares within a year of exercise or before 2 years from grant.
                      This creates ordinary income like an NSO but avoids AMT.
                    </p>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unknown" id="unknown" />
                  <Label htmlFor="unknown" className="cursor-pointer">
                    <span className="font-medium">Undecided / Don't know</span>
                    <p className="text-sm text-muted-foreground">
                      I'm not sure of my holding strategy yet. Show me tax implications for both scenarios.
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="p-4 bg-blue-900/20 border border-blue-800/30 rounded-md">
              <div className="flex items-start space-x-3">
                <InfoIcon className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-400" />
                <div>
                  <h4 className="text-sm font-medium text-blue-400">ISO Tax Consideration</h4>
                  <p className="text-xs text-blue-300 mt-1">
                    ISOs have special tax treatment. When exercised and held beyond the qualifying periods, they're subject to AMT 
                    in the exercise year but qualify for LTCG rates when sold. If sold before these periods (disqualifying disposition), 
                    the spread is taxed as ordinary income in the year of sale, like NSOs, but without AMT implications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button onClick={onPrevious} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button onClick={onNext}>
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
