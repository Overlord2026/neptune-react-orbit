
import React from 'react';
import { CharitableScenario } from '../types/CharitableTypes';
import { Badge } from '@/components/ui/badge';
import { Check, AlertTriangle } from 'lucide-react';

interface StrategyListProps {
  scenario: CharitableScenario;
}

const StrategyList: React.FC<StrategyListProps> = ({ scenario }) => {
  const hasAnnualGiving = 
    (scenario.annualGiving.type === 'fixed' && scenario.annualGiving.amount > 0) || 
    (scenario.annualGiving.type === 'variable' && 
      scenario.annualGiving.yearlyAmounts && 
      scenario.annualGiving.yearlyAmounts.length > 0);
  
  const hasDaf = scenario.dafStrategy.useDaf;
  const hasQcd = scenario.qcd.useQcd;
  const hasCrt = scenario.crt?.useCrt;
  
  // Format currency values
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    });
  };

  return (
    <ul className="space-y-3">
      {hasAnnualGiving && (
        <li className="flex items-center">
          <div className="bg-[#1A1F2C] h-6 w-6 rounded-full flex items-center justify-center mr-3">
            <Check className="h-4 w-4 text-emerald-500" />
          </div>
          <span className="text-white">
            {scenario.annualGiving.type === 'fixed' 
              ? `Annual charitable giving of ${formatCurrency(scenario.annualGiving.amount)}`
              : 'Variable annual charitable giving'
            }
            {scenario.isItemizing && (
              <Badge variant="outline" className="ml-2 bg-emerald-950/50 text-emerald-400 border-emerald-800">
                Itemized Deduction
              </Badge>
            )}
          </span>
        </li>
      )}
      
      {hasDaf && (
        <li className="flex items-center">
          <div className="bg-[#1A1F2C] h-6 w-6 rounded-full flex items-center justify-center mr-3">
            <Check className="h-4 w-4 text-emerald-500" />
          </div>
          <span className="text-white">
            Donor-Advised Fund
            {scenario.dafStrategy.approach === 'bunching' && (
              <Badge variant="outline" className="ml-2 bg-blue-950/50 text-blue-400 border-blue-800">
                Bunching Strategy
              </Badge>
            )}
          </span>
        </li>
      )}
      
      {hasCrt && (
        <li className="flex items-center">
          <div className="bg-[#1A1F2C] h-6 w-6 rounded-full flex items-center justify-center mr-3">
            <Check className="h-4 w-4 text-emerald-500" />
          </div>
          <span className="text-white">
            {scenario.crt.type === 'CRAT' ? 'Charitable Remainder Annuity Trust (CRAT)' : 'Charitable Remainder Unitrust (CRUT)'}
            <Badge variant="outline" className="ml-2 bg-purple-950/50 text-purple-400 border-purple-800">
              {formatCurrency(scenario.crt.fundingAmount)} at {scenario.crt.payoutRate}%
            </Badge>
          </span>
        </li>
      )}
      
      {hasQcd && (
        <li className="flex items-center">
          <div className="bg-[#1A1F2C] h-6 w-6 rounded-full flex items-center justify-center mr-3">
            <Check className="h-4 w-4 text-emerald-500" />
          </div>
          <span className="text-white">
            Qualified Charitable Distribution (QCD) from IRA
            <Badge variant="outline" className="ml-2 bg-amber-950/50 text-amber-400 border-amber-800">
              {formatCurrency(scenario.qcd.amount)}
            </Badge>
          </span>
        </li>
      )}
      
      {!hasAnnualGiving && !hasDaf && !hasQcd && !hasCrt && (
        <li className="flex items-center">
          <div className="bg-[#1A1F2C] h-6 w-6 rounded-full flex items-center justify-center mr-3">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <span className="text-amber-500">
            No charitable giving strategies configured
          </span>
        </li>
      )}
    </ul>
  );
};

export default StrategyList;
