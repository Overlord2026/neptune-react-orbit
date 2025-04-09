
import React from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const FilingStatusOverviewSection: React.FC = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-[#1A1F2C]">
        <CardTitle>Filing Status Overview</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <p>
            Your filing status determines your tax rates, deduction amounts, and eligibility for certain tax benefits. The status you choose depends on your marital status and family situation as of December 31st of the tax year.
          </p>

          <Accordion type="multiple" className="w-full">
            <AccordionItem value="filing-statuses">
              <AccordionTrigger className="text-[#9b87f5]">
                Filing Status Types
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="p-3 bg-[#1A1F2C] rounded-md">
                    <h4 className="font-semibold">Single</h4>
                    <p className="text-sm">For unmarried individuals or those legally separated from their spouse.</p>
                  </div>
                  
                  <div className="p-3 bg-[#1A1F2C] rounded-md">
                    <h4 className="font-semibold">Married Filing Jointly</h4>
                    <p className="text-sm">For married couples who combine their income and deductions on one return. Generally offers the most tax benefits.</p>
                  </div>
                  
                  <div className="p-3 bg-[#1A1F2C] rounded-md">
                    <h4 className="font-semibold">Married Filing Separately</h4>
                    <p className="text-sm">For married couples who file separate returns. May benefit couples with significant differences in income or deductions.</p>
                  </div>
                  
                  <div className="p-3 bg-[#1A1F2C] rounded-md">
                    <h4 className="font-semibold">Head of Household</h4>
                    <p className="text-sm">For unmarried individuals who pay more than half the cost of keeping up a home for themselves and a qualifying dependent.</p>
                  </div>
                  
                  <div className="p-3 bg-[#1A1F2C] rounded-md">
                    <h4 className="font-semibold">Qualifying Widow(er)</h4>
                    <p className="text-sm">For individuals whose spouse died in the previous two years and who have a dependent child.</p>
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

export default FilingStatusOverviewSection;
