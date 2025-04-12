import React from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import GlossaryTerm from '@/components/GlossaryTerm';
import DynamicContentText from '@/components/DynamicContentText';

interface CapitalGainsSectionProps {
  selectedYear: number;
  selectedFilingStatus: 'single' | 'married' | 'head_of_household';
}

const CapitalGainsSection: React.FC<CapitalGainsSectionProps> = ({
  selectedYear,
  selectedFilingStatus
}) => {
  const contentOptions = {
    year: selectedYear,
    filingStatus: selectedFilingStatus,
    format: 'currency' as const
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-[#1A1F2C]">
        <CardTitle>Capital Gains Basics</CardTitle>
        {selectedYear === 2025 && (
          <p className="text-xs text-gray-400 mt-1">
            Tax rates and thresholds for 2025 are projected/estimated and may change once official IRS figures are released. For the most accurate information, consult the latest IRS publications.
          </p>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <p>
            <strong><GlossaryTerm termId="capital_gain">Capital gains</GlossaryTerm></strong> are profits from selling assets that have increased in value, such as stocks, real estate, or collectibles. These are generally taxed at lower rates than ordinary income.
          </p>
          <p>
            <strong><GlossaryTerm termId="short_term_capital_gain">Short-term capital gains</GlossaryTerm></strong> (assets held for one year or less) are taxed at your ordinary income tax rates, while <strong><GlossaryTerm termId="long_term_capital_gain">long-term capital gains</GlossaryTerm></strong> (assets held longer than one year) are taxed at 0%, 15%, or 20% depending on your income level.
          </p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="capital-gains-rates">
              <AccordionTrigger className="text-[#9b87f5]">
                Long-Term Capital Gains Rates ({selectedYear})
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 bg-[#1A1F2C] rounded-md">
                  <ul className="list-disc list-inside">
                    <li><strong>0% rate:</strong> Income up to <DynamicContentText 
                        options={{...contentOptions, filingStatus: 'single'}}
                      >{`capital_gains_0_rate_max`}</DynamicContentText> (single) or <DynamicContentText 
                        options={{...contentOptions, filingStatus: 'married'}}
                      >{`capital_gains_0_rate_max`}</DynamicContentText> (married filing jointly)
                    </li>
                    <li><strong>15% rate:</strong> Income from $47,001 to $518,000 (single) or $94,001 to $583,000 (married filing jointly)</li>
                    <li><strong>20% rate:</strong> Income above $518,000 (single) or $583,000 (married filing jointly)</li>
                  </ul>
                  <p className="mt-2 text-sm text-yellow-300">Note: An additional 3.8% Net Investment Income Tax may apply to high-income earners.</p>
                  {selectedYear === 2025 && (
                    <p className="mt-2 text-xs text-gray-400">
                      Tax rates and thresholds for 2025 are projected/estimated and may change once official IRS figures are released. For the most accurate information, consult the latest IRS publications.
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};

export default CapitalGainsSection;
