
import React from 'react';
import { AlertTriangle, Info, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import TaxDisclaimerWithCheckbox from '@/components/tax/TaxDisclaimerWithCheckbox';

interface EquityDisclaimerSectionProps {
  acknowledged: boolean;
  onAcknowledgeChange: (checked: boolean) => void;
}

const EquityDisclaimerSection: React.FC<EquityDisclaimerSectionProps> = ({
  acknowledged,
  onAcknowledgeChange
}) => {
  return (
    <div className="space-y-4">
      <TaxDisclaimerWithCheckbox
        acknowledged={acknowledged}
        onAcknowledgeChange={onAcknowledgeChange}
        title="Equity Compensation Disclaimer"
        content={
          <>
            <p>
              Equity compensation is subject to complex tax rules—this module provides approximations. 
              Consult your CPA or tax advisor for specifics, especially for:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>ISO Alternative Minimum Tax (AMT) calculations</li>
              <li>Partial or disqualifying dispositions</li>
              <li>Special holding period considerations</li>
              <li>Employer-specific equity plan rules</li>
            </ul>
            
            <div className="mt-3 p-3 bg-blue-900/20 border border-blue-800/30 rounded-md">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-400 flex-shrink-0 mt-1" />
                <p className="text-sm">
                  If you're considering 83(b) elections for early exercising of restricted stock, 
                  note that this tool only provides basic scenario planning. Filing official forms 
                  with the IRS within 30 days of exercise is your responsibility.
                </p>
              </div>
            </div>
            
            <TooltipProvider>
              <div className="mt-3 flex items-center">
                <HelpCircle className="h-4 w-4 text-muted-foreground mr-2" />
                <Tooltip>
                  <TooltipTrigger className="text-sm text-muted-foreground hover:underline cursor-help">
                    Can this tool help with state tax implications?
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      This tool focuses on federal tax implications. State tax treatment of equity compensation 
                      varies significantly and may require additional planning with a tax professional familiar 
                      with your state's tax code.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </>
        }
        checkboxLabel="I understand that this is a planning tool only and not a substitute for professional tax advice."
      />
    </div>
  );
};

export default EquityDisclaimerSection;
