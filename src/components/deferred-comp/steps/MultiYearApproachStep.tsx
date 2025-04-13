import React from "react";
import { useEquityForm } from "../context/EquityFormContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MultiYearApproachStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

const MultiYearApproachStep: React.FC<MultiYearApproachStepProps> = ({ onNext, onPrevious }) => {
  const { formState, updateForm } = useEquityForm();
  const currentYear = new Date().getFullYear();

  const handleContinue = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-3">
          <Label>Planning Approach</Label>
          <RadioGroup 
            value={formState.planningApproach} 
            onValueChange={(value) => updateForm({ planningApproach: value as "single-year" | "multi-year" })}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="single-year" id="single-year" />
              <Label htmlFor="single-year">Single-year approach (calculate for current tax year only)</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="multi-year" id="multi-year" />
              <Label htmlFor="multi-year">Multi-year approach (optimize across multiple tax years)</Label>
            </div>
          </RadioGroup>
        </div>

        {formState.planningApproach === "multi-year" && (
          <Card className="mt-6 bg-[#1D2433] border-[#2A2F3C]">
            <CardContent className="pt-6">
              <Tabs defaultValue="year1" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="year1">{currentYear} (Year 1)</TabsTrigger>
                  <TabsTrigger value="year2">{currentYear + 1} (Year 2)</TabsTrigger>
                </TabsList>
                
                <TabsContent value="year1" className="space-y-4">
                  {(formState.equityType === "NSO" || formState.equityType === "ISO") && (
                    <div className="space-y-2">
                      <Label htmlFor="year1Exercise">Shares to exercise in {currentYear}</Label>
                      <Input 
                        id="year1Exercise" 
                        type="number"
                        max={formState.vestedShares}
                        value={formState.year1Exercise || ""} 
                        onChange={(e) => updateForm({ year1Exercise: Number(e.target.value) })} 
                        placeholder="0"
                      />
                    </div>
                  )}
                  
                  {formState.hasDeferredComp && (
                    <div className="space-y-2">
                      <Label htmlFor="year1Deferral">Amount to defer from {currentYear}</Label>
                      <Input 
                        id="year1Deferral" 
                        type="number"
                        max={formState.bonusAmount}
                        value={formState.year1Deferral || ""} 
                        onChange={(e) => updateForm({ year1Deferral: Number(e.target.value) })} 
                        placeholder="0"
                      />
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="year2" className="space-y-4">
                  {(formState.equityType === "NSO" || formState.equityType === "ISO") && (
                    <div className="space-y-2">
                      <Label htmlFor="year2Exercise">Shares to exercise in {currentYear + 1}</Label>
                      <Input 
                        id="year2Exercise" 
                        type="number"
                        max={formState.vestedShares - (formState.year1Exercise || 0)}
                        value={formState.year2Exercise || ""} 
                        onChange={(e) => updateForm({ year2Exercise: Number(e.target.value) })} 
                        placeholder="0"
                      />
                      {formState.equityType === "ISO" && formState.year1Exercise && formState.year2Exercise && (
                        <p className="text-xs text-amber-300 mt-1">
                          Note: Exercising ISOs across multiple years may help manage AMT liability.
                        </p>
                      )}
                    </div>
                  )}
                  
                  {formState.hasDeferredComp && (
                    <div className="space-y-2">
                      <Label htmlFor="year2Deferral">Amount to receive in {currentYear + 1}</Label>
                      <Input 
                        id="year2Deferral" 
                        type="number"
                        value={formState.year2Deferral || ""} 
                        onChange={(e) => updateForm({ year2Deferral: Number(e.target.value) })} 
                        placeholder="0"
                      />
                      <p className="text-xs text-muted-foreground">
                        This would be deferred income from previous years that you'll receive in {currentYear + 1}.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
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

export default MultiYearApproachStep;
