
import React from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import GlossaryTerm from '@/components/GlossaryTerm';
import { FilingStatusType } from '@/types/tax/filingTypes';

interface TaxBracketsSectionProps {
  selectedYear: number;
  selectedFilingStatus: FilingStatusType;
}

const TaxBracketsSection: React.FC<TaxBracketsSectionProps> = ({
  selectedYear,
  selectedFilingStatus
}) => {
  // Format filing status for display
  const formatFilingStatus = (status: FilingStatusType): string => {
    return status.replace(/_/g, ' ');
  };

  // Get tax bracket example based on filing status and year
  const getTaxBracketExample = () => {
    let example;
    
    // Base example changes by filing status and year
    if (selectedFilingStatus === 'married_joint') {
      example = (
        <div className="p-4 bg-[#1A1F2C] rounded-md">
          <p>For a married couple filing jointly with $100,000 taxable income in {selectedYear}:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Pay 10% on first $22,000 = $2,200</li>
            <li>Pay 12% on next $67,450 (from $22,001 to $89,450) = $8,094</li>
            <li>Pay 22% on remaining $10,550 (from $89,451 to $100,000) = $2,321</li>
            <li>Total tax = $12,615</li>
            <li>Effective tax rate = 12.6% ($12,615 ÷ $100,000)</li>
          </ul>
        </div>
      );
    } else {
      example = (
        <div className="p-4 bg-[#1A1F2C] rounded-md">
          <p>For a {formatFilingStatus(selectedFilingStatus)} filer with $60,000 taxable income in {selectedYear}:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Pay 10% on first $11,000 = $1,100</li>
            <li>Pay 12% on next $33,725 (from $11,001 to $44,725) = $4,047</li>
            <li>Pay 22% on remaining $15,275 (from $44,726 to $60,000) = $3,360.50</li>
            <li>Total tax = $8,507.50</li>
            <li>Effective tax rate = 14.2% ($8,507.50 ÷ $60,000)</li>
          </ul>
        </div>
      );
    }
    
    // For 2025, add an adjustment note
    if (selectedYear === 2025) {
      return (
        <>
          {example}
          <p className="text-[#f6ad55] text-sm mt-3">
            Note: 2025 calculations use projected tax brackets that may be adjusted once official IRS figures are released.
          </p>
        </>
      );
    }
    
    return example;
  };

  return (
    <Card className="overflow-hidden mb-6">
      <CardHeader className="bg-[#1A1F2C]">
        <CardTitle id="tax-brackets">How Tax Brackets Work ({selectedYear})</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <p>
            The U.S. uses a <strong>progressive tax system</strong> where different portions of your income are taxed at increasing rates. 
            This system is organized into <GlossaryTerm termId="tax_bracket">tax brackets</GlossaryTerm>, which are income ranges that are taxed at specific rates.
          </p>
          
          <p>
            For example, in {selectedYear}, a {formatFilingStatus(selectedFilingStatus)} filer might pay 10% on the first portion of income, 12% on the next portion, and so on. 
            This means not all of your income is taxed at your highest bracket rate.
          </p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="bracket-example" className="border-[#2d3748]">
              <AccordionTrigger className="text-[#9b87f5] hover:text-[#a495f7] py-4 px-2">
                See Example Calculation ({selectedYear})
              </AccordionTrigger>
              <AccordionContent className="px-2 pb-4">
                {getTaxBracketExample()}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxBracketsSection;
