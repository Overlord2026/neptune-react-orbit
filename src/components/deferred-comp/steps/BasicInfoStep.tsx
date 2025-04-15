
import React from "react";
import { useEquityForm } from "../context/EquityFormContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { InfoIcon } from "lucide-react";

interface BasicInfoStepProps {
  onNext: () => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ onNext }) => {
  const { formState, updateForm } = useEquityForm();

  const handleContinue = () => {
    // Validate required fields
    if (!formState.equityType || (!formState.totalShares && !formState.bonusAmount)) {
      alert("Please fill in all required fields");
      return;
    }
    onNext();
  };

  // Use totalShares as a backup for shareCount for backward compatibility
  const shareCount = formState.shareCount || formState.totalShares || 0;
  const employer = formState.employer || "";

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="equityType">What type of equity do you hold?</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      <strong>NSO:</strong> Nonqualified Stock Option - Taxed as ordinary income upon exercise<br />
                      <strong>ISO:</strong> Incentive Stock Option - Special tax treatment, but may trigger AMT<br />
                      <strong>RSU:</strong> Restricted Stock Unit - Taxed as ordinary income upon vesting<br />
                      <strong>ESPP:</strong> Employee Stock Purchase Plan - Special tax rules apply
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select 
              value={formState.equityType} 
              onValueChange={(value) => updateForm({ equityType: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select equity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NSO">Nonqualified Stock Options (NSO)</SelectItem>
                <SelectItem value="ISO">Incentive Stock Options (ISO)</SelectItem>
                <SelectItem value="RSU">Restricted Stock Units (RSU)</SelectItem>
                <SelectItem value="ESPP">Employee Stock Purchase Plan (ESPP)</SelectItem>
                <SelectItem value="Other">Other Equity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch 
                id="hasDeferredComp" 
                checked={formState.hasDeferredComp}
                onCheckedChange={(checked) => updateForm({ hasDeferredComp: checked })}
              />
              <div className="flex items-center">
                <Label htmlFor="hasDeferredComp">Do you have a deferred compensation plan?</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Deferred compensation plans allow you to delay receiving part of your salary or bonus until a future tax year.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employer">Current employer</Label>
            <Input 
              id="employer" 
              value={employer} 
              onChange={(e) => updateForm({ employer: e.target.value })} 
              placeholder="Enter your employer's name"
            />
          </div>

          {(formState.equityType === "NSO" || 
            formState.equityType === "ISO" || 
            formState.equityType === "RSU" || 
            formState.equityType === "ESPP") && (
            <div className="space-y-2">
              <Label htmlFor="shareCount">Approximate number of shares</Label>
              <Input 
                id="shareCount" 
                type="number"
                value={shareCount || ""} 
                onChange={(e) => updateForm({ totalShares: Number(e.target.value), shareCount: Number(e.target.value) })} 
                placeholder="Enter total number of shares"
              />
            </div>
          )}

          {formState.hasDeferredComp && (
            <div className="space-y-2">
              <Label htmlFor="bonusAmount">Potential bonus amount ($)</Label>
              <Input 
                id="bonusAmount" 
                type="number"
                value={formState.bonusAmount || ""} 
                onChange={(e) => updateForm({ bonusAmount: Number(e.target.value) })} 
                placeholder="Enter potential bonus amount"
              />
            </div>
          )}
        </div>
      </div>

      <Button onClick={handleContinue} className="mt-6">
        Continue <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default BasicInfoStep;
