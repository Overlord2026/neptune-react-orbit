
import React from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const TaxFormsSection: React.FC = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-[#1A1F2C]">
        <CardTitle>Common Tax Forms</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <p>
            Understanding tax forms is essential for proper tax filing. Each form serves a specific purpose in reporting different types of income or claiming deductions and credits.
          </p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="form-w2">
              <AccordionTrigger className="text-[#9b87f5]">
                W-2 (Wage and Tax Statement)
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  The W-2 is issued by employers to employees, showing annual wages earned and taxes withheld. This includes federal, state, and other taxes, as well as contributions to retirement plans and benefits. You'll receive this by January 31st for the previous tax year.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="form-1099">
              <AccordionTrigger className="text-[#9b87f5]">
                1099 Forms (Independent Contractor Income)
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  1099 forms report income from sources other than employment. Common types include:
                </p>
                <ul className="list-disc list-inside mt-2">
                  <li>1099-NEC: For independent contractor/freelance income</li>
                  <li>1099-INT: For interest income from banks</li>
                  <li>1099-DIV: For dividends from investments</li>
                  <li>1099-MISC: For miscellaneous income</li>
                  <li>1099-R: For distributions from retirement accounts</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="form-1040">
              <AccordionTrigger className="text-[#9b87f5]">
                1040 (Individual Income Tax Return)
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Form 1040 is the main tax return form for individuals. It summarizes your income, deductions, credits, and calculates your final tax obligation or refund. Most taxpayers file this form annually by April 15th, though extensions are available.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxFormsSection;
