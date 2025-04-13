
import React from 'react';
import { AlertTriangle, HelpCircle, ExternalLink } from 'lucide-react';
import { CharitableScenario } from '../types/CharitableTypes';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from 'react-router-dom';

interface ResultDisclaimerProps {
  scenario?: CharitableScenario;
}

const ResultDisclaimer: React.FC<ResultDisclaimerProps> = ({ scenario }) => {
  // Determine what strategies are being used
  const isUsingQcd = scenario?.qcd?.useQcd || false;
  const isUsingBunching = scenario?.dafStrategy?.approach === 'bunching' || false;
  const isUsingCrt = scenario?.crt?.useCrt || false;
  
  return (
    <div className="space-y-4">
      {/* General Disclaimer */}
      <div className="bg-[#1A1F2C]/50 p-4 rounded-md flex items-start space-x-3 text-sm">
        <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
        <div>
          <p className="font-medium text-white">Important Disclaimers</p>
          <p className="text-muted-foreground">
            This tool models approximate tax outcomes only. For actual charitable strategies or establishing 
            donor-advised funds, consult your financial advisor or attorney. Tax laws change frequently, and 
            results may vary based on your complete financial situation.
          </p>
        </div>
      </div>
      
      {/* QCD-specific disclaimer */}
      {isUsingQcd && (
        <div className="bg-[#1A1F2C]/50 p-4 rounded-md flex items-start space-x-3 text-sm">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="font-medium text-white">QCD Considerations</p>
            <p className="text-muted-foreground">
              Qualified Charitable Distributions must go directly from your IRA to a qualified charity. 
              Not all 501(c)(3) organizations qualify for QCDs. Confirm eligibility and specific rules 
              with your IRA custodian before initiating a transfer.
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center mt-2 text-primary cursor-help">
                    <HelpCircle size={14} className="mr-1" />
                    <span className="text-xs">How QCDs reduce RMDs</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-xs">
                    QCDs count toward your Required Minimum Distribution but aren't included in your taxable income,
                    effectively reducing your MAGI for tax purposes, which can lower your Medicare premiums and
                    taxation of Social Security benefits.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
      
      {/* CRT-specific disclaimer */}
      {isUsingCrt && (
        <div className="bg-[#1A1F2C]/50 p-4 rounded-md flex items-start space-x-3 text-sm">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="font-medium text-white">CRT Legal Requirements</p>
            <p className="text-muted-foreground">
              Charitable Remainder Trusts require proper legal establishment and ongoing administration.
              The IRS requires a minimum 5% annual payout rate and a minimum 10% charitable remainder value.
              Consult with an attorney experienced in charitable planning before establishing any trust.
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center mt-2 text-primary cursor-help">
                    <HelpCircle size={14} className="mr-1" />
                    <span className="text-xs">What is the Section 7520 rate?</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-xs">
                    The IRS Section 7520 rate is used to calculate the present value of the remainder interest
                    in a CRT. This rate is published monthly by the IRS and can significantly impact the charitable deduction
                    amount. Higher rates generally favor CRATs, while lower rates favor CRUTs.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
      
      {/* Bunching/lumping disclaimer */}
      {isUsingBunching && (
        <div className="bg-[#1A1F2C]/50 p-4 rounded-md flex items-start space-x-3 text-sm">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="font-medium text-white">Bunching Strategy Considerations</p>
            <p className="text-muted-foreground">
              Large one-year donations can maximize deductions but may not align with your long-term giving plans.
              Confirm with your accountant if bunching strategies align with your philanthropic timeline and 
              overall tax situation.
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center mt-2 text-primary cursor-help">
                    <HelpCircle size={14} className="mr-1" />
                    <span className="text-xs">What is a donor-advised fund?</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-xs">
                    A donor-advised fund (DAF) is a giving account established at a public charity that allows you
                    to make a charitable contribution, receive an immediate tax deduction, and then recommend grants
                    from the fund over time while the assets potentially grow tax-free.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
      
      {/* Current tax law notice */}
      <div className="bg-[#1A1F2C]/50 p-4 rounded-md flex items-start space-x-3 text-sm">
        <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
        <div>
          <p className="font-medium text-white">Current Tax Laws</p>
          <p className="text-muted-foreground">
            This analysis reflects standard tax rules for charitable contributions. Temporary expansions 
            under the CARES Act have expired. Normal AGI limitations for cash gifts (60% of AGI), 
            appreciated securities (30% of AGI), and other contribution types now apply.
          </p>
          <Link 
            to="/tax-education/charitable-giving" 
            className="flex items-center mt-2 text-primary text-xs hover:underline"
          >
            Learn more about charitable giving strategies
            <ExternalLink size={12} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultDisclaimer;
