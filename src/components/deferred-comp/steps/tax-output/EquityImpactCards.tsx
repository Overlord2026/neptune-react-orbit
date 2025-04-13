
import React from "react";
import { useEquityForm } from "../../context/EquityFormContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { EquityPlanningTable } from "../../components/EquityPlanningTable";

interface EquityImpactCardsProps {
  equityType: string;
  isDisqualifyingDisposition: boolean;
}

export const EquityImpactCards: React.FC<EquityImpactCardsProps> = ({ 
  equityType, 
  isDisqualifyingDisposition 
}) => {
  const { calculateAmtImpact } = useEquityForm();
  const amtImpact = calculateAmtImpact();
  
  return (
    <Card className="bg-[#1D2433] border-[#2A2F3C]">
      <CardHeader>
        <CardTitle className="flex items-center">
          Equity Exercise Impact
          {equityType === "ISO" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    ISO exercises may be subject to AMT. Consult with a tax professional for a complete calculation.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardTitle>
        <CardDescription>
          {equityType === "NSO" 
            ? "NSO exercises are taxed as ordinary income upon exercise."
            : "ISO exercises may trigger Alternative Minimum Tax (AMT)."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EquityPlanningTable />
        
        {equityType === "ISO" && amtImpact > 0 && (
          <div className="mt-4">
            <Card className="bg-amber-900/20 border-amber-500">
              <CardHeader className="py-4">
                <CardTitle className="text-amber-500 text-sm">AMT Consideration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Estimated AMT impact: <span className="font-semibold">${amtImpact.toLocaleString()}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  This is a simplified calculation. Actual AMT depends on your total income, 
                  exemptions, and other factors. Consult with a tax professional.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
