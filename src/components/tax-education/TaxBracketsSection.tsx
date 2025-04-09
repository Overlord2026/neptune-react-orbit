
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

interface TaxBracketsSectionProps {
  selectedYear: number;
  selectedFilingStatus: 'single' | 'married' | 'head_of_household';
}

const TaxBracketsSection: React.FC<TaxBracketsSectionProps> = ({
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
        <CardTitle id="tax-brackets">How Tax Brackets Work</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <p>
            The U.S. uses a <strong>progressive tax system</strong> where different portions of your income are taxed at increasing rates. 
            This system is organized into <GlossaryTerm termId="tax_bracket">tax brackets</GlossaryTerm>, which are income ranges that are taxed at specific rates.
          </p>
          
          <p>
            For example, in {selectedYear}, a single filer might pay 10% on the first $11,000 of income, 12% on income from $11,001 to $44,725, and so on. 
            This means not all of your income is taxed at your highest bracket rate.
          </p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="bracket-example">
              <AccordionTrigger className="text-[#9b87f5]">
                See Example Calculation
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 bg-[#1A1F2C] rounded-md">
                  <p>
                    For a {selectedFilingStatus} filer with $60,000 taxable income in {selectedYear}:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Pay 10% on first $11,000 = $1,100</li>
                    <li>Pay 12% on next $33,725 (from $11,001 to $44,725) = $4,047</li>
                    <li>Pay 22% on remaining $15,275 (from $44,726 to $60,000) = $3,361</li>
                    <li>Total tax = $8,508</li>
                    <li><GlossaryTerm termId="effective_tax_rate">Effective tax rate</GlossaryTerm> = 14.2% ($8,508 ÷ $60,000)</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxBracketsSection;
