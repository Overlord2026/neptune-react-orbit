
import React from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import GlossaryTerm from '@/components/GlossaryTerm';

const DeductionsVsCreditsSection: React.FC = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-[#1A1F2C]">
        <CardTitle>Deductions vs. Credits</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <p>
            <strong><GlossaryTerm termId="tax_deduction">Tax deductions</GlossaryTerm></strong> reduce your taxable income before the tax rate is applied. For example, a $1,000 deduction for someone in the 22% tax bracket saves $220 in taxes.
          </p>
          <p>
            <strong><GlossaryTerm termId="tax_credit">Tax credits</GlossaryTerm></strong> reduce your tax bill dollar-for-dollar after taxes are calculated. A $1,000 tax credit saves you exactly $1,000 in taxes, regardless of your tax bracket. This generally makes credits more valuable than deductions of the same amount.
          </p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="examples">
              <AccordionTrigger className="text-[#9b87f5]">
                Common Examples
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#1A1F2C] rounded-md">
                    <h4 className="font-semibold mb-2">Common Deductions:</h4>
                    <ul className="list-disc list-inside">
                      <li>Mortgage interest</li>
                      <li>State and local taxes (SALT)</li>
                      <li>Charitable contributions</li>
                      <li>Student loan interest</li>
                      <li>Health Savings Account (HSA) contributions</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-[#1A1F2C] rounded-md">
                    <h4 className="font-semibold mb-2">Common Credits:</h4>
                    <ul className="list-disc list-inside">
                      <li>Child Tax Credit</li>
                      <li>Earned Income Tax Credit</li>
                      <li>American Opportunity Credit (education)</li>
                      <li>Lifetime Learning Credit (education)</li>
                      <li>Residential energy credits</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeductionsVsCreditsSection;
