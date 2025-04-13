
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EquityComparisonChart } from "../../components/EquityComparisonChart";

interface TaxVisualizationProps {
  currentYear: number;
}

export const TaxVisualization: React.FC<TaxVisualizationProps> = ({ currentYear }) => {
  return (
    <Card className="bg-[#1D2433] border-[#2A2F3C]">
      <CardHeader>
        <CardTitle>Multi-Year Tax Visualization</CardTitle>
        <CardDescription>
          Comparing your tax impact across {currentYear} and {currentYear + 1}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <EquityComparisonChart />
        </div>
      </CardContent>
    </Card>
  );
};
