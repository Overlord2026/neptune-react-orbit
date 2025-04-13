
import React from 'react';
import { CharitableScenario } from '../types/CharitableTypes';

interface StrategyListProps {
  scenario: CharitableScenario;
}

const StrategyList: React.FC<StrategyListProps> = ({ scenario }) => {
  const annualGivingAmount = scenario.annualGiving.amount;
  const isUsingQcd = scenario.qcd.useQcd;
  const isUsingDaf = scenario.dafStrategy.useDaf;
  const isUsingBunching = isUsingDaf && scenario.dafStrategy.approach === "bunching";

  return (
    <div className="bg-[#1A1F2C] p-4 rounded-md">
      <h5 className="font-medium text-white mb-2">Primary Strategies:</h5>
      <ul className="space-y-3">
        <li className="flex items-start space-x-3">
          <div className="h-5 w-5 rounded-full bg-[#00C47C] flex items-center justify-center text-xs font-medium text-black mt-0.5">✓</div>
          <div>
            <p className="text-white">Annual Charitable Giving</p>
            <p className="text-sm text-muted-foreground">
              {scenario.annualGiving.type === "fixed" 
                ? `$${annualGivingAmount.toLocaleString()} per year` 
                : "Variable giving amounts over time"}
            </p>
          </div>
        </li>
        
        {isUsingDaf && (
          <li className="flex items-start space-x-3">
            <div className="h-5 w-5 rounded-full bg-[#00C47C] flex items-center justify-center text-xs font-medium text-black mt-0.5">✓</div>
            <div>
              <p className="text-white">Donor-Advised Fund</p>
              <p className="text-sm text-muted-foreground">
                {isUsingBunching 
                  ? `Bunching ${scenario.dafStrategy.bunchingYears} years of contributions in one year` 
                  : "Annual contributions to DAF"}
              </p>
            </div>
          </li>
        )}
        
        {isUsingQcd && (
          <li className="flex items-start space-x-3">
            <div className="h-5 w-5 rounded-full bg-[#00C47C] flex items-center justify-center text-xs font-medium text-black mt-0.5">✓</div>
            <div>
              <p className="text-white">Qualified Charitable Distributions</p>
              <p className="text-sm text-muted-foreground">
                ${scenario.qcd.amount.toLocaleString()} annual QCD from IRA, reducing AGI and potentially RMDs
              </p>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default StrategyList;
