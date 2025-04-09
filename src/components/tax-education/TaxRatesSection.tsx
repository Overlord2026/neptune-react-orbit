
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import GlossaryTerm from '@/components/GlossaryTerm';

const TaxRatesSection: React.FC = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-[#1A1F2C]">
        <CardTitle>Marginal vs. Effective Tax Rates</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <p>
            Your <strong><GlossaryTerm termId="marginal_tax_rate">marginal tax rate</GlossaryTerm></strong> is the rate you pay on the last dollar of income earned (your highest tax bracket). This is often what people refer to when they say "I'm in the 24% bracket."
          </p>
          <p>
            Your <strong><GlossaryTerm termId="effective_tax_rate">effective tax rate</GlossaryTerm></strong> is the actual percentage of your income that you pay in taxes, calculated as total tax divided by total taxable income. Because of the progressive bracket system, your effective rate is always lower than your marginal rate.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxRatesSection;
