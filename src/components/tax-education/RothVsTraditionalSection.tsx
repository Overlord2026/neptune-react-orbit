
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

interface RothVsTraditionalSectionProps {
  selectedYear: number;
}

const RothVsTraditionalSection: React.FC<RothVsTraditionalSectionProps> = ({
  selectedYear
}) => {
  const contentOptions = {
    year: selectedYear,
    format: 'currency' as const
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-[#1A1F2C]">
        <CardTitle>Roth vs. Traditional Accounts</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <p>
            <strong><GlossaryTerm termId="traditional_ira">Traditional accounts</GlossaryTerm></strong> (like Traditional IRAs and 401(k)s) offer tax-deferred growth. Contributions may be tax-deductible now, but withdrawals in retirement are taxed as ordinary income.
          </p>
          <p>
            <strong><GlossaryTerm termId="roth_ira">Roth accounts</GlossaryTerm></strong> (like Roth IRAs and Roth 401(k)s) are funded with after-tax dollars, offering no immediate tax benefit. However, qualified withdrawals in retirement are completely tax-free, including all growth and earnings.
          </p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="account-comparison">
              <AccordionTrigger className="text-[#9b87f5]">
                When to Choose Each Type
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#1A1F2C] rounded-md">
                    <h4 className="font-semibold mb-2">Consider Traditional when:</h4>
                    <ul className="list-disc list-inside">
                      <li>You expect to be in a lower tax bracket in retirement</li>
                      <li>You want to reduce your current taxable income</li>
                      <li>You need the tax deduction now</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-[#1A1F2C] rounded-md">
                    <h4 className="font-semibold mb-2">Consider Roth when:</h4>
                    <ul className="list-disc list-inside">
                      <li>You expect to be in a higher tax bracket in retirement</li>
                      <li>You want tax-free withdrawals in retirement</li>
                      <li>You want to avoid Required Minimum Distributions</li>
                      <li>You want to leave tax-free assets to heirs</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-[#0b1120] rounded-md">
                  <h4 className="font-semibold mb-2">Current Contribution Limits ({selectedYear}):</h4>
                  <ul className="list-disc list-inside">
                    <li>
                      IRA Contribution Limit: <DynamicContentText options={contentOptions}>{`IRA_limit`}</DynamicContentText>
                    </li>
                    <li>
                      401(k) Contribution Limit: <DynamicContentText options={contentOptions}>{`401k_limit`}</DynamicContentText>
                    </li>
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

export default RothVsTraditionalSection;
