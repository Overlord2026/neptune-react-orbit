
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { TaxResult } from '@/utils/taxCalculator';
import InfoTooltip from '@/components/tax/InfoTooltip';

interface ScenarioComparisonTableProps {
  scenarios: TaxResult[];
  formatCurrency: (value: number | string) => string;
  formatPercent: (value: number) => string;
}

const ScenarioComparisonTable: React.FC<ScenarioComparisonTableProps> = ({ 
  scenarios,
  formatCurrency,
  formatPercent
}) => {
  if (scenarios.length < 3) {
    return <div>Not enough scenario data for comparison.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Metric</TableHead>
            <TableHead className="text-center bg-blue-950/30">
              Scenario 1 (2022)
            </TableHead>
            <TableHead className="text-center bg-green-950/30">
              Scenario 2 (2024)
            </TableHead>
            <TableHead className="text-center bg-amber-950/30">
              Scenario 3 (2025 w/ Roth)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Total Income</TableCell>
            <TableCell className="text-center">{formatCurrency(scenarios[0].total_income)}</TableCell>
            <TableCell className="text-center">{formatCurrency(scenarios[1].total_income)}</TableCell>
            <TableCell className="text-center">{formatCurrency(scenarios[2].total_income)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Taxable Income</TableCell>
            <TableCell className="text-center">{formatCurrency(scenarios[0].taxable_income)}</TableCell>
            <TableCell className="text-center">{formatCurrency(scenarios[1].taxable_income)}</TableCell>
            <TableCell className="text-center">{formatCurrency(scenarios[2].taxable_income)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium flex items-center">
              Marginal Rate
              <InfoTooltip text="The highest tax bracket your last dollar of income falls into." />
            </TableCell>
            <TableCell className="text-center">{formatPercent(scenarios[0].marginal_rate)}</TableCell>
            <TableCell className="text-center">{formatPercent(scenarios[1].marginal_rate)}</TableCell>
            <TableCell className="text-center">{formatPercent(scenarios[2].marginal_rate)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium flex items-center">
              Effective Tax Rate
              <InfoTooltip text="Your overall average tax rate, calculated as Total Tax ÷ Total Income." />
            </TableCell>
            <TableCell className="text-center">{formatPercent(scenarios[0].effective_rate)}</TableCell>
            <TableCell className="text-center">{formatPercent(scenarios[1].effective_rate)}</TableCell>
            <TableCell className="text-center">{formatPercent(scenarios[2].effective_rate)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Total Tax</TableCell>
            <TableCell className="text-center">{formatCurrency(scenarios[0].total_tax)}</TableCell>
            <TableCell className="text-center">{formatCurrency(scenarios[1].total_tax)}</TableCell>
            <TableCell className="text-center">{formatCurrency(scenarios[2].total_tax)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Tax Owed/Refund</TableCell>
            <TableCell className="text-center">Calculated at filing</TableCell>
            <TableCell className="text-center">Calculated at filing</TableCell>
            <TableCell className="text-center">Calculated at filing</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="mt-2 text-xs text-muted-foreground">
        <p>Note: 2025 values are projected/estimated and subject to change when official IRS data is released.</p>
      </div>
    </div>
  );
};

export default ScenarioComparisonTable;
