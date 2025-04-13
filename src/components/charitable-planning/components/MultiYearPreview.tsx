
import React from 'react';
import { CharitableScenario } from '../types/CharitableTypes';
import { PanelRight } from 'lucide-react';

interface MultiYearPreviewProps {
  scenario: CharitableScenario;
  isEnabled: boolean;
}

const MultiYearPreview: React.FC<MultiYearPreviewProps> = ({ scenario, isEnabled }) => {
  if (!isEnabled) return null;

  return (
    <div className="bg-[#242A38] p-4 rounded-md flex items-start space-x-3">
      <PanelRight className="text-[#FFD700] shrink-0 mt-0.5" size={18} />
      <div className="text-sm">
        <p className="font-medium text-white">Multi-Year Preview</p>
        <p className="text-muted-foreground mb-3">
          Based on your selections, we'll generate a 5-year plan showing how your charitable giving 
          impacts your taxes each year.
        </p>
        
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-[#1A1F2C] p-2 rounded text-center">
              <div className="text-white font-medium">Year 1</div>
              {scenario.dafStrategy.approach === "bunching" ? (
                <div className="text-[#00C47C]">Large Contribution</div>
              ) : (
                <div className="text-muted-foreground">Standard Giving</div>
              )}
            </div>
            <div className="bg-[#1A1F2C] p-2 rounded text-center">
              <div className="text-white font-medium">Year 2</div>
              {scenario.dafStrategy.approach === "bunching" ? (
                <div className="text-amber-500">Standard Deduction</div>
              ) : (
                <div className="text-muted-foreground">Standard Giving</div>
              )}
            </div>
            <div className="bg-[#1A1F2C] p-2 rounded text-center">
              <div className="text-white font-medium">Year 3</div>
              {scenario.dafStrategy.approach === "bunching" && scenario.dafStrategy.bunchingYears <= 2 ? (
                <div className="text-[#00C47C]">Large Contribution</div>
              ) : (
                <div className="text-muted-foreground">Standard Giving</div>
              )}
            </div>
          </div>
          
          {scenario.qcd.useQcd && (
            <div className="bg-[#1A1F2C] p-2 rounded text-xs">
              <div className="text-white font-medium">QCD Impact</div>
              <div className="text-[#00C47C]">
                ${scenario.qcd.amount.toLocaleString()} QCD each year reduces AGI
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiYearPreview;
