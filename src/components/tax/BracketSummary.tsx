
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaxResult } from '@/utils/taxCalculator';
import { formatCurrency, formatPercent } from '@/utils/taxBracketData';
import TaxDataVersionInfo from './TaxDataVersionInfo';
import TaxProjectionDisclaimer from './TaxProjectionDisclaimer';

interface BracketSummaryProps {
  scenario: TaxResult;
}

const BracketSummary: React.FC<BracketSummaryProps> = ({ scenario }) => {
  // Safely check if brackets_breakdown exists and has arrays
  const hasOrdinary = scenario.brackets_breakdown?.ordinary && Array.isArray(scenario.brackets_breakdown.ordinary) && scenario.brackets_breakdown.ordinary.length > 0;
  const hasCapitalGains = scenario.brackets_breakdown?.capitalGains && Array.isArray(scenario.brackets_breakdown.capitalGains) && scenario.brackets_breakdown.capitalGains.length > 0;
  const currentYear = new Date().getFullYear();
  const isFutureProjection = scenario.year > currentYear;
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Tax Bracket Breakdown</CardTitle>
            {scenario.tax_data_version && (
              <span className="text-sm text-muted-foreground">
                Data Version: {scenario.tax_data_version}
              </span>
            )}
          </div>
          {scenario.year === 2025 && (
            <p className="text-xs text-gray-400 mt-1">
              Tax rates and thresholds for 2025 are projected/estimated and may change once official IRS figures are released. For the most accurate information, consult the latest IRS publications.
            </p>
          )}
        </CardHeader>
        <CardContent>
          {isFutureProjection && (
            <div className="mb-4">
              <TaxProjectionDisclaimer taxYear={scenario.year} />
            </div>
          )}
          
          <div className="space-y-6">
            {hasOrdinary && (
              <div>
                <h3 className="text-sm font-medium mb-3">Ordinary Income</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Bracket</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Income in Bracket</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Tax</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {Array.isArray(scenario.brackets_breakdown?.ordinary) && scenario.brackets_breakdown?.ordinary.map((bracket, index) => (
                        <tr key={`ordinary-${index}`}>
                          <td className="px-3 py-2 text-sm">{formatPercent(bracket.bracket / 100)}</td>
                          <td className="px-3 py-2 text-sm text-right">{formatCurrency(bracket.amount)}</td>
                          <td className="px-3 py-2 text-sm text-right">{formatCurrency(bracket.tax)}</td>
                        </tr>
                      ))}
                      <tr className="bg-muted/30">
                        <td className="px-3 py-2 text-sm font-medium">Total</td>
                        <td className="px-3 py-2 text-sm text-right font-medium">
                          {formatCurrency(
                            Array.isArray(scenario.brackets_breakdown?.ordinary) 
                              ? scenario.brackets_breakdown?.ordinary.reduce((sum, bracket) => sum + bracket.amount, 0) 
                              : 0
                          )}
                        </td>
                        <td className="px-3 py-2 text-sm text-right font-medium">
                          {formatCurrency(scenario.ordinary_tax)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {hasCapitalGains && (
              <div>
                <h3 className="text-sm font-medium mb-3">Long-Term Capital Gains</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Bracket</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Income in Bracket</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Tax</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {Array.isArray(scenario.brackets_breakdown?.capitalGains) && scenario.brackets_breakdown?.capitalGains.map((bracket, index) => (
                        <tr key={`capital-${index}`}>
                          <td className="px-3 py-2 text-sm">{formatPercent(bracket.bracket / 100)}</td>
                          <td className="px-3 py-2 text-sm text-right">{formatCurrency(bracket.amount)}</td>
                          <td className="px-3 py-2 text-sm text-right">{formatCurrency(bracket.tax)}</td>
                        </tr>
                      ))}
                      <tr className="bg-muted/30">
                        <td className="px-3 py-2 text-sm font-medium">Total</td>
                        <td className="px-3 py-2 text-sm text-right font-medium">
                          {formatCurrency(
                            Array.isArray(scenario.brackets_breakdown?.capitalGains)
                              ? scenario.brackets_breakdown?.capitalGains.reduce((sum, bracket) => sum + bracket.amount, 0) 
                              : 0
                          )}
                        </td>
                        <td className="px-3 py-2 text-sm text-right font-medium">
                          {formatCurrency(scenario.capital_gains_tax)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Tax:</span>
                <span className="font-bold text-lg">{formatCurrency(scenario.total_tax)}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                <span>Effective Tax Rate:</span>
                <span>{formatPercent(scenario.effective_rate)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <TaxDataVersionInfo year={scenario.year} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BracketSummary;
