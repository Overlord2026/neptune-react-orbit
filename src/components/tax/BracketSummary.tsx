
import React from 'react';
import { getDistanceToNextBracket } from '@/utils/taxUtils';
import { TaxResult } from '@/utils/taxCalculator';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon, AlertTriangleIcon, ExternalLinkIcon, ClockIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatPercent } from '@/utils/taxBracketData';
import { getFormattedUpdateDate } from '@/utils/dataFeedUtils';

interface BracketSummaryProps {
  scenario: TaxResult;
  showHeader?: boolean;
}

const BracketSummary: React.FC<BracketSummaryProps> = ({ scenario, showHeader = true }) => {
  // Extract bracket information from the scenario
  const ordinaryBracket = (scenario.marginal_rate * 100).toFixed(1);
  const capitalGainsBracket = (scenario.marginal_capital_gains_rate * 100).toFixed(1);
  
  // Calculate distance to next bracket
  const nextOrdinaryBracket = getDistanceToNextBracket(
    scenario.taxable_income,
    scenario.year,
    scenario.filing_status,
    "ordinary"
  );
  
  // Check if user is close to the next bracket (within $5,000)
  const isCloseToNextBracket = nextOrdinaryBracket.distance > 0 && nextOrdinaryBracket.distance <= 5000;
  
  // Calculate progress within the current bracket for visualization
  // This is a simplified approximation
  const progressPercentage = Math.min(
    100,
    nextOrdinaryBracket.distance <= 0 ? 100 : (1 - (nextOrdinaryBracket.distance / 10000)) * 100
  );
  
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      {showHeader && (
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            Bracket Summary
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Tax brackets show the percentage of tax applied to different portions of your income.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="pt-4 space-y-4">
        {/* Bracket Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Ordinary Income Bracket
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3 w-3 inline ml-1 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>This is your marginal rate - the tax rate applied to your last dollar of ordinary income.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
              <span className="font-semibold">{ordinaryBracket}%</span>
            </div>
            <div className="h-2 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-full">
              <div
                className="relative h-full"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute right-0 top-0 w-2 h-2 bg-primary rounded-full transform translate-x-1/2 -translate-y-1/4"></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                LTCG Bracket
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3 w-3 inline ml-1 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>This is the tax rate applied to your long-term capital gains.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
              <span className="font-semibold">{capitalGainsBracket}%</span>
            </div>
            <div className="h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-full">
              <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" 
                style={{ width: `${(scenario.marginal_capital_gains_rate / 0.20) * 100}%` }}>
              </div>
            </div>
          </div>
        </div>
        
        {/* Explanation */}
        <p className="text-sm text-muted-foreground mt-2">
          Based on your scenario inputs, your last dollar of ordinary income is taxed at <strong>{ordinaryBracket}%</strong> and your long-term capital gains at <strong>{capitalGainsBracket}%</strong>.
        </p>
        
        {/* Warning if close to next bracket */}
        {isCloseToNextBracket && nextOrdinaryBracket.nextBracketRate && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 rounded-md flex gap-2 items-start mt-2">
            <AlertTriangleIcon className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              You're only {formatCurrency(nextOrdinaryBracket.distance)} away from the next bracket ({(Number(nextOrdinaryBracket.nextBracketRate) * 100).toFixed(1)}%). Consider adjusting your conversions or capital gains to stay in a lower bracket.
            </p>
          </div>
        )}
        
        {/* Tax data currency info */}
        {scenario.tax_data_updated_at && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <ClockIcon className="h-3.5 w-3.5" />
            <span>
              Based on IRS data updated on {getFormattedUpdateDate(scenario.tax_data_updated_at)}
              {!scenario.tax_data_is_current && (
                <span className="text-amber-500 ml-1">(newer data available)</span>
              )}
            </span>
          </div>
        )}
        
        {/* Link to "Which Bracket Am I In?" page */}
        <div className="text-right mt-2">
          <Link to="/which-bracket-am-i-in" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
            View full bracket table <ExternalLinkIcon className="h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default BracketSummary;
