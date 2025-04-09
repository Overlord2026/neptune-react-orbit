
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from 'lucide-react';
import { TaxTrapChecker } from './TaxTrapChecker';
import { TaxResult } from '@/utils/taxCalculator';

interface TaxTrapCollapsibleProps {
  selectedScenario: TaxResult | null;
}

const TaxTrapCollapsible: React.FC<TaxTrapCollapsibleProps> = ({ selectedScenario }) => {
  const [isTrapCollapsibleOpen, setIsTrapCollapsibleOpen] = useState(false);

  if (!selectedScenario) return null;

  return (
    <Collapsible
      open={isTrapCollapsibleOpen}
      onOpenChange={setIsTrapCollapsibleOpen}
      className="w-full"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2">
          Potential Tax Traps and Surcharges
        </h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="p-0 w-9 h-9">
            <ChevronDown className={`h-4 w-4 transition-transform ${isTrapCollapsibleOpen ? "transform rotate-180" : ""}`} />
            <span className="sr-only">Toggle tax trap details</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="mt-2">
        <Card className="bg-amber-50/30 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/40">
          <CardContent className="pt-4">
            <TaxTrapChecker
              scenarioId={selectedScenario.scenario_name}
              scenarioData={{
                year: selectedScenario.year,
                filing_status: 'single', // This would come from actual data in real implementation
                agi: selectedScenario.agi,
                magi: selectedScenario.agi, // Simplified for now
                total_income: selectedScenario.total_income,
                taxable_income: selectedScenario.taxable_income,
                capital_gains_long: 2500, // Mock data
                capital_gains_short: 0, // Mock data
                social_security_amount: 0, // Mock data
                household_size: 1, // Mock data
                medicare_enrollment: true, // Mock data
                aca_enrollment: false, // Mock data
              }}
            />
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TaxTrapCollapsible;
