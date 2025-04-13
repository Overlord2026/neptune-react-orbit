
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { YearlyResult } from '../../types/ScenarioTypes';
import { CalendarHeart, HeartHandshake, Percent, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  
  // Check if any warnings mention charitable impacts
  const charitableTraps = yearlyResults.flatMap(result => 
    result.warnings.filter(warning => 
      warning.trapType === 'charitable_opportunity' || 
      warning.message?.toLowerCase().includes('charitable') ||
      warning.message?.toLowerCase().includes('qcd')
    )
  );

  // Check for tax trap avoidance successes
  const trapAvoidances = contributionYears.filter(year => 
    year.charitableContribution?.trapAvoidance && 
    year.charitableContribution.trapAvoidance.length > 0
  );
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <HeartHandshake className="h-5 w-5 mr-2" />
          Charitable Contribution Impact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-muted/50">
            <CardContent className="pt-6 text-center">
              <CalendarHeart className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Total Contributions</div>
              <div className="text-2xl font-bold mt-1">${totalContributions.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/50">
            <CardContent className="pt-6 text-center">
              <Percent className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Total Tax Savings</div>
              <div className="text-2xl font-bold mt-1">${totalSavings.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/50">
            <CardContent className="pt-6 text-center">
              <ShieldCheck className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">QCD Strategies</div>
              <div className="text-2xl font-bold mt-1">{qcdYears.length}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tax Trap Avoidances - Success Stories */}
        {trapAvoidances.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-3 text-lg">Tax Trap Avoidance Successes</h3>
            <div className="space-y-3">
              {trapAvoidances.map((year, idx) => 
                year.charitableContribution?.trapAvoidance?.map((avoidance, avoidanceIdx) => (
                  <Alert key={`${idx}-${avoidanceIdx}`} className="bg-green-950/20 border-green-800/30">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    <AlertTitle>Year {year.year}: {avoidance.title}</AlertTitle>
                    <AlertDescription className="text-sm">
                      {avoidance.description}
                      {avoidance.savings > 0 && (
                        <div className="font-medium mt-1">
                          Financial impact: ${avoidance.savings.toLocaleString()}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                ))
              )}
            </div>
          </div>
        )}
        
        {/* Charitable Opportunities - Additional options */}
        {charitableTraps.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-3 text-lg">Additional Charitable Opportunities</h3>
            <div className="space-y-3">
              {charitableTraps.map((trap, idx) => (
                <Alert key={idx} className="bg-amber-950/20 border-amber-800/30">
                  <AlertTitle>{trap.message || trap.type}</AlertTitle>
                  {trap.message && <AlertDescription className="text-sm">{trap.message}</AlertDescription>}
                </Alert>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-4 mt-6">
          <h3 className="font-medium text-lg">Year-by-Year Impact</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deduction</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Savings</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
                {contributionYears.map((year) => (
                  <tr key={year.year}>
                    <td className="px-4 py-2 whitespace-nowrap">{year.year}</td>
                    <td className="px-4 py-2 whitespace-nowrap">${year.charitableContribution?.amount.toLocaleString()}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {year.charitableContribution?.useQcd ? 'QCD' : 'Cash/DAF'}
                      {year.charitableContribution?.isBunching && ' (Bunched)'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {year.charitableContribution?.isItemizing ? 
                        `$${year.charitableContribution?.itemizedDeduction.toLocaleString()} (Itemized)` : 
                        `$${year.charitableContribution?.standardDeduction.toLocaleString()} (Standard)`}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">${year.charitableContribution?.taxSavings.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CharitableContributionImpact;
