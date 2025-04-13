
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { YearlyResult } from '../../types/ScenarioTypes';
import { CalendarHeart, HeartHandshake, Percent } from 'lucide-react';

interface CharitableContributionImpactProps {
  yearlyResults: YearlyResult[];
}

const CharitableContributionImpact: React.FC<CharitableContributionImpactProps> = ({ yearlyResults }) => {
  // Filter only years with charitable contributions
  const contributionYears = yearlyResults.filter(result => 
    result.charitableContribution && result.charitableContribution.amount > 0
  );
  
  if (contributionYears.length === 0) {
    return null;
  }
  
  // Calculate total contributions and savings
  const totalContributions = contributionYears.reduce((sum, year) => 
    sum + (year.charitableContribution?.amount || 0), 0
  );
  
  const totalSavings = contributionYears.reduce((sum, year) => 
    sum + (year.charitableContribution?.taxSavings || 0), 0
  );
  
  // Count QCD usage
  const qcdYears = contributionYears.filter(year => 
    year.charitableContribution?.useQcd
  );
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-medium">
          <HeartHandshake className="w-5 h-5 mr-2 text-primary" />
          Charitable Contribution Impact
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Contributions</div>
              <div className="text-2xl font-semibold mt-1">${totalContributions.toLocaleString()}</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Tax Savings</div>
              <div className="text-2xl font-semibold mt-1">${totalSavings.toLocaleString()}</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Effective Rate</div>
              <div className="text-2xl font-semibold mt-1 flex items-center">
                <Percent className="w-4 h-4 mr-1" />
                {totalContributions > 0 ? ((totalSavings / totalContributions) * 100).toFixed(1) : 0}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contribution</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strategy</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deduction</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Savings</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QCD Impact</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
                {contributionYears.map((result) => {
                  const contribution = result.charitableContribution;
                  if (!contribution) return null;
                  
                  return (
                    <tr key={result.year}>
                      <td className="px-4 py-3 whitespace-nowrap">{result.year}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{result.age}</td>
                      <td className="px-4 py-3 whitespace-nowrap">${contribution.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {contribution.useQcd ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">QCD</span>
                        ) : contribution.isBunching ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">Bunching</span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Standard</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {contribution.isItemizing ? (
                          <span>${contribution.itemizedDeduction.toLocaleString()}</span>
                        ) : (
                          <span className="text-muted-foreground">${contribution.standardDeduction.toLocaleString()} (Standard)</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">${contribution.taxSavings.toLocaleString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {contribution.qcdImpact ? (
                          <span className="text-green-600">-${contribution.qcdImpact.toLocaleString()} from AGI</span>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {qcdYears.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <CalendarHeart className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">QCD Benefits</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    QCD reduces AGI directly, which may lower Medicare premiums (IRMAA) and taxation of Social Security. 
                    It also counts toward your Required Minimum Distributions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CharitableContributionImpact;
