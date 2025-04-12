
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import GlossaryTerm from '@/components/GlossaryTerm';

interface TaxRatesSectionProps {
  selectedYear?: number;
}

const TaxRatesSection: React.FC<TaxRatesSectionProps> = ({ 
  selectedYear = new Date().getFullYear() 
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-[#1A1F2C]">
        <CardTitle>Marginal vs. Effective Tax Rates</CardTitle>
        {selectedYear === 2025 && (
          <p className="text-xs text-gray-400 mt-1">
            Tax rates and thresholds for 2025 are projected/estimated and may change once official IRS figures are released. For the most accurate information, consult the latest IRS publications.
          </p>
        )}
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
