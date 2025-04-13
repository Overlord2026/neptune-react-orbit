
import React from 'react';
import { Card } from '@/components/ui/card';
import { HelpCircle, Info, AlertTriangle, DollarSign, Calendar, Building } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CrtResultsSectionProps {
  type: "CRAT" | "CRUT";
  fundingAmount: number;
  payoutRate: number;
  deduction: number;
  annualPayout: number;
  trustTerm: number | "lifetime";
  estateTaxSavings: number;
}

const CrtResultsSection: React.FC<CrtResultsSectionProps> = ({
  type,
  fundingAmount,
  payoutRate,
  deduction,
  annualPayout,
  trustTerm,
  estateTaxSavings
}) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  };
  
  const trustType = type === "CRAT" ? "Charitable Remainder Annuity Trust" : "Charitable Remainder Unitrust";
  const termDescription = trustTerm === "lifetime" ? "Lifetime" : `${trustTerm} years`;
  
  // Calculate tax deduction percentage
  const deductionPercentage = (deduction / fundingAmount) * 100;
  
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-white">Charitable Remainder Trust Analysis:</h4>
      
      <Card className="bg-[#1A1F2C] p-4 border border-slate-700">
        <h5 className="text-primary text-lg font-medium mb-3">Charitable Remainder Trust Summary</h5>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Type</p>
            <p className="text-lg font-medium text-white">{trustType}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Term</p>
            <p className="text-lg font-medium text-white">{termDescription}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-[#242A38] p-3 rounded-md flex justify-between items-center">
            <div className="flex items-start gap-3">
              <DollarSign className="text-[#FFD700] shrink-0 mt-1" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Estimated Immediate Deduction</p>
                <p className="text-lg font-medium text-white">{formatCurrency(deduction)}</p>
                <p className="text-xs text-muted-foreground">
                  {deductionPercentage.toFixed(1)}% of funding amount
                </p>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <HelpCircle className="text-muted-foreground" size={18} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p className="text-sm">
                    The deduction equals the present value of the remainder interest that will go to charity, 
                    calculated using IRS tables and the Section 7520 rate.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="bg-[#242A38] p-3 rounded-md flex justify-between items-center">
            <div className="flex items-start gap-3">
              <Calendar className="text-[#FFD700] shrink-0 mt-1" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Annual Income {termDescription}</p>
                <p className="text-lg font-medium text-white">{formatCurrency(annualPayout)}</p>
                <p className="text-xs text-muted-foreground">
                  {payoutRate}% {type === "CRAT" ? "fixed payment" : "of trust value annually"}
                </p>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <HelpCircle className="text-muted-foreground" size={18} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p className="text-sm">
                    {type === "CRAT" 
                      ? "A CRAT pays the same fixed dollar amount each year regardless of investment performance."
                      : "A CRUT pays a fixed percentage of the trust's value as recalculated each year, allowing payments to potentially grow over time."
                    }
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {estateTaxSavings > 0 && (
            <div className="bg-[#242A38] p-3 rounded-md flex justify-between items-center">
              <div className="flex items-start gap-3">
                <Building className="text-[#FFD700] shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground">Potential Estate Reduction</p>
                  <p className="text-lg font-medium text-white">{formatCurrency(estateTaxSavings)}</p>
                  <p className="text-xs text-muted-foreground">
                    Assumes estate subject to federal estate tax
                  </p>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help">
                      <HelpCircle className="text-muted-foreground" size={18} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-xs">
                    <p className="text-sm">
                      Assets placed in a CRT are removed from your taxable estate, potentially reducing estate taxes.
                      This only applies if your estate would exceed the federal exemption amount.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
        
        <div className="mt-4 bg-[#141820] p-3 rounded-md border border-slate-700">
          <div className="flex items-start gap-2">
            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-medium text-white">IRS Requirements</p>
              <p className="text-xs text-muted-foreground">
                To qualify as a CRT, the trust must meet the IRS 10% minimum remainder requirement and follow specific 
                rules about payout rates (minimum 5%). A properly drafted trust document by an attorney specializing in 
                charitable planning is essential.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CrtResultsSection;
