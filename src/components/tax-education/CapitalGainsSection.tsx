
import React from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import GlossaryTerm from '@/components/GlossaryTerm';

interface CapitalGainsSectionProps {
  selectedYear: number;
  selectedFilingStatus: 'single' | 'married' | 'head_of_household';
}

const CapitalGainsSection: React.FC<CapitalGainsSectionProps> = ({
  selectedYear,
  selectedFilingStatus
}) => {
  // Function to get capital gains thresholds based on year and filing status
  const getCapitalGainsThresholds = () => {
    // Basic thresholds that change based on year and filing status
    let zeroRateMax, fifteenRateMax;
    
    if (selectedYear === 2023) {
      if (selectedFilingStatus === 'single') {
        zeroRateMax = 44625;
        fifteenRateMax = 492300;
      } else if (selectedFilingStatus === 'married') {
        zeroRateMax = 89250;
        fifteenRateMax = 553850;
      } else { // head_of_household
        zeroRateMax = 59750;
        fifteenRateMax = 523050;
      }
    } else if (selectedYear === 2024) {
      if (selectedFilingStatus === 'single') {
        zeroRateMax = 47025;
        fifteenRateMax = 518900;
      } else if (selectedFilingStatus === 'married') {
        zeroRateMax = 94050;
        fifteenRateMax = 583750;
      } else { // head_of_household
        zeroRateMax = 63000;
        fifteenRateMax = 551350;
      }
    } else if (selectedYear === 2025) {
      // Projected 2025 values with ~5% inflation adjustment
      if (selectedFilingStatus === 'single') {
        zeroRateMax = 49375;
        fifteenRateMax = 544845;
      } else if (selectedFilingStatus === 'married') {
        zeroRateMax = 98750;
        fifteenRateMax = 612950;
      } else { // head_of_household
        zeroRateMax = 66150;
        fifteenRateMax = 578920;
      }
    } else {
      // Default 2022 values
      if (selectedFilingStatus === 'single') {
        zeroRateMax = 41675;
        fifteenRateMax = 459750;
      } else if (selectedFilingStatus === 'married') {
        zeroRateMax = 83350; 
        fifteenRateMax = 517200;
      } else { // head_of_household
        zeroRateMax = 55800;
        fifteenRateMax = 488500;
      }
    }
    
    return { zeroRateMax, fifteenRateMax };
  };
  
  const { zeroRateMax, fifteenRateMax } = getCapitalGainsThresholds();
  
  // Format numbers with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <Card className="overflow-hidden mb-6">
      <CardHeader className="bg-[#1A1F2C]">
        <CardTitle>Capital Gains Basics ({selectedYear})</CardTitle>
        {selectedYear === 2025 && (
          <p className="text-xs text-gray-400 mt-1">
            Tax rates and thresholds for 2025 are projected/estimated and may change once official IRS figures are released.
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
            <AccordionItem value="capital-gains-rates" className="border-[#2d3748]">
              <AccordionTrigger className="text-[#9b87f5] hover:text-[#a495f7] py-4 px-2">
                Long-Term Capital Gains Rates ({selectedYear})
              </AccordionTrigger>
              <AccordionContent className="px-2 pb-4">
                <div className="p-4 bg-[#1A1F2C] rounded-md">
                  <ul className="list-disc list-inside">
                    <li><strong>0% rate:</strong> Income up to ${formatNumber(zeroRateMax)} ({selectedFilingStatus}) </li>
                    <li><strong>15% rate:</strong> Income from ${formatNumber(zeroRateMax + 1)} to ${formatNumber(fifteenRateMax)} ({selectedFilingStatus})</li>
                    <li><strong>20% rate:</strong> Income above ${formatNumber(fifteenRateMax)} ({selectedFilingStatus})</li>
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
