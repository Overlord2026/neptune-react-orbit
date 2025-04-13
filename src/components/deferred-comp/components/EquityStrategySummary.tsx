
import React from 'react';
import { useEquityForm } from '../context/EquityFormContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../utils/formatUtils';

export const EquityStrategySummary: React.FC = () => {
  const { formState, getEquityEvents, calculateMultiYearImpact } = useEquityForm();
  
  const equityEvents = getEquityEvents();
  const multiYearImpact = calculateMultiYearImpact();
  const currentYear = new Date().getFullYear();

  // Calculate total tax savings
  const totalTaxSavings = multiYearImpact.reduce((sum, year) => sum + (year.taxSavings > 0 ? year.taxSavings : 0), 0);
  
  // Get notable equity exercise events
  const currentYearExercise = equityEvents.find(event => event.year === currentYear);
  const nextYearExercise = equityEvents.find(event => event.year === currentYear + 1);
  
  // Check if any years trigger IRMAA
  const triggersIRMAA = multiYearImpact.some(year => year.irmaaImpact);
  
  // Calculate AMT impact
  const amtImpact = multiYearImpact.reduce((sum, year) => sum + year.amtAdjustment, 0);
  
  // Check if strategy is beneficial
  const isStrategyBeneficial = totalTaxSavings > 0;
  
  // Check if a split strategy is being used
  const isSplitStrategy = formState.exerciseStrategy === 'split' || formState.deferralStrategy === 'multi-year';
  
  // Calculate exercise values
  const year1Shares = currentYearExercise?.sharesExercised || 0;
  const year2Shares = nextYearExercise?.sharesExercised || 0;
  const totalShares = year1Shares + year2Shares;
  
  // Get potential market risk disclaimer
  const getMarketRiskDisclaimer = () => {
    if (!isSplitStrategy) return null;
    
    if (formState.equityType === "NSO" || formState.equityType === "ISO") {
      const deferredShares = formState.exerciseStrategy === 'split' ? nextYearExercise?.sharesExercised || 0 : 0;
      if (deferredShares > 0) {
        return (
          <div className="flex items-start mt-3">
            <AlertTriangle className="h-4 w-4 text-amber-400 mr-2 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Exercising {deferredShares.toLocaleString()} {formState.equityType} shares in {currentYear + 1} instead of {currentYear} saves 
              an estimated {formatCurrency(totalTaxSavings)} in taxes, but you also risk share price changes during that period.
            </p>
          </div>
        );
      }
    }
    
    return null;
  };
  
  return (
    <Card className="bg-[#1D2433] border-[#2A2F3C]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          {isStrategyBeneficial ? (
            <>
              <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
              <span>Strategy Benefits</span>
            </>
          ) : (
            <>
              <TrendingDown className="h-5 w-5 text-amber-500 mr-2" />
              <span>Strategy Analysis</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Strategy Summary */}
          <div>
            {formState.equityType === "NSO" && (
              <p className="text-sm">
                {isSplitStrategy ? (
                  <>
                    Your strategy of exercising {totalShares.toLocaleString()} NSO shares across {formState.splitYears} years 
                    {formState.hasDeferredComp && ", combined with bonus deferral,"} results in an estimated 
                    <span className="text-green-400 font-medium"> {formatCurrency(totalTaxSavings)}</span> in tax savings.
                  </>
                ) : (
                  <>
                    Your plan to exercise {totalShares.toLocaleString()} NSO shares in {currentYear} 
                    {formState.hasDeferredComp && formState.deferralAmount > 0 ? 
                      ` while deferring ${formatCurrency(formState.deferralAmount)} of your bonus ` : 
                      " "}
                    has an estimated tax impact of {formatCurrency(multiYearImpact[0]?.totalTax || 0)}.
                  </>
                )}
              </p>
            )}
            
            {formState.equityType === "ISO" && (
              <p className="text-sm">
                {isSplitStrategy ? (
                  <>
                    Your strategy of exercising {totalShares.toLocaleString()} ISO shares across {formState.splitYears} years
                    helps minimize AMT impact and results in an estimated  
                    <span className="text-green-400 font-medium"> {formatCurrency(totalTaxSavings)}</span> in tax savings.
                  </>
                ) : (
                  <>
                    Your plan to exercise {totalShares.toLocaleString()} ISO shares in {currentYear} 
                    may trigger an AMT liability of approximately {formatCurrency(amtImpact)}.
                    {formState.isDisqualifyingDisposition && 
                      " A disqualifying disposition means this will be taxed as ordinary income."}
                  </>
                )}
              </p>
            )}
          </div>
          
          {/* IRMAA Warning */}
          {triggersIRMAA && (
            <div className="flex items-start mt-3">
              <AlertTriangle className="h-4 w-4 text-amber-400 mr-2 mt-0.5" />
              <p className="text-xs">
                <span className="text-amber-400 font-medium">Medicare IRMAA Alert:</span>{" "}
                <span className="text-muted-foreground">
                  Your income may trigger Income-Related Monthly Adjustment Amount (IRMAA) surcharges 
                  on your Medicare premiums. Consider spreading income across years to avoid this threshold.
                </span>
              </p>
            </div>
          )}
          
          {/* Market Risk Disclaimer */}
          {getMarketRiskDisclaimer()}
          
          {/* AMT Specific Guidance */}
          {formState.equityType === "ISO" && amtImpact > 0 && (
            <div className="bg-amber-900/20 border border-amber-900/30 rounded-md p-3 mt-3">
              <p className="text-xs">
                <span className="text-amber-400 font-medium">AMT Consideration:</span>{" "}
                <span className="text-muted-foreground">
                  The Alternative Minimum Tax impact of {formatCurrency(amtImpact)} is based on the paper gain 
                  from your ISO exercise. If you hold these shares through qualifying periods 
                  (1+ year after exercise, 2+ years from grant), gains may qualify for favorable long-term 
                  capital gains rates upon sale.
                </span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
