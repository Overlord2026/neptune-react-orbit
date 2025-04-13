
import React from "react";
import { useEquityForm } from "../../context/EquityFormContext";
import { Checkbox } from "@/components/ui/checkbox";

interface EquityDisclaimerSectionProps {
  acknowledged: boolean;
  onAcknowledgeChange: (acknowledged: boolean) => void;
}

export const EquityDisclaimerSection: React.FC<EquityDisclaimerSectionProps> = ({ 
  acknowledged,
  onAcknowledgeChange 
}) => {
  return (
    <div className="bg-[#161B29] border border-[#2A2F3C] rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-medium text-white">Important Tax Disclaimer</h3>
      <p className="text-sm text-muted-foreground">
        This analysis provides estimates based on your inputs and standard tax calculations. 
        Actual tax implications may vary based on your complete financial situation, tax filing status, 
        and other factors not captured in this tool.
      </p>
      
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Please consider the following:</p>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li>Tax laws and rates change frequently and may affect future analysis.</li>
          <li>Alternative Minimum Tax (AMT) calculations are complex and depend on many factors.</li>
          <li>State and local taxes are not included in this analysis.</li>
          <li>Deferred compensation plans have specific rules that may impact your tax situation.</li>
        </ul>
      </div>
      
      <div className="flex items-center space-x-2 pt-2">
        <Checkbox 
          id="disclaimer" 
          checked={acknowledged} 
          onCheckedChange={(checked) => {
            if (typeof checked === "boolean") {
              onAcknowledgeChange(checked);
            }
          }}
        />
        <label
          htmlFor="disclaimer"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I acknowledge this is for educational purposes only and not professional tax advice
        </label>
      </div>
    </div>
  );
};
